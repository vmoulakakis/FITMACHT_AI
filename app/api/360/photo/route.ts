import {NextResponse} from "next/server";
import {catalog} from "@/lib/catalog";
import {eligible} from "@/lib/decision";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(req:Request){
 const id=new URL(req.url).searchParams.get("id")||"";
 if(!/^[a-zA-Z0-9_.:-]{1,120}$/.test(id))return new Response(null,{status:400});
 const hosts=(process.env.FITMATCH_IMAGE_HOSTS||"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);
 if(!hosts.length)return new Response(null,{status:404});
 const data=await catalog();
 const item=data.offers.find(o=>o.id===id&&eligible(o,100000,7).ok);
 if(!item?.imageUrl)return new Response(null,{status:404});
 let url:URL;
 try{url=new URL(item.imageUrl);if(url.protocol!=="https:"||!hosts.includes(url.hostname.toLowerCase())||url.username||url.password||url.port)throw Error("host");}catch{return new Response(null,{status:403})}
 try{
  const r=await fetch(url.toString(),{redirect:"error",signal:AbortSignal.timeout(5000),cache:"no-store",headers:{"Accept":"image/jpeg,image/png,image/webp"}});
  if(!r.ok)return new Response(null,{status:404});
  const typ=(r.headers.get("content-type")||"").split(";")[0].trim().toLowerCase();
  if(!["image/png","image/jpeg","image/webp"].includes(typ))return new Response(null,{status:415});
  if(Number(r.headers.get("content-length")||0)>3_000_000)return new Response(null,{status:413});
  const bytes=await r.arrayBuffer();if(bytes.byteLength>3_000_000)return new Response(null,{status:413});
  return new NextResponse(bytes,{headers:{"Content-Type":typ,"Cache-Control":"private, max-age=3600","X-Content-Type-Options":"nosniff"}});
 }catch{return new Response(null,{status:502})}
}
