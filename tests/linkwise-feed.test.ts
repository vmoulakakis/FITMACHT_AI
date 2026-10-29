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
