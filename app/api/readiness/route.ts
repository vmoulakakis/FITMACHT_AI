import {NextResponse} from "next/server";
import data from "@/data/source-readiness.json";
import sourcing from "@/data/fitness-sourcing-audit.json";
import {catalog} from "@/lib/catalog";
export const dynamic="force-dynamic";
export async function GET(){
 const c=await catalog();
 return NextResponse.json({snapshot:data,sourcingAudit:sourcing,live:{catalogStatus:c.mode,verifiedCatalogRows:c.offers.length,releaseReady:false},notice:"Historical audited counts are a timestamped snapshot, NOT live source-table counts."},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex"}});
}
