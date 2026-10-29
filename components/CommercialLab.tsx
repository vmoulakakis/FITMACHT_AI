"use client";
import {useState} from "react";
import {ArrowLeft,SlidersHorizontal,ShieldAlert,ExternalLink,CheckCircle2,XCircle,Info} from "lucide-react";
import {screenCandidate,rateScenario} from "@/lib/mikromove-commercial";
import type {ScreenedCandidate} from "@/lib/mikromove-commercial";
export default function CommercialLab({items}:{items:ScreenedCandidate[]}){
 const [scope,setScope]=useState("all");
 const [sort,setSort]=useState("relevance");
 const [onlyCandidate,setOnlyCandidate]=useState(true);
 const screened=items.map(screenCandidate);
 const suitable=(c:ReturnType<typeof screenCandidate>)=>/exercise-bike|rowing-machine|weight-bench|adjustable-dumbbells/.test(c.category);
 const visible=screened.filter(c=>(scope==="all"||c.category===scope)&&(!onlyCandidate||c.passesIndicativeFloor)).sort((a,b)=>{
  if(sort==="price")return a.priceEur-b.priceEur;
  if(sort==="estimate")return (b.indicativeEur||0)-(a.indicativeEur||0);
  return Number(suitable(b))-Number(suitable(a)) || a.priceEur-b.priceEur;
 });
 const count=screened.filter(c=>c.passesIndicativeFloor).length;
 return <main className="mml-root">
  <header className="mml-nav"><a href="/mikromove"><ArrowLeft size={16}/> MIKRO/MOVE</a><span>RESEARCH / COMMERCIAL INTELLIGENCE</span></header>
  <div className="mml-container">
   <div className="mml-eyebrow">SUPPLIER DISCOVERY · 29/10/2026</div>
   <div className="mml-intro"><div><h1>ΟΧΙ ΑΛΛΑ<br/><em>ΤΥΧΑΙΑ</em> ΠΡΟΪΟΝΤΑ.</h1><p>Συστηματικό sourcing από ιστορικά feeds και ερευνημένες δημόσιες σελίδες εμπόρων. Η οικονομική διαλογή προηγείται της προώθησης. Το κατάλληλο προϊόν προηγείται της προμήθειας.</p></div><div className="mml-bigstat"><strong>{count}</strong><span>ΥΠΟΨΗΦΙΑ ΜΕ<br/>ΣΕΝΑΡΙΟ ≥10€</span><small>0 εγκεκριμένα<br/>για affiliate προώθηση</small></div></div>
   <section className="mml-disclosure"><ShieldAlert size={21}/><div><strong>Ερευνητικά δεδομένα, όχι εμπορικές προσφορές.</strong><p>Οι προβλεπόμενες αποδόσεις είναι μόνο αριθμητικό <b>σενάριο</b> με παλιό καταγεγραμμένο ποσοστό {rateScenario.archivedPercent}% για τον συγκεκριμένο merchant (17/09/2026), υποθετική αφαίρεση ΦΠΑ {rateScenario.assumedVatPercent}% και πρόσθετη συντηρητική παρακράτηση {rateScenario.reservePercent}%. <b>Δεν έχει επιβεβαιωθεί program ID, έγκριση, τρέχον ποσοστό ή πραγματική πληρωμή.</b> Δεν εμφανίζονται affiliate κουμπιά μέχρι να τα επαληθεύσουμε.</p></div></section>
   <div className="mml-metrics"><span><b>{items.length}</b> πραγματικές καταχωρίσεις προς έρευνα</span><span><b>{extraCount(items)}</b> νέες από σελίδα merchant</span><span><b>€10</b> στόχος ελάχιστης προβλεπόμενης απόδοσης</span><span><b>0</b> αποδεδειγμένα εγκεκριμένες προμήθειες</span></div>
   <section className="mml-toolbar"><label><SlidersHorizontal size={17}/> Κατηγορία <select value={scope} onChange={e=>setScope(e.target.value)}><option value="all">Όλος ο εξοπλισμός</option>{[...new Set(items.map(x=>x.category))].sort().map(k=><option key={k} value={k}>{k}</option>)}</select></label><label>Κατάταξη<select value={sort} onChange={e=>setSort(e.target.value)}><option value="relevance">Καταλληλότητα μικρού χώρου</option><option value="price">Χαμηλότερη τιμή</option><option value="estimate">Υψηλότερο υποθετικό ποσό</option></select></label><label className="mml-toggle"><input type="checkbox" checked={onlyCandidate} onChange={e=>setOnlyCandidate(e.target.checked)}/> Μόνο ≥10€ στο συντηρητικό σενάριο</label></section>
   <div className="mml-results"><span>Βρέθηκαν {visible.length} υποψήφια από {items.length} παρατηρήσεις</span><span>LAST SOURCE CHECK · OCT 2026</span></div>
   <div className="mml-grid">{visible.map((c,i)=><article className="mml-card" key={c.id}><div className="mml-top"><span>RESEARCH #{String(i+1).padStart(2,"0")}</span><span>{c.source==="historical_feed"?"HISTORICAL CD104":"MERCHANT PAGE"}</span></div><div className="mml-image">{c.imageUrl?<img loading="lazy" alt={c.title} src={c.imageUrl}/>:<span>{c.category.replaceAll("-"," ").toUpperCase()}</span>}</div><h2>{c.title}</h2><div className="mml-price"><span>{c.priceEur.toLocaleString("el-GR",{style:"currency",currency:"EUR"})}</span><small>Τιμή πηγής · {new Date(c.sourceDate).toLocaleDateString("el-GR")}</small></div><div className="mml-commission"><span>{c.passesIndicativeFloor?<CheckCircle2 size={17}/>:<XCircle size={17}/>} {c.passesIndicativeFloor?"Περνά τον αριθμητικό έλεγχο":"Κάτω από το όριο"}</span><b>{c.indicativeEur?.toLocaleString("el-GR",{style:"currency",currency:"EUR"})||"—"}*</b></div><div className="mml-foot"><span><ShieldAlert size={13}/> Έγκριση & απόθεμα μη επιβεβαιωμένα</span>{c.source==="merchant_public_page"?<a href={c.sourcePage} target="_blank" rel="noreferrer">Πηγή έρευνας <ExternalLink size={13}/></a>:null}</div></article>)}</div>
   <div className="mml-note"><Info size={16}/><p>*Η αριθμητική εκτίμηση δεν αποτελεί εγγύηση, πρόβλεψη αποδοχών, επιβεβαίωση εμπορικής συνεργασίας ή σύσταση αγοράς. Μόνο μια επίσημα εγκεκριμένη προμήθεια ανά επιλέξιμο SKU θα επιτρέψει εμπορική προώθηση.</p></div>
  </div>
 </main>;
}
function extraCount(items:ScreenedCandidate[]){return items.filter(x=>x.source==="merchant_public_page").length;}
