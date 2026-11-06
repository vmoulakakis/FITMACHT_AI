"use client";

import {useState,type FormEvent} from "react";
import {ArrowRight,BrainCircuit,Check,ClipboardList,LockKeyhole,RotateCcw,ShieldCheck,Sparkles} from "lucide-react";
import type {Goal} from "@/lib/decision";
import type {FitCheckPlan} from "@/lib/fitcheck";

type FitCheckResponse={plan:FitCheckPlan;processing:"guided_rules"|"model_assisted"};
const examples=[
 "Έχω μικρό χώρο και δεν ξέρω από πού να ξεκινήσω",
 "Κάθομαι πολλές ώρες στο γραφείο και δυσκολεύομαι να κινηθώ",
 "Θέλω να ενδυναμωθώ αλλά δεν έχω εξοπλισμό"
];
export default function FitCheck({onExplore}:{onExplore:(goal:Goal)=>void}){
 const [issue,setIssue]=useState("");
 const [consent,setConsent]=useState(false);
 const [result,setResult]=useState<FitCheckResponse|null>(null);
 const [pending,setPending]=useState(false);
 const [error,setError]=useState("");
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(pending)return;
  setError("");setPending(true);setResult(null);
  try{
    const response=await fetch("/api/fitcheck",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({issue:issue.trim(),consentToModel:consent}),
      cache:"no-store"
    });
    if(!response.ok)throw new Error("Η ανάλυση δεν ολοκληρώθηκε. Έλεγξε το κείμενο και δοκίμασε ξανά.");
    const data=await response.json() as FitCheckResponse;
    if(!data?.plan?.steps?.length)throw new Error("Δεν λάβαμε έγκυρο αποτέλεσμα. Δοκίμασε ξανά.");
    setResult(data);
  }catch(e){setError(e instanceof Error?e.message:"Προσωρινό πρόβλημα επικοινωνίας.");}
  finally{setPending(false);}
 }
 return <section id="fitcheck" className="fitcheck" aria-labelledby="fitcheck-title">
  <div className="fcFrame">
    <div className="fcEditorial">
      <div className="fcOverline"><span className="fcSignal"/> FITCHECK · PERSONAL DECISION STUDIO</div>
      <h2 id="fitcheck-title">Δεν ψάχνεις προϊόν.<br/><em>Ψάχνεις λύση.</em></h2>
      <p>Περιέγραψε με δικά σου λόγια τι σε εμποδίζει να κινείσαι περισσότερο. Θα ξεκινήσουμε με πρακτικά βήματα — όχι με άσκοπες αγορές.</p>
      <div className="fcValues"><span><BrainCircuit size={17}/> Αξιολόγηση ανάγκης</span><span><ShieldCheck size={17}/> Έλεγχοι ασφάλειας</span><span><LockKeyhole size={17}/> Χωρίς λογαριασμό</span></div>
      <div className="fcIndex">01 <span>/</span> FITCHECK</div>
    </div>
    <div className="fcWorkarea">
      {!result?<form onSubmit={submit} className="fcForm">
        <div className="fcFormTop"><span><Sparkles size={17}/> Ξεκίνα από την καθημερινότητά σου</span><span>01 — INPUT</span></div>
        <label htmlFor="fitcheck-issue">Τι θέλεις να αλλάξεις;</label>
        <textarea id="fitcheck-issue" rows={4} minLength={12} maxLength={500} required value={issue}
         onChange={event=>setIssue(event.target.value)}
         placeholder="Π.χ. Δουλεύω όλη μέρα καθιστός και θέλω να βρω έναν απλό τρόπο να κινηθώ στο σπίτι…"/>
        <p className="fcSupport">Για το πρώτο βήμα μη γράψεις ονόματα, στοιχεία επικοινωνίας ή ευαίσθητα ιατρικά δεδομένα.</p>
        <div className="fcExamples" aria-label="Παραδείγματα προβλημάτων">
          {examples.map(example=><button type="button" key={example} onClick={()=>setIssue(example)}>{example}</button>)}
        </div>
        <label className="fcConsent"><input type="checkbox" checked={consent} onChange={event=>setConsent(event.target.checked)}/>
          <span>Επιτρέπω προαιρετικά την αποστολή της περιγραφής σε AI πάροχο, μόνο αν η υπηρεσία είναι ενεργοποιημένη. Διαφορετικά εφαρμόζεται καθοδηγούμενη αξιολόγηση.</span>
        </label>
        <button type="submit" className="fcSubmit" disabled={pending||issue.trim().length<12}>
          {pending?"Αξιολογούμε τις ανάγκες…":"Δες το πλάνο σου"}{!pending&&<ArrowRight size={19}/>}
        </button>
        {error&&<p role="alert" className="fcError">{error}</p>}
      </form>:<div className="fcResult" aria-live="polite">
        <div className="fcFormTop"><span><Check size={18}/> Το πλάνο σου</span><span>{result.processing==="model_assisted"?"AI-ASSISTED":"GUIDED RULES"}</span></div>
        <h3>{result.plan.heading}</h3><p className="fcRationale">{result.plan.rationale}</p>
        <ol>{result.plan.steps.map((step,i)=><li key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{step}</p></li>)}</ol>
        <div className="fcQuestion"><ClipboardList size={18}/><span><strong>Η επόμενη ερώτηση</strong>{result.plan.question}</span></div>
        <p className="fcCaution"><ShieldCheck size={17}/>{result.plan.caution}</p>
        <div className="fcResultActions">
          <button type="button" className="fcReset" onClick={()=>{setResult(null);setError("");}}><RotateCcw size={16}/> Νέα περιγραφή</button>
          {result.plan.equipmentAllowed&&result.plan.suggestedGoal&&<button className="fcSubmit" type="button" onClick={()=>onExplore(result.plan.suggestedGoal!)}>Εξατομίκευση εξοπλισμού <ArrowRight size={17}/></button>}
        </div>
        <small>Δεν εμφανίζονται μη επαληθευμένες προσφορές ως διαθέσιμα προϊόντα. Η εκτίμηση δεν είναι ιατρική διάγνωση.</small>
      </div>}
    </div>
  </div>
 </section>;
}
