import {NextResponse} from "next/server";
import {catalog} from "@/lib/catalog";
import {eligible} from "@/lib/decision";
import {approvedTrackingHosts,validatedTrackingUrl} from "@/lib/tracking";
export const dynamic="force-dynamic";
export async function GET(req:Request){
 const id=new URL(req.url).searchParams.get("id");
 if(!id||id.length>100||!/^[a-zA-Z0-9._-]+$/.test(id))return NextResponse.json({error:"invalid_offer"},{status:400});
 const c=await catalog();
 const o=c.offers.find(x=>x.id===id);
 if(!o||!eligible(o,Number.MAX_SAFE_INTEGER).ok)return NextResponse.json({error:"offer_not_verified"},{status:404});
 const hosts=approvedTrackingHosts(process.env.FITMATCH_LINKWISE_HOSTS);
 const url=validatedTrackingUrl(o.trackingUrl,hosts);
 if(!url)return NextResponse.json({error:"unapproved_tracking_host"},{status:403});
 // No raw tracking URL from user input; server resolves offer id against audited catalog.
 return NextResponse.redirect(url.toString(),{status:302,headers:{"Cache-Control":"no-store","Referrer-Policy":"no-referrer"}});
}
