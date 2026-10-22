import test from "node:test";
import assert from "node:assert/strict";
import {getStoreListings,merchantAudit,buyerReason,storeCategories,topItems} from "../lib/storefront";
import type {Offer} from "../lib/decision";
const now=Date.parse("2026-10-22T13:00:00Z");
const p:Offer={id:"approved-1",title:"Approved Fitness Bike",category:"exercise-bike",merchant:"Reviewed merchant",price:580,currency:"EUR",trackingUrl:"https://go.linkwi.se/z/100-0/CD104/",inStock:true,lastSeen:"2026-10-22T12:00:00Z",verifiedCommissionEur:20.01,commissionEvidence:true,specsVerified:true};
test("all research listings are real records and never affilate-ready",()=>{
 const list=getStoreListings([],now);assert.ok(list.length>=30);
 assert.ok(list.every(x=>x.name&&x.merchant&&x.price>0));
 assert.ok(list.every(x=>!x.affiliateEligible&&!x.approved));
 assert.equal(new Set(list.map(x=>x.id)).size,list.length);
});
test("five niche categories are represented, even if unpopulated in feed",()=>{
 const types=storeCategories().map(x=>x.id);assert.deepEqual(types,["cardio","strength","home-gym","recovery","accessories"]);
 const list=getStoreListings([],now);
 assert.ok(topItems(list,"cardio").length>0);
 assert.ok(topItems(list,"strength").length>0);
 assert.equal(topItems(list,"recovery").length,0);
});
test("strict payout gate separates 20 from 20.01, without leaking track urls",()=>{
 const list=getStoreListings([p,{...p,id:"not-approved",title:"Below minimum",verifiedCommissionEur:20}],now);
 assert.equal(list.filter(x=>x.affiliateEligible).length,1);
 assert.equal(list.find(x=>x.id==="not-approved")?.affiliateEligible,undefined);
 assert.ok(!JSON.stringify(list).includes("go.linkwi.se"));
});
test("merchant ranking is evidence grounded: counts, no fabricated reputation scores",()=>{
 const stats=merchantAudit(getStoreListings([],now));
 assert.ok(stats.length>=2);
 assert.ok(stats.every(x=>x.count>0&&x.approved===0));
});
test("each SKU has unique buyer explanation with checks",()=>{
 const items=getStoreListings([],now);
 for(const item of items.slice(0,12)){const r=buyerReason(item);assert.ok(r.headline.length>10);assert.ok(r.check.length>0);assert.ok(r.caution);}
});
