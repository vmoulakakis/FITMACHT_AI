"use client";

import {useState} from "react";
import {
 Activity, ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown,
 Compass, Dumbbell, Footprints, HeartHandshake, Info, Layers3,
 Menu, Ruler, SearchCheck, ShieldCheck, SlidersHorizontal, Sparkles,
 Target, Wallet, X
} from "lucide-react";
import {goals,spaces,getFitCheckSuggestion,fitCheckAdvisorUrl,type Goal,type Space} from "@/lib/fitcheck";

type Preview={
 id:string;title:string;brand:string|null;imageUrl:string|null;observedAt:string;
 category:string;status:"unverified_feed_preview"|"historical_feed_preview"
};

const facts=[
 {index:"01",title:"Πρώτα η χρήση",description:"Κατανοούμε τι θέλεις να κάνεις, όχι ποιο μηχάνημα σου αρέσει σε μια φωτογραφία.",Icon:Target},
 {index:"02",title:"Έπειτα οι περιορισμοί",description:"Χώρος, θόρυβος, τρόπος άσκησης, προϋπολογισμός και αποθήκευση μπαίνουν στην απόφαση.",Icon:Ruler},
 {index:"03",title:"Τέλος η τεκμηρίωση",description:"Προτείνουμε κατηγορία με αιτιολόγηση. Προϊόντα προς αγορά εμφανίζονται μόνο μετά από έλεγχο.",Icon:SearchCheck}
];

export default function FitMatchHome({featured=[]}:{featured?:Preview[]}){
 const [goal,setGoal]=useState<Goal|null>(null);
 const [space,setSpace]=useState<Space|null>(null);
 const [mobileMenu,setMobileMenu]=useState(false);
 const match=goal&&space?getFitCheckSuggestion(goal,space):null;
 const ready=goal!==null&&space!==null;
 const proceed=()=>{if(goal&&space)window.location.assign(fitCheckAdvisorUrl({goal,space}));};
 return <div className="fmx">
  <a className="fmx-skip" href="#main">Μετάβαση στο κύριο περιεχόμενο</a>
  <header className="fmx-header">
   <div className="fmx-header-inner">
    <a className="fmx-logo" href="/" aria-label="FitMatch AI — αρχική"><span className="fmx-logo-symbol"><Activity size={20}/></span><span>fitmatch</span><span className="fmx-logo-dot">✳</span><small>AI</small></a>
    <nav id="fmx-menu" className={mobileMenu?"fmx-navigation is-open":"fmx-navigation"} aria-label="Κύρια πλοήγηση">
     <a href="#fitstart" onClick={()=>setMobileMenu(false)}>Βρες το Fit σου</a>
     <a href="#how" onClick={()=>setMobileMenu(false)}>Πώς λειτουργεί</a>
     <a href="#catalog" onClick={()=>setMobileMenu(false)}>Προϊόντα</a>
     <a href="/methodology" onClick={()=>setMobileMenu(false)}>Μεθοδολογία</a>
    </nav>
    <a className="fmx-header-cta" href="#fitstart">Ξεκίνα δωρεάν <ArrowUpRight size={17}/></a>
    <button type="button" className="fmx-mobile-menu" aria-label={mobileMenu?"Κλείσιμο μενού":"Άνοιγμα μενού"} aria-expanded={mobileMenu} aria-controls="fmx-menu" onClick={()=>setMobileMenu(x=>!x)}>{mobileMenu?<X size={23}/>:<Menu size={23}/>}</button>
   </div>
  </header>
  <main id="main">
   <section className="fmx-hero" aria-labelledby="hero-title">
    <div className="fmx-hero-inner">
     <div className="fmx-hero-copy">
      <div className="fmx-kicker"><span/> PERSONAL FITNESS INTELLIGENCE / ΕΛΛΑΔΑ</div>
      <h1 id="hero-title">Μην αγοράζεις<br/>απλώς εξοπλισμό.<br/><em>Βρες το Fit σου.</em></h1>
      <p className="fmx-lead">Ο σωστός εξοπλισμός εξαρτάται από το πώς ζεις, όχι μόνο από την τιμή του. Πες μας τον στόχο και τον χώρο σου. Θα προχωρήσουμε μαζί σε μια αιτιολογημένη επιλογή.</p>
      <div className="fmx-hero-actions"><a className="fmx-btn fmx-btn-lime" href="#fitstart">Ξεκίνα την αξιολόγηση <ArrowUpRight size={18}/></a><a className="fmx-btn fmx-btn-outline" href="#how">Δες τη διαδικασία <ArrowRight size={16}/></a></div>
      <div className="fmx-hero-notes"><span><Check size={16}/> Χωρίς εγγραφή</span><span><Check size={16}/> Χωρίς υποχρεωτική αγορά</span><span><Check size={16}/> Ελληνικός οδηγός</span></div>
      <div className="fmx-hero-signature"><span>FIT / 001</span><span className="fmx-fingerprint" aria-hidden="true">✳</span><span>ΑΠΟΦΑΣΕΙΣ ΜΕ ΚΡΙΤΗΡΙΑ</span></div>
     </div>
     <section id="fitstart" className="fmx-interactive" aria-labelledby="fmx-question-heading">
      <div className="fmx-interactive-top"><div><span className="fmx-interactive-eyebrow"><span className="fmx-status-dot"/> FITMATCH / QUICK START</span><h2 id="fmx-question-heading">Ας βρούμε τι <em>σου ταιριάζει.</em></h2></div><span className="fmx-interactive-symbol" aria-hidden="true"><SlidersHorizontal size={23}/></span></div>
      <div className="fmx-assessment-progress" aria-label="Δύο πρώτες ερωτήσεις από έξι"><span className="filled"/><span className={goal?"filled":""}/><span className={space?"filled":""}/><span/><span/><span/></div>
      <p className="fmx-assessment-hint">Δύο σύντομες επιλογές εδώ. Οι απαντήσεις σου μεταφέρονται στον πλήρη σύμβουλο — δεν τις ξαναγράφεις.</p>
      <fieldset className="fmx-selector">
       <legend><span>01</span> Τι θέλεις να πετύχεις;</legend>
       <div className="fmx-option-stack">{goals.map(g=><button type="button" key={g.id} onClick={()=>setGoal(g.id)} aria-pressed={goal===g.id} className={goal===g.id?"selected":""}><span className="fmx-option-dot">{goal===g.id?<Check size={15}/>:null}</span><span><strong>{g.label}</strong><small>{g.detail}</small></span></button>)}</div>
      </fieldset>
      <fieldset className="fmx-selector">
       <legend><span>02</span> Πόσο χώρο διαθέτεις;</legend>
       <div className="fmx-space-options">{spaces.map(s=><button type="button" key={s.id} onClick={()=>setSpace(s.id)} aria-pressed={space===s.id} className={space===s.id?"selected":""}><span aria-hidden="true" className={"fmx-space-mark "+s.id}><span/></span><strong>{s.label}</strong></button>)}</div>
      </fieldset>
      <div className="fmx-interactive-insight" aria-live="polite" aria-atomic="true">
       <span className="fmx-insight-label"><Sparkles size={15}/> ΠΡΩΤΗ ΕΝΔΕΙΞΗ</span>
       {match?<><h3>{match.title}</h3><p>{match.description}</p><small><ShieldCheck size={15}/>{match.check}</small></>:<p>Επίλεξε στόχο και χώρο για να εμφανιστεί μια πρώτη εξήγηση. Δεν είναι ακόμη τελική σύσταση.</p>}
      </div>
      <button type="button" className="fmx-assessment-cta" disabled={!ready} onClick={proceed}>Συνέχεια στο βήμα 3 από 6 <ArrowRight size={18}/></button>
      <p className="fmx-assessment-disclosure"><ShieldCheck size={14}/> Χωρίς σκορ που δεν τεκμηριώνεται · χωρίς ψεύτικες προσφορές.</p>
     </section>
    </div>
    <div className="fmx-hero-foot"><span>ONE PROCESS · INFORMED CHOICES</span><a href="#how">Μάθε πώς λειτουργεί <ChevronDown size={17}/></a></div>
   </section>

   <section id="how" className="fmx-method fmx-wrap">
    <div className="fmx-section-heading">
     <div><span className="fmx-eyebrow">ΤΟ FITMATCH ΣΕ ΤΡΙΑ ΣΤΑΔΙΑ</span><h2>Πρώτα καταλαβαίνουμε.<br/><em>Μετά προτείνουμε.</em></h2></div>
     <p>Η καλή εμπειρία αγοράς δεν ξεκινά με «best sellers». Ξεκινά με πραγματικά ερωτήματα.</p>
    </div>
    <div className="fmx-method-grid">{facts.map(f=>{const Icon=f.Icon;return <article key={f.index}><span className="fmx-method-number">{f.index} / 03</span><span className="fmx-method-icon"><Icon size={25}/></span><h3>{f.title}</h3><p>{f.description}</p></article>})}</div>
    <div className="fmx-method-action"><p><Info size={18}/> Η επιλογή κατηγορίας γίνεται με σαφείς κανόνες. Η τρέχουσα έκδοση δεν ισχυρίζεται ότι λειτουργεί αυτόνομος LLM agent.</p><a href="/methodology">Διάβασε τη μεθοδολογία <ArrowUpRight size={16}/></a></div>
   </section>

   <section id="catalog" className="fmx-catalog-area">
    <div className="fmx-wrap">
     <div className="fmx-section-heading">
      <div><span className="fmx-eyebrow">SOURCE-AUTHENTIC / LINKWISE DATA</span><h2>Αληθινές καταχωρίσεις.<br/><em>Όχι τεχνητή διαθεσιμότητα.</em></h2></div>
      <p>Τα δείγματα προέρχονται από καταχωρίσεις πηγής, όχι από φανταστικά προϊόντα. Η τρέχουσα διαθεσιμότητα και τιμή απαιτούν νέα επαλήθευση.</p>
     </div>
     {featured.length>0?<div className="fmx-preview-grid">{featured.slice(0,3).map(item=><article className="fmx-preview-product" key={item.id}>
      <div className="fmx-preview-media">{item.imageUrl?<img src={item.imageUrl} alt={item.title} loading="lazy" width={280} height={220}/>:<Dumbbell size={48} aria-label="Δεν υπάρχει εικόνα πηγής"/>}<span>ΑΝΕΠΙΒΕΒΑΙΩΤΗ ΚΑΤΑΧΩΡΙΣΗ</span></div>
      <div className="fmx-preview-body"><span className="fmx-preview-tag">FITNESS EQUIPMENT</span><h3>{item.title}</h3><p>Καταγραφή: {new Date(item.observedAt).toLocaleDateString("el-GR")} · Η διαθεσιμότητα δεν έχει επαληθευτεί.</p></div>
     </article>)}</div>:<div className="fmx-catalog-empty"><SearchCheck size={28}/><div><h3>Δεν εμφανίζονται ακόμη επαληθευμένα δείγματα καταλόγου.</h3><p>Η απουσία δεδομένων δεν αντικαθίσταται με ψεύτικα προϊόντα ή προσφορές.</p></div></div>}
     <div className="fmx-catalog-bottom"><span><ShieldCheck size={17}/> Ιστορική καταχώριση ≠ διαθέσιμη προσφορά αγοράς.</span><a href="/products">Εξερεύνησε τον κατάλογο <ArrowUpRight size={17}/></a></div>
    </div>
   </section>

   <section className="fmx-reality fmx-wrap"><div className="fmx-reality-copy"><span className="fmx-eyebrow">ΑΠΟ ΤΟ ΦΙΛΤΡΟ ΣΤΗΝ ΑΠΟΦΑΣΗ</span><h2>Το «ταιριάζει»<br/>χρειάζεται <em>αποδείξεις.</em></h2><p>Δεν αρκεί ένα όνομα προϊόντος. Πριν από σύνδεσμο αγοράς ελέγχουμε καταλληλότητα, τεχνικά χαρακτηριστικά και επιλεξιμότητα προσφοράς.</p><a href="#fitstart" className="fmx-btn fmx-btn-dark">Ξεκίνα από τον στόχο σου <ArrowUpRight size={17}/></a></div>
    <div className="fmx-proof" aria-label="Κριτήρια επιλογής"><div className="fmx-proof-header"><span><span className="fmx-status-dot"/> FITMATCH / DECISION MODEL</span><span>01—03</span></div><div className="fmx-proof-canvas"><div className="fmx-proof-ring ring-a"/><div className="fmx-proof-ring ring-b"/><div className="fmx-proof-cross"/><div className="fmx-proof-center"><Target size={35}/><strong>THE FIT</strong><small>ανάγκη × πραγματικά δεδομένα</small></div></div><div className="fmx-proof-row"><span><Ruler size={16}/> Χώρος & χρήσεις</span><CheckCircle2 size={17}/></div><div className="fmx-proof-row"><span><Wallet size={16}/> Προϋπολογισμός</span><CheckCircle2 size={17}/></div><div className="fmx-proof-row"><span><ShieldCheck size={16}/> Επαλήθευση πηγής</span><CheckCircle2 size={17}/></div></div>
   </section>

   <section className="fmx-next-area"><div className="fmx-wrap fmx-next-inner"><div><span className="fmx-eyebrow">ΠΕΡΙΣΣΟΤΕΡΟ ΑΠΟ ΤΗΝ ΑΓΟΡΑ</span><h2>Και αν το επόμενο βήμα<br/>δεν είναι <em>να αγοράσεις;</em></h2><p>Το FitMatch προσφέρει επίσης ένα ξεχωριστό, πληροφοριακό εργαλείο καθημερινής κίνησης και ένα 360° Studio για γενικές συνήθειες, διατροφή και PDF. Χωρίς ιατρικές υποσχέσεις.</p><div className="fmx-next-links"><a href="/next">Ανακάλυψε τη διαδρομή κίνησης <ArrowUpRight size={17}/></a><a href="/next/360">Άνοιξε το 360° Studio <ArrowUpRight size={17}/></a></div></div><div className="fmx-next-motif" aria-hidden="true"><span className="circle1"/><span className="circle2"/><span className="circle3"/><strong>360°</strong></div></div></section>

   <section className="fmx-faq fmx-wrap"><div><span className="fmx-eyebrow">FAQ / ΔΙΑΦΑΝΕΙΑ</span><h2>Μερικές σωστές ερωτήσεις.</h2></div><div className="fmx-faq-items">
    <details><summary>Είναι πραγματικά AI ή απλώς ένας κατάλογος; <ChevronDown size={18}/></summary><p>Σήμερα χρησιμοποιείται μια εξηγήσιμη μηχανή κανόνων και ασφαλών ελέγχων. Η ενεργοποίηση αυτόνομου AI agent είναι ξεχωριστό τεχνικό στάδιο και δεν παρουσιάζεται ως ήδη διαθέσιμη.</p></details>
    <details><summary>Γιατί δεν βλέπω πάντα προϊόντα προς αγορά; <ChevronDown size={18}/></summary><p>Η απουσία επαληθευμένων προσφορών είναι προτιμότερη από ψευδείς τιμές ή ανεπιβεβαίωτους συνδέσμους. Ο κατάλογος δειγμάτων δεν είναι live stock.</p></details>
    <details><summary>Χρειάζεται λογαριασμός ή αγορά; <ChevronDown size={18}/></summary><p>Όχι. Ο βασικός σύμβουλος μπορεί να χρησιμοποιηθεί χωρίς λογαριασμό και χωρίς υποχρέωση αγοράς.</p></details>
   </div></section>

   <section className="fmx-final"><div className="fmx-wrap"><span className="fmx-eyebrow">FITMATCH / START WITH YOUR NEED</span><h2>Η καλύτερη επιλογή<br/><em>ξεκινά από εσένα.</em></h2><a className="fmx-btn fmx-btn-lime" href="#fitstart">Βρες το Fit σου <ArrowUpRight size={17}/></a></div></section>
  </main>
  <footer className="fmx-footer"><div className="fmx-wrap fmx-footer-inner"><div><a href="/" className="fmx-logo"><span className="fmx-logo-symbol"><Activity size={19}/></span><span>fitmatch</span><span className="fmx-logo-dot">✳</span><small>AI</small></a><p>Ένας τεκμηριωμένος τρόπος να αξιολογείς fitness επιλογές. Όχι ηλεκτρονικό κατάστημα.</p></div><nav aria-label="Υποσέλιδο"><a href="/equipment">Σύμβουλος</a><a href="/products">Κατάλογος</a><a href="/next">Κίνηση</a><a href="/next/360">360° Studio</a><a href="/methodology">Μεθοδολογία</a><a href="/privacy">Απόρρητο</a></nav></div><div className="fmx-footer-meta fmx-wrap"><span>© 2026 FitMatch AI · Δοκιμαστική έκδοση</span><span>Affiliate links ενδέχεται να αποφέρουν προμήθεια, χωρίς επιπλέον κόστος αγοράς.</span></div></footer>
 </div>;
}
