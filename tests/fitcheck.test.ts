import {test} from "node:test";
import {strict as assert} from "node:assert";
import {goals,spaces,getFitCheckSuggestion,fitCheckAdvisorUrl,parseFitCheckSeed} from "../lib/fitcheck";

test("every FitCheck goal × space state contains grounded category guidance",()=>{
 assert.equal(goals.length,3);
 assert.equal(spaces.length,3);
 for(const goal of goals)for(const space of spaces){
  const item=getFitCheckSuggestion(goal.id,space.id);
  assert.ok(item.title.length>15,goal.id+":"+space.id);
  assert.ok(item.description.length>35,goal.id+":"+space.id);
  assert.ok(item.check.length>18,goal.id+":"+space.id);
  assert.equal("trackingUrl" in item,false);
  assert.equal("price" in item,false);
 }
});
test("selection affects the explanation",()=>{
 assert.notEqual(getFitCheckSuggestion("cardio","compact").title,getFitCheckSuggestion("strength","compact").title);
 assert.notEqual(getFitCheckSuggestion("cardio","compact").title,getFitCheckSuggestion("cardio","large").title);
});
test("complete FitCheck submits safe parameters for a two-step warm start",()=>{
 for(const goal of goals)for(const space of spaces){
  const url=fitCheckAdvisorUrl({goal:goal.id,space:space.id});
  assert.ok(url.startsWith("/equipment?"));
  const query=Object.fromEntries(new URL(url,"https://example.org").searchParams.entries());
  assert.deepEqual(parseFitCheckSeed(query),{goal:goal.id,space:space.id});
 }
});
test("invalid and incomplete query data never bypass the first two steps",()=>{
 assert.equal(parseFitCheckSeed({start:"1",goal:"walking"}),null);
 assert.equal(parseFitCheckSeed({start:"1",goal:"wrong",space:"medium"}),null);
 assert.equal(parseFitCheckSeed({start:"0",goal:"cardio",space:"large"}),null);
 assert.equal(parseFitCheckSeed({start:"1",goal:["walking","cardio"],space:"compact"}),null);
 assert.equal(parseFitCheckSeed({start:"1",goal:"walking",space:"INVALID"}),null);
});
