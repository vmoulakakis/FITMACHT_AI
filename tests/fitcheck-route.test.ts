import test from "node:test";
import assert from "node:assert/strict";
import {POST} from "../app/api/fitcheck/route";
import type {FitCheckPlan} from "../lib/fitcheck";

async function send(body:unknown){
 return POST(new Request("https://example.test/api/fitcheck",{
  method:"POST",headers:{"content-type":"application/json"},
  body:JSON.stringify(body)
 }));
}

test("invalid short intake is rejected without calling providers",async()=>{
 const response=await send({issue:"hi",consentToModel:false});
 assert.equal(response.status,422);
 assert.equal(response.headers.get("Cache-Control"),"no-store");
});
test("Greek issue returns honest rule-based steps without consent",async()=>{
 const response=await send({issue:"Έχω μικρό χώρο σε διαμέρισμα",consentToModel:false});
 assert.equal(response.status,200);
 const data=await response.json() as {processing:string;plan:FitCheckPlan};
 assert.equal(data.processing,"guided_rules");
 assert.equal(data.plan.intent,"space");
 assert.equal(data.plan.steps.length,3);
 assert.equal(data.plan.equipmentAllowed,true);
});
test("pain language disables equipment CTA even if it includes equipment",async()=>{
 const response=await send({issue:"Έχω πόνο στο γόνατο και θέλω διάδρομο",consentToModel:false});
 const data=await response.json() as {plan:FitCheckPlan};
 assert.equal(data.plan.intent,"recovery");
 assert.equal(data.plan.equipmentAllowed,false);
 assert.equal(data.plan.suggestedGoal,null);
});
