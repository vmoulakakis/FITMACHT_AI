"use client";

import {useState} from "react";
import {
 Activity, ArrowRight, ArrowUpRight, Check, ChevronDown,
 ClipboardCheck, Compass, Dumbbell, HeartHandshake, Layers3, Menu,
 Ruler, ShieldCheck, SlidersHorizontal, Sparkles, Wallet, X
} from "lucide-react";

type Goal = "cardio" | "strength" | "mobility";
type Space = "compact" | "medium" | "open";
const goals: {id:Goal;label:string}[] = [
 {id:"cardio",label:"Αντοχή & cardio"},
 {id:"strength",label:"Ενδυνάμωση"},
 {id:"mobility",label:"Ήπια κίνηση"}
];
const spaces: {id:Space;label:string}[] = [
 {id:"compact",label:"Μικρός χώρος"},
 {id:"medium",label:"Μια ελεύθερη γωνιά"},
 {id:"open",label:"Άνετος χώρος"}
];
const suggestions:Record<Goal,Record<Space,{title:string;copy:string;check:string}>>={
 cardio:{
  compact:{title:"Μικρός χώρος, έξυπνη αερόβια επιλογή",copy:"Διερεύνησε συμπαγή ή πτυσσόμενο εξοπλισμό, αλλά μόνο όταν επιβεβαιωθούν οι διαστάσεις χρήσης και αποθήκευσης.",check:"Έλεγξε ελεύθερο χώρο, θόρυβο και επιτρεπόμενο φορτίο."},
  medium:{title:"Αερόβια άσκηση με προσοχή στις διαστάσεις",copy:"Ένα ποδήλατο γυμναστικής ή άλλη επιλογή cardio μπορεί να εξεταστεί ανάλογα με τις συνήθειες και το πραγματικό αποτύπωμα.",check:"Ζήτησε διαστάσεις λειτουργίας και ασφάλειας γύρω από το μηχάνημα."},
  open:{title:"Περισσότερες επιλογές, ίδια κριτήρια",copy:"Ο μεγαλύτερος χώρος διευρύνει τις κατηγορίες, αλλά η αντοχή, η συντήρηση και η συχνότητα χρήσης εξακολουθούν να έχουν προτεραιότητα.",check:"Σύγκρινε θόρυβο, ισχύ και πραγματική χρήση πριν από την αγορά."}
 },
 strength:{
  compact:{title:"Δύναμη χωρίς ογκώδες μηχάνημα",copy:"Ελαστικοί ιμάντες και ελεύθερα βάρη μικρού αποτυπώματος είναι κατηγορίες προς αξιολόγηση, όχι αυτόματη σύσταση αγοράς.",check:"Επιβεβαίωσε φορτίο, λαβή και ασφαλή τρόπο αποθήκευσης."},
  medium:{title:"Ευέλικτος χώρος ενδυνάμωσης",copy:"Διερεύνησε ρυθμιζόμενα βάρη ή πάγκο εφόσον οι πραγματικές διαστάσεις και ο διαθέσιμος χώρος το επιτρέπουν.",check:"Επιβεβαίωσε αντοχή δαπέδου και χώρο γύρω από τον εξοπλισμό."},
  open:{title:"Χτίσε τη λύση γύρω από τις ασκήσεις σου",copy:"Ο χώρος δεν δικαιολογεί από μόνος του μεγαλύτερη αγορά. Πρώτα καθόρισε τη χρήση και μετά αξιολόγησε το είδος του εξοπλισμού.",check:"Έλεγξε ασφάλεια, σταθερότητα και προοδευτική χρησιμότητα."}
 },
 mobility:{
  compact:{title:"Η καλύτερη αρχή μπορεί να είναι χωρίς αγορά",copy:"Ένα ασφαλές σημείο για ήπια δραστηριότητα μπορεί να είναι αρκετό. Δεν χρειάζεται πάντα πρόσθετος εξοπλισμός.",check:"Αν υπάρχει πόνος ή θεραπευτική ανάγκη, συμβουλεύσου επαγγελματία."},
  medium:{title:"Άνεση και ευκολία πριν από τα προϊόντα",copy:"Οργάνωσε μια μικρή ρουτίνα καθημερινής κίνησης. Τα βοηθήματα έχουν νόημα μόνο αν λύνουν συγκεκριμένο πρόβλημα.",check:"Έλεγξε προσβασιμότητα και ασφάλεια του χώρου."},
  open:{title:"Ο χώρος σου, ο δικός σου ρυθμός",copy:"Προτίμησε μια δραστηριότητα που απολαμβάνεις και μπορείς να διατηρήσεις. Ο εξοπλισμός είναι προαιρετικός.",check:"Μην επιλέγεις εξοπλισμό μόνο επειδή υπάρχει διαθέσιμος χώρος."}
 }
};

function Blueprint(){
 return <div className="fmx-blueprint" aria-label="Καλλιτεχνική απεικόνιση χώρου και εργαλείων σχεδιασμού">
  <div className="fmx-blueprint-top"><span className="fmx-bp-bullet"/><span>FITMATCH / SPACE INTELLIGENCE</span><span className="fmx-bp-mark">✳</span></div>
  <div className="fmx-visual" aria-hidden="true">
   <div className="fmx-orbit fmx-orbit-a"/><div className="fmx-orbit fmx-orbit-b"/>
   <svg viewBox="0 0 490 410" role="presentation" focusable="false">
    <defs><linearGradient id="fmx-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#dff1dd"/><stop offset="1" stopColor="#c5dacb"/></linearGradient></defs>
    <path d="M92 95L315 31L429 119L206 190Z" fill="#c4e3dc" opacity=".2"/>
    <path d="M87 201L302 119L428 202L207 297Z" fill="url(#fmx-grad)" stroke="#89b7af" strokeWidth="2"/>
    <path d="M207 297V333L428 239V202" fill="#8cb5a8" opacity=".55"/>
    <path d="M87 201V239L207 333V297" fill="#bad8c8"/>
    <path d="M132 188L304 128M160 210L332 147M190 232L358 165M117 227L328 149M160 255L373 173" stroke="#94b9ac" strokeWidth="1" opacity=".65"/>
    <ellipse cx="252" cy="205" rx="100" ry="42" fill="#14454a" opacity=".13"/>
    <path d="M180 195L290 155L334 183L224 226Z" fill="#e2eee7" stroke="#20515b" strokeWidth="3"/>
    <path d="M193 174L284 142L311 154L220 188Z" fill="#183e48"/>
    <path d="M194 174V195L220 209V188M220 188V209L311 174V154" fill="#345f66"/>
    <path d="M223 185V120C223 113 230 107 239 106L254 103C263 102 270 106 270 115V162" fill="none" stroke="#1e5056" strokeWidth="10" strokeLinecap="round"/>
    <path d="M240 106L263 101" stroke="#f17e68" strokeWidth="10" strokeLinecap="round"/>
    <rect x="244" y="157" width="40" height="11" rx="5" fill="#f17e68" transform="rotate(-20 244 157)"/>
    <circle cx="305" cy="215" r="16" fill="#ee8d76" stroke="#fff" strokeWidth="6"/>
    <circle cx="333" cy="203" r="14" fill="#17464d" stroke="#fff" strokeWidth="5"/>
    <path d="M357 70L378 61M378 61L372 82M378 61L388 80" stroke="#ee8d76" strokeWidth="4" strokeLinecap="round"/>
   </svg>
   <div className="fmx-float fmx-float-a"><Ruler size={17}/><span>Πρώτα οι πραγματικές<br/><b>διαστάσεις</b></span></div>
   <div className="fmx-float fmx-float-b"><ShieldCheck size={17}/><span>Διαφάνεια<br/><b>χωρίς υποθέσεις</b></span></div>
  </div>
  <div className="fmx-bp-bottom"><span>01 / ΚΑΤΑΝΟΗΣΗ</span><span>02 / ΚΑΤΑΛΛΗΛΟΤΗΤΑ</span><span>03 / ΕΠΙΛΟΓΗ</span></div>
 </div>;
}

export default function FitMatchHome(){
 const [goal,setGoal]=useState<Goal>("cardio");
 const [space,setSpace]=useState<Space>("compact");
 const [menuOpen,setMenuOpen]=useState(false);
 const selected=suggestions[goal][space];
 const close=()=>setMenuOpen(false);
 return <div className="fmx">
  <a className="fmx-skip" href="#fmx-content">Μετάβαση στο περιεχόμενο</a>
  <header className="fmx-header">
   <div className="fmx-header-inner">
    <a href="/" className="fmx-logo" aria-label="FitMatch AI — αρχική"><span className="fmx-logo-symbol"><Activity size={21}/></span>fitmatch<span className="fmx-logo-dot">✳</span><small>AI</small></a>
    <nav id="fmx-menu" className={menuOpen?"fmx-navigation is-open":"fmx-navigation"} aria-label="Κύρια πλοήγηση">
     <a onClick={close} href="#fmx-how">Πώς λειτουργεί</a>
     <a onClick={close} href="#fmx-explorer">Δοκίμασε το FitCheck</a>
     <a onClick={close} href="/products">Κατάλογος</a>
     <a onClick={close} href="/methodology">Μεθοδολογία</a>
    </nav>
    <a className="fmx-header-cta" href="/equipment">Ξεκίνα το matching <ArrowUpRight size={17}/></a>
    <button type="button" className="fmx-mobile-menu" aria-label={menuOpen?"Κλείσιμο μενού":"Άνοιγμα μενού"} aria-expanded={menuOpen} aria-controls="fmx-menu" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X size={24}/>:<Menu size={24}/>}</button>
   </div>
  </header>
  <main id="fmx-content">
   <section className="fmx-hero">
    <div className="fmx-hero-inner">
     <div className="fmx-hero-copy">
      <div className="fmx-kicker"><span/> SMARTER FITNESS DECISIONS · ΕΛΛΑΔΑ</div>
      <h1>Η σωστή επιλογή δεν αρχίζει από το <em>προϊόν.</em><br/><span>Αρχίζει από εσένα.</span></h1>
      <p className="fmx-lead">Ένας πιο έξυπνος τρόπος να βρεις εξοπλισμό και συνήθειες που ταιριάζουν πραγματικά στον χώρο, τον στόχο και την καθημερινότητά σου.</p>
      <div className="fmx-hero-actions"><a className="fmx-btn fmx-btn-lime" href="/equipment">Βρες τι σου ταιριάζει <ArrowUpRight size={19}/></a><a className="fmx-btn fmx-btn-outline" href="/next/360">Δημιούργησε πλάνο 360° <ArrowRight size={18}/></a></div>
      <div className="fmx-hero-notes"><span><Check size={17}/> Δωρεάν αξιολόγηση</span><span><Check size={17}/> Χωρίς λογαριασμό</span><span><Check size={17}/> Χωρίς πίεση αγοράς</span></div>
     </div>
     <Blueprint/>
    </div>
    <div className="fmx-hero-foot"><span>FITMATCH / HUMAN-FIRST INTELLIGENCE</span><a href="#fmx-paths">Εξερεύνησε τις επιλογές <ChevronDown size={18}/></a></div>
   </section>

   <section id="fmx-paths" className="fmx-paths fmx-wrap">
    <div className="fmx-section-heading"><div><span className="fmx-eyebrow">ΔΥΟ ΔΙΑΔΡΟΜΕΣ · ΕΝΑΣ ΣΤΟΧΟΣ</span><h2>Αυτό που χρειάζεσαι.<br/><em>Όχι περισσότερα απ' όσα χρειάζεσαι.</em></h2></div><p>Μπορείς να επιλέξεις εξοπλισμό ή να ξεκινήσεις με μικρές καθημερινές αλλαγές. Και οι δύο δρόμοι καταλήγουν σε πιο συνειδητές αποφάσεις.</p></div>
    <div className="fmx-path-grid">
     <a href="/equipment" className="fmx-path fmx-path-primary"><span className="fmx-card-tag">01 / BUYING ADVISOR</span><div className="fmx-path-icon"><Dumbbell size={31}/></div><h3>Βρες τον σωστό<br/>εξοπλισμό.</h3><p>Έξι απλές επιλογές για στόχο, χώρο, τρόπο άσκησης, θόρυβο, budget και αποθήκευση.</p><span className="fmx-path-link">Ξεκίνα την αξιολόγηση <ArrowUpRight size={20}/></span><span className="fmx-path-number">01</span></a>
     <a href="/next" className="fmx-path fmx-path-secondary"><span className="fmx-card-tag">02 / MOVEMENT JOURNEY</span><div className="fmx-path-icon"><HeartHandshake size={31}/></div><h3>Βρες τον δικό σου<br/>τρόπο κίνησης.</h3><p>Ξεκίνα από το τι σε δυσκολεύει, χωρίς σύγκριση, περιττές αγορές ή αυθαίρετες υποσχέσεις.</p><span className="fmx-path-link">Ανακάλυψε τη διαδρομή σου <ArrowUpRight size={20}/></span><span className="fmx-path-number">02</span></a>
    </div>
   </section>

   <section id="fmx-explorer" className="fmx-check-section">
    <div className="fmx-wrap fmx-check-layout">
     <div className="fmx-check-intro"><span className="fmx-eyebrow">LIVE INTERACTION · FITCHECK</span><h2>Δες πώς σκέφτεται ένα <em>καλύτερο matching.</em></h2><p>Διάλεξε στόχο και χώρο. Θα δεις μια πρώτη κατεύθυνση — όχι αυτόματη πρόταση προϊόντος. Ο πλήρης σύμβουλος ελέγχει επιπλέον περιορισμούς πριν καταλήξει.</p><div className="fmx-check-proof"><ClipboardCheck size={20}/> Χωρίς «μαγικά» scores ή ατεκμηρίωτα προϊόντα.</div></div>
     <div className="fmx-check-panel">
      <div className="fmx-check-heading"><span>FITCHECK / QUICK EXPLORE</span><SlidersHorizontal size={19}/></div>
      <fieldset><legend>01 / Τι θέλεις να πετύχεις;</legend><div className="fmx-chips">{goals.map(x=><button key={x.id} type="button" className={goal===x.id?"active":""} aria-pressed={goal===x.id} onClick={()=>setGoal(x.id)}>{x.label}</button>)}</div></fieldset>
      <fieldset><legend>02 / Πόσο χώρο διαθέτεις;</legend><div className="fmx-chips">{spaces.map(x=><button key={x.id} type="button" className={space===x.id?"active":""} aria-pressed={space===x.id} onClick={()=>setSpace(x.id)}>{x.label}</button>)}</div></fieldset>
      <div className="fmx-check-result" aria-live="polite" aria-atomic="true"><span><Sparkles size={17}/> ΕΝΔΕΙΚΤΙΚΗ ΚΑΤΕΥΘΥΝΣΗ</span><h3>{selected.title}</h3><p>{selected.copy}</p><div><ShieldCheck size={16}/>{selected.check}</div></div>
      <a href="/equipment" className="fmx-btn fmx-btn-dark fmx-check-action">Συνέχισε στον πλήρη σύμβουλο <ArrowUpRight size={19}/></a>
     </div>
    </div>
   </section>

   <section id="fmx-how" className="fmx-logic fmx-wrap"><div className="fmx-logic-head"><span className="fmx-eyebrow">ΤΟ ΜΟΝΤΕΛΟ ΑΠΟΦΑΣΗΣ</span><h2>Λιγότερη εικασία.<br/><em>Περισσότερη ουσία.</em></h2></div>
    <div className="fmx-logic-grid">
     <article><span className="fmx-logic-icon"><Ruler/></span><span>01 / SPACE</span><h3>Χωράει;</h3><p>Χώρος χρήσης, αποθήκευση και πραγματικές διαστάσεις — όχι μόνο ωραίες φωτογραφίες.</p></article>
     <article><span className="fmx-logic-icon"><Compass/></span><span>02 / PURPOSE</span><h3>Σου ταιριάζει;</h3><p>Στόχος, συνήθειες, θόρυβος και πρακτικά εμπόδια στην καθημερινότητά σου.</p></article>
     <article><span className="fmx-logic-icon"><Wallet/></span><span>03 / VALUE</span><h3>Αξίζει;</h3><p>Πραγματική τεκμηρίωση αντί για αυθαίρετη κατάταξη προϊόντων και τεχνητή βεβαιότητα.</p></article>
    </div>
   </section>

   <section className="fmx-360 fmx-wrap"><div className="fmx-360-inner"><div className="fmx-360-kicker"><Layers3 size={18}/> FITMATCH 360° STUDIO</div><h2>Κίνηση. Συνήθειες.<br/>Εξοπλισμός. <em>Στην ίδια εικόνα.</em></h2><p>Ένα ξεχωριστό εργαλείο γενικής ενημέρωσης, με προσωπικές επιλογές, συνοπτικό πλάνο και δυνατότητα PDF. Δεν αντικαθιστά επαγγελματική συμβουλή υγείας.</p><a className="fmx-btn fmx-btn-lime" href="/next/360">Άνοιξε το 360° Studio <ArrowUpRight size={19}/></a><div className="fmx-360-art" aria-hidden="true"><span className="fmx-360-ring r1"/><span className="fmx-360-ring r2"/><span className="fmx-360-ring r3"/><span className="fmx-360-center">360<span>°</span></span></div></div></section>

   <section className="fmx-transparency fmx-wrap"><div><span className="fmx-eyebrow">ΕΜΠΙΣΤΟΣΥΝΗ ΧΩΡΙΣ ΥΠΟΣΧΕΣΕΙΣ</span><h2>Τα δεδομένα έχουν σημασία.</h2><p>Ο κατάλογος περιλαμβάνει καταχωρίσεις πηγής που μπορεί να είναι ιστορικές. Δεν αποτελούν αυτομάτως διαθέσιμες προσφορές. Η εμφάνιση πραγματικών affiliate συνδέσμων απαιτεί επαλήθευση.</p></div><a className="fmx-text-link" href="/methodology">Δες τη μεθοδολογία και την affiliate ενημέρωση <ArrowUpRight size={19}/></a></section>

   <section className="fmx-final"><div className="fmx-wrap"><span className="fmx-eyebrow">READY WHEN YOU ARE</span><h2>Βρες αυτό που <em>πραγματικά</em><br/>σου ταιριάζει.</h2><div className="fmx-final-actions"><a className="fmx-btn fmx-btn-lime" href="/equipment">Ξεκίνα δωρεάν <ArrowUpRight size={19}/></a><a className="fmx-final-secondary" href="/next">Ή εξερεύνησε την κίνηση <ArrowRight size={17}/></a></div></div></section>
  </main>
  <footer className="fmx-footer"><div className="fmx-wrap fmx-footer-inner"><div><a href="/" className="fmx-logo"><span className="fmx-logo-symbol"><Activity size={18}/></span>fitmatch<span className="fmx-logo-dot">✳</span><small>AI</small></a><p>Human-first fitness intelligence. Πρώτα η ανάγκη, μετά η επιλογή.</p></div><nav aria-label="Υποσέλιδο"><a href="/equipment">Σύμβουλος αγοράς</a><a href="/next">Κίνηση</a><a href="/products">Κατάλογος</a><a href="/methodology">Μεθοδολογία</a><a href="/privacy">Απόρρητο</a></nav></div><div className="fmx-footer-meta fmx-wrap"><span>© 2026 FITMATCH AI · Staging / δοκιμαστική έκδοση</span><span>Οι επιλογές είναι ενημερωτικές, όχι ιατρική συμβουλή.</span></div></footer>
 </div>;
}
