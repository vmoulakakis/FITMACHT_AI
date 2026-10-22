import {NextResponse} from "next/server";
import {catalog} from "@/lib/catalog";
import {rankStudio,type BuyerStudioProfile} from "@/lib/studio-ranking";
export const dynamic="force-dynamic";
const valid={
 goal:["walking","cardio","strength","mixed"],
 space:["compact","medium","large"],
 noise:["critical","normal"],activity:["walk","run","both"],
 level:["beginner","intermediate","advanced"],
 preference:["value","compact","balanced"],
 pain:["space","budget","goal","noise","level","equipment"]
};
export async function POST(req:Request){
 let data:Record<string,unknown>;
 try{data=await req.json() as Record<string,unknown>;}catch{return NextResponse.json({error:"invalid_json"},{status:400});}
 if(!data||Array.isArray(data)||
 Object.entries(valid).some(([k,v])=>!v.includes(String(data[k])))||
 typeof data.budget!=="number"||!Number.isFinite(data.budget)||data.budget<0||data.budget>20000||
 typeof data.fold!=="boolean")
  return NextResponse.json({error:"invalid_profile"},{status:422,headers:{"Cache-Control":"no-store"}});
 const profile=data as BuyerStudioProfile;
 const inventory=await catalog();
 const lanes=rankStudio(profile,inventory.offers);
 const approved=lanes.reduce((n,l)=>n+l.verifiedCount,0);
 return NextResponse.json({
  lanes,verifiedOffers:approved,releaseReady:approved>0,
  catalogMode:inventory.mode,rankingVersion:"top-five-r1-gated",
  note:"Πάντα έως πέντε πραγματικά επαληθευμένα προϊόντα ανά διαδρομή. Τα μη εγκεκριμένα SKU είναι μόνο ευρήματα έρευνας χωρίς affiliate CTA. Όλες οι υπόλοιπες θέσεις είναι συμβουλές, όχι προϊόντα."
 },{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex"}});
}
