import {NextResponse} from "next/server";
import {advise,choose,type Answers} from "@/lib/decision";
import {catalog} from "@/lib/catalog";
import {linkwisePreviews} from "@/lib/linkwise-preview";
import {publicLinkwisePreviews} from "@/lib/linkwise-public";
export const dynamic="force-dynamic";
const goals=["walking","cardio","strength","mixed"], spaces=["compact","medium","large"], noises=["critical","normal"], activities=["walk","run","both"];
export async function POST(req:Request){
 let v:Partial<Answers>;
 try{v=await req.json()}catch{return NextResponse.json({error:"invalid_json"},{status:400})}
 if(!v||!goals.includes(String(v.goal))||!spaces.includes(String(v.space))||!noises.includes(String(v.noise))||!activities.includes(String(v.activity))||typeof v.budget!=="number"||v.budget<0||v.budget>100000||typeof v.fold!=="boolean")
 return NextResponse.json({error:"invalid_answers"},{status:422});
 const answers=v as Answers;
 const decision=advise(answers);
 const c=await catalog();
 const offers=choose(c.offers,answers,decision.category);
 const candidatePreviews=offers.length?[]:(await publicLinkwisePreviews(decision.category,answers.budget));
 // Local review snapshots are supported only outside production, never public Vercel filesystem.
 const previews=candidatePreviews.length || process.env.VERCEL_ENV==="production" ? candidatePreviews : await linkwisePreviews(decision.category,answers.budget);
 return NextResponse.json({decision,offers,candidatePreviews:previews,catalogState:c.mode,catalogNote:c.reason??"",disclosure:"Οι σύνδεσμοι αγοράς μπορεί να είναι affiliate. Καμία παραγγελία δεν ολοκληρώνεται στο FITMATCH AI."},{headers:{"Cache-Control":"no-store"}});
}
