import {NextResponse} from "next/server";
import {catalog} from "@/lib/catalog";
import {eligible} from "@/lib/decision";
import {allowProductCheckout,validPlanInput,type ProductOption} from "@/lib/fitmatch-360";
export const dynamic="force-dynamic";
const cats:Record<string,string[]>={
 desk:["walking-pad","exercise-bike","exercise-mat","resistance-bands"],
 motivation:["exercise-bike","walking-pad","exercise-mat","resistance-bands"],
 confidence:["exercise-mat","exercise-bike","resistance-bands"],
 fitness:["resistance-bands","adjustable-dumbbells","walking-pad","exercise-bike","exercise-mat","treadmill"]
};
const budgets={low:100,medium:300,high:1500} as const;
function allowedTracking(raw:string):boolean{
 const hosts=(process.env.FITMATCH_LINKWISE_HOSTS||"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);
 if(!hosts.length)return false;
 try{const u=new URL(raw);return u.protocol==="https:"&& !u.username&&!u.password&&hosts.includes(u.hostname.toLowerCase());}catch{return false;}
}
export async function POST(req:Request){
 const origin=req.headers.get("origin");
 if(origin&&origin!==new URL(req.url).origin)return NextResponse.json({error:"origin_denied"},{status:403});
 let value:unknown;
 try{value=await req.json()}catch{return NextResponse.json({error:"bad_json"},{status:400})}
 if(!validPlanInput(value))return NextResponse.json({error:"bad_plan"},{status:422});
 if(!allowProductCheckout(value))return NextResponse.json({offers:[],catalogState:"professional_review",message:"Για την περίπτωση αυτή, η επιλογή συγκεκριμένου εξοπλισμού χρειάζεται κατάλληλη επαγγελματική αξιολόγηση.",requiredProductCount:3},{headers:{"Cache-Control":"no-store"}});
 const allowed=cats[value.need]||[];
 const max=budgets[value.budget];
 const c=await catalog();
 const options:ProductOption[]=c.offers.filter(o=>allowed.includes(o.category))
  .filter(o=>eligible(o,max,7).ok&&allowedTracking(o.trackingUrl))
  .sort((a,b)=>(allowed.indexOf(a.category)-allowed.indexOf(b.category))||(a.price-b.price))
  .slice(0,5).map(o=>({id:o.id,title:o.title,merchant:o.merchant,price:o.price,imageUrl:o.imageUrl||null,trackingUrl:o.trackingUrl,category:o.category,lastSeen:o.lastSeen}));
 return NextResponse.json({offers:options,catalogState:c.mode,message:options.length>=3?"Επαληθευμένες επιλογές":"Δεν υπάρχουν ακόμη 3–5 επαληθευμένες και κατάλληλες διαθέσιμες προσφορές. Το πρόγραμμα συνεχίζει χωρίς κατασκευασμένες αγορές.",requiredProductCount:3},{headers:{"Cache-Control":"no-store"}});
}
