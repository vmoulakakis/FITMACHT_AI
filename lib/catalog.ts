import {MIN_VERIFIED_COMMISSION_EUR,type Offer} from "./decision";

type VerifiedRow = Record<string, unknown>;
const str=(value:unknown)=>typeof value==="string"?value.trim():"";
const amount=(value:unknown)=>typeof value==="number"?value:Number(value);
const categories=new Set(["walking-pad","treadmill","exercise-bike","adjustable-dumbbells","resistance-bands"]);

function validEvidenceUrl(value:unknown):boolean {
  try {
    const url=new URL(str(value));
    return url.protocol==="https:" && !url.username && !url.password;
  }catch{return false}
}

function recentTerms(value:unknown,now:number):boolean {
  const timestamp=Date.parse(str(value));
  return Number.isFinite(timestamp) && timestamp<=now && timestamp>now-30*86400000;
}

/**
 * Convert only evidence-backed, owner-approved records from the RLS-protected
 * fitmatch_verified_offers table. Unverified feed offers never enter checkout.
 */
export function mapVerifiedOffer(row:VerifiedRow,now=Date.now()):Offer|null {
  const category=str(row.normalized_category);
  const price=amount(row.price_eur);
  const commission=amount(row.verified_commission_eur);
  const id=str(row.id);
  if(row.approved!==true || row.in_stock!==true || row.specs_verified!==true ||
     !categories.has(category) || !/^[a-fA-F0-9-]{36}$/.test(id) ||
     !str(row.title) || !str(row.merchant_name) || !str(row.tracking_url) ||
     row.currency!=="EUR" || !Number.isFinite(price) || price<=0 ||
     !Number.isFinite(commission) || commission<MIN_VERIFIED_COMMISSION_EUR ||
     !validEvidenceUrl(row.terms_source_url) || !validEvidenceUrl(row.spec_evidence_url) ||
     !recentTerms(row.terms_verified_at,now)) return null;
  const seen=Date.parse(str(row.last_seen_at));
  if(!Number.isFinite(seen) || seen>now || seen<=now-7*86400000)return null;
  return {
    id,title:str(row.title),category,price,currency:"EUR",
    merchant:str(row.merchant_name),trackingUrl:str(row.tracking_url),
    inStock:true,lastSeen:str(row.last_seen_at),
    verifiedCommissionEur:commission,commissionEvidence:true,specsVerified:true,
    imageUrl:str(row.image_url)||null,urlEvidence:str(row.terms_source_url)
  };
}

export async function catalog():Promise<{offers:Offer[];mode:string;reason?:string}> {
  const base=process.env.SOCIALMARKET_SUPABASE_URL;
  const key=process.env.SOCIALMARKET_SUPABASE_PUBLISHABLE_KEY;
  if(!base||!key)return {offers:[],mode:"not_connected",reason:"Η ασφαλής σύνδεση SocialMarket δεν έχει διαμορφωθεί."};
  if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base))return {offers:[],mode:"error",reason:"Μη έγκυρη διεύθυνση δεδομένων."};
  try {
    // Public role has SELECT only through RLS approved/fresh/verified policy.
    // Never use the service-role key or query commerce_feed_eligible_offers.
    const select="id,title,merchant_name,normalized_category,price_eur,currency,tracking_url,image_url,in_stock,last_seen_at,verified_commission_eur,terms_source_url,terms_verified_at,spec_evidence_url,specs_verified,approved";
    const url=base+"/rest/v1/fitmatch_verified_offers?select="+select+"&approved=eq.true&limit=200";
    const response=await fetch(url,{headers:{"apikey":key,"Authorization":"Bearer "+key},cache:"no-store",signal:AbortSignal.timeout(4500)});
    if(!response.ok)return {offers:[],mode:"restricted",reason:"Η ασφαλής ανάγνωση εγκεκριμένων προσφορών δεν είναι διαθέσιμη."};
    const rows:unknown=await response.json();
    if(!Array.isArray(rows))return {offers:[],mode:"error",reason:"Μη έγκυρη απάντηση του καταλόγου."};
    const now=Date.now();
    const offers=rows.map(r=>r&&typeof r==="object"?mapVerifiedOffer(r as VerifiedRow,now):null).filter((r):r is Offer=>r!==null);
    return {offers,mode:offers.length?"verified":"verified_empty",reason:offers.length?undefined:"Δεν υπάρχουν ακόμη επαληθευμένες και εγκεκριμένες προσφορές."};
  }catch{return {offers:[],mode:"error",reason:"Η υπηρεσία καταλόγου δεν απάντησε εγκαίρως."}}
}
