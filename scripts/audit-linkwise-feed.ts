/**
 * Run explicitly from a trusted worker, NOT inside a Vercel request:
 * LINKWISE_FITMATCH_FEED_URL='https://affiliate.linkwi.se/feeds/1.2/CD104/.../feed.json' npm run linkwise:audit
 *
 * Writes ONLY to a gitignored private staging directory; it never publishes
 * offers or writes to SocialMarket. Large JSON is processed as a byte stream.
 */
import {createWriteStream} from "node:fs";
import {mkdir,rename,rm,writeFile} from "node:fs/promises";
import {dirname,resolve} from "node:path";
import {once} from "node:events";
import {finished} from "node:stream/promises";
import {normalizeLinkwise,streamJsonObjects,validateFeedUrl} from "../lib/linkwise-feed";

async function main():Promise<void>{
const url=validateFeedUrl(process.env.LINKWISE_FITMATCH_FEED_URL||"");
const path=resolve(process.env.FITMATCH_LINKWISE_AUDIT_PATH||".fitmatch-private/linkwise-cd104-candidates.jsonl");
const observedAt=new Date().toISOString();
const maxCandidates=Number(process.env.FITMATCH_MAX_AUDIT_CANDIDATES||10000);
if(!Number.isSafeInteger(maxCandidates)||maxCandidates<1||maxCandidates>50000)throw new Error("invalid_max_candidates");
const r=await fetch(url,{redirect:"error",headers:{"Accept":"application/json"},signal:AbortSignal.timeout(240000),cache:"no-store"});
if(!r.ok||!r.body)throw new Error("linkwise_feed_http_"+r.status);
const contentType=r.headers.get("content-type")||"";
if(!/json|octet-stream|text\/plain/i.test(contentType))throw new Error("linkwise_unexpected_content_type");
await mkdir(dirname(path),{recursive:true,mode:0o700});
const temp=path+".tmp-"+process.pid;
const file=createWriteStream(temp,{mode:0o600,flags:"wx"});
const seenKeys=new Set<string>();
const counts={rowsSeen:0,candidates:0,stored:0,duplicates:0,invalidOrOutOfScope:0,outOfStock:0,missingProgram:0,missingImage:0,missingTrackingUrl:0};
try{
  for await(const row of streamJsonObjects(r.body)){
    counts.rowsSeen++;
    const p=normalizeLinkwise(row,observedAt);
    if(!p){counts.invalidOrOutOfScope++;continue;}
    counts.candidates++;
    if(!p.inStock)counts.outOfStock++;
    if(!p.programId)counts.missingProgram++;
    if(!p.imageUrl)counts.missingImage++;
    if(!p.trackingUrl)counts.missingTrackingUrl++;
    const key=(p.programId||"unknown")+"\u0000"+p.sourceProductId;
    if(seenKeys.has(key)){counts.duplicates++;continue;}
    seenKeys.add(key);
    if(counts.stored>=maxCandidates)continue;
    if(!file.write(JSON.stringify(p)+"\n"))await once(file,"drain");
    counts.stored++;
  }
  file.end();
  await finished(file);
  await rename(temp,path);
  await writeFile(path+".meta.json",JSON.stringify({source:"linkwise_cd104",observedAt,verified:false,counts},null,2),{mode:0o600});
  console.log(JSON.stringify({ok:true,stagingOnly:true,output:path,observedAt,counts},null,2));
}catch(e){
  file.destroy();
  await rm(temp,{force:true});
  throw e;
}

}
main().catch(e=>{console.error(e instanceof Error?e.message:String(e));process.exitCode=1;});
