import {NextResponse} from "next/server";
import {type Answers} from "@/lib/decision";
import {runAdvisorAgent} from "@/lib/agent";
import {optionalHF} from "@/lib/hf-context";
import {catalog} from "@/lib/catalog";
export const dynamic="force-dynamic";
const goals=["walking","cardio","strength","mixed"];
const spaces=["compact","medium","large"],noises=["critical","normal"],activities=["walk","run","both"];
export async function POST(request:Request){
 let v:Record<string,unknown>;
 try{v=await request.json() as Record<string,unknown>;}catch{return NextResponse.json({error:"invalid_json"},{status:400});}
 if(!v||Array.isArray(v)||!goals.includes(String(v.goal))||(v.space!==undefined&&!spaces.includes(String(v.space)))||
 (v.noise!==undefined&&!noises.includes(String(v.noise)))||(v.activity!==undefined&&!activities.includes(String(v.activity)))||
 typeof v.budget!=="number"||!Number.isFinite(v.budget)||v.budget<0||v.budget>20000||
 (v.fold!==undefined&&typeof v.fold!=="boolean")||(v.aiConsent!==undefined&&typeof v.aiConsent!=="boolean")||
 (v.note!==undefined&&(typeof v.note!=="string"||v.note.length>600)))
 return NextResponse.json({error:"invalid_answers"},{status:422});
 const a:Answers={goal:v.goal as Answers["goal"],budget:v.budget as number,
 space:(v.space as Answers["space"]|undefined)||"compact",noise:(v.noise as Answers["noise"]|undefined)||"normal",
 activity:(v.activity as Answers["activity"]|undefined)||"walk",fold:v.fold===true};
 const note=(v.note as string|undefined)||"";
 const context=await optionalHF(note,v.aiConsent===true);
 const c=await catalog();
 const agent=runAdvisorAgent(a,note,c.offers,c.mode,context??undefined);
 const solutions=agent.plan,offers=agent.matchesByPath[solutions.primary.id]??[];
 return NextResponse.json({solutions,offers,matchesByPath:agent.matchesByPath,researchByPath:agent.researchByPath,agentStages:agent.stages,sourceStatus:agent.sourceStatus,agentVersion:agent.version,catalogState:c.mode,catalogNote:c.reason??"",
 aiStatus:context?"hf-assisted":"contextual-fallback",
 disclosure:"Τυχόν σύνδεσμοι αγοράς μπορεί να είναι affiliate. Οι πληρωμές γίνονται μόνο στο κατάστημα. Οι προτάσεις κατηγορίας δεν αποτελούν πραγματικές προσφορές."
 },{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex"}});
}
