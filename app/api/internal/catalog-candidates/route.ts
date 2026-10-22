import {NextResponse} from "next/server";
import {JsonArrayObjectScanner,gymProduct} from "@/lib/feed-stream";
import {parseFeedEur,normalizeAvailability} from "@/lib/feed-normalize";
export const dynamic="force-dynamic";
export const runtime="nodejs";
export const maxDuration=25;
const categoryIds=new Set(["3","27","67","29","33","81","73","87","103","105","111","117","119"]);
/** Staging diagnostics: returns at most 40 genuine feed candidates, NOT purchasable offers.
 * Protected by preview-only deployment and disabled outside the staging project.
 * The merchant terms, real stock and tech specs remain UNVERIFIED until separate review.
 */
export async function GET(req:Request){
 const diagnosticToken=process.env.FITMATCH_DIAGNOSTIC_TOKEN;
 if(!diagnosticToken||diagnosticToken.length<24||req.headers.get("x-fitmatch-diagnostic-key")!==diagnosticToken)
  return NextResponse.json({error:"not_found"},{status:404});
 if(process.env.VERCEL_ENV!=="preview"||process.env.FITMATCH_LINKWISE_PROBE!=="1")
  return NextResponse.json({error:"not_found"},{status:404});
 const id=new URL(req.url).searchParams.get("category")||"119";
 if(!categoryIds.has(id))return NextResponse.json({error:"unsupported_category"},{status:400});
 let uri:URL;
 try{uri=new URL(process.env.FITMATCH_LINKWISE_FEED_URL||"");}catch{return NextResponse.json({error:"source_missing"},{status:503});}
 if(uri.protocol!=="https:"||uri.hostname!=="affiliate.linkwi.se")return NextResponse.json({error:"invalid_feed_source"},{status:503});
 uri.pathname=uri.pathname.replace(/\/catinc-[0-9,]+\//,"/catinc-"+id+"/");
 const headers={"Cache-Control":"no-store","X-Robots-Tag":"noindex"};
 try{
  const response=await fetch(uri.toString(),{cache:"no-store",redirect:"manual",signal:AbortSignal.timeout(21000)});
  if(!response.ok||!response.body)return NextResponse.json({status:response.status,error:"feed_unavailable"},{status:502,headers});
  const scanner=new JsonArrayObjectScanner(),decoder=new TextDecoder(),reader=response.body.getReader();
  const items:{source_product_id:string;program_name:string;product_title:string;category_raw:string;price_eur:number;availability_raw:string;image_url:string;tracking_url:string}[]=[];
  let scanned=0,totalBytes=0,fitnessClassified=0,missingPrice=0,missingMerchant=0,missingProductId=0;
  let programKeys:string[]=[];
  const samplePriceStrings:string[]=[];
  try{
   while(scanned<12000&&totalBytes<16000000&&items.length<40){
    const next=await reader.read();if(next.done)break;totalBytes+=next.value.byteLength;
    scanner.parseChunk(decoder.decode(next.value,{stream:true}),row=>{
     scanned++;
     if(items.length>=40)return;
     const title=String(row.product_name??"").trim().slice(0,250),category=String(row.category??"").slice(0,300);
     const programObj=row.program&&typeof row.program==="object"&&!Array.isArray(row.program)?row.program as Record<string,unknown>:null;
     if(programObj&&programKeys.length===0)programKeys=Object.keys(programObj).slice(0,20);
     const merchant=String(row.program_name??programObj?.name??programObj?.program_name??(typeof row.program==="string"?row.program:"")).trim().slice(0,130);
     const id=String(row.product_id??"").trim().slice(0,130),price=parseFeedEur(row.price);
     if(!gymProduct(title,category))return;
     fitnessClassified++;
     if(price===null){missingPrice++;if(samplePriceStrings.length<4)samplePriceStrings.push(String(row.price).slice(0,40));}
     if(!merchant)missingMerchant++;
     if(!id)missingProductId++;
     if(!id||!title||!merchant||price===null)return;
     const link=String(row.tracking_url??"").slice(0,2048),image=String(row.image_url??"").slice(0,2048);
     items.push({source_product_id:id,program_name:merchant,product_title:title,category_raw:category,price_eur:price,
      availability_raw:normalizeAvailability(row.in_stock??row.availability),
      image_url:image.startsWith("https://")?image:"",tracking_url:link.startsWith("https://")?link:""});
    });
   }
  }finally{await reader.cancel().catch(()=>{});}
  return NextResponse.json({scan:"bounded",categoryFilter:id,scanned,totalBytes,candidateCount:items.length,
   status:"UNVERIFIED",fitnessClassified,missingPrice,missingMerchant,missingProductId,programKeys,samplePriceStrings,candidates:items,note:"Merchant terms and specs are NOT approved. Do not display as product recommendations or send users to tracking URLs."},{headers});
 }catch{return NextResponse.json({error:"upstream_timeout_or_error"},{status:502,headers});}
}
