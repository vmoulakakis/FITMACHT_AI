import {NextResponse} from "next/server";
import {catalog} from "@/lib/catalog";
import {publicLinkwisePreviews} from "@/lib/linkwise-public";
export const dynamic="force-dynamic";
export async function GET(){
 const c=await catalog();
 const categories=["walking-pad","treadmill","exercise-bike","adjustable-dumbbells","resistance-bands","fixed-dumbbells","weight-bench","elliptical","rowing-machine","home-gym","kettlebells","pull-up-bars","stepper","exercise-mat","pilates-equipment"] as const;
 const previews=await Promise.all(categories.map(cat=>publicLinkwisePreviews(cat,100000,fetch,100)));
 return NextResponse.json({
  app:"FITMATCH AI",environment:process.env.VERCEL_ENV==="production"?"production":"staging",
  catalog:c.mode,verifiedOffers:c.offers.filter(x=>x.specsVerified&&x.commissionEvidence).length,
  publicPreviewCategories:previews.filter(v=>v.length>0).length,
  publicPreviewSampleCount:previews.reduce((n,v)=>n+Math.min(v.length,3),0),
  publicSourceProductCount:previews.reduce((n,v)=>n+v.length,0),
  publicSourceDisclaimer:"Historically observed products are not verified live offers or commissions.",
  previewDisclaimer:"Product discovery only. Prices and stock are not verified offers.",
  time:new Date().toISOString()
 },{headers:{"Cache-Control":"no-store"}});
}
