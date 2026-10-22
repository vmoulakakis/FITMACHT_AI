import test from "node:test";import assert from "node:assert/strict";
import {rankStudio,selectedPersona,type BuyerStudioProfile} from "../lib/studio-ranking";
import type {Offer} from "../lib/decision";
const now=Date.parse("2026-10-22T08:00:00Z");
const base:BuyerStudioProfile={goal:"mixed",space:"compact",budget:600,noise:"critical",activity:"walk",fold:true,level:"beginner",preference:"compact",pain:"space"};
const offer=(override:Partial<Offer>={}):Offer=>({id:"real-1",title:"Walking pad example",category:"walking-pad",price:300,currency:"EUR",merchant:"Verified merchant",trackingUrl:"https://go.linkwi.se/z/99-0/CD104/",inStock:true,lastSeen:"2026-10-22T07:00:00Z",verifiedCommissionEur:12,commissionEvidence:true,specsVerified:true,...override});
test("every supported goal x space x noise x budget x preference produces five actionable slots in each lane",()=>{
 for(const goal of ["walking","cardio","strength","mixed"] as const)
 for(const space of ["compact","medium","large"] as const)
 for(const noise of ["critical","normal"] as const)
 for(const budget of [0,30,100,250,500,1500])
 for(const preference of ["compact","value","balanced"] as const){
  const p={...base,goal,space,noise,budget,preference};
  const lanes=rankStudio(p,[],now);
  assert.equal(lanes.length,3);
  for(const lane of lanes){assert.equal(lane.items.length,5);assert.equal(new Set(lane.items.map(i=>i.id)).size,5);assert.ok(lane.items.every(i=>!i.isAffiliate&&!i.buyPath));}
  if(budget===0)assert.ok(lanes.every(x=>x.items.every(i=>i.type==="guide")));
 }
});
test("a verified product can be linked, pending products never have affiliate URLs",()=>{
 const r=rankStudio({...base,goal:"cardio",noise:"normal",space:"large"},[offer()],now);
 const cardio=r.find(x=>x.id==="cardio")!;
 assert.equal(cardio.verifiedCount,1);
 assert.ok(cardio.items.some(i=>i.type==="verified"&&i.isAffiliate&&i.buyPath?.startsWith("/api/out?id=")));
 assert.ok(cardio.items.filter(i=>i.type==="research").every(i=>!i.isAffiliate&&!i.buyPath));
});
test("stock stale terms low commission and budget are hard gates",()=>{
 for(const o of [{verifiedCommissionEur:9},{specsVerified:false},{commissionEvidence:false},{inStock:false},{lastSeen:"2026-09-01T00:00:00Z"},{price:10000}]){
  const lanes=rankStudio({...base,noise:"normal",space:"large"},[offer(o)],now);
  assert.equal(lanes.reduce((n,l)=>n+l.verifiedCount,0),0);
 }
});
test("critical noise does not claim treadmill as verified fit",()=>{
 const lanes=rankStudio({...base,goal:"cardio",noise:"critical",space:"medium"},[offer({category:"treadmill"})],now);
 assert.equal(lanes.reduce((n,l)=>n+l.verifiedCount,0),0);
});
test("research candidates are based on source data, capped to five and not priced above budget",()=>{
 const lanes=rankStudio({...base,noise:"normal",goal:"strength",space:"large",budget:250},[],now);
 for(const item of lanes.flatMap(x=>x.items)){
  if(item.type==="research"){assert.ok(item.price!<=250);assert.equal(item.isAffiliate,false);assert.ok(item.lastSeen);}
 }
});
test("persona selection respects meaningful goal and space",()=>{
 assert.equal(selectedPersona({...base,goal:"strength"}),"strength");
 assert.equal(selectedPersona({...base,goal:"walking",space:"large"}),"cardio");
 assert.equal(selectedPersona({...base,goal:"mixed",space:"compact"}),"compact");
});
