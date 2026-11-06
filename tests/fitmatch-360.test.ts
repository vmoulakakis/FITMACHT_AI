import {test} from "node:test";import {strict as assert} from "node:assert";
import {buildProgram,allowProductCheckout,validPlanInput,type PlanInput} from "../lib/fitmatch-360";
const p:PlanInput={need:"desk",barrier:"time",minutes:5,safety:"well",preference:"mediterranean",setting:"home",budget:"medium"};
test("a complete wellness journey includes movement nutrition and weekly habits",()=>{const r=buildProgram(p);assert.equal(r.tier,"wellness");assert.ok(r.movement.length>=3);assert.ok(r.food.length>=2);assert.equal(r.weekly.length,6);assert.ok(r.sources.length>0);});
test("medical routes do not auto prescribe exercises or diets or checkout",()=>{const a={...p,need:"rehab",safety:"clinical"} as const;const r=buildProgram(a);assert.equal(r.tier,"professional");assert.equal(allowProductCheckout(a),false);assert.match(r.expertReview,/έγκριση/);});
test("urgent route cannot checkout and contains emergency routing",()=>{const a={...p,safety:"urgent"} as const;const r=buildProgram(a);assert.equal(r.tier,"urgent");assert.equal(allowProductCheckout(a),false);assert.match(r.movement.join(" "),/112/);});
test("invalid plan is rejected",()=>{assert.equal(validPlanInput({...p,minutes:999}),false);assert.equal(validPlanInput({...p,safety:"unknown"}),false);assert.equal(validPlanInput(p),true);});
test("wellness and dietary preference do not imply clinician authorization",()=>{const r=buildProgram({...p,preference:"vegetarian"});assert.match(r.expertReview,/χρειάζονται/);assert.ok(r.food.some(x=>x.includes("διαιτολόγο")));});
