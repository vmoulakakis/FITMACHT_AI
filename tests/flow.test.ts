import test from "node:test";import assert from "node:assert/strict";import {solve} from "../lib/solutions";import type {Answers} from "../lib/decision";
const a:Answers={goal:"walking",space:"compact",noise:"normal",activity:"walk",budget:400,fold:false};
test("two-question buyer journey always returns three solutions",()=>{const s=solve(a);assert.equal([s.primary,...s.alternatives].length,3);});
test("no payment means no purchase guidance",()=>assert.equal(solve({...a,budget:0}).primary.kind,"no_purchase"));
