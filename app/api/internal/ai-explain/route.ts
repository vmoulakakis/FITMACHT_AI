import {NextResponse} from 'next/server';
import {timingSafeEqual} from 'node:crypto';
import {advise, type Answers} from '@/lib/decision';
import {FreeLLMGateway} from '@/lib/free-llm-gateway.mjs';

export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=30;

const GOALS=new Set(['walking','cardio','strength','mixed']);
const SPACES=new Set(['compact','medium','large']);
const NOISES=new Set(['critical','normal']);
const ACTIVITIES=new Set(['walk','run','both']);
const MAX_BODY_BYTES=2048;

function authorized(req:Request):boolean{
 const configured=process.env.FITMATCH_INTERNAL_AI_TOKEN;
 const header=req.headers.get('authorization')??'';
 if(!configured || configured.length<24 || !header.startsWith('Bearer '))return false;
 const a=Buffer.from(header.slice(7));
 const b=Buffer.from(configured);
 return a.length===b.length && timingSafeEqual(a,b);
}

function validAnswers(v:unknown):v is Answers{
 if(!v || typeof v!=='object')return false;
 const a=v as Record<string,unknown>;
 return GOALS.has(String(a.goal)) && SPACES.has(String(a.space)) &&
  NOISES.has(String(a.noise)) && ACTIVITIES.has(String(a.activity)) &&
  typeof a.budget==='number' && Number.isFinite(a.budget) && a.budget>=0 &&
  a.budget<=100000 && typeof a.fold==='boolean';
}

export async function POST(req:Request){
 // Internal agent-to-agent route only, not a public chat endpoint.
 if(process.env.FITMATCH_INTERNAL_AI_ENABLED!=='true')return NextResponse.json({error:'not_found'},{status:404});
 if(!authorized(req))return NextResponse.json({error:'unauthorized'},{status:401});
 const length=Number(req.headers.get('content-length')||0);
 if(!Number.isFinite(length)||length>MAX_BODY_BYTES)return NextResponse.json({error:'request_too_large'},{status:413});
 let body:unknown;
 try {const raw=await req.text();if(Buffer.byteLength(raw,'utf8')>MAX_BODY_BYTES)return NextResponse.json({error:'request_too_large'},{status:413});body=JSON.parse(raw);}
 catch{return NextResponse.json({error:'invalid_json'},{status:400});}
 if(!validAnswers(body))return NextResponse.json({error:'invalid_answers'},{status:422});
 // Derived evidence only. Never send private user messages, merchant links, commissions or PII to free models.
 const decision=advise(body);
 const summary={
  goal:body.goal,space:body.space,noise:body.noise,activity:body.activity,fold:body.fold,
  budget:body.budget,category:decision.category,
  verifiedReason:decision.reason,verifiedCaution:decision.caution,
  checks:decision.checks,wait:decision.wait
 };
 const gateway=new FreeLLMGateway({env:{...process.env,OLLAMA_ENABLED:'false'},timeoutMs:10000});
 if(!gateway.listRoutes({audience:'public'}).some(r=>['groq','openrouter','cloudflare'].includes(r.provider))){
  return NextResponse.json({error:'no_free_provider_configured'},{status:503});
 }
 try {
  const result=await gateway.chat({
   audience:'public',privacy:'standard',maxTokens:220,maxAttempts:2,
   messages:[
    {role:'system',content:'Explain only the deterministic Greek fitness decision in clear Greek. Never invent products, claims, prices, supplier approvals, shipping, reviews or medical advice. Never override the decision, safety cautions or verification state. Respond with one brief paragraph.'},
    {role:'user',content:JSON.stringify(summary)}
   ]
  });
  return NextResponse.json({
   experimental:true,notPurchaseAdvice:true,decision,aiExplanation:result.text.slice(0,1500),
   provider:result.provider,model:result.model
  },{headers:{'Cache-Control':'no-store'}});
 }catch {
  return NextResponse.json({error:'free_ai_temporarily_unavailable',decision},{status:503,headers:{'Cache-Control':'no-store'}});
 }
}
