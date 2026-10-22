import test from "node:test";
import assert from "node:assert/strict";
import {runAdvisorAgent} from "../lib/agent";
import {matchPath} from "../lib/matching";
import type {Answers,Offer} from "../lib/decision";
import type {Path} from "../lib/solutions";
const now=Date.parse("2026-10-22T08:00:00Z");
const a:Answers={goal:"walking",space:"compact",noise:"critical",activity:"walk",budget:500,fold:true};
const path:Path={id:"walking-pad",category:"walking-pad",kind:"equipment",title:"Walking pad",reason:"test",actions:["a","b","c"]};
function offer(v:Partial<Offer>={}):Offer{return{id:"item",title:"Verified walking pad",category:"walking-pad",merchant:"Greek merchant",price:320,currency:"EUR",trackingUrl:"https://affiliate.linkwi.se/a",inStock:true,lastSeen:"2026-10-22T07:00:00Z",verifiedCommissionEur:15,commissionEvidence:true,specsVerified:true,urlEvidence:"https://merchant.example/spec",imageUrl:null,...v};}
test("catalog absence produces three useful paths and transparent state",()=>{
 const r=runAdvisorAgent(a,"Μικρό σπίτι και θόρυβος",[],"no_approved_offers");
 assert.equal(r.stages.length,3);assert.equal(r.sourceStatus.purchaseReady,false);
 assert.equal(r.stages[2].state,"review_needed");assert.equal(Object.values(r.matchesByPath).flat().length,0);
});
test("eligible product is attached only to matching verified buying path",()=>{
 const v=matchPath(path,a,[offer()],now);assert.equal(v.length,1);assert.equal(v[0].review,"verified");assert.match(v[0].evidenceUrl??"",/^https:/);
});
test("agent never bypasses commerce hard gates",()=>{
 for(const patch of [{verifiedCommissionEur:9},{commissionEvidence:false},{inStock:false},{lastSeen:"2026-09-10T08:00:00Z"},{specsVerified:false},{category:"treadmill"}])
 assert.equal(matchPath(path,a,[offer(patch)],now).length,0);
});
test("commission size does not control buyer ranking",()=>{
 const res=matchPath(path,a,[offer({id:"big",price:410,verifiedCommissionEur:100}),offer({id:"best-price",price:299,verifiedCommissionEur:11})],now);
 assert.deepEqual(res.map(x=>x.id),["best-price","big"]);
});
test("all buyer goals and budgets return paths without fake sales",()=>{
 for(const goal of ["walking","cardio","strength","mixed"] as const)
 for(const budget of [0,100,500,1000]){
  const r=runAdvisorAgent({...a,goal,budget},"",[],"restricted");
  assert.equal([r.plan.primary,...r.plan.alternatives].length,3);
  assert.equal(r.sourceStatus.purchaseReady,false);
 }
});
