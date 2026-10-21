import {NextResponse} from "next/server";
import {catalog} from "@/lib/catalog";
import {eligible} from "@/lib/decision";
import snapshot from "@/data/source-readiness.json";
export const dynamic="force-dynamic";
export async function GET(){
 const c=await catalog();
 return NextResponse.json({app:"FITMATCH AI",environment:"staging",catalog:c.mode,offers:c.offers.length,monetizedOffers:c.offers.filter(o=>eligible(o,Number.MAX_SAFE_INTEGER).ok).length,releaseReady:c.mode==="reviewed"&&c.offers.some(o=>eligible(o,Number.MAX_SAFE_INTEGER).ok),sourceSnapshotAt:snapshot.checked_at,commissionPolicy:"verified >=10 EUR",time:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}});
}
