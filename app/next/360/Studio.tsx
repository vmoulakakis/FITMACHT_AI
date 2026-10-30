"use client";
import {useEffect,useMemo,useState} from "react";
import {ArrowLeft,ArrowRight,ArrowUpRight,Check,ChevronRight,Download,FileText,HeartHandshake,Leaf,Mail,ShieldCheck,Sparkles,SquareArrowOutUpRight,ShoppingBag,XCircle} from "lucide-react";
import {buildProgram,allowProductCheckout,validPlanInput,type PlanInput,type ProductOption,type Preference,type Setting,type Budget} from "@/lib/fitmatch-360";
type Initial={need:string;barrier:string;minutes:string;safety:string};
type Status={state:"idle"|"loading"|"done"|"error";message:string};
type CaptchaGlobal=Window&{turnstile?:{render:(node:HTMLElement,config:{sitekey:string;callback:(token:string)=>void;"expired-callback":()=>void})=>string;remove:(id:string)=>void}};
const needs=[["desk","Πολλές ώρες καθιστός"],["motivation","Δεν μπορώ να ξεκινήσω"],["confidence","Θέλω περισσότερη σιγουριά"],["pain","Η κίνηση με δυσκολεύει"],["rehab","Ακολουθώ φυσικοθεραπεία"],["independence","Θέλω αυτονομία"],["care","Φροντίζω κάποιον"],["fitness","Θέλω περισσότερη κίνηση"]];
const barrierDefault="time";
function getInput(initial:Initial):PlanInput {
 const i={need:initial.need||"desk",barrier:initial.barrier||barrierDefault,minutes:Number(initial.minutes)||5,safety:initial.safety||"well",setting:"flexible",preference:"mediterranean",budget:"medium"};
 return validPlanInput(i)?i as PlanInput:{need:"desk",barrier:"time",minutes:5,safety:"well",setting:"flexible",preference:"mediterranean",budget:"medium"};
}
export default function Studio({initial}: {initial:Initial}){
 const [plan,setPlan]=useState<PlanInput>(()=>getInput(initial));
 useEffect(()=>{try{const raw=sessionStorage.getItem("fitmatch-360-handoff");if(!raw)return;sessionStorage.removeItem("fitmatch-360-handoff");const from=JSON.parse(raw);const candidate={...getInput(initial),...from};if(validPlanInput(candidate))setPlan(candidate);}catch{}},[initial]);
 const [phase,setPhase]=useState<"questions"|"results"|"delivery">("questions");
 const [offers,setOffers]=useState<ProductOption[]>([]);
 const [chosen,setChosen]=useState<string|null>(null);
 const [catalogMessage,setCatalogMessage]=useState("");
 const [gettingOffers,setGettingOffers]=useState(false);
 const [download,setDownload]=useState<Status>({state:"idle",message:""});
 const [email,setEmail]=useState("");
 const [deliveryConsent,setDeliveryConsent]=useState(false);
 const [emailEnabled,setEmailEnabled]=useState(false);
 const [siteKey,setSiteKey]=useState("");
 const [captcha,setCaptcha]=useState("");
 const [mailStatus,setMailStatus]=useState<Status>({state:"idle",message:""});
 const program=useMemo(()=>buildProgram(plan),[plan]);
 const safeCommerce=allowProductCheckout(plan);
 const patch=(p:Partial<PlanInput>)=>setPlan(x=>({...x,...p}));
 useEffect(()=>{let ok=true;fetch("/api/360/email",{cache:"no-store"}).then(r=>r.json()).then(d=>{if(ok){setEmailEnabled(d.enabled===true);setSiteKey(typeof d.siteKey==="string"?d.siteKey:"");}}).catch(()=>{});return()=>{ok=false}},[]);
 useEffect(()=>{if(phase!=="delivery"||!emailEnabled||!siteKey)return;const id="fm-turnstile-target";let script:HTMLScriptElement|null=null;let widget:string|null=null;let cancelled=false;
   const render=()=>{if(cancelled||widget)return;const target=document.getElementById(id),api=(window as CaptchaGlobal).turnstile;if(target&&api)widget=api.render(target,{sitekey:siteKey,callback:setCaptcha,"expired-callback":()=>setCaptcha("")})};
   if(!(window as CaptchaGlobal).turnstile){script=document.createElement("script");script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";script.async=true;script.onload=render;document.head.appendChild(script);}else render();
   return()=>{cancelled=true;if(widget)try{(window as CaptchaGlobal).turnstile?.remove(widget)}catch{};if(script)script.remove()};
 },[phase,emailEnabled,siteKey]);
 const fetchOffers=async()=>{
  setGettingOffers(true);setOffers([]);setChosen(null);setCatalogMessage("");
  if(!safeCommerce){setCatalogMessage("Κατάλληλη κατηγορία εξοπλισμού μπορεί να συζητηθεί με τον επαγγελματία που σε παρακολουθεί. Δεν εμφανίζουμε αυτόματα ιατρικές αγορές.");setGettingOffers(false);return;}
  try{const r=await fetch("/api/360/offers",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(plan)});const v=await r.json();if(!r.ok)throw Error("Αδυναμία ελέγχου εμπορικών επιλογών.");setOffers(Array.isArray(v.offers)?v.offers:[]);setCatalogMessage(String(v.message||""));}
  catch{setCatalogMessage("Η σύνδεση του καταλόγου δεν είναι διαθέσιμη. Δεν παρουσιάζουμε προϊόντα χωρίς επαλήθευση.");}
  finally{setGettingOffers(false)}
 };
 const proceed=async()=>{if(plan.safety==="urgent"){setPhase("results");setCatalogMessage("Χρειάζεται άμεση ιατρική αξιολόγηση, όχι πρόγραμμα ή αγορές.");return;}setPhase("results");await fetchOffers()};
 const makePdf=async(andDownload:boolean)=>{
  const {createFitmatchPdf}=await import("@/lib/fitmatch-pdf");
  const result=await createFitmatchPdf(plan,program,offers,chosen);
  if(andDownload)result.download();
  return result;
 };
 const onDownload=async()=>{setDownload({state:"loading",message:"Δημιουργία PDF…"});try{await makePdf(true);setDownload({state:"done",message:"Το προσωπικό PDF δημιουργήθηκε. Θα το βρεις στις λήψεις σου."})}catch{setDownload({state:"error",message:"Δεν μπόρεσε να δημιουργηθεί το PDF. Δοκίμασε ξανά."})}};
 const onSend=async()=>{
  if(!emailEnabled||plan.safety!=="well"){setMailStatus({state:"error",message:"Η ασφαλής αποστολή email δεν είναι ενεργή για αυτή τη διαδρομή."});return}
  if(!deliveryConsent||!captcha||!email){setMailStatus({state:"error",message:"Συμπλήρωσε email, συναίνεση και έλεγχο ασφαλείας."});return}
  setMailStatus({state:"loading",message:"Δημιουργία και αποστολή PDF…"});
  try{
   const result=await makePdf(false);
   const response=await fetch("/api/360/email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,consent:true,plan,pdfBase64:result.pdfBase64,captchaToken:captcha})});
   const data=await response.json();
   if(!response.ok||!data.sent)throw Error("email_unavailable");
   setMailStatus({state:"done",message:"Το PDF στάλθηκε στο email που επέλεξες."});
  }catch{setMailStatus({state:"error",message:"Δεν επιβεβαιώθηκε η αποστολή email. Κατέβασε το PDF απευθείας."})}
 };
 const picked=offers.find(x=>x.id===chosen);
 return <main className="fm360">
  <header className="fm360-head"><a href="/next" className="fm360-logo">fitmatch<span>✳</span><small>360° STUDIO</small></a><div className="fm360-nav"><span>{phase==="questions"?"01 / 03":phase==="results"?"02 / 03":"03 / 03"}</span><a href="/next">Επιστροφή <ArrowLeft size={16}/></a></div></header>
  <div className="fm360-wrap">
  {phase==="questions"&&<section className="fm360-first">
   <div className="fm360-kicker"><Sparkles size={17}/> ΜΙΑ ΟΛΟΚΛΗΡΩΜΕΝΗ ΕΜΠΕΙΡΙΑ</div>
   <h1>Το δικό σου <em>360°</em><br/>ξεκινά εδώ.</h1>
   <p className="fm360-lead">Κίνηση, ευχάριστες συνήθειες, γενικές αρχές διατροφής και κατάλληλος εξοπλισμός. Λίγες επιλογές — όλα συνδεδεμένα.</p>
   <div className="fm360-tiles">
    <div className="fm360-question"><div className="fm360-question-title"><span>01</span><h2>Τι θέλεις να κάνεις πιο εύκολο;</h2></div><div className="fm360-chip-row">{needs.map(([id,label])=><button type="button" key={id} className={plan.need===id?"active":""} onClick={()=>patch({need:id as PlanInput["need"],safety:["rehab","pain","care","independence"].includes(id)?"clinical":plan.safety})}>{label}</button>)}</div></div>
    <div className="fm360-question"><div className="fm360-question-title"><span>✳</span><h2>Χρειάζεσαι υποστήριξη υγείας αυτή την περίοδο;</h2></div><div className="fm360-segments">{([["well","Γενική ευεξία"],["clinical","Πόνος / θεραπεία / πάθηση"],["urgent","Σοβαρό ή ξαφνικό σύμπτωμα"]] as const).map(([id,label])=><button key={id} type="button" className={plan.safety===id?"active":""} onClick={()=>patch({safety:id})}>{label}</button>)}</div></div>
    <div className="fm360-question"><div className="fm360-question-title"><span>02</span><h2>Πού σου ταιριάζει να κινείσαι;</h2></div><div className="fm360-segments">{([["home","Στο σπίτι"],["outdoors","Έξω"],["flexible","Όπου βολεύει"]] as const).map(([id,label])=><button type="button" key={id} onClick={()=>patch({setting:id})} className={plan.setting===id?"active":""}>{label}</button>)}</div></div>
    <div className="fm360-question"><div className="fm360-question-title"><span>03</span><h2>Τι προσέγγιση διατροφής προτιμάς;</h2></div><div className="fm360-segments">{([["mediterranean","Μεσογειακή"],["vegetarian","Χορτοφαγική"],["unsure","Δεν ξέρω ακόμα"]] as const).map(([id,label])=><button type="button" key={id} onClick={()=>patch({preference:id})} className={plan.preference===id?"active":""}>{label}</button>)}</div></div>
    <div className="fm360-question"><div className="fm360-question-title"><span>04</span><h2>Budget εξοπλισμού — αν χρειαστεί;</h2></div><div className="fm360-segments">{([["low","Έως 100 €"],["medium","Έως 300 €"],["high","Έως 1.500 €"]] as const).map(([id,label])=><button type="button" key={id} onClick={()=>patch({budget:id})} className={plan.budget===id?"active":""}>{label}</button>)}</div><small>Ο εξοπλισμός είναι προαιρετικός· η βοήθεια δεν εξαρτάται από αγορά.</small></div>
   </div>
   <div className="fm360-bottom"><div><ShieldCheck size={17}/> Δεν ζητάμε ιατρικό ιστορικό, κιλά ή θερμίδες.</div><button type="button" onClick={proceed} className="fm360-primary">Δείξε μου το 360° πλάνο <ArrowRight size={19}/></button></div>
  </section>}
  {phase==="results"&&<section className="fm360-result"><div className="fm360-kicker">ΕΣΥ ΕΠΙΛΕΓΕΙΣ · ΕΜΕΙΣ ΣΥΝΔΕΟΥΜΕ ΤΙΣ ΛΥΣΕΙΣ</div><h1>{program.heading}<span>.</span></h1><p className="fm360-lead">{program.goal}</p>
   {program.tier==="urgent"?<div className="fm360-clinical"><XCircle size={27}/><h2>Χρειάζεται άμεση ιατρική βοήθεια.</h2><p>Δεν εμφανίζουμε προγράμματα ή προϊόντα για σοβαρά ή ξαφνικά συμπτώματα. Ελλάδα: 112 ή 166.</p></div>:<>
   <div className="fm360-triptych"><article className="mint"><div><Leaf/><span>ΚΙΝΗΣΗ</span></div><h2>Κίνηση στο δικό σου πλαίσιο</h2><p>{program.movement[0]}</p><a href="#program-details">Περισσότερα <ChevronRight size={15}/></a></article><article className="peach"><div><HeartHandshake/><span>ΔΙΑΤΡΟΦΗ</span></div><h2>Ισορροπημένες επιλογές</h2><p>{program.food[0]}</p><a href="#program-details">Περισσότερα <ChevronRight size={15}/></a></article><article className="sky"><div><ShoppingBag/><span>ΕΞΟΠΛΙΣΜΟΣ</span></div><h2>Προϊόντα με λόγο ύπαρξης</h2><p>Έως 5 πραγματικά επαληθευμένες επιλογές, μόνο όταν ταιριάζουν στην ανάγκη και υπάρχει ασφαλής σύνδεσμος.</p><a href="#fitmatch-products">Δες τις επιλογές <ChevronRight size={15}/></a></article></div>
   <div id="program-details" className="fm360-details"><h2>Το πλάνο σου</h2><div className="fm360-detail-columns"><article><h3>Κίνηση / συνήθεια</h3>{program.movement.map((s,i)=><p key={i}><Check size={16}/>{s}</p>)}</article><article><h3>Διατροφικές αρχές</h3>{program.food.map((s,i)=><p key={i}><Check size={16}/>{s}</p>)}</article></div><small><ShieldCheck size={14}/> {program.expertReview}</small></div>
   <section id="fitmatch-products" className="fm360-product-section"><div className="fm360-product-heading"><div><div className="fm360-kicker">ΠΡΟΤΑΣΕΙΣ SOCIALMARKET AI</div><h2>Οι δικές σου επιλογές προϊόντων</h2><p>Πρώτα η καταλληλότητα, μετά η επαληθευμένη προσφορά. Οι φωτογραφίες παραμένουν οι αυθεντικές των προϊόντων.</p></div><div className="fm360-product-count">{offers.length} <span>/ 5</span></div></div>
   {gettingOffers?<p role="status">Έλεγχος προϊόντων και merchant δεδομένων…</p>:offers.length>0?<div className="fm360-products">{offers.map((p,i)=><button key={p.id} type="button" className={chosen===p.id?"selected":""} onClick={()=>setChosen(p.id)}><div className="fm360-photo">{p.imageUrl?<img src={p.imageUrl} alt={p.title} loading="lazy"/>:<ShoppingBag size={35}/>}</div><div className="fm360-product-tag">{chosen===p.id?"ΕΠΙΛΕΧΘΗΚΕ":i===0?"ΕΠΙΛΟΓΗ ΓΙΑ ΕΞΕΤΑΣΗ":"ΕΠΙΠΛΕΟΝ ΕΠΙΛΟΓΗ"}</div><h3>{p.title}</h3><small>{p.merchant}</small><strong>{p.price.toLocaleString("el-GR",{style:"currency",currency:"EUR"})}</strong><div className="fm360-select">{chosen===p.id?<><Check size={17}/> Στο PDF μου</>:"Επιλογή προϊόντος →"}</div></button>)}</div>:<div className="fm360-no-products"><ShoppingBag size={31}/><h3>Δεν θα σου προτείνουμε φανταστικά προϊόντα.</h3><p>{catalogMessage||"Προς το παρόν δεν έχει εγκριθεί κατάλληλος εξοπλισμός από την εμπορική βάση."}</p><small>Το ενημερωτικό πρόγραμμα και το PDF σου διατίθενται χωρίς αγορά.</small></div>}
   {picked&&<p className="fm360-picked"><Check size={17}/> Επιλογή για το PDF: <b>{picked.title}</b>. Η πραγματική φωτογραφία του και ένα QR με το επαληθευμένο tracking URL θα προστεθούν στο αρχείο.</p>}
   </section>
   <div className="fm360-expert"><ShieldCheck size={26}/><div><h3>Από γυμναστή και διαιτολόγο — μόνο μετά την πραγματική έγκρισή τους.</h3><p>Αυτή η έκδοση περιέχει γενικές οδηγίες WHO/NICE. Δεν υπογράφουμε αυτόματα προγράμματα ειδικών. Σε φυσικοθεραπεία, πόνο ή άλλες σύνθετες ανάγκες, το PDF χρησιμοποιείται ως συνοδευτικό ενημερωτικό πλάνο.</p></div></div>
   <div className="fm360-next"><button className="fm360-secondary" onClick={()=>setPhase("questions")} type="button"><ArrowLeft size={16}/> Άλλαξε επιλογές</button><button type="button" className="fm360-primary" onClick={()=>setPhase("delivery")}>Δημιούργησε το 360° PDF <FileText size={18}/></button></div>
   </>}
   </section>}
  {phase==="delivery"&&<section className="fm360-delivery"><div className="fm360-kicker">ΤΟ ΔΙΚΟ ΣΟΥ ΠΡΟΓΡΑΜΜΑ · A4 PDF</div><h1>Ένα πρόγραμμα.<br/><em>Μαζί σου παντού.</em></h1><p className="fm360-lead">Premium γραφιστική διάταξη, γενικές κατευθύνσεις κίνησης και διατροφής, φωτογραφίες πραγματικών επαληθευμένων προϊόντων όπου υπάρχουν και διαδραστικά links/QR στο PDF.</p>
   <div className="fm360-delivery-grid"><div className="fm360-paper"><div className="fm360-paper-brand">fitmatch <span>✳</span><small>360° STUDIO</small></div><h2>Η κίνηση<br/>ξεκινά από<br/><em>εσένα.</em></h2><div className="fm360-paper-art"><div/></div><span>Η δική σου αφετηρία · {plan.minutes} λεπτά</span><small>Πρόγραμμα γενικής ενημέρωσης · Προεπισκόπηση εξωφύλλου</small></div><div className="fm360-delivery-actions"><div className="fm360-delivery-step"><span>01</span><h3>Κατέβασε το PDF</h3><p>Άμεση λήψη, χωρίς να χρειάζεται να δώσεις email.</p><button className="fm360-primary" onClick={onDownload} disabled={download.state==="loading"}><Download size={17}/>{download.state==="loading"?"Δημιουργείται…":"Λήψη προσωπικού PDF"}</button>{download.message&&<small role="status">{download.message}</small>}</div><div className="fm360-delivery-step"><span>02</span><h3>Στείλ’ το στο email σου</h3>{!emailEnabled?<p>Η αυτόματη αποστολή ενεργοποιείται όταν προστεθούν επαληθευμένο email domain, Resend API και προστασία από spam. Η λήψη PDF λειτουργεί ανεξάρτητα.</p>:program.tier!=="wellness"?<p>Η αποστολή πληροφοριών που μπορεί να αποκαλύπτουν δεδομένα υγείας δεν είναι ενεργή. Κατέβασε το PDF και διαχειρίσου το ιδιωτικά.</p>:<><label htmlFor="fitmatch-email">Email παραλήπτη</label><input id="fitmatch-email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com"/><label className="fm360-consent"><input type="checkbox" checked={deliveryConsent} onChange={e=>setDeliveryConsent(e.target.checked)}/><span>Συμφωνώ να χρησιμοποιηθεί αυτό το email αποκλειστικά για μία αποστολή του PDF μου. Δεν εγγράφομαι σε newsletter.</span></label><div id="fm-turnstile-target"/><button className="fm360-primary" onClick={onSend} disabled={mailStatus.state==="loading"}><Mail size={17}/>Αποστολή προσωπικού PDF</button>{mailStatus.message&&<small role="status">{mailStatus.message}</small>}</>}</div><div className="fm360-disclosure"><ShieldCheck size={19}/><p>Οι προτάσεις δεν υποκαθιστούν επαγγελματία υγείας. Affiliate links επιτρέπονται μόνο σε πραγματικά επαληθευμένες προσφορές. Δεν αποθηκεύουμε εδώ τις επιλογές του προγράμματος.</p></div></div></div>
   <div className="fm360-next"><button className="fm360-secondary" onClick={()=>setPhase("results")}><ArrowLeft size={17}/> Στις επιλογές σου</button><a href="/next" className="fm360-secondary">FitMatch NEXT <SquareArrowOutUpRight size={16}/></a></div>
  </section>}
  </div>
  <footer className="fm360-footer"><span>fitmatch ✳ · A MOVEMENT INTELLIGENCE EXPERIENCE</span><p>Πηγές: WHO Physical Activity Guidelines · WHO Healthy Diet (2026) · NICE PH49. Ενημερωτική έκδοση και όχι προσωπική ιατρική/διαιτολογική συνταγή.</p></footer>
 </main>
}