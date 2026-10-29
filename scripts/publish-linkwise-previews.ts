/**
 * Publish ONLY sanitized, fresh, UNVERIFIED candidate previews to a dedicated
 * Supabase table. Requires a trusted worker with a server-side service-role key.
 * Never uses this key in Next.js, client code, or the Vercel deployment.
 *
 * Run after a successful complete feed audit:
 * FITMATCH_IMPORT_SUPABASE_URL=https://<project>.supabase.co
 * FITMATCH_IMPORT_SUPABASE_SERVICE_ROLE_KEY=... npm run linkwise:publish-previews
 */
import {createReadStream} from "node:fs";
import {stat} from "node:fs/promises";
import {createInterface} from "node:readline";
import {resolve} from "node:path";
import type {LinkwiseCandidate} from "../lib/linkwise-feed";

async function main(){
 const base=process.env.FITMATCH_IMPORT_SUPABASE_URL||"";
 const key=process.env.FITMATCH_IMPORT_SUPABASE_SERVICE_ROLE_KEY||"";
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base)||!key||key.length<30)
   throw new Error("private_supabase_writer_not_configured");
 const file=resolve(process.env.FITMATCH_LINKWISE_AUDIT_PATH||".fitmatch-private/linkwise-cd104-candidates.jsonl");
 const safeRoot=resolve(".fitmatch-private");
 if(!file.startsWith(safeRoot+"/"))throw new Error("invalid_private_snapshot_path");
 const size=(await stat(file)).size;
 if(size<=0||size>1_000_000_000)throw new Error("invalid_private_snapshot_size");
 const rows:Record<string,unknown>[]=[];
 let examined=0,published=0;
 const lines=createInterface({input:createReadStream(file,{encoding:"utf8"}),crlfDelay:Infinity});
 async function flush(){
   if(!rows.length)return;
   const url=base+"/rest/v1/fitmatch_feed_candidates?on_conflict=source,source_product_id";
   const r=await fetch(url,{
     method:"POST",headers:{"apikey":key,"Authorization":"Bearer "+key,"Content-Type":"application/json",
       "Prefer":"resolution=merge-duplicates,return=minimal"},
     body:JSON.stringify(rows),signal:AbortSignal.timeout(20000),cache:"no-store"
   });
   if(!r.ok)throw new Error("supabase_preview_upsert_failed_"+r.status);
   published+=rows.length;rows.length=0;
 }
 try{
  for await(const line of lines){
   examined++;
   if(line.length>100_000)continue;
   let p:LinkwiseCandidate;
   try{p=JSON.parse(line) as LinkwiseCandidate;}catch{continue;}
   if(p.source!=="linkwise_cd104"||p.verification!=="pending_program_and_specs_review"||
      p.currency!=="EUR"||p.inStock!==true||typeof p.sourceProductId!=="string"||
      !p.sourceProductId||typeof p.productName!=="string"||p.productName.length<2||
      p.productName.length>500||!Number.isFinite(p.priceEur)||p.priceEur<=0||
      !["walking-pad","treadmill","exercise-bike","adjustable-dumbbells","resistance-bands","fixed-dumbbells","weight-bench","elliptical","rowing-machine","home-gym","kettlebells","pull-up-bars","stepper","exercise-mat","pilates-equipment"].includes(p.category))continue;
   const age=Date.now()-Date.parse(p.observedAt);
   if(!Number.isFinite(age)||age<0||age>48*3600_000)continue;
   rows.push({
     source:"linkwise_cd104",source_product_id:p.sourceProductId,
     category:p.category,product_name:p.productName,brand_name:p.brandName,
     price_eur:p.priceEur,image_url:p.imageUrl,in_stock:true,
     observed_at:p.observedAt,preview_state:"preview"
   });
   if(rows.length>=100)await flush();
  }
  await flush();
 }finally{lines.close();}
 // Never log service keys, original feed URL, tracking URLs or raw item data.
 console.log(JSON.stringify({ok:true,examined,published,mode:"public_unverified_previews_only"}));
}
main().catch(e=>{console.error(e instanceof Error?e.message:"upload_failure");process.exitCode=1;});
