import test from 'node:test';
import assert from 'node:assert/strict';
import {FreeLLMGateway, FreeLLMUnavailableError} from '../lib/free-llm-gateway.mjs';

test('disabled credentials cannot call a free provider',async()=>{
 const gateway=new FreeLLMGateway({env:{},fetchImpl:async()=>{throw Error('must not be called')}});
 assert.deepEqual(gateway.listRoutes({audience:'public'}),[]);
 await assert.rejects(gateway.chat({messages:[{role:'user',content:'hello'}]}),FreeLLMUnavailableError);
});
test('Groq requires verified free-tier account',()=>{
 const one=new FreeLLMGateway({env:{GROQ_API_KEY:'test'}});
 assert.deepEqual(one.listRoutes(),[]);
 const two=new FreeLLMGateway({env:{GROQ_API_KEY:'test',GROQ_FREE_TIER_CONFIRMED:'true'}});
 assert.equal(two.listRoutes()[0].provider,'groq');
});
test('Gemini unpaid is excluded from public audience',()=>{
 const gateway=new FreeLLMGateway({env:{GEMINI_API_KEY:'test',GEMINI_UNPAID_TIER_CONFIRMED:'true'}});
 assert.deepEqual(gateway.listRoutes(),[]);
 assert.equal(gateway.listRoutes({audience:'internal'})[0].provider,'gemini');
});
