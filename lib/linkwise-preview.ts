/**
 * Read-only local/private staging previews. Not an approved offers source.
 * The importer stores full tracking URLs privately; this function never
 * returns those URLs to the browser or marks a product safe for purchase.
 */
import {createReadStream} from "node:fs";
import {stat} from "node:fs/promises";
import {createInterface} from "node:readline";
import {resolve} from "node:path";
import type {Category} from "./decision";
import type {LinkwiseCandidate} from "./linkwise-feed";

export type CandidatePreview={
  id:string;title:string;brand:string|null;price:number;imageUrl:string|null;
  observedAt:string;status:"unverified_feed_preview";
};
export async function linkwisePreviews(category:Category,budget:number):Promise<CandidatePreview[]>{
  // Only a local, intentionally configured private staging path is read.
  // Never accept a path from the request or allow paths outside .fitmatch-private.
  const base=resolve(process.cwd(),".fitmatch-private");
  const raw=process.env.FITMATCH_LINKWISE_AUDIT_PATH||".fitmatch-private/linkwise-cd104-candidates.jsonl";
  const path=resolve(raw);
  if(path!==base && !path.startsWith(base+"/"))return [];
  let fileSize=0;
  try{fileSize=(await stat(path)).size;}catch{return [];}
  if(fileSize>30_000_000)return [];
  const selected:CandidatePreview[]=[];
  const input=createReadStream(path,{encoding:"utf8"});
  const lines=createInterface({input,crlfDelay:Infinity});
  try{
    for await(const line of lines){
      if(line.length>100_000)continue;
      let p:LinkwiseCandidate;
      try{p=JSON.parse(line) as LinkwiseCandidate;}catch{continue;}
      if(p.category!==category||p.verification!=="pending_program_and_specs_review"||p.currency!=="EUR"||p.inStock!==true||!p.sourceProductId||!p.productName)continue;
      if(!Number.isFinite(p.priceEur)||p.priceEur<=0||p.priceEur>budget)continue;
      const age=Date.now()-new Date(p.observedAt).getTime();
      if(!Number.isFinite(age)||age<0||age>48*3600_000)continue;
      selected.push({id:p.sourceProductId,title:p.productName,brand:p.brandName,price:p.priceEur,
        imageUrl:p.imageUrl,observedAt:p.observedAt,status:"unverified_feed_preview"});
      selected.sort((a,b)=>a.price-b.price);
      if(selected.length>3)selected.pop();
    }
  }catch{return [];}finally{lines.close();input.destroy();}
  return selected;
}
