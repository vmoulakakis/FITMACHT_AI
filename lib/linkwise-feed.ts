/**
 * FitMatch CD104 Linkwise discovery import.
 * SOURCE DATA IS UNVERIFIED. This adapter does not authorize merchant clicks.
 * The feed's selected columns can omit program_id; never infer merchant identity.
 */
import type {Category} from "./decision";

export type LinkwiseCandidate = {
  source: "linkwise_cd104";
  sourceProductId: string;
  programId: string | null;
  productName: string;
  modelName: string | null;
  brandName: string | null;
  category: Category;
  categoryRaw: string;
  priceEur: number;
  fullPriceEur: number | null;
  currency: "EUR";
  imageUrl: string | null;
  trackingUrl: string | null;
  inStock: boolean;
  observedAt: string;
  validTo: string | null;
  verification: "pending_program_and_specs_review";
};

type SourceRow = Record<string,unknown>;
const str = (v:unknown):string => typeof v==="string" || typeof v==="number" ? String(v).trim() : "";
const numeric = (v:unknown):number|null => {
  const raw=str(v).replace(/\s/g,"");
  if(!raw)return null;
  const formatted=raw.includes(",") ? raw.replace(/\./g,"").replace(",",".") : raw;
  const n=Number(formatted);
  return Number.isFinite(n) && n>0 ? n : null;
};
const https = (v:unknown):string|null => {
  try{
    const u=new URL(str(v));
    if(u.protocol!=="https:"||u.username||u.password||u.port||!u.hostname.includes("."))return null;
    if(u.hostname==="localhost"||u.hostname.endsWith(".localhost")||u.hostname.endsWith(".local"))return null;
    if(/^\d+\.\d+\.\d+\.\d+$/.test(u.hostname))return null;
    return u.href;
  }catch{return null;}
};
const trueStock=(v:unknown):boolean => v===true||v===1||["true","yes","y","1","in stock","available","διαθέσιμο"].includes(str(v).toLowerCase());
const rejectedParts=/ανταλλακτικ|θήκη|κάλυμμα|λιπαντικ|accessor|replacement|spare part|charger|φορτισ|πατάκι|χαλάκι|mat\b|καλώδιο|τηλεχειριστ|συντήρησ|belt only/i;

/** Conservative candidate taxonomy: never equate text matching with verified specs. */
export function classifyFitness(row:SourceRow):Category|null {
  const product=str(row.product_name).toLocaleLowerCase("el-GR");
  const category=str(row.category).toLocaleLowerCase("el-GR");
  if(!product||rejectedParts.test(product))return null;
  const s=(product+" "+category).normalize("NFC");
  if(/walking[\s-]*pad|διάδρομ.{0,16}περπατ|διάδρομος βάδισης/i.test(s))return "walking-pad";
  if(/treadmill|διάδρομ.{0,16}(γυμναστικ|τρεξίμ|τρεξιμ)/i.test(s))return "treadmill";
  if(/exercise[\s-]*bike|spin[\s-]*bike|ποδήλατ.{0,18}(γυμναστικ|στατικ)|στατικ.{0,14}ποδήλατ/i.test(s))return "exercise-bike";
  if(/adjustable[\s-]*dumbbell|ρυθμιζόμεν.{0,14}αλτήρ|ρυθμιζομεν.{0,14}αλτηρ/i.test(s))return "adjustable-dumbbells";
  if(/resistance[\s-]*bands?|λάστιχ.{0,15}αντίστασ|λαστιχ.{0,15}αντιστασ|ιμάντ.{0,15}αντίστασ/i.test(s))return "resistance-bands";
  return null;
}

export function normalizeLinkwise(row:unknown,observedAt:string):LinkwiseCandidate|null {
  if(!row||typeof row!=="object"||Array.isArray(row))return null;
  const p=row as SourceRow;
  const sourceProductId=str(p.product_id),productName=str(p.product_name);
  const category=classifyFitness(p),priceEur=numeric(p.price);
  if(!sourceProductId||!productName||!category||priceEur===null||str(p.currency).toUpperCase()!=="EUR")return null;
  const validTo=str(p.valid_to);
  if(validTo && Number.isFinite(Date.parse(validTo)) && Date.parse(validTo)<Date.parse(observedAt))return null;
  // Product images, links and stock are data from a feed, not independent verification.
  return {
    source:"linkwise_cd104",sourceProductId,programId:str(p.program_id)||null,
    productName,modelName:str(p.model_name)||null,brandName:str(p.brand_name)||null,
    category,categoryRaw:str(p.category),priceEur,fullPriceEur:numeric(p.full_price),
    currency:"EUR",imageUrl:https(p.image_url)||https(p.thumb_url),
    trackingUrl:https(p.tracking_url),inStock:trueStock(p.in_stock),
    observedAt,validTo:validTo||null,verification:"pending_program_and_specs_review"
  };
}

/**
 * Incremental decoder for JSON feeds with arrays at root or nested as
 * { products: [...] }, { items: [...] }, { data: [...] }. No full-feed JSON.parse.
 * Only direct array-element objects are buffered. Unknown JSON envelopes are
 * accepted as source data, but their objects must still pass normalizeLinkwise.
 */
export async function* streamJsonObjects(
  stream:ReadableStream<Uint8Array>, maxObjectChars=250_000
):AsyncGenerator<unknown> {
  const decoder=new TextDecoder("utf-8",{fatal:true});
  const reader=stream.getReader();
  const stack:string[]=[];
  let inString=false,escape=false,captureDepth=-1,buffer="";
  let objectCount=0;
  const readText=(text:string)=>text;
  try{
    while(true){
      const {done,value}=await reader.read();
      if(done)break;
      const chunk=readText(decoder.decode(value,{stream:true}));
      for(const c of chunk){
        if(!inString && c==="{" && stack[stack.length-1]==="[" && captureDepth<0){
          captureDepth=stack.length;
          buffer="";
        }
        if(captureDepth>=0){
          buffer+=c;
          if(buffer.length>maxObjectChars)throw new Error("linkwise_object_too_large");
        }
        if(inString){
          if(escape)escape=false;
          else if(c==="\\")escape=true;
          else if(c==='"')inString=false;
          continue;
        }
        if(c==='"'){inString=true;continue;}
        if(c==="{"||c==="["){stack.push(c);continue;}
        if(c==="}"||c==="]"){
          const expected=c==="}"?"{":"[";
          if(stack.pop()!==expected)throw new Error("linkwise_invalid_json_structure");
          if(c==="}" && captureDepth>=0 && stack.length===captureDepth){
            objectCount++;
            let parsed:unknown;
            try{parsed=JSON.parse(buffer);}catch{throw new Error("linkwise_invalid_product_json");}
            captureDepth=-1;buffer="";
            yield parsed;
          }
        }
      }
    }
    decoder.decode(); // flush decoder, reject invalid tail
    if(stack.length||inString||captureDepth>=0)throw new Error("linkwise_truncated_json");
    if(objectCount===0)throw new Error("linkwise_no_array_products");
  }finally{
    try{await reader.cancel();}catch{}
    reader.releaseLock();
  }
}

/** Never allow the source URL to target arbitrary hosts (SSRF). */
export function validateFeedUrl(raw:string):URL {
  const u=new URL(raw);
  if(u.protocol!=="https:"||u.hostname!=="affiliate.linkwi.se"||u.username||u.password||u.port||
    !u.pathname.startsWith("/feeds/1.2/CD104/")||!u.pathname.endsWith("/feed.json"))
    throw new Error("unsupported_linkwise_feed_url");
  return u;
}
