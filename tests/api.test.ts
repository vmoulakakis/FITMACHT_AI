import test from "node:test";
import assert from "node:assert/strict";
import {POST} from "../app/api/recommend/route";
import {GET} from "../app/api/out/route";
const input={goal:"walking",space:"compact",noise:"critical",activity:"walk",budget:350,fold:true};
test("recommendation never fabricates offers without verified catalog",async()=>{
 const resp=await POST(new Request("https://test.local/api/recommend",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(input)}));
 assert.equal(resp.status,200);
 const json=await resp.json();
 assert.equal(json.decision.category,"walking-pad");
 assert.deepEqual(json.offers,[]);
 assert.match(json.disclosure,/affiliate/i);
});
test("invalid quiz payload rejected",async()=>{
 const resp=await POST(new Request("https://test.local/api/recommend",{method:"POST",headers:{"Content-Type":"application/json"},body:'{"goal":"invalid"}'}));
 assert.equal(resp.status,422);
});
test("unknown outbound ID never redirects",async()=>{
 const resp=await GET(new Request("https://test.local/api/out?id=unknown"));
 assert.equal(resp.status,404);
});
test("unsafe outbound ID rejected",async()=>{
 const resp=await GET(new Request("https://test.local/api/out?id=https://attacker.example"));
 assert.equal(resp.status,400);
});
