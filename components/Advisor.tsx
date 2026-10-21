"use client";
import {useState} from "react";
import {ArrowRight,ArrowLeft,Check,ChevronRight,ChevronDown,Compass,Footprints,ShieldCheck,HeartPulse,House,Activity,Dumbbell,Volume2,Wallet,PackageCheck,RotateCcw,ExternalLink,Sparkles,SlidersHorizontal,Ruler,MoveRight,Search,Eye,LockKeyhole} from "lucide-react";
import type {Answers} from "@/lib/decision";
import type {Plan,Path} from "@/lib/solutions";
type Product = {id:string;title:string;merchant:string;price:number;lastSeen:string;tag:string};
type Result={solutions:Plan;offers:Product[];catalogState:string;catalogNote:string;aiStatus:string;disclosure:string};
const initial:Answers={goal:"walking",space:"compact",noise:"normal",activity:"walk",budget:500,fold:false};

function Choice({active,title,detail,emoji,onClick}:{active:boolean;title:string;detail?:string;emoji:string;onClick:()=>void}){return <button className={"choice"+(active?" selected":"")} type="button" onClick={onClick}><span className="choiceEmoji">{emoji}</span><span className="choiceCopy"><strong>{title}</strong>{detail&&<small>{detail}</small>}</span><span className="choiceCheck">{active?<Check size={16}/>:<span className="emptyCircle"/>}</span></button>;}
export default function Advisor(){
 const [started,setStarted]=useState(false);
 const [step,setStep]=useState(0);
 const [a,setA]=useState<Answers>(initial);
 const [note,setNote]=useState("");
 const [aiConsent,setAiConsent]=useState(false);
 const [result,setResult]=useState<Result|null>(null);
 const [selected,setSelected]=useState(0);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState("");
 const patch=(p:Partial<Answers>)=>setA(x=>({...x,...p}));
 const begin=()=>{setResult(null);setSelected(0);setError("");setStarted(true);setStep(0);window.scrollTo({top:0,behavior:"smooth"});};
 const next=async()=>{
  if(step===0){setStep(1);return;}
  setLoading(true);setError("");
  try{
   const response=await fetch("/api/recommend",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...a,note,aiConsent})});
   if(!response.ok)throw new Error("Δεν ήταν δυνατή η αξιολόγηση. Δοκίμασε ξανά.");
   const payload=await response.json() as Result;
   if(!payload.solutions?.primary||!Array.isArray(payload.solutions.alternatives))throw new Error("Απρόσμενη απάντηση. Δοκίμασε ξανά.");
   setResult(payload);setSelected(0);
  }catch(e){setError(e instanceof Error?e.message:"Σφάλμα επικοινωνίας.");}
  finally{setLoading(false);}
 };
 const paths:Path[]=result?[result.solutions.primary,...result.solutions.alternatives]:[];
 const selectedPath=paths[selected]||paths[0];
 const labels:Record<string,string>={walking:"Περπάτημα",cardio:"Cardio",strength:"Δύναμη",mixed:"Συνδυασμός"};
 return <div className="shell">
  <header className="header"><div className="headerInside">
    <a className="brand" href="/" aria-label="FITMATCH AI αρχική"><span className="brandMark"><Activity size={20} strokeWidth={2.8}/></span><span>FITMATCH<span className="brandAI"> AI</span></span></a>
    <nav className="nav" aria-label="Κύρια πλοήγηση"><a href="#how">Πώς λειτουργεί</a><a href="#why">Η φιλοσοφία μας</a><a href="/methodology">Μεθοδολογία</a></nav>
    <button className="headerCTA" onClick={begin} type="button">Βρες τον εξοπλισμό σου <ArrowRight size={16}/></button>
  </div></header>
  {!started?<main>
    <section className="hero"><div className="heroInner"><div className="heroText">
      <div className="eyebrow"><Sparkles size={14}/> AI BUYING ADVISOR · ΕΛΛΑΔΑ</div>
      <h1>Ο σωστός εξοπλισμός.<br/><span className="accent">Για τον δικό σου χώρο.</span></h1>
      <p className="heroLead">Δεν χρειάζεσαι άλλον έναν fitness κατάλογο. Χρειάζεσαι κάποιον να καταλάβει τι πραγματικά σου ταιριάζει — πριν ξοδέψεις ούτε ένα ευρώ.</p>
      <div className="heroActions"><button onClick={begin} type="button" className="btnPrimary">Βρες τι σου ταιριάζει <ArrowRight size={19}/></button><a href="#how" className="btnSecondary">Πώς λειτουργεί <ChevronDown size={17}/></a></div>
      <div className="heroPoints"><span><Check size={15}/> 2 ερωτήσεις</span><span><Check size={15}/> Χωρίς εγγραφή</span><span><Check size={15}/> Ανεξάρτητες συμβουλές</span></div>
    </div>
    <div className="heroArt" aria-label="Παράδειγμα διαμόρφωσης γυμναστικής σε σπίτι" role="img"><div className="artRing ring1"/><div className="artRing ring2"/><div className="artPlane"><div className="planeLines"/><div className="equipment"><div className="equipmentHandle"/><div className="equipmentBar"/><div className="equipmentBase"><div className="equipmentStripe"/></div></div><div className="miniLabel"><span className="labelDot"/> SMART SPACE FIT</div></div><div className="floatCard floatA"><Ruler size={17}/><span><b>Χώρος</b><small>Στα μέτρα σου</small></span><Check size={16}/></div><div className="floatCard floatB"><ShieldCheck size={17}/><span><b>Ελεγμένα κριτήρια</b><small>Χωρίς υποθέσεις</small></span></div></div>
    </div></section>
    <section className="trustStrip"><div className="trustInside"><span>ΠΡΩΤΑ Η ΑΝΑΓΚΗ ΣΟΥ. ΜΕΤΑ ΤΟ ΠΡΟΪΟΝ.</span><div><ShieldCheck size={18}/> Προσαρμόσιμες λύσεις</div><div><Eye size={18}/> Διαφανείς επιλογές</div><div><LockKeyhole size={18}/> Χωρίς υποχρεωτικό email</div></div></section>
    <section id="how" className="section"><div className="sectionHead"><div className="overline">ΠΩΣ ΛΕΙΤΟΥΡΓΕΙ</div><h2>Από το «τι να πάρω;»<br/>στο <em>«αυτό είναι για μένα».</em></h2><p>Τρία βήματα που αφαιρούν την αβεβαιότητα — όχι προσθέτουν προϊόντα.</p></div>
      <div className="stepsGrid"><div className="stepCard"><div className="stepTop"><span>01</span><Compass size={25}/></div><h3>Διάλεξε τον στόχο σου</h3><p>Ένα κλικ για τον στόχο σου. Μετά μόνο το budget και οι σημαντικοί περιορισμοί σου.</p><div className="stepPill">Κατανόηση ανάγκης <ChevronRight size={14}/></div></div><div className="stepCard"><div className="stepTop"><span>02</span><SlidersHorizontal size={25}/></div><h3>Βρίσκουμε τη σωστή κατηγορία</h3><p>Πρώτα αξιολογούμε τον τύπο εξοπλισμού. Ακόμη κι αν η σωστή απόφαση είναι να μην αγοράσεις τώρα.</p><div className="stepPill">Αιτιολογημένη επιλογή <ChevronRight size={14}/></div></div><div className="stepCard"><div className="stepTop"><span>03</span><PackageCheck size={25}/></div><h3>Συγκρίνεις με σιγουριά</h3><p>Μόνο πραγματικές και ελεγμένες προσφορές, όταν υπάρχουν. Με σαφή κριτήρια και απευθείας αγορά στο κατάστημα.</p><div className="stepPill">Έλεγχος πριν την αγορά <ChevronRight size={14}/></div></div></div>
    </section>
    <section id="why" className="purpose"><div className="purposeInner"><div><div className="overline">ΤΟ ΠΡΟΒΛΗΜΑ</div><h2>Μικρό σπίτι.<br/>Μεγάλες αποφάσεις.</h2><p>Ένας διάδρομος που δεν χωράει, ένα όργανο που καταλήγει στην αποθήκη, τεχνικά χαρακτηριστικά που δεν εξηγούνται. Εμείς ξεκινάμε από τον πραγματικό τρόπο ζωής σου.</p><button onClick={begin} className="btnWhite" type="button">Ξεκίνα το προσωπικό σου fit <ArrowRight size={18}/></button></div><div className="purposeVisual"><div className="statBlock"><span>01 / SPACE</span><b>Χωράει;</b><small>Με πραγματικές διαστάσεις</small></div><div className="statBlock"><span>02 / PURPOSE</span><b>Σε εξυπηρετεί;</b><small>Με κριτήρια χρήσης</small></div><div className="statBlock"><span>03 / VALUE</span><b>Αξίζει;</b><small>Με διαφανείς εναλλακτικές</small></div></div></div></section>
    <section className="lastCTA"><div className="overline">ΕΙΣΑΙ ΕΤΟΙΜΟΣ;</div><h2>Μην μαντεύεις.<br/><em>Βρες το fit σου.</em></h2><p>Λιγότερες αμφιβολίες. Πιο σωστές επιλογές.</p><button onClick={begin} className="btnPrimary" type="button">Ξεκίνα δωρεάν <ArrowRight size={19}/></button></section>
  </main>:<main className="quizShell"><div className="quizDecor"/><div className="quizLayout">
 <div className="quizTop"><button className="subtleBack" type="button" onClick={()=>{setStarted(false);setResult(null)}}><ArrowLeft size={17}/> Αρχική</button><span className="quizBrand">FITMATCH <b>AI</b></span></div>
 {!result?<div className="quizPanel">
  <div className="quizProgress"><div className="progressTitle"><span>Ο ΕΞΥΠΝΟΣ ΣΥΜΒΟΥΛΟΣ ΣΟΥ</span><span>Ερώτηση {step+1} από 2</span></div><div className="progressBar"><span style={{width:step===0?"50%":"100%"}}/></div></div>
  <div className="quizQuestion">
   {step===0?<><div className="questionLabel">01 / Η ΑΝΑΓΚΗ ΣΟΥ</div>
    <h2>Τι θέλεις να πετύχεις;</h2>
    <p>Μόνο αυτό για αρχή. Μπορείς να μας πεις περισσότερα αργότερα με δικά σου λόγια.</p>
    <div className="choices">
     <Choice active={a.goal==="walking"} emoji="🚶" title="Να κινούμαι περισσότερο" detail="Περπάτημα μέσα ή έξω από το σπίτι" onClick={()=>patch({goal:"walking",activity:"walk"})}/>
     <Choice active={a.goal==="cardio"} emoji="💚" title="Cardio & αντοχή" detail="Αερόβια άσκηση με τον τρόπο μου" onClick={()=>patch({goal:"cardio"})}/>
     <Choice active={a.goal==="strength"} emoji="💪" title="Δύναμη & ενδυνάμωση" detail="Απλές ή πιο συστηματικές επιλογές" onClick={()=>patch({goal:"strength",activity:"walk"})}/>
     <Choice active={a.goal==="mixed"} emoji="✨" title="Θέλω λίγο απ' όλα" detail="Δεν έχω αποφασίσει — πρότεινέ μου" onClick={()=>patch({goal:"mixed"})}/>
    </div></>
   :<><div className="questionLabel">02 / ΤΙ ΣΕ ΒΟΛΕΥΕΙ</div>
    <h2>Τι να λάβουμε υπόψη;</h2>
    <p>Budget και χώρος. Όλα τα υπόλοιπα είναι προαιρετικά — μπορείς να γράψεις με δικά σου λόγια.</p>
    <div className="compactFields">
     <label className="fieldLabel" htmlFor="budget">Μέχρι πόσα χρήματα σκέφτεσαι;</label>
     <div className="budgetInline"><input id="budget" type="number" min="0" max="20000" step="10" value={a.budget} onChange={e=>patch({budget:Math.max(0,Math.min(20000,Number(e.target.value)||0))})}/><span>€</span></div>
     <div className="budgetPresets">{[0,150,400,800].map(n=><button key={n} type="button" className={a.budget===n?"active":""} onClick={()=>patch({budget:n})}>{n===0?"Χωρίς αγορά":n+"€"}</button>)}</div>
     <span className="fieldLabel">Ο χώρος σου</span>
     <div className="quickOptions">{([["compact","Μικρός"],["medium","Κανονικός"],["large","Άνετος"]] as const).map(([key,txt])=><button key={key} type="button" aria-pressed={a.space===key} className={a.space===key?"picked":""} onClick={()=>patch({space:key})}>{txt}</button>)}</div>
     <div className="quickToggles">
      <label><input type="checkbox" checked={a.noise==="critical"} onChange={e=>patch({noise:e.target.checked?"critical":"normal"})}/> 🤫 Θέλω ησυχία</label>
      <label><input type="checkbox" checked={a.fold} onChange={e=>patch({fold:e.target.checked})}/> 📦 Να αποθηκεύεται εύκολα</label>
      {(a.goal==="walking"||a.goal==="cardio"||a.goal==="mixed")&&<label><input type="checkbox" checked={a.activity==="run"} onChange={e=>patch({activity:e.target.checked?"run":"walk"})}/> 🏃 Θέλω να τρέχω</label>}
     </div>
     <label className="fieldLabel" htmlFor="my-context">Κάτι άλλο που σε απασχολεί; <span>(προαιρετικό)</span></label>
     <textarea id="my-context" rows={3} maxLength={600} value={note} onChange={e=>setNote(e.target.value)} placeholder="π.χ. Μένω σε πολυκατοικία, έχω μικρό χώρο, θέλω να κινούμαι χωρίς θόρυβο..."/>
     <details className="aiDisclosure"><summary>Επιπλέον ανάλυση κειμένου με open-weight AI (προαιρετικά)</summary>
      <label><input type="checkbox" checked={aiConsent} onChange={e=>setAiConsent(e.target.checked)}/> Επιτρέπω να σταλεί μόνο η προαιρετική περιγραφή μου στον πάροχο Hugging Face, αν είναι διαθέσιμος.</label>
      <small>Η βασική ανάλυση λειτουργεί και χωρίς αυτό. Μην γράφεις προσωπικά ή ιατρικά δεδομένα.</small>
     </details>
    </div></>}
  </div>
  <div className="quizFooter"><button className="quizBack" type="button" onClick={()=>setStep(0)} disabled={step===0||loading}><ArrowLeft size={17}/> Πίσω</button>
  <button className="btnPrimary" type="button" onClick={next} disabled={loading}>{loading?"Συνδυάζουμε τα δεδομένα σου...":step===0?"Συνέχεια":"Δες τις λύσεις μου"}{!loading&&<ArrowRight size={18}/>}</button></div>
  {error&&<p className="errorMsg" role="alert">{error}</p>}
 </div>:<div className="resultsPanel">
  <div className="resultBadge"><Check size={16}/> Έτοιμο! Βρήκαμε επιλογές για σένα</div>
  <div className="questionLabel">Η ΚΑΤΑΛΛΗΛΟΤΕΡΗ ΠΡΟΣΕΓΓΙΣΗ</div>
  <h2>{selectedPath.title}</h2><p className="resultIntro">{selectedPath.reason}</p>
  <div className="solutionPathGrid" role="region" aria-label="Εναλλακτικές λύσεις">{paths.map((p,i)=><button type="button" key={p.id} aria-pressed={selected===i} className={"solutionPath"+(selected===i?" isSelected":"")} onClick={()=>setSelected(i)}>
    <span className="solutionPathLabel">{i===0?"Κύρια πρόταση":p.kind==="no_purchase"?"Χωρίς αγορά":"Εναλλακτική λύση"}</span>
    <strong>{p.title}</strong><small>{p.kind==="no_purchase"?"Δοκίμασε τώρα":"Κατηγορία προς διερεύνηση"}</small>
  </button>)}</div>
  <div className="whyCard"><div className="whyIcon"><Compass size={22}/></div><div><b>Γιατί το εξετάζουμε;</b><p>{selectedPath.reason}</p></div></div>
  <div className="resultSection" style={{marginTop:18}}><div className="resultTitle"><Check size={19}/> Τρία πρακτικά βήματα</div>
    <ul>{selectedPath.actions.map(t=><li key={t}><Check size={16}/>{t}</li>)}</ul>
  </div>
  <div className="resultSection" style={{marginTop:15}}><div className="resultTitle"><Sparkles size={18}/> Τι λάβαμε υπόψη</div>
    <ul>{result.solutions.insights.map(t=><li key={t}><Check size={16}/>{t}</li>)}</ul>
    <p className="contextMode">{result.aiStatus==="hf-assisted"?"Επιπλέον γλωσσική ανάλυση με Hugging Face.":"Προσαρμογή βάσει στόχου, περιορισμών και των δικών σου λέξεων."}</p>
  </div>
  <div className="offerArea"><div className="offerHead"><div><span className="overline">ΠΡΑΓΜΑΤΙΚΕΣ ΑΓΟΡΕΣ</span><h3>Επαληθευμένα προϊόντα</h3></div></div>
   {selected===0&&selectedPath.kind==="equipment"&&result.offers.length>0?<div className="offerList">{result.offers.map(p=><div key={p.id} className="offerCard"><div><span className="offerTag">{p.tag}</span><h4>{p.title}</h4><p>{p.merchant} · {new Date(p.lastSeen).toLocaleDateString("el-GR")}</p></div><div className="offerPrice"><b>{p.price.toLocaleString("el-GR")}€</b><a href={"/api/out?id="+encodeURIComponent(p.id)} rel="nofollow sponsored noopener">Στο κατάστημα <ExternalLink size={15}/></a></div></div>)}</div>
   :<div className="emptyOffers"><Search size={27}/><h4>Η λύση είναι διαθέσιμη ως πλάνο, όχι ακόμη ως επαληθευμένη προσφορά.</h4><p>Δεν θα επινοήσουμε προϊόντα, τιμές ή διαθεσιμότητα. Μπορείς να ακολουθήσεις τα πρακτικά βήματα και να δεις τις εναλλακτικές παραπάνω.</p><small>{result.catalogNote}</small></div>}
  </div>
  <div className="resultActions"><button className="btnPrimary" onClick={begin} type="button"><RotateCcw size={17}/> Δοκίμασε άλλον στόχο</button><a className="btnText" href="/methodology">Πώς αποφασίζουμε <MoveRight size={16}/></a></div>
  <p className="disclosure">{result.disclosure} Δεν παρέχονται ιατρικές συμβουλές.</p>
 </div>}
 </div></main>}
  <footer className="footer"><div className="footerInner"><div className="footerBrand"><span className="brandMark"><Activity size={19}/></span><b>FITMATCH <span>AI</span></b></div><p>Πρώτα ταιριάζουμε τις ανάγκες. Μετά εξετάζουμε προϊόντα.</p><div className="footerLinks"><a href="/methodology">Μεθοδολογία & affiliate disclosure</a><a href="/privacy">Απόρρητο</a></div><small>© 2026 FITMATCH AI · Staging / δοκιμαστική έκδοση</small></div></footer>
 </div>;
}
