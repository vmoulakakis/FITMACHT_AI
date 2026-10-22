"use client";
import {useMemo,useState} from "react";
import {Activity,ArrowRight,ArrowUpRight,CheckCircle2,Dumbbell,House,Leaf,Search,ShieldCheck,SlidersHorizontal,Sparkles} from "lucide-react";
import {rankForBuyer,type BuyerAnswer,type BuyerGoal,type Listing} from "@/lib/storefront";
const intentions:[
 BuyerGoal,string,string,typeof Activity
][]=[
 ["cardio","Θέλω αντοχή","Περπάτημα, ποδήλατο, cardio",Activity],
 ["strength","Θέλω δύναμη","Αλτήρες, αντίσταση, ασκήσεις",Dumbbell],
 ["home-gym","Στήνω home gym","Πάγκοι και βασικός εξοπλισμός",House],
 ["recovery","Θέλω ήπια κίνηση","Επιλογές προς προσεκτική αξιολόγηση",Leaf]
];
const eur=(n:number)=>n.toLocaleString("el-GR",{style:"currency",currency:"EUR"});
export default function FitQuiz({products}:{products:Listing[]}){
 const [goal,setGoal]=useState<BuyerGoal>("cardio");
 const [budget,setBudget]=useState(600);
 const [space,setSpace]=useState<BuyerAnswer["space"]>("compact");
 const [step,setStep]=useState(1);
 const results=useMemo(()=>rankForBuyer(products,{goal,budget,space}),[products,goal,budget,space]);
 return <section id="fit-quiz" className="fmQuiz" aria-label="FITMATCH δύο βημάτων">
  <div className="fmQuizIntro"><div><p className="fmMiniKicker"><Sparkles size={14}/> YOUR TWO-STEP FITNESS MATCH</p><h2>Βρες τα προϊόντα που σου ταιριάζουν.<br/><em>Σε δύο απλές επιλογές.</em></h2><p>Δεν χρειάζεται να γνωρίζεις μάρκες ή κωδικούς. Αρκεί να μας πεις τον στόχο και το διαθέσιμο budget.</p></div><div className="fmQuizVisual" aria-hidden="true"><span>01</span><ArrowRight size={20}/><span>02</span><ArrowRight size={20}/><strong>TOP 5</strong></div></div>
  <div className="fmQuizStepper"><div className={step>=1?"active":""}><span>1</span> Στόχος</div><ArrowRight size={17}/><div className={step>=2?"active":""}><span>2</span> Budget & χώρος</div><ArrowRight size={17}/><div className={step>=3?"active":""}><span>3</span> Οι επιλογές σου</div></div>
  {step===1&&<div className="fmQuizPanel"><h3>Τι θέλεις να πετύχεις;</h3><div className="fmQuizGoals">{intentions.map(([id,label,desc,Icon])=><button key={id} type="button" className={goal===id?"selected":""} aria-pressed={goal===id} onClick={()=>{setGoal(id);setStep(2)}}><Icon size={31}/><strong>{label}</strong><small>{desc}</small><ArrowUpRight size={15}/></button>)}</div></div>}
  {step===2&&<div className="fmQuizPanel fmQuizChoices"><div><h3>Ποιο είναι το budget σου;</h3><label htmlFor="fitmatch-quiz-budget">Μέχρι <b>{eur(budget)}</b></label><input id="fitmatch-quiz-budget" type="range" min="0" max="6000" step="100" value={budget} onChange={e=>setBudget(Number(e.target.value))}/><div className="fmQuizPresets">{[200,500,1000,2000].map(n=><button type="button" aria-pressed={budget===n} key={n} onClick={()=>setBudget(n)}>{eur(n)}</button>)}</div></div><div><h3>Πόσο χώρο έχεις;</h3><div className="fmQuizSpace"><button type="button" aria-pressed={space==="compact"} onClick={()=>setSpace("compact")}><House size={20}/> Μικρό διαμέρισμα</button><button type="button" aria-pressed={space==="regular"} onClick={()=>setSpace("regular")}><SlidersHorizontal size={20}/> Αρκετό χώρο</button></div><p>Δεν υποθέτουμε πραγματικές διαστάσεις ή αθόρυβη λειτουργία χωρίς τεκμηρίωση.</p></div><div className="fmQuizNext"><button type="button" className="fmBigCta" onClick={()=>setStep(3)}>Δες τις 5 επιλογές μου <ArrowRight size={17}/></button><button type="button" className="fmQuizBack" onClick={()=>setStep(1)}>Αλλαγή στόχου</button></div></div>}
  {step===3&&<div className="fmQuizPanel fmQuizResults"><div className="fmQuizResultHeader"><div><p className="fmMiniKicker"><CheckCircle2 size={14}/> PERSONAL PRODUCT MATCH</p><h3>Οι 5 πιο σχετικές επιλογές για σένα</h3><p>Με πραγματικά προϊόντα από τη βάση. Όπου χρειάζεται εμφανίζουμε κοντινή λύση και τον συμβιβασμό.</p></div><button className="fmQuizBack" type="button" onClick={()=>setStep(1)}>Νέο matching ↻</button></div>
   {results.length?<div className="fmQuizProductGrid">{results.map((r,i)=><article key={r.product.id} className="fmQuizMatchCard"><div className="fmQuizMatchTop"><span>#{i+1}</span><span>{r.fit==="direct"?"ΑΜΕΣΗ ΚΑΤΗΓΟΡΙΑ":r.fit==="near"?"ΚΟΝΤΙΝΗ ΛΥΣΗ":"ΕΝΑΛΛΑΚΤΙΚΗ"}</span></div><div className="fmQuizMatchVisual">{r.product.image?<img src={r.product.image} alt="" loading="lazy" onError={e=>{e.currentTarget.style.display="none";}}/>:<Activity size={39}/>}</div><div className="fmQuizMatchInfo"><strong>{r.product.name}</strong><span>{eur(r.product.price)} <small>στο feed</small></span><p>{r.reason}</p><small className="fmQuizCommercial">{r.product.affiliateEligible?"✓ Verified affiliate >20€":"Εμπορική επαλήθευση σε εκκρεμότητα"}</small><a href={"/products/"+encodeURIComponent(r.product.id)}>Ανάλυση προϊόντος <ArrowUpRight size={15}/></a></div></article>)}</div>:<p>Δεν υπάρχουν ακόμη πραγματικές εγγραφές στο feed. Δοκίμασε άλλη κατηγορία.</p>}
   <div className="fmQuizAssurance"><ShieldCheck size={19}/><p>Οι επιλογές βασίζονται σε πραγματικές εγγραφές, όχι σε ψεύτικες βαθμολογίες. Η τελική αγορά ανοίγει μόνο όταν υπάρχει τεκμηριωμένη προμήθεια πάνω από 20€ και εγκεκριμένο tracking link.</p></div>
  </div>}
 </section>;
}
