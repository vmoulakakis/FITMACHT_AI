/**
 * MyAgenticTeam Free LLM Gateway, Node >=20.
 * Dependency-free, server-side OpenAI-compatible Chat Completions router.
 * Only explicitly documented free-tier model routes are included.
 */
const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 20_000;
const MAX_TEXT_LENGTH = 100_000;

const DEFINITIONS = Object.freeze({
  groq: Object.freeze({
    model: 'openai/gpt-oss-20b',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    envKey: 'GROQ_API_KEY',
    confirmation: 'GROQ_FREE_TIER_CONFIRMED',
    dailyRequestGuard: 800,
    allowedPublic: true,
  }),
  openrouter: Object.freeze({
    model: 'openrouter/free',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    envKey: 'OPENROUTER_API_KEY',
    dailyRequestGuard: 45,
    allowedPublic: true,
  }),
  gemini: Object.freeze({
    model: 'gemini-2.5-flash-lite',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    envKey: 'GEMINI_API_KEY',
    confirmation: 'GEMINI_UNPAID_TIER_CONFIRMED',
    // Gemini free API cannot serve EEA/UK/CH users under Google API Terms.
    allowedPublic: false,
  }),
  cloudflare: Object.freeze({
    model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    envKey: 'CLOUDFLARE_API_TOKEN',
    confirmation: 'CLOUDFLARE_WORKERS_FREE_PLAN_CONFIRMED',
    allowedPublic: true,
  }),
  ollama: Object.freeze({
    // loopback-only by construction; never accept an untrusted remote URL.
    url: 'http://127.0.0.1:11434/v1/chat/completions',
    allowedPublic: true,
    local: true,
  }),
});
const ORDER = Object.freeze(['ollama', 'groq', 'openrouter', 'cloudflare', 'gemini']);

export class FreeLLMUnavailableError extends Error {
  constructor(attempts) {
    super('No eligible free LLM route succeeded. Check free-tier eligibility, keys, quota, model availability and network.');
    this.name = 'FreeLLMUnavailableError';
    // Only generic reasons/statuses: never return credentials or provider response bodies.
    this.attempts = attempts;
  }
}

function truthy(value) { return ['1', 'true', 'yes'].includes(String(value ?? '').trim().toLowerCase()); }
function dayKey(now) { return new Date(now).toISOString().slice(0, 10); }
function boundedNumber(value, min, max, label) {
  if (!Number.isInteger(value) || value < min || value > max) throw new TypeError(label + ' must be an integer from ' + min + ' to ' + max);
  return value;
}
function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 40) throw new TypeError('messages must contain 1–40 items');
  let total = 0;
  for (const message of messages) {
    if (!message || !['system', 'user', 'assistant'].includes(message.role) || typeof message.content !== 'string') {
      throw new TypeError('Only text system/user/assistant messages are supported');
    }
    total += message.content.length;
  }
  if (total > MAX_TEXT_LENGTH) throw new TypeError('Input exceeds the gateway text limit');
}

export class FreeLLMGateway {
  constructor({ env = process.env, fetchImpl = globalThis.fetch, now = Date.now, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    if (typeof fetchImpl !== 'function') throw new TypeError('A fetch implementation is required');
    this.env = env;
    this.fetchImpl = fetchImpl;
    this.now = now;
    this.timeoutMs = boundedNumber(timeoutMs, 500, 120_000, 'timeoutMs');
    this.unavailableUntil = new Map();
    this.dailyUsage = new Map();
  }

  #providerConfig(id) {
    const def = DEFINITIONS[id];
    if (!def) return null;
    if (id === 'ollama') {
      if (!truthy(this.env.OLLAMA_ENABLED) || !this.env.OLLAMA_MODEL?.trim()) return null;
      return { ...def, id, model: this.env.OLLAMA_MODEL.trim(), token: null };
    }
    const token = this.env[def.envKey];
    if (!token || !token.trim()) return null;
    if (def.confirmation && !truthy(this.env[def.confirmation])) return null;
    if (id === 'cloudflare') {
      const account = this.env.CLOUDFLARE_ACCOUNT_ID ?? '';
      if (!/^[0-9a-f]{32}$/i.test(account)) return null;
      return { ...def, id, token, url: 'https://api.cloudflare.com/client/v4/accounts/' + account + '/ai/v1/chat/completions' };
    }
    return { ...def, id, token };
  }

  listRoutes({ audience = 'public', privacy = 'standard' } = {}) {
    if (!['public', 'internal'].includes(audience)) throw new TypeError('audience must be public or internal');
    if (!['standard', 'sensitive'].includes(privacy)) throw new TypeError('privacy must be standard or sensitive');
    return ORDER.map(id => this.#providerConfig(id))
      .filter(route => route && (audience === 'internal' || route.allowedPublic) && (privacy === 'standard' || route.local))
      .map(({ id, model, local }) => ({ provider: id, model, local: !!local }));
  }

  #usageCount(routeId) {
    const key = routeId + ':' + dayKey(this.now());
    return [key, this.dailyUsage.get(key) ?? 0];
  }

  async chat({ messages, audience = 'public', privacy = 'standard', maxTokens = 512, temperature = 0.3, maxAttempts = 4 } = {}) {
    validateMessages(messages);
    boundedNumber(maxTokens, 1, 4096, 'maxTokens');
    boundedNumber(maxAttempts, 1, 5, 'maxAttempts');
    if (typeof temperature !== 'number' || temperature < 0 || temperature > 2) throw new TypeError('temperature must be 0–2');
    const eligible = this.listRoutes({ audience, privacy });
    const attempts = [];
    for (const candidate of eligible) {
      if (attempts.length >= maxAttempts) break;
      const route = this.#providerConfig(candidate.provider);
      if (!route) continue;
      if ((this.unavailableUntil.get(route.id) ?? 0) > this.now()) {
        attempts.push({ provider: route.id, reason: 'cooldown' });
        continue;
      }
      const [usageKey, count] = this.#usageCount(route.id);
      if (route.dailyRequestGuard !== undefined && count >= route.dailyRequestGuard) {
        attempts.push({ provider: route.id, reason: 'local-daily-guard' });
        continue;
      }
      this.dailyUsage.set(usageKey, count + 1);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await this.fetchImpl(route.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(route.token ? { Authorization: 'Bearer ' + route.token } : {}),
          },
          body: JSON.stringify({ model: route.model, messages, max_tokens: maxTokens, temperature }),
          signal: controller.signal,
        });
        if (!response.ok) {
          attempts.push({ provider: route.id, reason: 'http-error', status: response.status });
          if (response.status === 429 || response.status >= 500) {
            const retryAfter = Number(response.headers?.get('retry-after'));
            const cooldown = Number.isFinite(retryAfter) && retryAfter > 0
              ? Math.min(retryAfter * 1000, 10 * 60_000) : 60_000;
            this.unavailableUntil.set(route.id, this.now() + cooldown);
          }
          continue;
        }
        const body = await response.json();
        const text = body?.choices?.[0]?.message?.content;
        if (typeof text !== 'string' || !text.trim()) {
          attempts.push({ provider: route.id, reason: 'invalid-response' });
          continue;
        }
        return {
          provider: route.id,
          model: route.model,
          text,
          usage: body.usage ?? null,
          fallbackCount: attempts.length,
        };
      } catch (error) {
        attempts.push({ provider: route.id, reason: error?.name === 'AbortError' ? 'timeout' : 'network-error' });
        this.unavailableUntil.set(route.id, this.now() + 30_000);
      } finally {
        clearTimeout(timer);
      }
    }
    throw new FreeLLMUnavailableError(attempts);
  }
}

export const FREE_LLM_PROVIDER_IDS = Object.freeze(Object.keys(DEFINITIONS));
export const FREE_LLM_REFERENCE = 'https://github.com/mnfst/awesome-free-llm-apis';
