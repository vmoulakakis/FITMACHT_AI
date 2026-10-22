import test from "node:test";import assert from "node:assert/strict";
import {rankStudio,suggestNearby,selectedPersona,type BuyerStudioProfile} from "../lib/studio-ranking";
import type {Offer} from "../lib/decision";
const now=Date.parse("2026-10-22T08:00:00Z");
const base:BuyerStudioProfile={goal:"mixed",space:"compact",budget:600,noise:"critical",activity:"walk",fold:true,level:"beginner",preference:"compact",pain:"space"};
const offer=(override:Partial<Offer>={}):Offer=>({id:"real-1",title:"Walking pad example",category:"walking-pad",price:300,currency:"EUR",merchant:"Verified merchant",trackingUrl:"https://go.linkwi.se/z/99-0/CD104/",inStock:true,lastSeen:"2026-10-22T07:00:00Z",verifiedCommissionEur:25,commissionEvidence:true,specsVerified:true,...override});
test("every goal x space x noise x budget x preference yields 3 distinct five-slot solution paths",()=>{
 for(const goal of ["walking","cardio","strength","mixed"] as const)
 for(const space of ["compact","medium","large"] as const)
 for(const noise of ["critical","normal"] as const)
 for(const budget of [0,30,100,250,500,1500])
 for(const preference of ["compact","value","balanced"] as const){
  const p={...base,goal,space,noise,budget,preference};
  const lanes=rankStudio(p,[],now);
  assert.equal(lanes.length,3);
  for(const l of lanes){
   assert.equal(l.items.length,5);
   assert.equal(new Set(l.items.map(x=>x.id)).size,5);
   assert.ok(l.items.every(x=>!x.isAffiliate&&!x.buyPath));
  }
  if(budget===0)assert.ok(lanes.every(l=>l.items.every(x=>x.type==="guide")));
 }
});
test("real researched SKUs are found across the expanded 36 product feed",()=>{
 const lanes=rankStudio({...base,goal:"strength",budget:40,space:"large",noise:"normal"},[],now);
 const rs=lanes.flatMap(l=>l.items).filter(i=>i.type==="research");
 assert.ok(rs.length>0);
 assert.ok(rs.some(i=>i.category==="resistance-bands"||i.category==="fixed-dumbbells"));
 assert.ok(rs.every(i=>i.name&&i.merchant&&!i.buyPath));
});
test("soft near-budget range includes a close SKU but labels the overage precisely",()=>{
 const p:BuyerStudioProfile={...base,goal:"cardio",space:"large",noise:"normal",budget:170};
 const items=rankStudio(p,[],now).find(l=>l.id==="cardio")!.items;
 const near=items.filter(i=>i.type==="research"&&i.price!>170);
 assert.ok(near.length>0);
 assert.ok(near.every(i=>i.price!<=170+Math.min(Math.max(170*.35,12),120)));
 assert.ok(near.every(i=>i.tradeoff?.includes("πάνω από το budget")));
});
test("with no exact walking pad cardio offers a different cardio modality",()=>{
 const items=rankStudio({...base,goal:"walking",activity:"walk",space:"large",noise:"normal",budget:230},[],now)
  .find(l=>l.id==="cardio")!.items;
 assert.ok(items.some(i=>i.type==="research"&&i.name.toLowerCase().includes("ποδήλατο")));
});
test("critical noise never claims noise measurements it does not have",()=>{
 const r=rankStudio({...base,goal:"cardio",noise:"critical",space:"large",budget:10000},[offer({category:"treadmill"})],now);
 const item=r.find(l=>l.id==="cardio")!.items.find(x=>x.type==="verified");
 assert.ok(item);
 assert.ok(item?.tradeoff?.includes("θορύβου"));
});
test("commission and source evidence are absolute merchant buy-link conditions",()=>{
 for(const o of [{verifiedCommissionEur:9},{specsVerified:false},{commissionEvidence:false},{inStock:false},{lastSeen:"2026-09-01T00:00:00Z"},{price:10000}]){
  const lanes=rankStudio({...base,noise:"normal",space:"large",budget:500},[offer(o)],now);
  assert.equal(lanes.reduce((n,l)=>n+l.verifiedCount,0),0);
  assert.ok(lanes.flatMap(l=>l.items).filter(i=>i.type==="research").every(i=>!i.buyPath));
 }
});
test("never promote suspicious price/weight source mismatch to recommendation",()=>{
 const rows=rankStudio({...base,goal:"strength",budget:200,space:"large",noise:"normal"},[],now)
  .flatMap(l=>l.items.filter(i=>i.type==="research"));
 assert.ok(rows.every(x=>!x.name.includes("Energetic Body 100 kg")));
});
test("suggestNearby returns genuine research only and five at most",()=>{
 const a={goal:"strength",space:"compact",budget:70,noise:"normal",activity:"walk",fold:true} as const;
 const items=suggestNearby(a,"adjustable-dumbbells",now);
 assert.ok(items.length>0&&items.length<=5);
 assert.ok(items.every(i=>i.type==="research"&&!i.isAffiliate&&!i.buyPath&&!!i.tradeoff));
 assert.equal(suggestNearby({...a,budget:0},"adjustable-dumbbells",now).length,0);
});
test("buyer goal and pain choose appropriate lane",()=>{
 assert.equal(selectedPersona({...base,goal:"strength"}),"strength");
 assert.equal(selectedPersona({...base,goal:"walking",space:"large"}),"cardio");
 assert.equal(selectedPersona({...base,goal:"mixed",space:"compact"}),"compact");
});
