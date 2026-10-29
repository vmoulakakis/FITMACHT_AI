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
const rejectedParts=/(?:ανταλλακτικ|spare[\s-]*part|replacement[\s-]*part|θήκη|καλυμμ|λιπαντικ|lubricant|charger|φορτιστ|καλωδι|τηλεχειριστ|συντηρησ|belt only|κoλαρ|κολαρ|μανταλακι|αξεσουαρ ανταλλακτικ)/i;
const fold=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("el-GR").replace(/&gt;|&amp;|&lt;/g," ");
/**
 * Classify actual home-fitness equipment; never use price as an inclusion filter.
 * A precise category is useful for brand/model-only titles, but generic "Sports"
 * categories cannot override unrelated title evidence.
 */
function inferCategory(title:string,merchantCategory:string):Category|null{
  const t=fold(title),cat=fold(merchantCategory);
  const exact:(readonly [RegExp,Category])[]=[
    [/walking[\s-]*pad|διαδρομ.{0,20}περπατ|διαδρομος βαδισης/,"walking-pad"],
    [/treadmill|διαδρομ.{0,20}(γυμναστ|τρεξιμ|running)/,"treadmill"],
    [/elliptical|ελλειπτικ/,"elliptical"],
    [/rowing[\s-]*(machine|trainer)|κωπηλατικ/,"rowing-machine"],
    [/exercise[\s-]*bike|spinning[\s-]*bike|spin[\s-]*bike|magnetic[\s-]*bike|ποδηλατ.{0,20}(γυμναστ|στατικ)|στατικ.{0,14}ποδηλατ/,"exercise-bike"],
    [/adjustable[\s-]*dumbbell|ρυθμιζομεν.{0,16}αλτηρ/,"adjustable-dumbbells"],
    [/kettlebell|δραμι/,"kettlebells"],
    [/resistance[\s-]*bands?|λαστιχ.{0,18}(αντιστασ|γυμναστ)|ιμαντ.{0,18}αντιστασ|exercise[\s-]*bands?/,"resistance-bands"],
    [/πολυοργαν.{0,15}γυμναστ|multi[\s-]*gym|home[\s-]*gym|power[\s-]*rack|smith[\s-]*machine/,"home-gym"],
    [/παγκ.{0,20}(γυμναστ|βαρ)|weight[\s-]*bench|workout[\s-]*bench/,"weight-bench"],
    [/μονοζυγ|διζυγ|pull[\s-]*up[\s-]*bar|chin[\s-]*up[\s-]*bar|dip[\s-]*station/,"pull-up-bars"],
    [/stepper|step[\s-]*machine|στεπερ/,"stepper"],
    [/pilates[\s-]*reformer|reformer[\s-]*pilates|δακτυλιδι[\s-]*pilates|pilates[\s-]*ring|μπαλα[\s-]*pilates|pilates[\s-]*ball/,"pilates-equipment"],
    [/yoga[\s-]*mat|exercise[\s-]*mat|fitness[\s-]*mat|στρωματ.{0,16}(γυμναστ|yoga|γιoγκα)|χαλακ.{0,16}(γυμναστ|yoga|γιoγκα)/,"exercise-mat"],
    [/dumbbell|βαρακ|αλτηρ|αριστηρες? γυμναστ/,"fixed-dumbbells"]
  ];
  for(const [regex,category] of exact)if(regex.test(t))return category;
  // Taxonomy fallback only when merchant category names a specific machine.
  // Generic fitness/sport/gym categories never qualify by themselves.
  const precise:(readonly [RegExp,Category])[]=[
    [/ελλειπτικ|elliptical/,"elliptical"],
    [/κωπηλατικ|rowing machines?/,"rowing-machine"],
    [/διαδρομ.{0,18}περπατ|walking pads?/,"walking-pad"],
    [/διαδρομοι γυμναστ|treadmills?/,"treadmill"],
    [/ποδηλατ.{0,18}γυμναστ|exercise bikes?/,"exercise-bike"],
    [/πολυοργανα γυμναστ|home gyms?/,"home-gym"],
    [/παγκοι γυμναστ|weight benches/,"weight-bench"],
    [/αλτηρ|βαρακ|dumbbells?/,"fixed-dumbbells"],
    [/λαστιχ.{0,18}(αντιστασ|γυμναστ)|resistance bands?/,"resistance-bands"]
  ];
  for(const [regex,category] of precise){
    if(regex.test(cat)&&!/(?:σετ ανταλλακτικ|spare|replacement|shirt|tshirt|μπλουζ|παντελον|φανελ|αξεσουαρ)/.test(t))return category;
  }
  return null;
}
export function classifyFitness(row:SourceRow):Category|null {
 const name=str(row.product_name)||str(row.model_name);
 if(!name||rejectedParts.test(fold(name)))return null;
 // Cross-category hygiene: a merchant's fitness bucket can contain misfiled items.
 if(/(?:σεντον|κουρτιν|κλινοσκεπ|κοσμημ|βραχιολ|μπλουζ|παντελον|t[\\s-]*shirt|jacket|bed[\\s-]*sheet|linen[\\s-]*sheet)/.test(fold(name)))return null;
 return inferCategory(name,str(row.category));
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
    !u.pathname.startsWith("/feeds/1.2/CD104/")||!(/\/feed\.(?:json|csv)$/.test(u.pathname)))
    throw new Error("unsupported_linkwise_feed_url");
  return u;
}
