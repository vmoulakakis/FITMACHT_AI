"use client";
import {useState} from "react";
import {ArrowRight,ArrowUpRight,Check,ChevronDown,Activity,Sparkles,ShieldCheck,Home,Volume2,Wallet,RotateCcw,ExternalLink,CheckCircle2,ScanSearch,MoveRight,LoaderCircle} from "lucide-react";
import type {Plan,Path} from "@/lib/solutions";
type Offer={id:string;title:string;merchant:string;price:number;lastSeen:string;tag:string;imageUrl?:string|null;evidenceUrl?:string|null;reason?:string;review?:"verified"};
type AgentStage={id:string;title:string;detail:string;state:"done"|"review_needed"};
type Result={solutions:Plan;offers:Offer[];matchesByPath?:Record<string,Offer[]>;agentStages?:AgentStage[];sourceStatus?:{verifiedMatches:number;purchaseReady:boolean};catalogState:string;catalogNote:string;aiStatus:string;disclosure:string};
const problems=[
 {id:"space",icon:"◩",kicker:"ΜΙΚΡΟ ΣΠΙΤΙ",title:"Δεν έχω χώρο για όργανα.",note:"Μένω σε μικρό διαμέρισμα. Θέλω να γυμνάζομαι χωρίς να γεμίζει ο χώρος με εξοπλισμό.",goal:"mixed" as const},
 {id:"noise",icon:"◉",kicker:"ΠΟΛΥΚΑΤΟΙΚΙΑ",title:"Δεν θέλω να ενοχλώ τους γείτονες.",note:"Μένω σε πολυκατοικία. Θέλω να κινούμαι μέσα στο σπίτι χωρίς θόρυβο.",goal:"walking" as const},
 {id:"budget",icon:"↗",kicker:"ΕΞΥΠΝΗ ΑΓΟΡΑ",title:"Δεν θέλω να πετάξω τα χρήματά μου.",note:"Θέλω τον πιο κατάλληλο εξοπλισμό για το budget μου και να μη μείνει αχρησιμοποίητος.",goal:"mixed" as const}
];
export default function Advisor(){
 const [active,setActive]=useState("space");
 const [note,setNote]=useState(problems[0].note);
 const [goal,setGoal]=useState<"walking"|"cardio"|"strength"|"mixed">("mixed");
 const [budget,setBudget]=useState(450);
 const [space,setSpace]=useState<"compact"|"medium"|"large">("compact");
 const [quiet,setQuiet]=useState(false);
 const [consent,setConsent]=useState(false);
 const [result,setResult]=useState<Result|null>(null);
 const [selected,setSelected]=useState(0);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState("");
 function preset(p:typeof problems[number]){
  setActive(p.id);setNote(p.note);setGoal(p.goal);setQuiet(p.id==="noise");setError("");setResult(null);
 }
 async function assess(){
  setLoading(true);setError("");
  try{
   const res=await fetch("/api/recommend",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({goal,space,budget,noise:quiet?"critical":"normal",activity:/τρέχ|τρεξ|trex|running/i.test(note)?"run":"walk",fold:space==="compact",note,aiConsent:consent})});
   if(!res.ok)throw Error("Δεν ήταν δυνατή η ανάλυση. Παρακαλούμε δοκίμασε ξανά.");
   const data=await res.json() as Result;
   if(!data.solutions?.primary)throw Error("Η υπηρεσία δεν επέστρεψε κατάλληλη λύση.");
   setResult(data);setSelected(0);requestAnimationFrame(()=>document.getElementById("your-solution")?.scrollIntoView({behavior:"smooth",block:"start"}));
  }catch(e){setError(e instanceof Error?e.message:"Σφάλμα επικοινωνίας.");}finally{setLoading(false);}
 }
 const paths=result?[result.solutions.primary,...result.solutions.alternatives]:[];
 const chosen:Path|undefined=paths[selected];
 const selectedOffers:Offer[]=chosen?(result?.matchesByPath?.[chosen.id]??(selected===0?(result?.offers??[]):[])):[];
 return <div className="cinematicSite">
  <header className="cinematicHeader">
   <a className="cinematicLogo" href="/" aria-label="FITMATCH AI — αρχική"><span className="logoGlyph">F<span>✦</span></span><span>FITMATCH<b> AI</b><small>THE SOLUTION EXPERIENCE</small></span></a>
   <nav aria-label="Κύρια πλοήγηση"><a href="#problems">Τα προβλήματα</a><a href="#advisor">Ο σύμβουλος</a><a href="#how-it-works">Πώς λειτουργεί</a></nav>
   <button className="headerPill" type="button" onClick={()=>document.getElementById("advisor")?.scrollIntoView({behavior:"smooth"})}>Βρες τη λύση σου <ArrowUpRight size={17}/></button>
  </header>
  <main>
   <section className="cinematicHero" aria-label="Λύσεις fitness για πραγματικά προβλήματα">
    <div className="heroVideoLayer" role="img" aria-label="Κινηματογραφική ατμόσφαιρα γυμναστικής σε σύγχρονο διαμέρισμα"></div>
    <div className="heroVignette"></div>
    <div className="heroContent">
     <div className="heroSignal"><span className="signalDot"></span> AI PAIN-GAP SOLVER <span className="signalDivider"></span> DESIGNED FOR REAL LIFE</div>
     <h1>Δεν έχεις χώρο.<br/>Δεν θέλεις θόρυβο.<br/><em>Δεν θέλεις λάθος αγορά.</em></h1>
     <p className="heroPitch">Δεν χρειάζεσαι περισσότερα προϊόντα. Χρειάζεσαι τη σωστή λύση για το σπίτι σου, τη ζωή σου και τα χρήματά σου.</p>
     <div className="heroActions"><button className="cinematicBtn" type="button" onClick={()=>document.getElementById("advisor")?.scrollIntoView({behavior:"smooth"})}>Βρες τη δική σου λύση <ArrowRight size={20}/></button><a className="heroSecondary" href="#problems">Αναγνώρισε το πρόβλημά σου <ChevronDown size={17}/></a></div>
     <div className="heroFine"><span><Check size={14}/> 2 επιλογές & ελεύθερο κείμενο</span><span><Check size={14}/> Χωρίς εγγραφή</span><span><Check size={14}/> Πρώτα το fit, μετά η αγορά</span></div>
    </div>
    <div className="sceneCaption"><span>01 / 03</span><span>YOUR SPACE. YOUR RULES.</span><span className="captionLine"></span></div>
   </section>
   <section id="problems" className="painChapter">
    <div className="chapterEyebrow"><span className="purpleDash"></span> ΔΕΝ ΞΕΚΙΝΑΜΕ ΑΠΟ ΚΑΤΑΛΟΓΟ</div>
    <div className="chapterLead"><h2>Ποιο είναι το <em>δικό σου</em><br/>πρόβλημα;</h2><p>Επιλέγεις αυτό που σε εκφράζει. Ο σύμβουλος διερευνά περιορισμούς, εναλλακτικές και την πραγματική αξία μιας αγοράς.</p></div>
    <div className="painTiles">{problems.map((p,i)=><button type="button" key={p.id} onClick={()=>{preset(p);document.getElementById("advisor")?.scrollIntoView({behavior:"smooth"})}} className={"painTile painTile"+i} aria-label={"Λύσε το πρόβλημα: "+p.title}>
      <span className="painIndex">0{i+1} / {p.kicker}</span><span className="painBigIcon" aria-hidden="true">{p.icon}</span><strong>{p.title}</strong><span className="tileAction">Ας το λύσουμε <ArrowUpRight size={18}/></span>
     </button>)}</div>
   </section>
   <section id="advisor" className="advisorChapter">
    <div className="advisorIntro"><div className="chapterEyebrow"><span className="purpleDash"></span> YOUR PRIVATE BUYING ADVISOR</div><h2>Πες μας τι σε <em>δυσκολεύει.</em><br/>Τα υπόλοιπα είναι δική μας δουλειά.</h2><p>Μια πραγματική ανάγκη, ένας σύντομος έλεγχος και πολλοί δρόμοι προς τη λύση. Χωρίς ατελείωτο quiz.</p></div>
    <div className="advisorGlass">
     <div className="assistantHeader"><span className="aiAvatar"><Sparkles size={22}/></span><div><strong>FITMATCH INTELLIGENCE</strong><small>Σύμβουλος λύσεων για το σπίτι σου</small></div><span className="assistantLive"><i></i> PAIN-GAP ANALYST</span></div>
     <div className="assistantForm">
      <label htmlFor="buyer-need" className="inputLabel">01 <span>/ ΠΕΣ ΤΟ ΠΡΟΒΛΗΜΑ ΜΕ ΔΙΚΑ ΣΟΥ ΛΟΓΙΑ</span></label>
      <textarea id="buyer-need" maxLength={600} value={note} onChange={e=>{setNote(e.target.value);setResult(null);}} rows={3} placeholder="π.χ. Θέλω να περπατάω το βράδυ, αλλά είμαι σε διαμέρισμα και δεν θέλω θόρυβο..."/>
      <div className="quickProblemRow">{problems.map(p=><button type="button" key={p.id} className={active===p.id?"on":""} onClick={()=>preset(p)}>{p.id==="space"?"◩ Μικρός χώρος":p.id==="noise"?"◉ Ησυχία":"↗ Value for money"}</button>)}</div>
      <div className="smartInputs"><div><label className="inputLabel" htmlFor="purchaseBudget">02 <span>/ ΤΟ BUDGET ΣΟΥ</span></label><div className="cashInput"><input id="purchaseBudget" type="number" min={0} max={20000} step={10} value={budget} onChange={e=>setBudget(Math.max(0,Math.min(20000,Number(e.target.value)||0)))}/><b>€</b></div></div>
       <div><span className="inputLabel">ΧΩΡΟΣ</span><div className="spaceSwitch">{([["compact","Μικρός"],["medium","Μέτριος"],["large","Άνετος"]] as const).map(([v,t])=><button type="button" key={v} aria-pressed={space===v} className={space===v?"on":""} onClick={()=>setSpace(v)}>{t}</button>)}</div></div>
       <div><span className="inputLabel">ΣΗΜΑΝΤΙΚΟ ΓΙΑ ΣΕΝΑ</span><label className="quietControl"><input type="checkbox" checked={quiet} onChange={e=>setQuiet(e.target.checked)}/><Volume2 size={17}/> Χαμηλός θόρυβος</label></div>
      </div>
      <details className="advisorDetails"><summary>Περισσότερη εξατομίκευση (προαιρετική)</summary><label>Τι άσκηση σε ενδιαφέρει; <select value={goal} onChange={e=>setGoal(e.target.value as typeof goal)}><option value="walking">Περπάτημα</option><option value="cardio">Cardio & αντοχή</option><option value="strength">Δύναμη</option><option value="mixed">Συνδυασμός</option></select></label><label className="consentRow"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> Επιτρέπω να χρησιμοποιηθεί εξωτερικό Hugging Face μοντέλο μόνο για την ανάλυση του κειμένου μου, εφόσον είναι διαθέσιμο.</label></details>
      <button className="cinematicBtn formCta" type="button" disabled={loading} onClick={assess}>{loading?<><LoaderCircle className="spin" size={20}/> Αναζητούμε τη σωστή λύση...</>:<>Βρες τι πραγματικά μου ταιριάζει <ArrowRight size={20}/></>}</button>
      {error&&<p className="cinematicError" role="alert">{error}</p>}
      <p className="formNotice"><ShieldCheck size={14}/> Δεν ζητάμε στοιχεία επικοινωνίας. Δεν επινοούμε προϊόντα ή τιμές. Η αγορά γίνεται στον merchant.</p>
     </div>
    </div>
   </section>
   {result&&chosen&&<section id="your-solution" className="solutionChapter"><div className="chapterEyebrow"><span className="purpleDash"></span> YOUR SOLUTION / PERSONALIZED</div>
    <div className="solutionTop"><div><h2>Από το πρόβλημα,<br/><em>στη λύση σου.</em></h2><p>Οι προτάσεις βασίζονται στην περιγραφή σου και στους περιορισμούς σου. Η διαθεσιμότητα εμπορικών προϊόντων ελέγχεται χωριστά.</p></div><span className="matchIndicator"><CheckCircle2 size={17}/> ΑΝΑΛΥΘΗΚΑΝ ΟΙ ΑΝΑΓΚΕΣ</span></div>
    <div className="agentEvidence" aria-label="Πορεία ανάλυσης του συμβούλου">
      {(result.agentStages??[]).map((phase,i)=><div key={phase.id} className={"agentStep "+phase.state}><span className="agentStepIndex">0{i+1}</span><div><strong>{phase.title}</strong><p>{phase.detail}</p></div><span className="agentStepIcon">{phase.state==="done"?<CheckCircle2 size={20}/>:<ScanSearch size={20}/>}</span></div>)}
     </div>
    <div className="solutionChoices">{paths.map((p,i)=><button key={p.id} type="button" className={"solutionChoice"+(selected===i?" active":"")} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span>{i===0?"01 / ΠΡΩΤΗ ΠΡΟΣΕΓΓΙΣΗ":i===1?"02 / ΕΝΑΛΛΑΚΤΙΚΗ":"03 / ΕΠΙΠΛΕΟΝ ΛΥΣΗ"}</span><strong>{p.title}</strong><small>{p.kind==="no_purchase"?"Εφικτή χωρίς άμεση αγορά":"Κατηγορία προς τεχνικό έλεγχο"}</small><MoveRight size={20}/></button>)}</div>
    <div className="solutionAnalysis"><div><span className="inputLabel">ΓΙΑΤΙ ΑΥΤΗ Η ΛΥΣΗ;</span><h3>{chosen.title}</h3><p>{chosen.reason}</p></div><div><span className="inputLabel">ΤΑ ΕΠΟΜΕΝΑ ΒΗΜΑΤΑ</span>{chosen.actions.map((x,i)=><p className="solutionAction" key={i}><span>0{i+1}</span>{x}</p>)}</div></div>
    <div className="merchantArea"><div className="merchantHead"><div><div className="chapterEyebrow"><span className="purpleDash"></span> MERCHANT MATCHING</div><h3>Η λύση είναι ξεκάθαρη.<br/><em>Η αγορά μόνο με αποδείξεις.</em></h3></div><span className="stockGate"><ShieldCheck size={16}/> VERIFIED OFFERS ONLY</span></div>
    {chosen.category&&selectedOffers.length>0?<div className="merchantOffers">{selectedOffers.map(o=><article className="merchantOffer merchantOfferPro" key={o.id}>
        {o.imageUrl&&o.imageUrl.startsWith("https://")&&<div className="merchantProductImage"><img src={o.imageUrl} alt={o.title} loading="lazy"/></div>}
        <div className="merchantProductText"><span className="offerLabel">{o.tag} · Ελεγμένη προσφορά</span><h4>{o.title}</h4><p>{o.merchant} · Ενημέρωση τιμής/stock: {new Date(o.lastSeen).toLocaleDateString("el-GR")}</p>
        {o.reason&&<p className="sourceReason">{o.reason}</p>}{o.evidenceUrl&&o.evidenceUrl.startsWith("https://")&&<a className="evidenceLink" href={o.evidenceUrl} target="_blank" rel="noopener noreferrer">Πρωτογενής πηγή προδιαγραφών <ExternalLink size={13}/></a>}</div>
        <div className="priceAndBuy"><b>{o.price.toLocaleString("el-GR")}€</b><a href={"/api/out?id="+encodeURIComponent(o.id)} rel="nofollow sponsored noopener">Αγόρασε στον merchant <ExternalLink size={16}/></a></div></article>)}</div>
    :<div className="stockEmpty"><ScanSearch size={27}/><div><strong>Δεν έχουμε ακόμη επαληθευμένο προϊόν για ασφαλή σύσταση.</strong><p>Ο συγκεκριμένος τύπος λύσης έχει προσδιοριστεί. Η τρέχουσα βάση δεν διαθέτει για αυτή τη λύση SKU που να περνά όλα τα υποχρεωτικά κριτήρια τεχνικών στοιχείων, διαθεσιμότητας και επαληθευμένης affiliate προμήθειας ≥10€. Δεν παρουσιάζουμε πλασματικές προσφορές.</p><small>{result.catalogNote}</small></div></div>}
    <p className="affiliateDisclosure">{result.disclosure}</p></div>
    <button type="button" className="resetSolution" onClick={()=>{setResult(null);document.getElementById("advisor")?.scrollIntoView({behavior:"smooth"})}}><RotateCcw size={18}/> Εξερεύνησε διαφορετικό πρόβλημα</button>
   </section>}
   <section id="how-it-works" className="processChapter"><div className="chapterEyebrow"><span className="purpleDash"></span> THE FITMATCH METHOD</div><h2>Δεν πουλάμε το πρώτο προϊόν.<br/><em>Λύνουμε το σωστό πρόβλημα.</em></h2><div className="processGrid"><div><span>01 / UNDERSTAND</span><h3>Ακούμε την ανάγκη</h3><p>Χώρος, θόρυβος, συνήθειες, χρήματα. Όσα πραγματικά καθορίζουν τη σωστή αγορά.</p></div><div><span>02 / SOLVE</span><h3>Ελέγχουμε τη λύση</h3><p>Πρώτα αποφασίζουμε τι ταιριάζει, ακόμη κι αν η καλύτερη απάντηση είναι να μην αγοράσεις.</p></div><div><span>03 / VERIFY</span><h3>Μόνο πραγματικές προσφορές</h3><p>Συγκεκριμένος merchant, χρονικά τεκμηριωμένη τιμή, απόθεμα, specs και επιβεβαιωμένοι affiliate όροι. Μόνο όταν υπάρχουν πραγματικά δεδομένα.</p></div></div></section>
  </main><footer className="cinematicFooter"><span>FITMATCH <b>AI</b></span><p>ΤΑ ΠΡΟΒΛΗΜΑΤΑ ΕΙΝΑΙ ΠΡΑΓΜΑΤΙΚΑ. ΟΙ ΛΥΣΕΙΣ ΠΡΕΠΕΙ ΝΑ ΕΙΝΑΙ ΚΙ ΑΥΤΕΣ.</p><nav><a href="/methodology">Μεθοδολογία & affiliate disclosure</a><a href="/privacy">Απόρρητο</a><a href="/readiness">Διαφάνεια δεδομένων</a></nav><small>© 2026 · Staging preview</small></footer>
 </div>
}
