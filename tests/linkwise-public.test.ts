import test from "node:test";
import assert from "node:assert/strict";
import {publicLinkwisePreviews} from "../lib/linkwise-public";
test("public catalog fails closed without a server-side data source",async()=>{
 const saveUrl=process.env.FITMATCH_PUBLIC_CATALOG_URL, saveKey=process.env.FITMATCH_PUBLIC_CATALOG_KEY;
 try{
  delete process.env.FITMATCH_PUBLIC_CATALOG_URL;delete process.env.FITMATCH_PUBLIC_CATALOG_KEY;
  assert.deepEqual(await publicLinkwisePreviews("walking-pad",500),[]);
 }finally{
  if(saveUrl===undefined)delete process.env.FITMATCH_PUBLIC_CATALOG_URL;else process.env.FITMATCH_PUBLIC_CATALOG_URL=saveUrl;
  if(saveKey===undefined)delete process.env.FITMATCH_PUBLIC_CATALOG_KEY;else process.env.FITMATCH_PUBLIC_CATALOG_KEY=saveKey;
 }
});
test("public catalog returns only recent matching products within budget without links",async()=>{
 const oldUrl=process.env.FITMATCH_PUBLIC_CATALOG_URL,oldKey=process.env.FITMATCH_PUBLIC_CATALOG_KEY;
 try{
  process.env.FITMATCH_PUBLIC_CATALOG_URL="https://example123.supabase.co";
  process.env.FITMATCH_PUBLIC_CATALOG_KEY="sb_publishable_test_123";
  const sample={source_product_id:"fit-1",product_name:"Walking Pad Σπίτι",brand_name:"Sample",category:"walking-pad",price_eur:249.9,
    image_url:"https://example.org/fit.jpg",observed_at:new Date().toISOString()};
  let url="";
  const fetcher:typeof fetch=async function(input){
    url=String(input);
    return new Response(JSON.stringify([sample,{...sample,source_product_id:"expensive",price_eur:950},
      {...sample,source_product_id:"stale",observed_at:"2026-09-01T00:00:00Z"},
      {...sample,source_product_id:"unrelated",category:"treadmill"}]),{status:200,headers:{"content-type":"application/json"}});
  } as typeof fetch;
  const found=await publicLinkwisePreviews("walking-pad",500,fetcher);
  assert.equal(found.length,1);
  assert.equal(found[0].id,"fit-1");
  assert.equal("trackingUrl" in found[0],false);
  assert.match(url,/fitmatch_feed_candidates/);
  assert.match(url,/walking-pad/);
 }finally{
  if(oldUrl===undefined)delete process.env.FITMATCH_PUBLIC_CATALOG_URL;else process.env.FITMATCH_PUBLIC_CATALOG_URL=oldUrl;
  if(oldKey===undefined)delete process.env.FITMATCH_PUBLIC_CATALOG_KEY;else process.env.FITMATCH_PUBLIC_CATALOG_KEY=oldKey;
 }
});
test("public catalog handles denied RLS and malformed payloads safely",async()=>{
 const oldUrl=process.env.FITMATCH_PUBLIC_CATALOG_URL,oldKey=process.env.FITMATCH_PUBLIC_CATALOG_KEY;
 try{
  process.env.FITMATCH_PUBLIC_CATALOG_URL="https://example123.supabase.co";
  process.env.FITMATCH_PUBLIC_CATALOG_KEY="sb_publishable_test_123";
  assert.deepEqual(await publicLinkwisePreviews("treadmill",500,async()=>new Response("denied",{status:403})),[]);
  assert.deepEqual(await publicLinkwisePreviews("treadmill",500,async()=>new Response(JSON.stringify({error:"oops"}),{status:200})),[]);
 }finally{
  if(oldUrl===undefined)delete process.env.FITMATCH_PUBLIC_CATALOG_URL;else process.env.FITMATCH_PUBLIC_CATALOG_URL=oldUrl;
  if(oldKey===undefined)delete process.env.FITMATCH_PUBLIC_CATALOG_KEY;else process.env.FITMATCH_PUBLIC_CATALOG_KEY=oldKey;
 }
});

test("historical verified-category sample is visibly dated and never includes a buy link",async()=>{
 const u=process.env.FITMATCH_PUBLIC_CATALOG_URL,k=process.env.FITMATCH_PUBLIC_CATALOG_KEY;
 try{
  process.env.FITMATCH_PUBLIC_CATALOG_URL="https://example123.supabase.co";
  process.env.FITMATCH_PUBLIC_CATALOG_KEY="sb_publishable_test_123";
  const source={source_product_id:"bike-1",product_name:"HMS fitness bike",brand_name:null,
   category:"exercise-bike",price_eur:187.87,image_url:"https://cdn.example.org/bike.jpg",
   observed_at:new Date(Date.now()-7*86400000).toISOString(),preview_state:"historical"};
  const got=await publicLinkwisePreviews("exercise-bike",500,async()=>new Response(JSON.stringify([source]),{status:200}));
  assert.equal(got.length,1);
  assert.equal(got[0].status,"historical_feed_preview");
  assert.deepEqual("trackingUrl" in got[0],false);
  const obsolete={...source,observed_at:new Date(Date.now()-40*86400000).toISOString()};
  const stale=await publicLinkwisePreviews("exercise-bike",500,async()=>new Response(JSON.stringify([obsolete]),{status:200}));
  assert.deepEqual(stale,[]);
 }finally{
  if(u===undefined)delete process.env.FITMATCH_PUBLIC_CATALOG_URL;else process.env.FITMATCH_PUBLIC_CATALOG_URL=u;
  if(k===undefined)delete process.env.FITMATCH_PUBLIC_CATALOG_KEY;else process.env.FITMATCH_PUBLIC_CATALOG_KEY=k;
 }
});
