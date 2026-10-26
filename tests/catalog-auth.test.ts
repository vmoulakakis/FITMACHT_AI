import {test} from "node:test";
import assert from "node:assert/strict";
import {catalog} from "../lib/catalog";

test("modern publishable keys authenticate by apikey without bearer JWT",async()=>{
 const original={url:process.env.SOCIALMARKET_SUPABASE_URL,key:process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY,fetch:globalThis.fetch};
 process.env.SOCIALMARKET_SUPABASE_URL="https://gqpbskssrvpfjtujwezc.supabase.co";
 process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY="sb_publishable_mock";
 let saw=false;
 try {
  globalThis.fetch=(async (_url,init)=>{const headers=init?.headers as Record<string,string>;assert.equal(headers.apikey,"sb_publishable_mock");assert.equal(headers.Authorization,undefined);saw=true;return new Response("[]",{status:200,headers:{"Content-Type":"application/json"}});}) as typeof fetch;
  const result=await catalog();assert.equal(result.mode,"verified_empty");assert.equal(result.offers.length,0);assert.ok(saw);
 }finally{
  globalThis.fetch=original.fetch;
  if(original.url===undefined)delete process.env.SOCIALMARKET_SUPABASE_URL;else process.env.SOCIALMARKET_SUPABASE_URL=original.url;
  if(original.key===undefined)delete process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY;else process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY=original.key;
 }
});
test("secret Supabase keys cannot be used by consumer catalogue",async()=>{
 const prior=process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY;
 const priorUrl=process.env.SOCIALMARKET_SUPABASE_URL;
 process.env.SOCIALMARKET_SUPABASE_URL="https://gqpbskssrvpfjtujwezc.supabase.co";
 process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY="sb_secret_mock";
 try {const result=await catalog();assert.equal(result.mode,"error");assert.equal(result.offers.length,0);}
 finally {if(prior===undefined)delete process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY;else process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY=prior;if(priorUrl===undefined)delete process.env.SOCIALMARKET_SUPABASE_URL;else process.env.SOCIALMARKET_SUPABASE_URL=priorUrl;}
});
