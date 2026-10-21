import type {Offer} from "./decision";
type FeedRecord = Record<string,unknown>;
const nonempty=(v:unknown)=>typeof v==="string" ? v.trim() : "";
const n=(v:unknown)=>typeof v==="number"&&Number.isFinite(v)?v:Number(v);
export async function catalog():Promise<{offers:Offer[];mode:string;reason?:string}>{
 const base=process.env.SOCIALMARKET_SUPABASE_URL;
 const key=process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY;
 if(!base||!key)return {offers:[],mode:"not_connected",reason:"Η ασφαλής σύνδεση SocialMarket δεν έχει διαμορφωθεί."};
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base))return {offers:[],mode:"error",reason:"Μη έγκυρη διεύθυνση δεδομένων."};
 try{
   const url=base+"/rest/v1/commerce_feed_eligible_offers?select=source_product_id,program_name,product_name,category_raw,price_eur,tracking_url,image_url,in_stock,last_seen_at,expected_commission_eur&is_active=eq.true&limit=200";
   const r=await fetch(url,{headers:{"apikey":key,"Authorization":"Bearer "+key},cache:"no-store",signal:AbortSignal.timeout(4500)});
   if(!r.ok)return {offers:[],mode:"restricted",reason:"Το SocialMarket δεν εκθέτει ακόμη ασφαλή read-only κατάλογο στο FITMATCH."};
   const data=await r.json() as FeedRecord[];
   if(!Array.isArray(data))return {offers:[],mode:"error"};
   const offers=data.map(p=>({
     id:nonempty(p.source_product_id),title:nonempty(p.product_name),category:"unmapped",price:n(p.price_eur),
     currency:"EUR",merchant:nonempty(p.program_name),trackingUrl:nonempty(p.tracking_url),
     inStock:p.in_stock===true,lastSeen:nonempty(p.last_seen_at),
     verifiedCommissionEur:null,commissionEvidence:false,specsVerified:false,
     imageUrl:nonempty(p.image_url) || null
   }));
   // CRITICAL: SocialMarket upstream "estimated_commission" uses upper commission bounds.
   // NEVER treat its expected_commission_eur as verified FitMatch payout.
   // Never infer a category from loose feed text without a curated taxonomy mapping.
   return {offers,mode:"unverified",reason:"Τα στοιχεία καταλόγου είναι ορατά, αλλά απαιτούν επαληθευμένη ταξινομία, specs και όρους προμήθειας."};
 }catch{return {offers:[],mode:"error",reason:"Η υπηρεσία καταλόγου δεν απάντησε εγκαίρως."}}
}
