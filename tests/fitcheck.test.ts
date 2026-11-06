import test from "node:test";
import assert from "node:assert/strict";
import {classifyIssue,hasHealthConcern,makeFitCheckPlan} from "../lib/fitcheck";

test("Greek accent normalization recognises a small apartment",()=>{
 assert.equal(classifyIssue("Έχω μικρό χώρο σε διαμέρισμα"),"space");
});
test("desk work yields routine without forcing shopping",()=>{
 const p=makeFitCheckPlan("Κάθομαι σε γραφείο πολλές ώρες");
 assert.equal(p.intent,"routine"); assert.match(p.steps[1],/χωρίς νέο εξοπλισμό/);
});
test("pain/rehabilitation always overrides model-selected shopping classification",()=>{
 const p=makeFitCheckPlan("Έχω πόνο στο γόνατο και θέλω μηχάνημα","strength","model_assisted");
 assert.equal(p.intent,"recovery");assert.equal(p.equipmentAllowed,false);
 assert.equal(p.suggestedGoal,null);assert.equal(p.source,"guided_rules");
});
test("English pain language is picked up",()=>{
 assert.equal(hasHealthConcern("Post surgery rehab advice"),true);
});
test("known model selection is reflected only for safe classes",()=>{
 const p=makeFitCheckPlan("Θέλω κάτι για καλύτερη φυσική κατάσταση","cardio","model_assisted");
 assert.equal(p.intent,"cardio");assert.equal(p.source,"model_assisted");
});
test("unknown free text falls back to an actionable, safe generic plan",()=>{
 const p=makeFitCheckPlan("Θέλω να οργανώσω την καθημερινότητά μου");
 assert.equal(p.steps.length,3);assert.equal(p.source,"guided_rules");
});
