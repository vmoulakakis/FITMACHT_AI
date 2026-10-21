import test from "node:test";
import assert from "node:assert/strict";
import {POST} from "../app/api/recommend/route";
import {GET} from "../app/api/out/route";
const input={goal:"walking",space:"compact",noise:"normal",activity:"walk",budget:500,fold:true};
const send=(body:unknown)=>POST(new Request("https://test.local/api/recommend",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}));
test("two-input request returns three actionable alternatives even without feed",async()=>{
 const resp=await send({goal:"walking",budget:500});
 assert.equal(resp.status,200);
 const data=await resp.json();
 assert.equal(data.solutions.primary.category,"walking-pad");
 assert.equal(data.solutions.alternatives.length,2);
 assert.deepEqual(data.offers,[]);
 assert.equal(data.aiStatus,"contextual-fallback");
});
test("zero budget still gives 3 noncommerce solutions",async()=>{
 const data=await (await send({goal:"strength",budget:0})).json();
 assert.equal(data.solutions.primary.kind,"no_purchase");
 assert.equal(data.solutions.alternatives.length,2);
 assert.deepEqual(data.offers,[]);
});
test("free text quiet/run is understood without another screen",async()=>{
 const data=await(await send({...input,goal:"cardio",budget:1000,note:"Πολυκατοικία και θέλω να τρέχω"})).json();
 assert.equal(data.solutions.primary.kind,"no_purchase");
 assert.equal(data.solutions.alternatives.length,2);
});
test("invalid goals and text lengths return 422",async()=>{
 assert.equal((await send({...input,goal:"nope"})).status,422);
 assert.equal((await send({...input,note:"x".repeat(601)})).status,422);
});
test("malformed json rejects",async()=>{
 const res=await POST(new Request("https://test.local/api/recommend",{method:"POST",body:"{"}));
 assert.equal(res.status,400);
});
test("merchant redirects remain fail closed",async()=>{
 assert.equal((await GET(new Request("https://test.local/api/out?id=unknown"))).status,404);
 assert.equal((await GET(new Request("https://test.local/api/out?id=https://attacker.example"))).status,400);
});
