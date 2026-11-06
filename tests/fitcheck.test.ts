import {test} from "node:test";
import {strict as assert} from "node:assert";
import {goals,spaces,getFitCheckSuggestion} from "../lib/fitcheck";

test("every FitCheck goal and space combination produces useful advice",()=>{
 assert.equal(goals.length,3);
 assert.equal(spaces.length,3);
 for(const goal of goals)for(const space of spaces){
  const result=getFitCheckSuggestion(goal.id,space.id);
  assert.ok(result.title.length>15,goal.id+":"+space.id+" title");
  assert.ok(result.copy.length>35,goal.id+":"+space.id+" explanation");
  assert.ok(result.check.length>20,goal.id+":"+space.id+" safety/spec check");
  assert.equal("trackingUrl" in result,false);
  assert.equal("price" in result,false);
  assert.equal("available" in result,false);
 }
});

test("FitCheck guidance depends on goal and available space",()=>{
 assert.notEqual(getFitCheckSuggestion("cardio","compact").title,getFitCheckSuggestion("strength","compact").title);
 assert.notEqual(getFitCheckSuggestion("cardio","compact").title,getFitCheckSuggestion("cardio","open").title);
});

test("mobility intro does not require a purchase",()=>{
 const compact=getFitCheckSuggestion("mobility","compact");
 assert.match(compact.title,/χωρίς αγορά/);
});
