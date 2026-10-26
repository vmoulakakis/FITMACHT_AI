import test from "node:test";
import assert from "node:assert/strict";
import {mapVerifiedOffer,catalog} from "../lib/catalog";

const now=Date.parse("2026-10-26T18:00:00Z");
const sample={
  id:"345e0ddc-7620-427b-8549-1f0c1c86b213",
  title:"Verified walking pad",merchant_name:"Example merchant",
  normalized_category:"walking-pad",price_eur:"349.00",currency:"EUR",
  tracking_url:"https://affiliate.linkwi.se/click?id=42",image_url:null,
  in_stock:true,last_seen_at:"2026-10-26T12:00:00Z",
  verified_commission_eur:"12.00",terms_source_url:"https://merchant.example/terms",
  terms_verified_at:"2026-10-25T12:00:00Z",
  spec_evidence_url:"https://merchant.example/specs",
  specs_verified:true,approved:true
};

test("RLS-approved offer is mapped with auditable commission and specs",()=>{
  const o=mapVerifiedOffer(sample,now);
  assert.equal(o?.category,"walking-pad");
  assert.equal(o?.verifiedCommissionEur,12);
  assert.equal(o?.commissionEvidence,true);
  assert.equal(o?.specsVerified,true);
});

test("unapproved/stale/unsupported products never map",()=>{
  const bad=[
    {...sample,approved:false},
    {...sample,specs_verified:false},
    {...sample,terms_source_url:""},
    {...sample,terms_verified_at:"2026-08-10T00:00:00Z"},
    {...sample,last_seen_at:"2026-09-01T00:00:00Z"},
    {...sample,verified_commission_eur:"9.99"},
    {...sample,normalized_category:"fake-category"},
    {...sample,currency:"USD"},
    {...sample,price_eur:"0"}
  ];
  for(const row of bad)assert.equal(mapVerifiedOffer(row,now),null);
});

test("catalog uses only the reviewed, RLS-filtered table",async()=>{
  const fetchBefore=globalThis.fetch;
  const urlBefore=process.env.SOCIALMARKET_SUPABASE_URL;
  const keyBefore=process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY;
  try {
    process.env.SOCIALMARKET_SUPABASE_URL="https://example-project.supabase.co";
    process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY="test-publishable-key";
    globalThis.fetch=(async (input)=>{
      assert.match(String(input),/\/rest\/v1\/fitmatch_verified_offers\?/);
      assert.doesNotMatch(String(input),/commerce_feed_eligible_offers/);
      return new Response(JSON.stringify([]),{status:200,headers:{"Content-Type":"application/json"}});
    }) as typeof fetch;
    const result=await catalog();
    assert.equal(result.mode,"verified_empty");
    assert.deepEqual(result.offers,[]);
  } finally {
    globalThis.fetch=fetchBefore;
    if(urlBefore===undefined)delete process.env.SOCIALMARKET_SUPABASE_URL;else process.env.SOCIALMARKET_SUPABASE_URL=urlBefore;
    if(keyBefore===undefined)delete process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY;else process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY=keyBefore;
  }
});
