import {NextResponse} from "next/server";
import {JsonArrayObjectScanner,gymProduct} from "@/lib/feed-stream";
export const dynamic="force-dynamic";
export const runtime="nodejs";
/** Preview-only bounded, read-only feed schema connectivity check.
 * Never outputs credentials, product rows, raw URLs, tracking links or merchant terms.
 */
export async function GET(){
 if(process.env.VERCEL_ENV!=="preview"||process.env.FITMATCH_LINKWISE_PROBE!=="1")
  return NextResponse.json({error:"not_found"},{status:404});
 const raw=process.env.FITMATCH_LINKWISE_FEED_URL;
 if(!raw)return NextResponse.json({accessible:false,reason:"source_not_configured"},{status:503});
 let url:URL;
 try{url=new URL(raw);}catch{return NextResponse.json({accessible:false,reason:"invalid_source"},{status:503});}
 if(url.protocol!=="https:"||url.hostname!=="affiliate.linkwi.se"||url.username||url.password)
  return NextResponse.json({accessible:false,reason:"source_not_allowlisted"},{status:503});
 try{
  const response=await fetch(url.toString(),{method:"GET",headers:{Range:"bytes=0-16383",Accept:"text/csv,text/plain,*/*"},cache:"no-store",redirect:"manual",signal:AbortSignal.timeout(6500)});
  const summary={status:response.status,contentType:response.headers.get("content-type")?.split(";")[0]||"unknown",redirect:response.status>=300&&response.status<400,rangeSupported:response.status===206};
  if(!response.ok)return NextResponse.json({accessible:false,...summary},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex"}});
  if(!response.body)return NextResponse.json({accessible:false,...summary,reason:"empty_body"});
  let sample="",bytes=0;const reader=response.body.getReader(),decoder=new TextDecoder();
  try{
   while(bytes<16384){
    const next=await reader.read();if(next.done)break;
    const slice=next.value.subarray(0,Math.min(next.value.length,16384-bytes));bytes+=slice.length;
    sample+=decoder.decode(slice,{stream:true});
    if(sample.includes("\n"))break;
   }
  }finally{await reader.cancel().catch(()=>{});}
  if(summary.contentType.includes("json")||sample.trimStart().startsWith("{")||sample.trimStart().startsWith("[")){
   const prefix=sample.trimStart(),jsonShape=prefix.startsWith("[")?"array":prefix.startsWith("{")?"object":"unknown";
   const keys=Array.from(prefix.slice(0,500).matchAll(/"([a-zA-Z_][a-zA-Z_0-9]{1,45})"\s*:/g)).slice(0,12).map(x=>x[1]);
   return NextResponse.json({accessible:true,...summary,format:"json",jsonShape,sampledBytes:bytes,firstKeys:keys,
    note:"Schema-only JSON probe. No rows, tracking URLs, or merchant terms returned; not imported."},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex"}});
  }
  // Aggregate a bounded prefix of the owner-provided JSON feed; never return raw rows/URLs.
  if(summary.contentType.includes("json")||sample.trimStart().startsWith("[")){
   const counts={scanned:0,withProgramName:0,stockConfirmed:0,fitnessKeywords:0,
    fitnessWithProgramName:0,fitnessStockConfirmed:0,fitnessWithPrice:0};
   const categories=new Map<string,number>(),scanner=new JsonArrayObjectScanner();
   const inspect=(row:Record<string,unknown>)=>{
    counts.scanned++;
    const title=String(row.product_name??row.model_name??"").slice(0,300),category=String(row.category??"").slice(0,130);
    const program=String(row.program_name??"").trim();
    const stocked=row.in_stock===true||row.in_stock===1||String(row.in_stock).toLowerCase()==="true";
    const price=Number(row.price);
    const isGym=gymProduct(title,category);
    if(program)counts.withProgramName++;
    if(stocked)counts.stockConfirmed++;
    if(isGym){counts.fitnessKeywords++;if(program)counts.fitnessWithProgramName++;if(stocked)counts.fitnessStockConfirmed++;if(price>0&&Number.isFinite(price))counts.fitnessWithPrice++;
     categories.set(category,(categories.get(category)||0)+1);
    }
   };
   scanner.parseChunk(sample,inspect);
   let totalBytes=bytes;
   while(counts.scanned<2800&&totalBytes<7000000){
    const next=await reader.read();if(next.done)break;
    totalBytes+=next.value.byteLength;
    scanner.parseChunk(decoder.decode(next.value,{stream:true}),inspect);
   }
   await reader.cancel().catch(()=>{});
   return NextResponse.json({accessible:true,...summary,format:"json",observedAt:new Date().toISOString(),
    boundedSample:true,bytesRead:totalBytes,counts,
    gymCategoryNames:[...categories.entries()].sort((a,b)=>b[1]-a[1]).slice(0,7).map(([category,n])=>({category,n})),
    note:"Source counts are an observed JSON prefix, not a full import; zero affiliate approvals were inferred."},
    {headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex"}});
  }

  const header=sample.split(/\r?\n/,1)[0].replace(/^\uFEFF/,"");
  const columns=header.split(",").map(x=>x.replace(/^"|"$/g,"").trim());
  const recognized=["product_id","product_name","price","tracking_url","in_stock","category","program_id","program_name"].filter(x=>columns.includes(x));
  return NextResponse.json({accessible:true,...summary,format:"csv",sampledBytes:bytes,numberOfFields:columns.length,recognizedFieldNames:recognized,
   hasProductIdentity:columns.includes("product_id"),hasProgramIdentity:columns.includes("program_id"),hasMerchantName:columns.includes("program_name"),
   note:"Read-only schema sample, no feed import or commercial approval performed."},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex"}});
 }catch{return NextResponse.json({accessible:false,reason:"upstream_error_or_timeout"},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex"}});}
}
