/**
 * Public, RLS-limited Supabase projection of recent Linkwise discovery previews.
 * The table carries no tracking URLs, merchant payouts or private raw feed.
 * A publishable key only sees rows approved for "unverified preview" display.
 */
import type {Category} from "./decision";
import type {CandidatePreview} from "./linkwise-preview";

type Row={
 source_product_id:unknown; product_name:unknown; brand_name:unknown;
 price_eur:unknown; image_url:unknown; observed_at:unknown;
 category:unknown;
};
const httpsImage=(raw:unknown):string|null=>{
 if(typeof raw!=="string")return null;
 try{
   const u=new URL(raw);
   return u.protocol==="https:"&&!u.username&&!u.password&&!u.port&&u.hostname.includes(".")?u.href:null;
 }catch{return null;}
};
export async function publicLinkwisePreviews(category:Category,budget:number,fetcher:typeof fetch=fetch):Promise<CandidatePreview[]> {
 const base=process.env.FITMATCH_PUBLIC_CATALOG_URL;
 const key=process.env.FITMATCH_PUBLIC_CATALOG_KEY;
 if(!base||!key||!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base))return [];
 const query=new URL("/rest/v1/fitmatch_feed_candidates",base);
 query.searchParams.set("select","source_product_id,product_name,brand_name,price_eur,image_url,observed_at,category");
 query.searchParams.set("category","eq."+category);
 query.searchParams.set("order","price_eur.asc");
 query.searchParams.set("limit","15");
 try{
   const r=await fetcher(query,{headers:{"apikey":key,"Authorization":"Bearer "+key},signal:AbortSignal.timeout(3000),cache:"no-store"});
   if(!r.ok)return [];
   const data:unknown=await r.json();
   if(!Array.isArray(data))return [];
   const now=Date.now();
   const candidates:CandidatePreview[]=[];
   for(const item of data){
     if(!item||typeof item!=="object")continue;
     const p=item as Row;
     const price=Number(p.price_eur),observedAt=String(p.observed_at??"");
     const age=now-Date.parse(observedAt);
     if(String(p.category)!==category || typeof p.source_product_id!=="string" ||
       typeof p.product_name!=="string" || !p.product_name.trim() ||
       !Number.isFinite(price) || price<=0 || price>budget ||
       !Number.isFinite(age) || age<0 || age>48*3600_000)continue;
     candidates.push({
       id:p.source_product_id,title:p.product_name,brand:typeof p.brand_name==="string"?p.brand_name:null,
       price,imageUrl:httpsImage(p.image_url),observedAt,status:"unverified_feed_preview"
     });
   }
   return candidates.slice(0,3);
 }catch{return [];}
}
