import {test} from "node:test";
import {strict as assert} from "node:assert";
import {journeyTier,commerceEligible} from "../lib/movement-intelligence";
test("urgent disclosures suppress wellness and commerce",()=>{
 for(const id of ["desk","motivation","pain","rehab","care"] as const){
  assert.equal(journeyTier(id,"time","urgent"),"urgent");
  assert.equal(commerceEligible(id,"time","urgent"),false);
 }
});
test("rehabilitation, functional limitation and caregiver needs cannot auto-receive wellness commerce",()=>{
 for(const id of ["pain","rehab","independence","care"] as const){
  assert.equal(journeyTier(id,"time","well"),"professional");
  assert.equal(commerceEligible(id,"time","well"),false);
 }
});
test("barrier signalling body limitation escalates",()=>{
 assert.equal(journeyTier("desk","body","well"),"professional");
 assert.equal(commerceEligible("desk","body","well"),false);
});
test("explicit clinical context escalates",()=>assert.equal(journeyTier("fitness","time","clinical"),"professional"));
test("general non-clinical profile only allows candidate commerce after safety answer",()=>{
 assert.equal(commerceEligible("desk","time",null),false);
 assert.equal(commerceEligible("desk","time","well"),true);
 assert.equal(commerceEligible("motivation","routine","well"),true);
});
