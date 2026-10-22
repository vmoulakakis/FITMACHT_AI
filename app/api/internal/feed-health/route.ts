import {NextResponse} from "next/server";
import {JsonArrayObjectScanner,gymProduct} from "@/lib/feed-stream";
export const dynamic="force-dynamic";
export const runtime="nodejs";
/** Preview-only source introspection. Never returns private feed URLs, tracking links or raw rows. */
export async function GET(request:Request){
 if(process.env.VERCEL_ENV!=="preview"||process.env.FITMATCH_LINKWISE_PROBE!=="1")
  return NextResponse.json({error:"not_found"},{status:404});
 const source=process.env.FITMATCH_LINKWISE_FEED_URL;
 if(!source)return NextResponse.json({accessible:false,reason:"source_not_configured"},{status:503});
 let url:URL;
 try{url=new URL(source)}catch{return NextResponse.json({accessible:false,reason:"invalid_source"},{status:503})}
 if(url.protocol!=="https:"||url.hostname!=="affiliate.linkwi.se"||url.username||url.password)
  return NextResponse.json({accessible:false,reason:"source_not_allowlisted"},{status:503});
 const category=new URL(request.url).searchParams.get("category");
 const ids=new Set(["3","67","27","29","33","81","73","87","103","105","111","117","119"]);
 if(category!==null){
  if(!ids.has(category))return NextResponse.json({error:"unsupported_category"},{status:400});
  url.pathname=url.pathname.replace(/\/catinc-[0-9,]+\//,"/catinc-"+category+"/");
 }
 const headers={"Cache-Control":"no-store","X-Robots-Tag":"noindex"};
 try{
  const response=await fetch(url.toString(),{method:"GET",headers:{Accept:"application/json,text/csv,*/*"},cache:"no-store",redirect:"manual",signal:AbortSignal.timeout(9500)});
  const upstream={status:response.status,contentType:(response.headers.get("content-type")||"unknown").split(";")[0]};
  if(!response.ok)return NextResponse.json({accessible:false,...upstream},{headers});
  if(!response.body)return NextResponse.json({accessible:false,...upstream,reason:"empty_response"},{headers});
  const counts={scanned:0,withProgramName:0,stockConfirmed:0,fitnessKeywords:0,fitnessWithProgramName:0,fitnessStockConfirmed:0,fitnessWithPrice:0};
  const categories=new Map<string,number>(),allCategories=new Map<string,number>(),stockValues=new Map<string,number>(),scanner=new JsonArrayObjectScanner();
  let firstFieldNames:string[]=[];
  let format="unknown",prefix="",totalBytes=0;
  const inspect=(row:Record<string,unknown>)=>{
   counts.scanned++;
   if(counts.scanned===1)firstFieldNames=Object.keys(row).filter(k=>/^[a-z_]+$/i.test(k)).slice(0,40);
   const title=String(row.product_name??row.model_name??"").slice(0,300);
   const cat=String(row.category??"").slice(0,130);
   const merchant=String(row.program_name??row.program??"").trim();
   const stockRaw=String(row.in_stock??row.availability??"missing").toLowerCase();
   stockValues.set(stockRaw,(stockValues.get(stockRaw)||0)+1);
   allCategories.set(cat,(allCategories.get(cat)||0)+1);
   const inStock=row.in_stock===true||row.in_stock===1||["true","1","yes","y","available"].includes(stockRaw);
   const price=Number(row.price),gym=gymProduct(title,cat);
   if(merchant)counts.withProgramName++;if(inStock)counts.stockConfirmed++;
   if(gym){
    counts.fitnessKeywords++;
    if(merchant)counts.fitnessWithProgramName++;
    if(inStock)counts.fitnessStockConfirmed++;
    if(Number.isFinite(price)&&price>0)counts.fitnessWithPrice++;
    categories.set(cat,(categories.get(cat)||0)+1);
   }
  };
  const reader=response.body.getReader(),decoder=new TextDecoder();
  try{
   while(totalBytes<(category?1300000:6000000)&&counts.scanned<(category?550:2000)){
    const chunk=await reader.read();if(chunk.done)break;
    totalBytes+=chunk.value.byteLength;
    const text=decoder.decode(chunk.value,{stream:true});
    if(prefix.length<500)prefix+=(text.slice(0,500-prefix.length));
    if(format==="unknown"&&prefix.trimStart()){const ch=prefix.trimStart()[0];format=ch==="["||ch==="{"?"json":"csv";}
    if(format==="json")scanner.parseChunk(text,inspect);
    if(format==="csv"&&prefix.includes("\n"))break;
   }
  }finally{await reader.cancel().catch(()=>{});}
  if(format==="json"){
   return NextResponse.json({accessible:true,format,...upstream,observedAt:new Date().toISOString(),
    boundedSample:true,categoryFilter:category??"configured-combined",totalBytes,counts,firstFieldNames,programNameFieldObserved:counts.withProgramName>0,
    stockValues:[...stockValues.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6),
    topCategoryNames:[...allCategories.entries()].sort((a,b)=>b[1]-a[1]).slice(0,12).map(([category,n])=>({category,n})),
    gymCategories:[...categories].sort((a,b)=>b[1]-a[1]).slice(0,7).map(([category,n])=>({category,n})),
    note:"Bounded sample of source feed, NOT full inventory and NOT verified affiliate offers."},{headers});
  }
  const columns=prefix.split(/\r?\n/,1)[0].replace(/^\uFEFF/,"").split(",").map(x=>x.replace(/^"|"$/g,"").trim());
  return NextResponse.json({accessible:true,format:"csv",...upstream,observedAt:new Date().toISOString(),sampledBytes:totalBytes,
    numberOfFields:columns.length,
    recognizedFields:["product_id","program_name","program_id","price","in_stock","tracking_url"].filter(x=>columns.includes(x)),
    note:"CSV header only, no inventory imported."},{headers});
 }catch{return NextResponse.json({accessible:false,reason:"upstream_timeout_or_error"},{headers});}
}
