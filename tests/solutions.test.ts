import test from "node:test";
import assert from "node:assert/strict";
import {parseIntent,solve} from "../lib/solutions";
import type {Answers} from "../lib/decision";
const initial:Answers={goal:"walking",space:"compact",noise:"normal",activity:"walk",budget:500,fold:true};
test("Greek and Greeklish hints change context without another question",()=>{
 assert.equal(parseIntent("Μένω σε πολυκατοικία και θέλω να τρέχω").quiet,true);
 assert.equal(parseIntent("Θέλω να τρέχω").run,true);
 assert.equal(parseIntent("Δεν θέλω να τρέχω").run,false);
 assert.equal(parseIntent("ligo xoro, storage").small,true);
 assert.equal(parseIntent("χωρίς αγορά").noBuy,true);
});
test("cardio does not become resistance bands when quiet",()=>{
 const result=solve({...initial,goal:"cardio",budget:900,noise:"critical"});
 assert.notEqual(result.primary.category,"resistance-bands");
 assert.notEqual(result.primary.category,"adjustable-dumbbells");
});
test("all combinations provide unique actionable choices, regardless of missing commerce",()=>{
 for(const goal of ["walking","cardio","strength","mixed"] as const)
 for(const space of ["compact","medium","large"] as const)
 for(const noise of ["critical","normal"] as const)
 for(const budget of [0,30,60,180,500,1500])
 for(const fold of [true,false]){
  const answer:Answers={...initial,goal,space,noise,budget,fold};
  const result=solve(answer,"Θέλω να βρω κάτι πρακτικό.");
  const paths=[result.primary,...result.alternatives];
  assert.equal(paths.length,3,JSON.stringify(answer));
  assert.equal(new Set(paths.map(x=>x.id)).size,3,JSON.stringify(answer));
  for(const p of paths){assert.ok(p.title);assert.ok(p.reason);assert.equal(p.actions.length,3);}
  if(budget===0)assert.equal(result.primary.kind,"no_purchase");
  if(result.primary.kind==="equipment")assert.ok(paths.some(x=>x.kind==="no_purchase"));
 }
});
test("explicit no-buy prevents forced affiliate category",()=>{
 const result=solve({...initial,budget:1500},"Δεν θέλω να αγοράσω τίποτα, θέλω δωρεάν λύση");
 assert.equal(result.primary.kind,"no_purchase");
 assert.equal(result.alternatives.every(x=>x.kind==="no_purchase"),true);
});
test("injury prompts caution without inventing medical advice",()=>{
 const result=solve(initial,"Έχω τραυματισμό");
 assert.ok(result.insights.some(x=>x.includes("επαγγελματία υγείας")));
});
test("remote HF cues may add constraints but not override user goal or budget",()=>{
 const r=solve({...initial,goal:"strength",budget:0},"",{quiet:true,small:true});
 assert.equal(r.primary.kind,"no_purchase");
 assert.equal(r.reasoning,"hf-assisted");
});
