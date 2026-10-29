"use client";
import {useMemo,useState} from "react";
import {ArrowLeft,Search,ShieldAlert,ChevronLeft,ChevronRight,Dumbbell} from "lucide-react";
import type {CandidatePreview} from "@/lib/linkwise-preview";
type CatalogItem=CandidatePreview&{category:string};
const categories:Record<string,string>={
 "exercise-bike":"Ποδήλατα γυμναστικής",
 "treadmill":"Διάδρομοι",
 "walking-pad":"Walking pads",
 "adjustable-dumbbells":"Ρυθμιζόμενοι αλτήρες",
 "fixed-dumbbells":"Αλτήρες / βαράκια",
 "weight-bench":"Πάγκοι",
 "resistance-bands":"Λάστιχα αντίστασης",
 "elliptical":"Ελλειπτικά",
 "rowing-machine":"Κωπηλατικά",
 "home-gym":"Πολυόργανα",
 "kettlebells":"Kettlebells",
 "pull-up-bars":"Μονόζυγα / δίζυγα",
 "stepper":"Steppers",
 "exercise-mat":"Στρώματα yoga / γυμναστικής",
 "pilates-equipment":"Εξοπλισμός Pilates"
};
export default function ProductExplorer({items}:{items:CatalogItem[]}){
 const [category,setCategory]=useState("all"),[query,setQuery]=useState(""),[maxBudget,setMaxBudget]=useState("all"),[page,setPage]=useState(0);
 const filtered=useMemo(()=>items.filter(p=>
   (category==="all"||p.category===category)&&
   (maxBudget==="all"||p.price<=Number(maxBudget))&&
   (!query||p.title.toLocaleLowerCase("el-GR").includes(query.toLocaleLowerCase("el-GR")))
 ).sort((a,b)=>a.price-b.price),[items,category,query,maxBudget]);
 const pages=Math.max(1,Math.ceil(filtered.length/8)),current=Math.min(page,pages-1);
 const visible=filtered.slice(current*8,current*8+8);
 return <main className="catalogExplorer">
   <a href="/" className="catalogBack"><ArrowLeft size={16}/> Πίσω στον AI σύμβουλο</a>
   <div className="catalogHero"><div className="overline">FITMATCH AI · ΠΡΑΓΜΑΤΙΚΟΣ ΚΑΤΑΛΟΓΟΣ</div>
      <h1>Εξοπλισμός για το σπίτι. <em>Όχι τυχαία προϊόντα.</em></h1>
      <p>{items.length} πραγματικές εγγραφές fitness από τη δική μας βάση Linkwise. Οι τιμές και οι ενδείξεις διαθεσιμότητας είναι από τη στιγμή καταγραφής τους — όχι live προσφορές.</p>
      <div className="catalogCaution"><ShieldAlert size={18}/> Η προμήθεια, η σημερινή διαθεσιμότητα και οι τεχνικές προδιαγραφές δεν έχουν ακόμη επαληθευτεί. Γι' αυτό δεν εμφανίζονται κουμπιά αγοράς.</div>
   </div>
   <div className="catalogFilters">
     <label className="catalogSearch"><Search size={18}/><input aria-label="Αναζήτηση προϊόντος" placeholder="Μάρκα ή είδος…" value={query} onChange={e=>{setQuery(e.target.value);setPage(0)}}/></label>
     <label className="catalogSelect">Κατηγορία <select value={category} onChange={e=>{setCategory(e.target.value);setPage(0)}}><option value="all">Όλες ({items.length})</option>{Object.entries(categories).map(([k,v])=>items.some(x=>x.category===k)?<option key={k} value={k}>{v} ({items.filter(x=>x.category===k).length})</option>:null)}</select></label>
     <label className="catalogSelect">Budget <select value={maxBudget} onChange={e=>{setMaxBudget(e.target.value);setPage(0)}}><option value="all">Όλες οι τιμές</option><option value="50">Έως 50€</option><option value="120">Έως 120€</option><option value="250">Έως 250€</option><option value="500">Έως 500€</option><option value="1000">Έως 1.000€</option></select></label>
   </div>
   <div className="catalogResultCount">Βρέθηκαν <b>{filtered.length}</b> προϊόντα · Σελίδα {current+1}/{pages}</div>
   <div className="catalogCards">{visible.map(p=><article className="catalogCard" key={p.category+"-"+p.id}>
     <div className="catalogCardPicture">{p.imageUrl?<img src={p.imageUrl} width="210" height="155" alt={p.title} loading="lazy"/>:<Dumbbell size={36}/>}</div>
     <div className="catalogCardBody"><small className="catalogCategory">{categories[p.category]||p.category}</small><h2>{p.title}</h2><b>{p.price.toLocaleString("el-GR",{minimumFractionDigits:2,maximumFractionDigits:2})}€</b><small>Τιμή καταγραφής {new Date(p.observedAt).toLocaleDateString("el-GR")}</small><span className="catalogStock">Όχι επαληθευμένη σημερινή προσφορά</span></div>
   </article>)}</div>
   {visible.length===0&&<p className="catalogEmpty">Δεν υπάρχουν καταχωρίσεις με αυτά τα φίλτρα. Δοκίμασε άλλη κατηγορία ή μεγαλύτερο budget.</p>}
   <div className="catalogPagination"><button type="button" disabled={current===0} onClick={()=>setPage(x=>Math.max(0,x-1))}><ChevronLeft size={16}/> Προηγούμενη</button><span>{current+1} / {pages}</span><button type="button" disabled={current>=pages-1} onClick={()=>setPage(x=>x+1)}>Επόμενη <ChevronRight size={16}/></button></div>
 </main>;
}
