import {NextResponse} from "next/server";
import {validPlanInput,buildProgram} from "@/lib/fitmatch-360";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){
 const enabled=process.env.FITMATCH_EMAIL_ENABLED==="true"&&!!process.env.RESEND_API_KEY&&!!process.env.FITMATCH_MAIL_FROM&&!!process.env.TURNSTILE_SECRET_KEY&&!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
 return NextResponse.json({enabled,siteKey:enabled?process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY:null},{headers:{"Cache-Control":"no-store"}});
}
export async function POST(req:Request){
 if(process.env.FITMATCH_EMAIL_ENABLED!=="true"||!process.env.RESEND_API_KEY||!process.env.FITMATCH_MAIL_FROM||!process.env.TURNSTILE_SECRET_KEY)return NextResponse.json({error:"mail_not_configured"},{status:503});
 if(req.headers.get("origin")!==new URL(req.url).origin)return NextResponse.json({error:"origin_denied"},{status:403});
 const length=Number(req.headers.get("content-length")||0);
 if(length>6_000_000)return NextResponse.json({error:"attachment_too_large"},{status:413});
 let raw:unknown;
 try{raw=await req.json()}catch{return NextResponse.json({error:"invalid_json"},{status:400})}
 if(!raw||typeof raw!=="object")return NextResponse.json({error:"invalid_payload"},{status:422});
 const v=raw as Record<string,unknown>;
 if(!validPlanInput(v.plan)||v.plan.safety!=="well")return NextResponse.json({error:"health_context_not_supported_for_email"},{status:422});
 if(v.consent!==true||typeof v.email!=="string"||v.email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))return NextResponse.json({error:"consent_or_email_invalid"},{status:422});
 if(typeof v.captchaToken!=="string"||v.captchaToken.length<10||v.captchaToken.length>5000)return NextResponse.json({error:"captcha_required"},{status:422});
 if(typeof v.pdfBase64!=="string"||v.pdfBase64.length>5_000_000||v.pdfBase64.length<1500||!/^JVBERi0/.test(v.pdfBase64))return NextResponse.json({error:"pdf_invalid"},{status:422});
 let verify:any;
 try{
  const form=new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY!,response:v.captchaToken});
  const check=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",body:form,signal:AbortSignal.timeout(4500)});
  verify=await check.json();
 }catch{return NextResponse.json({error:"captcha_service_unavailable"},{status:503})}
 if(verify?.success!==true)return NextResponse.json({error:"captcha_failed"},{status:403});
 const b=buildProgram(v.plan);
 const html='<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#173745"><h1>FITMATCH NEXT · Το προσωπικό σου πρόγραμμα</h1><p>Το πρόγραμμα γενικής ευεξίας βρίσκεται στο συνημμένο PDF.</p><p><b>Στόχος:</b> '+escapeHtml(b.goal)+'</p><p>Περιλαμβάνει πληροφορίες για καθημερινή κίνηση, ισορροπημένη διατροφή και επιλεγμένα προϊόντα, όπου υπάρχουν επαληθευμένες προσφορές.</p><p>Δεν αντικαθιστά οδηγίες επαγγελματία υγείας.</p><small>Το email στάλθηκε κατόπιν συγκεκριμένου αιτήματός σου. Δεν αποτελεί εγγραφή σε marketing list.</small></div>';
 const endpoint="https://api.resend.com/emails";
 try{
   const sent=await fetch(endpoint,{method:"POST",headers:{"Authorization":"Bearer "+process.env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({from:process.env.FITMATCH_MAIL_FROM,to:[v.email],subject:"FitMatch NEXT · Το προσωπικό σου 360° PDF",html,attachments:[{filename:"fitmatch-program.pdf",content:v.pdfBase64}] }),signal:AbortSignal.timeout(10000)});
   if(!sent.ok)return NextResponse.json({error:"provider_rejected"},{status:502});
   return NextResponse.json({sent:true},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"delivery_unavailable"},{status:503})}
}
function escapeHtml(v:string){return v.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]||c))}
