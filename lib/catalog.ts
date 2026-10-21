/** FITMATCH reads ONLY its future audited published-offer export, not raw SocialMarket estimated offers. */
import {createHash} from "node:crypto";
import type {Offer} from "./decision";
type Row=Record<string,unknown>;
const str=(v:unknown)=>typeof v==="string"?v.trim():"";
const num=(v:unknown)=>typeof v==="number"&&Number.isFinite(v)?v:null;
const https=(v:unknown)=>typeof v==="string"&&v.startsWith("https://");
export async function catalog():Promise<{offers:Offer[];mode:string;reason?:string}>{
 const base=process.env.SOCIALMARKET_SUPABASE_URL;
 const key=process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY;
 if(!base||!key)return {offers:[],mode:"not_connected",reason:"Η ασφαλής read-only σύνδεση δεν έχει διαμορφωθεί."};
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base))return {offers:[],mode:"error",reason:"Μη έγκυρη διεύθυνση δεδομένων."};
 try{
  const fields="program_id,source_product_id,merchant_name,title,normalized_category,price_eur,currency,tracking_url,image_url,in_stock,last_seen_at,verified_commission_eur,terms_source_url,terms_verified_at,specs_verified,spec_evidence_url";
  const url=base+"/rest/v1/fitmatch_verified_offers?select="+fields+"&approved=eq.true&limit=100";
  const response=await fetch(url,{headers:{apikey:key,Authorization:"Bearer "+key},cache:"no-store",signal:AbortSignal.timeout(4500)});
  if(!response.ok)return {offers:[],mode:"restricted",reason:"Ο ανεξάρτητος επαληθευμένος κατάλογος FITMATCH δεν έχει ενεργοποιηθεί. Δεν εμφανίζουμε ανεξέλεγκτα SocialMarket offers."};
  const records=await response.json() as Row[];
  if(!Array.isArray(records))return {offers:[],mode:"error"};
  const offers:Offer[]=records.map(p=>{
   const termsTime=Date.parse(str(p.terms_verified_at));
   const termsFresh=Number.isFinite(termsTime)&&termsTime<=Date.now()&&(Date.now()-termsTime)/86400000<=30;
   const program=str(p.program_id),sourceId=str(p.source_product_id);
   const id=createHash("sha256").update(program+"\0"+sourceId).digest("hex").slice(0,32);
   return {
    id,title:str(p.title),category:str(p.normalized_category),price:num(p.price_eur)??NaN,
    currency:str(p.currency),merchant:str(p.merchant_name),trackingUrl:str(p.tracking_url),
    inStock:p.in_stock===true,lastSeen:str(p.last_seen_at),
    verifiedCommissionEur:num(p.verified_commission_eur),
    commissionEvidence:https(p.terms_source_url)&&termsFresh,
    specsVerified:p.specs_verified===true&&https(p.spec_evidence_url),
    imageUrl:str(p.image_url)||null,urlEvidence:str(p.spec_evidence_url)||null
   };
  });
  return {offers,mode:"reviewed",reason:"Μόνο πρόσφατες, επιβεβαιωμένες προσφορές FITMATCH μπορούν να προβληθούν."};
 }catch{return {offers:[],mode:"error",reason:"Η προστατευμένη υπηρεσία καταλόγου δεν απάντησε."};}
}
