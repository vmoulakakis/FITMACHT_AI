"use client";
import {useState} from "react";
type Candidate={id:number;title:string;merchant:string;price:number;image:string;at:string;kind:string;status:string};
export default function ResearchExplorer({products}:{products:Candidate[]}){
 const [kind,setKind]=useState("all"),[budget,setBudget]=useState("all"),[search,setSearch]=useState("");
 const rows=products.filter(x=>(kind==="all"||x.kind===kind)&&(budget==="all"||x.price<=Number(budget))&&x.title.toLowerCase().includes(search.toLowerCase()));
 return <section className="sourceExplorer">
  <div className="sourceControls"><div role="group" aria-label="Κατηγορίες προϊόντων">
   {([["all","Όλα"],["cardio","Cardio"],["strength","Ενδυνάμωση"]] as const).map(([v,t])=><button key={v} aria-pressed={kind===v} className={kind===v?"selected":""} onClick={()=>setKind(v)}>{t}</button>)}
  </div><input aria-label="Αναζήτηση μοντέλου" placeholder="Αναζήτηση μοντέλου..." value={search} onChange={e=>setSearch(e.target.value)}/>
  <label>Budget <select aria-label="Όριο τιμής" value={budget} onChange={e=>setBudget(e.target.value)}><option value="all">Όλες οι τιμές</option><option value="250">έως 250€</option><option value="500">έως 500€</option><option value="1000">έως 1000€</option></select></label></div>
  <p className="sourceCount">{rows.length} από {products.length} πραγματικά υποψήφια SKU</p>
  {rows.length?<div className="sourceGrid">{rows.map(x=><article key={x.id} className="sourceCard">
   <div className="sourcePhoto"><img src={x.image} alt={x.title} loading="lazy"/><span>UNDER REVIEW</span></div>
   <div className="sourceBody"><small>{x.merchant} · {x.kind.toUpperCase()}</small><h3>{x.title}</h3>
   <strong>{x.price.toLocaleString("el-GR",{style:"currency",currency:"EUR"})}</strong>
   <p>Τιμή προϊοντικού feed κατά τον έλεγχο. Δεν είναι επαληθευμένη προσφορά σήμερα.</p>
   <div className="sourceWarning">Σε έλεγχο: πραγματική προμήθεια ≥10€, έγκριση advertiser, τεχνικά specs και ισχύς tracking.</div></div>
  </article>)}</div>:<div className="sourceNoMatch">Δεν βρέθηκαν προϊόντα με αυτά τα φίλτρα.</div>}
 </section>;
}
