"use client";

import {useState} from "react";
import {ArrowRight,ArrowUpRight,Check,ShieldCheck,Ruler,Footprints,Dumbbell,Bike,PackageCheck,Compass,Target,SlidersHorizontal,ArrowDown,LockKeyhole} from "lucide-react";

type Goal = "walking" | "strength" | "cardio";
type Preview = {id:string;title:string;brand:string|null;price:number;imageUrl:string|null;observedAt:string;status:"unverified_feed_preview"|"historical_feed_preview"};
type Props = {featured:Preview[];onStart:()=>void;onStartGoal:(goal:Goal)=>void};
const scenarios:Record<Goal,{name:string,title:string,desc:string,detail:string,icon:typeof Footprints}> = {
 walking:{name:"Περπάτημα",title:"Κίνηση στην καθημερινότητα",desc:"Ένας μικρός χώρος μπορεί να αλλάξει τον τρόπο που κινείσαι.",detail:"Ελέγχουμε διαστάσεις, αποθήκευση και θόρυβο.",icon:Footprints},
 strength:{name:"Ενδυνάμωση",title:"Δύναμη χωρίς υπερβολές",desc:"Δεν χρειάζεσαι απαραίτητα ολόκληρο γυμναστήριο στο σπίτι.",detail:"Αξιολογούμε φορτίο, ασφάλεια και ευελιξία.",icon:Dumbbell},
 cardio:{name:"Cardio",title:"Αντοχή με το δικό σου ρυθμό",desc:"Διάλεξε κατηγορία με βάση τον χώρο και τον τρόπο άσκησης.",detail:"Εξετάζουμε χρήση, κίνηση και πραγματικούς περιορισμούς.",icon:Bike}
};

export default function EditorialHome({featured,onStart,onStartGoal}:Props){
 const [goal,setGoal]=useState<Goal>("walking");
 const selected=scenarios[goal];
 const SelectedIcon=selected.icon;
 return <main className="fm-home">
   <section className="fm-hero" aria-labelledby="fm-hero-title">
     <div className="fm-container fm-hero__grid">
       <div className="fm-hero__copy">
         <div className="fm-kicker"><span className="fm-pulse"/> FITMATCH / SMART BUYING ADVISOR</div>
         <h1 id="fm-hero-title">Ο χώρος σου.<br/>Ο ρυθμός σου.<br/><em>Το δικό σου fit.</em></h1>
         <p className="fm-lead">Εξοπλισμός γυμναστικής που ξεκινά από <strong>εσένα</strong> — όχι από μια λίστα προϊόντων. Έξι απλές ερωτήσεις, μία τεκμηριωμένη κατεύθυνση πριν από οποιαδήποτε αγορά.</p>
         <div className="fm-hero__actions">
           <button type="button" className="fm-button fm-button--primary" onClick={onStart}>Βρες τι σου ταιριάζει <ArrowRight size={19}/></button>
           <a className="fm-button fm-button--outline" href="#fm-process">Δες πώς λειτουργεί <ArrowDown size={17}/></a>
         </div>
         <div className="fm-proof"><span><Check size={15}/> Χωρίς εγγραφή</span><span><Check size={15}/> Χωρίς υποχρεωτική αγορά</span><span><Check size={15}/> Διαφανή κριτήρια</span></div>
       </div>
       <div className="fm-preview" aria-label="Ενδεικτική οπτικοποίηση του τρόπου αξιολόγησης" >
         <div className="fm-preview__top"><div><span className="fm-micro">THE FIT WORKSPACE</span><b>Ένα σπίτι. Πολλές επιλογές.</b></div><span className="fm-preview__badge">CONCEPT / 01</span></div>
         <div className="fm-room">
           <span className="fm-room__label">ROOM PLANNING / ΠΑΡΑΔΕΙΓΜΑ</span>
           <div className="fm-room__diagram">
             <div className="fm-room__wall fm-room__wall--a"/>
             <div className="fm-room__wall fm-room__wall--b"/>
             <div className="fm-room__floor">
               <span className="fm-room__floorline fm-room__floorline--a"/>
               <span className="fm-room__floorline fm-room__floorline--b"/>
               <div className="fm-room__equipment"><SelectedIcon size={53} strokeWidth={1.45}/><span>{selected.name}</span></div>
             </div>
             <div className="fm-room__marker fm-room__marker--a"><Ruler size={13}/> ΧΩΡΟΣ</div>
             <div className="fm-room__marker fm-room__marker--b"><ShieldCheck size={13}/> ΑΝΑΓΚΕΣ</div>
           </div>
           <p className="fm-room__caption">Οπτικό παράδειγμα κατηγορίας, όχι έλεγχος πραγματικών διαστάσεων.</p>
         </div>
         <div className="fm-preview__bottom"><div className="fm-preview__identity"><span className="fm-mini-icon"><SelectedIcon size={21}/></span><div><small>ΕΞΕΤΑΖΟΥΜΕ</small><b>{selected.title}</b></div></div><span className="fm-preview__arrow"><ArrowUpRight size={20}/></span></div>
       </div>
     </div>
     <a href="#fm-scenarios" className="fm-scrollcue">DISCOVER THE FIT <ArrowDown size={15}/></a>
   </section>
   <section className="fm-standfirst"><div className="fm-container fm-standfirst__grid"><div className="fm-standfirst__index">01 / THE IDEA</div><p>Δεν έχει σημασία τι είναι <i>δημοφιλές.</i><br/>Σημασία έχει τι <strong>λειτουργεί για σένα.</strong></p><div className="fm-standfirst__side">FIT FIRST.<br/>SHOP SECOND.</div></div></section>
   <section className="fm-scenarios fm-container" id="fm-scenarios">
     <div className="fm-heading"><div><span className="fm-sectionlabel">START WITH YOUR GOAL / 02</span><h2>Πρώτα ο στόχος.<br/><em>Μετά ο εξοπλισμός.</em></h2></div><p>Επίλεξε τι θέλεις να κάνεις. Ο σύμβουλος θα σε καθοδηγήσει με ερωτήσεις για τον χώρο, τη χρήση και το budget σου.</p></div>
     <div className="fm-scenario-grid">{(Object.keys(scenarios) as Goal[]).map((key,index)=>{const s=scenarios[key];const Icon=s.icon;return <button key={key} type="button" onClick={()=>setGoal(key)} aria-pressed={goal===key} className={"fm-scenario"+(goal===key?" fm-scenario--active":"")}><span className="fm-scenario__head"><span>0{index+1} / {s.name.toUpperCase()}</span><ArrowUpRight size={19}/></span><span className="fm-scenario__icon"><Icon size={38} strokeWidth={1.4}/></span><strong>{s.title}</strong><small>{s.desc}</small></button>})}</div>
     <div className="fm-context"><div><SelectedIcon size={24}/><span><strong>{selected.name} · Προσωπική αξιολόγηση</strong><small>{selected.detail}</small></span></div><button className="fm-button fm-button--dark" type="button" onClick={()=>onStartGoal(goal)}>Συνέχισε με αυτόν τον στόχο <ArrowRight size={18}/></button></div>
   </section>
   <section className="fm-process" id="fm-process"><div className="fm-container"><div className="fm-heading fm-heading--light"><div><span className="fm-sectionlabel">HOW IT WORKS / 03</span><h2>Έξυπνη επιλογή.<br/><em>Καθαρή διαδικασία.</em></h2></div><p>Η πρόταση παράγεται από ελέγχους προτεραιοτήτων και περιορισμών. Αν δεν υπάρχουν επαληθευμένα προϊόντα, το δηλώνουμε ξεκάθαρα.</p></div>
     <div className="fm-process__grid"><article><div className="fm-process__number">01</div><Target size={27}/><h3>Καταλαβαίνουμε την ανάγκη</h3><p>Στόχος, διαθέσιμος χώρος, θόρυβος, budget και αποθήκευση.</p></article><article><div className="fm-process__number">02</div><SlidersHorizontal size={27}/><h3>Επιλέγουμε κατηγορία</h3><p>Προτεραιότητα στην καταλληλότητα — όχι στην ακριβότερη αγορά.</p></article><article><div className="fm-process__number">03</div><ShieldCheck size={27}/><h3>Ελέγχουμε τα δεδομένα</h3><p>Ξεχωρίζουμε τις σημερινές επαληθευμένες προσφορές από ιστορικά στοιχεία.</p></article></div>
   </div></section>
   <section className="fm-catalog fm-container" id="fm-catalog">
     <div className="fm-heading"><div><span className="fm-sectionlabel">THE EQUIPMENT EDIT / 04</span><h2>Πραγματικά προϊόντα.<br/><em>Χωρίς ψεύτικες βεβαιότητες.</em></h2></div><div className="fm-catalog__intro"><p>Εμφανίζουμε στοιχεία καταλόγου μόνο όταν προέρχονται από την πραγματική πηγή. Η ιστορική τιμή δεν είναι σημερινή προσφορά.</p><a href="/products">Άνοιγμα καταλόγου <ArrowUpRight size={18}/></a></div></div>
     {featured.length>0?<div className="fm-product-grid">{featured.slice(0,4).map((p)=><article className="fm-product" key={p.id}><div className="fm-product__image">{p.imageUrl?<img loading="lazy" src={p.imageUrl} alt={p.title} width="220" height="180"/>:<PackageCheck size={38}/>}<span>HISTORICAL DATA</span></div><div className="fm-product__body"><small>{p.brand||"Προϊόν καταλόγου"}</small><h3>{p.title}</h3><strong>{p.price.toLocaleString("el-GR",{maximumFractionDigits:2})} €</strong><p>Τιμή καταγραφής {new Date(p.observedAt).toLocaleDateString("el-GR")}. Διαθεσιμότητα μη επαληθευμένη.</p></div></article>)}</div>:<div className="fm-catalog-empty"><PackageCheck size={31}/><div><h3>Ο κατάλογος βρίσκεται σε διαδικασία επαλήθευσης</h3><p>Δεν παρουσιάζουμε ενδεικτικά προϊόντα ως διαθέσιμα προς αγορά χωρίς πραγματικά δεδομένα.</p></div><a href="/products">Δες τον κατάλογο <ArrowUpRight size={17}/></a></div>}
     <p className="fm-catalog__foot"><LockKeyhole size={15}/> Affiliate σύνδεσμοι μόνο μετά από ελέγχους διαθεσιμότητας, τιμής, χαρακτηριστικών και όρων συνεργασίας.</p>
   </section>
   <section className="fm-final"><div className="fm-container fm-final__inner"><div><span className="fm-sectionlabel">READY WHEN YOU ARE / 05</span><h2>Κάνε χώρο για<br/><em>τη σωστή κίνηση.</em></h2><p>Η επόμενη αγορά σου μπορεί να ξεκινήσει με μια πιο σωστή ερώτηση.</p></div><button className="fm-button fm-button--lime" type="button" onClick={onStart}>Ξεκίνα την αξιολόγηση <ArrowRight size={20}/></button></div></section>
 </main>;
}
