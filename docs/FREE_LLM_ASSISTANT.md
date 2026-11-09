# FITMATCH AI — protected internal free-model explanation

Review 2026-11-09. Central source: vmoulakakis/Myagenticteam commit 925e5487, packages/free-llm-gateway/src/index.mjs, blob SHA c93712d3871d567aed98bc4caaa8bb1ad89694d0.

This is a **vendored, audited** source snapshot because the central repository is private and Vercel installations cannot assume a Git SSH deploy key. The new /api/internal/ai-explain endpoint is an INTERNAL authenticated workflow, never invoked by the consumer recommendation UI. It does not change /api/recommend or any deterministic verified offer/commission logic.

## Enable in preview only after secrets are configured
1. Add GROQ_API_KEY and GROQ_FREE_TIER_CONFIRMED=true for an eligible Groq free account, or OPENROUTER_API_KEY for an OpenRouter account. All credentials must be Vercel server secrets.
2. Set FITMATCH_INTERNAL_AI_TOKEN to a random >=24-character server-to-server token; it MUST NOT enter NEXT_PUBLIC_* or browser JS.
3. Set FITMATCH_INTERNAL_AI_ENABLED=true in Preview only after tests, then redeploy Preview.
4. Call POST /api/internal/ai-explain from a trusted backend with Authorization: Bearer <internal token>, Content-Type: application/json and body:
   {"goal":"walking","space":"compact","noise":"critical","activity":"walk","budget":500,"fold":true}
5. Verify only the *deterministic* decision is used for purchasing recommendations. AI output is an experimental supplementary explanation.

No token => 401. Feature flag off => 404. Provider missing/failed => 503. There is no unauthenticated public inference. Input is bounded and only normalized choice fields (no names, emails, affiliate URLs, confidential information) leave the service. Gemini unpaid is NEVER used for EEA public endpoints; the gateway uses audience=public and disables local Ollama.

Each serverless instance tracks local caps; scale requires distributed rate limiting and security review. Do NOT enable consumer-facing AI chat until per-account quotas, user auth, data/retention review and evals are implemented. The gateway has no API keys installed by default.

See official free docs: https://openrouter.ai/collections/free-models and https://console.groq.com/docs/rate-limits.
