import test from "node:test";
import assert from "node:assert/strict";
import {painGroups,targetItems,matchTargets} from "../lib/mikromove-data";
test("exactly 100 distinct specialized research targets in 10 groups",()=>{
 assert.equal(painGroups.length,10);
 assert.equal(targetItems.length,100);
 assert.equal(new Set(targetItems.map(x=>x.id)).size,100);
 assert.ok(targetItems.every(x=>x.status==="research_target"));
 for(const g of painGroups)assert.equal(targetItems.filter(x=>x.group===g.id).length,10);
});
test("no sourcing target is misrepresented as a verified listing",()=>{
 for(const item of targetItems){
   assert.ok(item.name.length>12);
   assert.ok(item.criterion.length>5);
   assert.equal("price" in item,false);
   assert.equal("trackingUrl" in item,false);
   assert.equal("commission" in item,false);
 }
});
test("100 deterministic user profiles always receive relevant traceable results",()=>{
 const profiles=Array.from({length:100},(_,i)=>({
  pain:painGroups[i%10].id,
  space:(i%2===0?"compact":"flexible") as "compact"|"flexible",
  quiet:(Math.floor(i/2)%2===0)
 }));
 for(const profile of profiles){
   const ranked=matchTargets(profile.pain,profile.space,profile.quiet);
   assert.equal(ranked.length,100);
   assert.equal(new Set(ranked.map(x=>x.id)).size,100);
   assert.ok(ranked.slice(0,3).every(x=>x.group===profile.pain));
 }
});
test("compact/quiet ranking favors matching form factors without false clinical promises",()=>{
 const ranked=matchTargets("quiet","compact",true);
 assert.equal(ranked[0].group,"quiet");
 assert.equal(targetItems.filter(x=>/θεραπεύει|εγγυημέν|πιστοποιημένο κλινικ|100% επιτυχία/i.test(x.name)).length,0);
});
