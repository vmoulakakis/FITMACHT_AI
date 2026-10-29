import {NextResponse} from "next/server";
import {catalog} from "@/lib/catalog";
import {publicLinkwisePreviews} from "@/lib/linkwise-public";
export const dynamic="force-dynamic";
export async function GET(){
 const c=await catalog();
 const previews=await Promise.all([
   publicLinkwisePreviews("walking-pad",100000),
   publicLinkwisePreviews("treadmill",100000),
   publicLinkwisePreviews("exercise-bike",100000),
   publicLinkwisePreviews("adjustable-dumbbells",100000),
   publicLinkwisePreviews("resistance-bands",100000)
 ]);
 return NextResponse.json({
  app:"FITMATCH AI",environment:process.env.VERCEL_ENV==="production"?"production":"staging",
  catalog:c.mode,verifiedOffers:c.offers.filter(x=>x.specsVerified&&x.commissionEvidence).length,
  publicPreviewCategories:previews.filter(v=>v.length>0).length,
  publicPreviewSampleCount:previews.reduce((n,v)=>n+v.length,0),
  previewDisclaimer:"Product discovery only. Prices and stock are not verified offers.",
  time:new Date().toISOString()
 },{headers:{"Cache-Control":"no-store"}});
}
