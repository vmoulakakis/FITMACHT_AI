import test from "node:test";
import assert from "node:assert/strict";
import {commissionScenario,rateScenario,screenCandidate,extraMerchantResearch,historicalMybrandAllowlist} from "../lib/mikromove-commercial";

test("conservative payout scenario requires about 183 EUR retail at old 8% under stated assumptions",()=>{
 assert.equal(commissionScenario(0),null);
 assert.equal(commissionScenario(-10),null);
 assert.equal(commissionScenario(100),5.48);
 assert.equal((commissionScenario(155)??Infinity)<10,true);
 assert.equal((commissionScenario(182)??Infinity)<10,true);
 assert.equal((commissionScenario(183)??-Infinity)>=10,true);
 assert.equal(rateScenario.targetNetEur,10);
});
test("all six newly observed merchant examples pass hypothetical EUR 10 payout but none passes approval",()=>{
 assert.equal(extraMerchantResearch.length,6);
 assert.equal(new Set(extraMerchantResearch.map(x=>x.id)).size,6);
 assert.ok(extraMerchantResearch.every(x=>x.source==="merchant_public_page"&&x.sourceDate==="2026-10-29"));
 for(const candidate of extraMerchantResearch){
   const result=screenCandidate(candidate);
   assert.equal(result.passesIndicativeFloor,true);
   assert.equal(result.approved,false);
   assert.equal(result.purchasable,false);
   assert.ok(result.indicativeEur!==null&&result.indicativeEur>=10);
   assert.equal("trackingUrl" in result,false);
 }
});
test("historical source allowlist is constrained to ten actual Mybrand SKU ids",()=>{
 assert.equal(historicalMybrandAllowlist.length,10);
 assert.equal(new Set(historicalMybrandAllowlist).size,10);
 assert.equal(historicalMybrandAllowlist.includes("nonexistent" as never),false);
});
test("approved affiliate income is never inferred from a merchant web price",()=>{
 const example=extraMerchantResearch[0];
 assert.ok(example.priceEur>0);
 const screened=screenCandidate(example);
 assert.equal(screened.approved,false);
 assert.equal(screened.review,"program_pending");
 assert.equal(screened.purchasable,false);
});
