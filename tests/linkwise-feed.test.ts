import test from "node:test";
import assert from "node:assert/strict";
import {classifyFitness,normalizeLinkwise,streamJsonObjects,validateFeedUrl} from "../lib/linkwise-feed";

const when="2026-10-29T11:00:00.000Z";
const base={product_id:"SKU-100",product_name:"Walking Pad Slim",category:"Διάδρομοι γυμναστικής",brand_name:"TestBrand",model_name:"S1",price:"249.90",full_price:"299.90",currency:"EUR",in_stock:"1",image_url:"https://images.example.org/s1.jpg",tracking_url:"https://affiliate.linkwi.se/track?id=1"};
function bytes(json:string,span=13):ReadableStream<Uint8Array>{
  const all=new TextEncoder().encode(json);let i=0;
  return new ReadableStream({pull(c){if(i>=all.length){c.close();return;}c.enqueue(all.slice(i,i+span));i+=span;}});
}
test("CD104 source URL cannot be changed into an arbitrary host",()=>{
  const u="https://affiliate.linkwi.se/feeds/1.2/CD104/programs-all/columns-product_id,product_name/feed.json";
  assert.equal(validateFeedUrl(u).hostname,"affiliate.linkwi.se");
  assert.throws(()=>validateFeedUrl("https://evil.example/feeds/1.2/CD104/test/feed.json"));
  assert.throws(()=>validateFeedUrl("http://affiliate.linkwi.se/feeds/1.2/CD104/test/feed.json"));
  assert.throws(()=>validateFeedUrl("https://affiliate.linkwi.se@evil.example/feeds/1.2/CD104/test/feed.json"));
});
test("maps named feed columns but never invents a program, approved offer or merchant",()=>{
  const c=normalizeLinkwise(base,when);
  assert.ok(c);
  assert.equal(c.category,"walking-pad");
  assert.equal(c.programId,null);
  assert.equal(c.priceEur,249.90);
  assert.equal(c.inStock,true);
  assert.equal(c.imageUrl,base.image_url);
  assert.equal(c.verification,"pending_program_and_specs_review");
  assert.equal("commissionEvidence" in c,false);
});
test("only exact fitness use cases, never accessories",()=>{
  assert.equal(classifyFitness({...base,product_name:"Λιπαντικό για διάδρομο γυμναστικής"}),null);
  assert.equal(classifyFitness({...base,product_name:"Smartwatch",category:"Wearables"}),null);
  assert.equal(classifyFitness({...base,product_name:"Ρυθμιζόμενοι αλτήρες 20kg"}),"adjustable-dumbbells");
  assert.equal(classifyFitness({...base,product_name:"Exercise bike compact"}),"exercise-bike");
});
test("rejects unusable prices, expired listings and unknown currencies",()=>{
  assert.equal(normalizeLinkwise({...base,price:"0"},when),null);
  assert.equal(normalizeLinkwise({...base,valid_to:"2026-10-01"},when),null);
  assert.equal(normalizeLinkwise({...base,currency:"USD"},when),null);
  assert.equal(normalizeLinkwise({...base,image_url:"http://example.com/x"},when)?.imageUrl,null);
  assert.equal(normalizeLinkwise({...base,in_stock:false},when)?.inStock,false);
});
test("streams root arrays across UTF-8 and escaped JSON boundaries",async()=>{
  const rows=[{...base,product_name:"Walking Pad \"Δοκιμή\""}, {...base,product_id:"SKU-101",product_name:"Ποδήλατο γυμναστικής"}];
  const seen:unknown[]=[];
  for await(const obj of streamJsonObjects(bytes(JSON.stringify(rows),3)))seen.push(obj);
  assert.deepEqual(seen,rows);
});
test("streams nested array envelope and ignores unrelated metadata",async()=>{
  const doc={version:2,meta:{test:true},data:[base,{...base,product_id:"SKU-102"}]};
  const seen:unknown[]=[];
  for await(const obj of streamJsonObjects(bytes(JSON.stringify(doc),7)))seen.push(obj);
  assert.deepEqual(seen,doc.data);
});
test("corrupt or truncated large feeds fail instead of completing a partial review",async()=>{
  await assert.rejects(async()=>{for await(const _ of streamJsonObjects(bytes('[{"product_id":"x"}',4))){}},/truncated/);
  await assert.rejects(async()=>{for await(const _ of streamJsonObjects(bytes('[{"product_name":"'.concat("X".repeat(100),'"}]'),16),25)){}},/too_large/);
});

test("rejects wrong title even when merchant category resembles fitness",()=>{
 assert.equal(classifyFitness({...base,product_name:"Βαμβακερή μπλούζα",category:"Διάδρομοι γυμναστικής"}),null);
 assert.equal(classifyFitness({...base,product_name:"Σεντόνι με λάστιχο",category:"Λάστιχα αντίστασης"}),null);
});


test("includes real gym benches and fixed dumbbells, but not spare parts or linen",()=>{
 assert.equal(classifyFitness({...base,product_name:"HMS LS3859 Ρυθμιζόμενος Πάγκος Γυμναστικής"}),"weight-bench");
 assert.equal(classifyFitness({...base,product_name:"HMS SG01 Αλτήρας 1 x 7kg"}),"fixed-dumbbells");
 assert.equal(classifyFitness({...base,product_name:"Body Sculpture Dumbbell 2x3 kg"}),"fixed-dumbbells");
 assert.equal(classifyFitness({...base,product_name:"Κολάρα Μανταλάκια για Αλτήρες Σετ"}),null);
 assert.equal(classifyFitness({...base,product_name:"Σεντόνι με λάστιχο",category:"Γυμναστική"}),null);
});


test("expanded home fitness taxonomy includes equipment missing from old 7-category filter",()=>{
 const cases:[string,string][]=[
  ["HMS Magnetic Elliptical Trainer","elliptical"],
  ["Κωπηλατικό μηχάνημα εσωτερικού χώρου","rowing-machine"],
  ["Πολυόργανο γυμναστικής 100kg","home-gym"],
  ["Kettlebell 12kg","kettlebells"],
  ["Μονόζυγο τοίχου","pull-up-bars"],
  ["Mini Stepper cardio","stepper"],
  ["Yoga mat 6mm","exercise-mat"],
  ["Pilates Reformer Home","pilates-equipment"],
  ["HMS Hex Pro αλτήρας 15kg","fixed-dumbbells"],
  ["Walking Pad S2","walking-pad"]
 ];
 for(const [product_name,category] of cases){
  assert.equal(classifyFitness({...base,product_name}),category,product_name);
 }
});
test("precise feed categories identify model-only gym equipment, but not irrelevant items",()=>{
 assert.equal(classifyFitness({...base,product_name:"HMS R10",category:"Αθλήματα > Όργανα Γυμναστικής > Κωπηλατικά"}),"rowing-machine");
 assert.equal(classifyFitness({...base,product_name:"HMS X100",category:"Αθλήματα > Όργανα Γυμναστικής > Ελλειπτικά"}),"elliptical");
 assert.equal(classifyFitness({...base,product_name:"Σεντόνι με λάστιχο",category:"Λάστιχα αντίστασης"}),null);
 assert.equal(classifyFitness({...base,product_name:"Παντελόνι",category:"Διάδρομοι Γυμναστικής"}),null);
 assert.equal(classifyFitness({...base,product_name:"T-Shirt Fitness",category:"Sports Wear"}),null);
});
test("does not treat 120 euro as a minimum product price; suitability and payout are separate",()=>{
 const cheap=normalizeLinkwise({...base,product_name:"Yoga mat 6mm",price:"19.99"},when);
 assert.ok(cheap);assert.equal(cheap.priceEur,19.99);
 assert.equal(cheap.category,"exercise-mat");
 assert.equal("verifiedCommissionEur" in cheap,false);
});
