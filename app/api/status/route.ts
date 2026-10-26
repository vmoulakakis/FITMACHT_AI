import {NextResponse} from "next/server";
import {catalog} from "@/lib/catalog";
import {eligible,MIN_VERIFIED_COMMISSION_EUR} from "@/lib/decision";
import {approvedTrackingHosts,validatedTrackingUrl} from "@/lib/tracking";
import {publicLaunchEnabled} from "@/lib/release";
export const dynamic="force-dynamic";
export async function GET(){
 const c=await catalog();
 const hosts=approvedTrackingHosts(process.env.FITMATCH_LINKWISE_HOSTS);
 const monetizedOffers=c.offers.filter(o=>eligible(o,Number.MAX_SAFE_INTEGER).ok&&validatedTrackingUrl(o.trackingUrl,hosts)!==null).length;
 return NextResponse.json({app:"FITMATCH AI",releasePhase:publicLaunchEnabled()?"public":"staging",catalog:c.mode,offers:c.offers.length,monetizedOffers,commissionPolicy:`verified >=${MIN_VERIFIED_COMMISSION_EUR} EUR`,time:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}});
}
