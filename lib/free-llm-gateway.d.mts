export type GatewayRole = 'system' | 'user' | 'assistant';
export type GatewayMessage = { role: GatewayRole; content: string };
export type GatewayProviderResult = {provider: string; model: string; text: string; fallbackCount: number; usage: unknown};
export type GatewayRoute = {provider: string;model: string;local: boolean};
export class FreeLLMUnavailableError extends Error { attempts: Array<{provider: string;reason: string;status?: number}> }
export class FreeLLMGateway {
 constructor(options?: {env?: NodeJS.ProcessEnv | Record<string,string | undefined>;fetchImpl?: typeof fetch;now?:()=>number;timeoutMs?:number});
 listRoutes(options?: {audience?:'public'|'internal';privacy?:'standard'|'sensitive'}):GatewayRoute[];
 chat(options:{messages:GatewayMessage[];audience?:'public'|'internal';privacy?:'standard'|'sensitive';maxTokens?:number;temperature?:number;maxAttempts?:number}):Promise<GatewayProviderResult>;
}
export const FREE_LLM_PROVIDER_IDS:readonly string[];
export const FREE_LLM_REFERENCE:string;
