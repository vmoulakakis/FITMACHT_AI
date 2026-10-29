"use client";
import {useMemo,useState} from "react";
import {ArrowUpRight,ArrowRight,ArrowLeft,Activity,MoveUpRight,SlidersHorizontal,Check,ChevronRight,Search,Command,ShieldCheck,Footprints,Dumbbell,Moon,MapPin,Database,Plus,RotateCcw,X,ExternalLink} from "lucide-react";
import {painGroups,targetItems,matchTargets} from "@/lib/mikromove-data";
import type {TargetItem} from "@/lib/mikromove-data";
type SourceExample={id:string;title:string;price:number;category:string;imageUrl:string|null;observedAt:string};
type Mode="discover"|"match"|"library"|"evidence";
const firstCategory=painGroups[0].id;
const sourceGroups:Record<string,string>={
 "walking-pad":"Walking pad","treadmill":"Διάδρομος","exercise-bike":"Ποδήλατο",
 "adjustable-dumbbells":"Ρυθμιζόμενοι αλτήρες","fixed-dumbbells":"Βαράκια",
 "resistance-bands":"Λάστιχα αντίστασης","weight-bench":"Πάγκος"
};
const currency=(n:number)=>n.toLocaleString("el-GR",{style:"currency",currency:"EUR"});
const painsIcons=["01","02","03","04","05","06","07","08","09","10"];
export default function MikroMove({examples}:{examples:SourceExample[]}){
 const [mode,setMode]=useState<Mode>("discover");
 const [pain,setPain]=useState(firstCategory);
 const [compact,setCompact]=useState(true);
 const [quiet,setQuiet]=useState(true);
 const [budget,setBudget]=useState("100-300");
 const [step,setStep]=useState(0);
 const [query,setQuery]=useState("");
 const [group,setGroup]=useState("all");
 const [showSources,setShowSources]=useState(false);
 const [saved,setSaved]=useState<string[]>([]);
 const selected=painGroups.find(g=>g.id===pain)||painGroups[0];
 const match=useMemo(()=>matchTargets(pain,compact?"compact":"flexible",quiet),[pain,compact,quiet]);
 const filtered=useMemo(()=>targetItems.filter(t=>(group==="all"||t.group===group)&&t.name.toLocaleLowerCase("el-GR").includes(query.toLocaleLowerCase("el-GR"))),[group,query]);
 const relevant=examples.filter(e=>selected.categories.includes(e.category));
 const toggle=(id:string)=>setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
 const show=(next:Mode)=>{setMode(next);setShowSources(false)};
 const saveText=()=>{const names=targetItems.filter(t=>saved.includes(t.id)).map(t=>t.id+" — "+t.name).join("\n");if(names&&typeof navigator!=="undefined"&&navigator.clipboard)void navigator.clipboard.writeText("MIKRO/MOVE · shortlist προς έρευνα\n"+names);};
 const itemCard=(t:TargetItem,idx:number)=> <article className="mm-solution" key={t.id}>
   <div className="mm-solution-top"><span>{t.id}</span><button className={"mm-icon-btn"+(saved.includes(t.id)?" mm-selected":"")} aria-label={saved.includes(t.id)?"Αφαίρεση από shortlist":"Προσθήκη στη shortlist"} onClick={()=>toggle(t.id)}><Plus size={17}/></button></div>
   <div className="mm-solution-index">{String(idx+1).padStart(2,"0")}</div>
   <h3>{t.name}</h3><p>{painGroups.find(g=>g.id===t.group)?.check}</p>
   <div className="mm-solution-foot"><span>ΠΡΟΪΟΝ-ΣΤΟΧΟΣ / SOURCING</span><span className="mm-dot"/></div>
 </article>;
 return <div className="mm-root">
  <header className="mm-header">
   <a href="/mikromove" className="mm-logo" aria-label="MIKRO MOVE αρχική"><span className="mm-logomark"><Activity size={22} strokeWidth={2.4}/></span><span>MIKRO<span className="mm-slash">/</span>MOVE<small>INTELLIGENT LIVING LAB</small></span></a>
   <nav className="mm-nav" aria-label="Πλοήγηση">
    <button className={mode==="discover"?"active":""} onClick={()=>show("discover")}>Η ιδέα</button>
    <button className={mode==="match"?"active":""} onClick={()=>show("match")}>AI επιλογή</button>
    <button className={mode==="library"?"active":""} onClick={()=>show("library")}>100 λύσεις</button>
    <button className={mode==="evidence"?"active":""} onClick={()=>show("evidence")}>Μεθοδολογία</button>
   </nav>
   <button className="mm-header-cta" onClick={()=>{setStep(0);show("match")}}>Βρες τη λύση σου <ArrowUpRight size={16}/></button>
  </header>
  <div className="mm-site-body">
   {mode==="discover"&&<main className="mm-discover">
    <div className="mm-hero">
      <div className="mm-hero-copy">
        <div className="mm-kicker"><span className="mm-live-dot"/> Ο ΕΛΛΗΝΙΚΟΣ ΟΔΗΓΟΣ ΕΞΥΠΝΗΣ ΕΥΕΞΙΑΣ <span>— 01/04</span></div>
        <h1>ΛΙΓΟΣ<br/>ΧΩΡΟΣ<span className="mm-period">.</span><br/><em>ΠΟΛΛΗ</em><br/>ΖΩΗ<span className="mm-period">.</span></h1>
        <p>Πιο πολλή κίνηση. Καλύτερη καθημερινότητα. Λιγότερες άσκοπες αγορές. <strong>Δεν πουλάμε προϊόντα στην τύχη — βρίσκουμε λύσεις που ταιριάζουν στη ζωή σου.</strong></p>
        <div className="mm-actions"><button onClick={()=>{setStep(0);show("match")}} className="mm-primary">Ξεκίνα με το πρόβλημά σου <ArrowUpRight size={19}/></button><button className="mm-secondary" onClick={()=>show("library")}>Ανακάλυψε 100 ιδέες <ArrowRight size={17}/></button></div>
        <div className="mm-hero-bottom"><span><ShieldCheck size={15}/> Χωρίς εγγραφή</span><span><Database size={15}/> Πηγές με ημερομηνίες</span><span><Command size={15}/> Ελληνικό AI matching</span></div>
      </div>
      <div className="mm-art" role="img" aria-label="Αφηρημένη τρισδιάστατη εικαστική σύνθεση μικρού χώρου και καθημερινής κίνησης">
       <div className="mm-art-grid"/><div className="mm-halo h1"/><div className="mm-halo h2"/>
       <div className="mm-pill-object"><span className="mm-pill-lid"/><span className="mm-pill-edge"/></div>
       <div className="mm-art-card top"><span>SPACE<br/>CHECK</span><strong>01:1</strong><small>ΠΡΩΤΑ Ο ΧΩΡΟΣ</small></div>
       <div className="mm-art-card bottom"><span>MICRO<br/>MOVES</span><strong>20′</strong><small>Ο ΔΙΚΟΣ ΣΟΥ ΡΥΘΜΟΣ</small></div>
       <div className="mm-art-label">DESIGNED FOR REAL LIFE · 2026</div>
      </div>
    </div>
    <div className="mm-problem-strip"><div><small>ΔΕΝ ΞΕΚΙΝΑΜΕ ΑΠΟ ΤΟ ΠΡΟΪΟΝ</small><b>Τι σε δυσκολεύει σήμερα;</b></div><div className="mm-problem-chips">{painGroups.slice(0,5).map(g=><button key={g.id} onClick={()=>{setPain(g.id);setStep(1);show("match")}}>{g.short} <ArrowUpRight size={13}/></button>)}</div></div>
    <div className="mm-facts"><span><b>10</b> καθημερινά προβλήματα</span><span><b>100</b> εξειδικευμένοι στόχοι έρευνας</span><span><b>{examples.length}</b> ιστορικές εγγραφές προϊόντων</span><span className="mm-facts-warning">Δεν είναι 100 επαληθευμένες προσφορές.</span></div>
   </main>}
   {mode==="match"&&<main className="mm-workspace">
    <div className="mm-work-left">
     <div className="mm-section-tag">01 / SMART MATCH ENGINE</div>
     <h2>Δεν χρειάζεται<br/><em>να ψάχνεις στα τυφλά.</em></h2>
     <p>Τρεις μικρές επιλογές. Μια προσωπική διαδρομή για λύσεις με πραγματικό νόημα.</p>
     <div className="mm-steps" aria-label="Πρόοδος">{[0,1,2].map(i=><button key={i} aria-label={"Βήμα "+(i+1)} className={i===step?"active":i<step?"done":""} onClick={()=>setStep(i)}>{i<step?<Check size={15}/>:String(i+1).padStart(2,"0")}</button>)}</div>
     {step===0?<div className="mm-chooser"><h3>Τι θέλεις να αλλάξεις;</h3><div className="mm-choices">{painGroups.map((g,i)=><button onClick={()=>setPain(g.id)} className={pain===g.id?"chosen":""} key={g.id}><span>{painsIcons[i]}</span>{g.title}<ChevronRight size={16}/></button>)}</div></div>:
      step===1?<div className="mm-chooser"><h3>Πώς είναι η καθημερινότητά σου;</h3><p className="mm-help">Χρησιμοποιούμε τις απαντήσεις μόνο εδώ για την επιλογή, όχι για προφίλ διαφήμισης.</p>
       <div className="mm-setting"><b>Ο χώρος σου</b><div className="mm-toggle-row"><button className={compact?"active":""} onClick={()=>setCompact(true)}>Μικρός / στενός</button><button className={!compact?"active":""} onClick={()=>setCompact(false)}>Έχω ευελιξία</button></div></div>
       <div className="mm-setting"><b>Θόρυβος</b><div className="mm-toggle-row"><button className={quiet?"active":""} onClick={()=>setQuiet(true)}>Πρέπει να είναι ήσυχα</button><button className={!quiet?"active":""} onClick={()=>setQuiet(false)}>Δεν είναι προτεραιότητα</button></div></div>
       <div className="mm-setting"><b>Ενδεικτικό budget</b><div className="mm-toggle-row">{["έως 100","100-300","300+"].map(k=><button className={budget===k?"active":""} key={k} onClick={()=>setBudget(k)}>{k==="έως 100"?"Έως 100€":k==="300+"?"300€+": "100–300€"}</button>)}</div></div>
      </div>:
      <div className="mm-chooser mm-result-info"><span className="mm-overline">ΠΡΟΣΩΠΙΚΗ ΔΙΑΔΡΟΜΗ</span><h3>{selected.title}</h3><p>{selected.pain}. Αναζήτησε λύσεις με βάση: <b>{selected.check.toLocaleLowerCase("el-GR")}</b>.</p><div className="mm-result-legend"><span className="mm-legend-square"/> Οι παρακάτω λύσεις είναι προφίλ προς έρευνα, όχι αγοραστικές προσφορές.</div>
       <button onClick={()=>setShowSources(x=>!x)} className="mm-sources-button">{showSources?"Κλείσε":"Δες"} τις {relevant.length} συναφείς πραγματικές καταχωρίσεις <ArrowRight size={16}/></button>
      </div>}
     <div className="mm-wizard-footer"><button disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}><ArrowLeft size={17}/> Πίσω</button>{step<2?<button className="mm-next" onClick={()=>setStep(s=>s+1)}>Συνέχεια <ArrowRight size={17}/></button>:<button className="mm-next" onClick={()=>{setStep(0);setShowSources(false)}}><RotateCcw size={17}/> Από την αρχή</button>}</div>
    </div>
    <div className="mm-work-right"><div className="mm-right-head"><span>EDITED BY NEED, NOT BY ADS</span><span>MIKRO/MOVE · FIT INTELLIGENCE</span></div>
     <div className="mm-recommendations"><h3>{step===2?selected.short+" / Δυνατές λύσεις":"Η πρόταση αλλάζει καθώς επιλέγεις"}</h3><div className="mm-top3">{match.slice(0,3).map((t,i)=>itemCard(t,i))}</div>
      {showSources&&<div className="mm-sourced"><div className="mm-sourced-head"><h4>Αληθινές εγγραφές της βάσης</h4><button onClick={()=>setShowSources(false)} aria-label="Κλείσιμο"><X size={19}/></button></div>{relevant.length?relevant.slice(0,6).map(x=><div key={x.category+"-"+x.id} className="mm-source-row"><div>{x.imageUrl?<img src={x.imageUrl} loading="lazy" alt={x.title}/>:<Dumbbell size={18}/>}</div><span>{x.title}<small>{sourceGroups[x.category]} · 22/10/2026 · μη επιβεβαιωμένη διαθεσιμότητα</small></span><b>{currency(x.price)}</b></div>):<p>Δεν βρέθηκε συναφής εγγραφή στην τρέχουσα δημόσια βάση. Δεν θα επινοήσουμε προϊόν ή τιμή.</p>}</div>}
     </div>
     <p className="mm-side-note">Σημείωση: δεν κάνουμε ιατρικές διαγνώσεις ή υποσχέσεις θεραπείας. Η καταλληλότητα οργάνων εξαρτάται και από τις προσωπικές σου ανάγκες.</p>
    </div>
   </main>}
   {mode==="library"&&<main className="mm-library"><div className="mm-library-head"><div><span className="mm-section-tag">02 / OPPORTUNITY ATLAS</span><h2>100 ΔΥΣΚΟΛΕΣ<br/><em>ΑΛΛΑ ΧΡΗΣΙΜΕΣ</em> ΛΥΣΕΙΣ<span className="mm-period">.</span></h2><p>100 ακριβή προφίλ προϊόντων για αναζήτηση και αξιολόγηση. <b>Δεν είναι 100 εγκεκριμένα affiliate SKU.</b> Η κατάταξη ξεκινά από το πρόβλημα, όχι την προμήθεια.</p></div><div className="mm-count-ring"><b>100</b><span>SOURCING<br/>TARGETS</span></div></div>
    <div className="mm-filters"><label><Search size={19}/><input placeholder="Αναζήτησε ανάγκη ή προϊόν..." value={query} onChange={e=>setQuery(e.target.value)} aria-label="Αναζήτηση στόχων"/></label><select aria-label="Κατηγορία προβλήματος" value={group} onChange={e=>setGroup(e.target.value)}><option value="all">Και οι 10 ανάγκες</option>{painGroups.map(g=><option key={g.id} value={g.id}>{g.title}</option>)}</select><div className="mm-saved"><span>{saved.length} στη shortlist</span><button disabled={!saved.length} onClick={saveText}>Αντιγραφή <ExternalLink size={13}/></button></div></div>
    <div className="mm-library-meta"><span>Εμφανίζονται {filtered.length} / 100 ερευνητικοί στόχοι</span><span>ΠΗΓΗ: MARKET GAP FRAMEWORK · ΟΧΙ LIVE INVENTORY</span></div>
    <div className="mm-solutions-grid">{filtered.map((t,i)=>itemCard(t,i))}</div>
   </main>}
   {mode==="evidence"&&<main className="mm-evidence"><div className="mm-section-tag">03 / PROOF BEFORE PROMOTION</div><h2>ΧΩΡΙΣ ΕΙΚΟΝΙΚΕΣ<br/><em>ΠΡΟΣΦΟΡΕΣ.</em></h2><div className="mm-evidence-grid"><section><span>01 / ΖΗΤΗΣΗ</span><h3>Η έλλειψη χρόνου και η αδράνεια είναι υπαρκτές.</h3><p>Το Ευρωβαρόμετρο του Σεπτεμβρίου 2026 δείχνει ότι το 65% των ερωτηθέντων στην Ελλάδα δεν ασκείται ποτέ. Αυτό δεν μετρά αγοραστική ζήτηση για τα συγκεκριμένα προϊόντα.</p><a href="https://sport.ec.europa.eu/whats-new/news/strong-increase-in-active-commuting-and-some-positive-changes-in-sport-and-exercise-habits-latest-special-eurobarometer-shows" target="_blank" rel="noreferrer">Ευρωπαϊκή Επιτροπή <ArrowUpRight size={14}/></a></section>
     <section><span>02 / ΠΡΟΒΛΗΜΑ</span><h3>Το προϊόν δεν είναι η λύση από μόνο του.</h3><p>Οι εργαζόμενοι αναφέρουν δυσκολίες στη ξεκούραση και στον ύπνο. Δεν ισχυριζόμαστε ότι κάποιο gadget θεραπεύει την αϋπνία ή την κούραση.</p><a href="https://minobi.gr/" target="_blank" rel="noreferrer">MINOBI · Έρευνα εργαζομένων <ArrowUpRight size={14}/></a></section>
     <section><span>03 / ΕΦΟΔΙΑΣΜΟΣ</span><h3>Αληθινό inventory ή καθαρό sourcing status.</h3><p>Η βάση SocialMarket/Linkwise περιλαμβάνει υπάρχουσες ιστορικές εγγραφές, αλλά δεν έχουμε 100 επιβεβαιωμένες προσφορές. Κάθε τιμή χρειάζεται νέο έλεγχο, κάθε προμήθεια ισχύοντες όρους εμπόρου.</p><button onClick={()=>show("library")}>Οι 100 στόχοι <ArrowRight size={16}/></button></section>
     <section><span>04 / ΣΕΒΑΣΜΟΣ</span><h3>Ελληνικό περιεχόμενο με αναγνωρίσιμες πηγές.</h3><p>Χωρίς ψεύτικα reviews, ατεκμηρίωτα «best», δήθεν stock, «έκπτωση μόνο σήμερα» ή μη επιβεβαιωμένες εγγυήσεις. Η αγοραστική ροή ενεργοποιείται μόνο όταν έχουν πιστοποιηθεί τα πραγματικά προϊόντα.</p><button onClick={()=>{setStep(0);show("match")}}>Δοκίμασε το matching <ArrowRight size={16}/></button></section></div></main>}
  </div>
  <footer className="mm-footer"><span>MIKRO/MOVE © 2026</span><span>POWERED BY HUMAN NEEDS · MARKET INTELLIGENCE</span><a href="/methodology">FITMATCH LAB · Η ΠΑΛΑΙΟΤΕΡΗ ΜΕΘΟΔΟΛΟΓΙΑ</a></footer>
 </div>;
}
