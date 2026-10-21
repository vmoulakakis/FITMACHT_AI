import {NextResponse} from "next/server";
import {catalog} from "@/lib/catalog";
export const dynamic="force-dynamic";
export async function GET(){
 const c=await catalog();
 return NextResponse.json({app:"FITMATCH AI",environment:"staging",catalog:c.mode,offers:c.offers.length,monetizedOffers:0,commissionPolicy:"verified >=10 EUR",time:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}});
}
