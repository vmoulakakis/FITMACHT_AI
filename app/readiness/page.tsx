import {catalog} from "@/lib/catalog";
import legacy from "@/data/source-readiness.json";
import source from "@/data/fitness-sourcing-audit.json";
import Link from "next/link";
export const dynamic="force-dynamic";
export const metadata={title:"FITMATCH · Data Intelligence & Release Gate",robots:{index:false,follow:false}};
const cards=[
 ["Fitness candidates",source.candidate_rows],
 ["Unique merchants",source.merchant_count],
 ["High-ticket candidates",source.high_ticket_price_ge_150_eur],
 ["Needs program identity",source.unmapped_program_ids]
];
export default async function Page(){
 const c=await catalog();
 return <main style={{fontFamily:"Arial,sans-serif",background:"#070b15",color:"#eff2ff",minHeight:"100vh",padding:"44px 22px 110px"}}>
 <div style={{maxWidth:1050,margin:"auto"}}>
 <Link href="/" style={{color:"#bfabff",fontSize:13,fontWeight:800}}>← FITMATCH AI</Link>
 <p style={{fontSize:11,color:"#a694ff",letterSpacing:2,marginTop:36}}>AGENTIC SOURCING / OPERATIONAL INTELLIGENCE</p>
 <h1 style={{fontSize:"clamp(30px,5vw,56px)",letterSpacing:-2,lineHeight:1.14,margin:"17px 0 13px"}}>Τι ξέρει πραγματικά ο σύμβουλος;</h1>
 <p style={{color:"#9da9c2",maxWidth:750,lineHeight:1.85}}>Πραγματικά δεδομένα ελέγχου, όχι τεχνητά προϊόντα ή υποσχέσεις κερδών. Τελευταία αποτύπωση sourcing {new Date(source.checked_at).toLocaleString("el-GR",{timeZone:"Europe/Athens"})}. Οι αριθμοί sourcing είναι στιγμιότυπο, όχι live μετρητές βάσης.</p>
 <section aria-label="Sourcing metrics" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,margin:"35px 0"}}>
 {cards.map(([name,value])=><div key={name} style={{background:"linear-gradient(145deg,#1e2640,#101829)",border:"1px solid #394266",borderRadius:17,padding:24}}><strong style={{fontSize:34,color:"#d6c4ff"}}>{Number(value).toLocaleString("el-GR")}</strong><p style={{fontSize:12,color:"#b5bfd2",marginBottom:0}}>{name}</p></div>)}</section>
 <section style={{padding:27,borderRadius:18,border:"1px solid #66543c",background:"linear-gradient(135deg,#231d2d,#11192a)"}}>
 <p style={{color:"#ecc28e",letterSpacing:2,fontSize:11,fontWeight:800,margin:"0 0 8px"}}>PUBLICATION GATE — BLOCKED</p>
 <h2 style={{fontSize:23,margin:"4px 0 8px"}}>Agent έτοιμος για αξιολόγηση. Commerce υπό έλεγχο.</h2>
 <p style={{color:"#b9bed0",lineHeight:1.8}}>Live published catalog: <b>{c.mode}</b> · Εγκεκριμένα SKU: <b>{c.offers.length}</b>. Τα 36 υποψήφια προϊόντα είναι πραγματικές εγγραφές του feed, αλλά δεν έχουν επαληθευμένο affiliate program ID και πλήρη specs.</p>
 <p style={{color:"#a9b3c9",fontSize:12}}>Μόνο 3 από τα ερευνημένα SKU έχουν ιστορική ενδεικτική προμήθεια πάνω από 20€, χωρίς επαλήθευση συμβολαίου. Κανένα δεν είναι εγκεκριμένο για affiliate αγορά.</p>
 </section>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:22,marginTop:36}}>
 <section style={{padding:23,background:"#111929",border:"1px solid #293953",borderRadius:16}}>
 <h2 style={{fontSize:20}}>Τι βρήκαμε</h2>
 <p style={{color:"#b8c5db",lineHeight:1.8}}>Linkwise JSON: HTTP {source.source_http_status}. Merchants: <b>{source.merchant_names.join(" · ")}</b>.</p>
 <p style={{color:"#b8c5db",lineHeight:1.8}}>Προϊόντα: πάγκοι, αλτήρες, λάστιχα, διάδρομοι και ποδήλατα — υποψήφια προς έλεγχο, όχι επιλεγμένες προσφορές.</p>
 </section>
 <section style={{padding:23,background:"#111929",border:"1px solid #293953",borderRadius:16}}>
 <h2 style={{fontSize:20}}>Τα πραγματικά blockers</h2>
 <ol style={{color:"#b8c5db",lineHeight:1.95,paddingLeft:20}}>
 <li>Program ID και συγκεκριμένοι εμπορικοί όροι merchant.</li>
 <li>Τεκμηριωμένες τεχνικές προδιαγραφές ανά SKU.</li>
 <li>Πρόσφατη επαλήθευση price/stock και Linkwise tracking compliance.</li>
 <li>Ανεξάρτητη έγκριση δημοσίευσης προϊόντος.</li>
 </ol></section></div>
 <section style={{marginTop:30,padding:24,border:"1px solid #594675",borderRadius:15,background:"#201b32"}}>
 <p style={{fontSize:11,color:"#d5bcff",letterSpacing:1.5}}>REAL PRODUCT RESEARCH</p>
 <h2>10 συγκεκριμένα μοντέλα προς έλεγχο</h2>
 <p style={{lineHeight:1.8,color:"#c0bfd2"}}>Φωτογραφίες προϊόντων από τους merchants, καταγεγραμμένες τιμές και κατάσταση εμπορικής επαλήθευσης. Δεν δημοσιεύουμε affiliate αγορές πριν ολοκληρωθούν οι έλεγχοι.</p>
 <Link href="/research" style={{display:"inline-block",background:"#baa0ff",color:"#141526",fontWeight:800,padding:"12px 16px",borderRadius:10}}>Δες τα 10 πραγματικά προϊόντα ↗</Link>
 </section>
 <section style={{marginTop:36,padding:24,border:"1px solid #293953",borderRadius:16}}>
 <h2 style={{fontSize:19}}>Υφιστάμενο SocialMarket</h2>
 <p style={{color:"#9facbc",lineHeight:1.8}}>Στιγμιότυπο {new Date(legacy.checked_at).toLocaleDateString("el-GR")}: {legacy.legacy_feed_rows.toLocaleString("el-GR")} παλαιότερες offer εγγραφές, {legacy.merchant_commission_source_records} merchant commission records και {legacy.product_specifications} επαληθευμένα specs. Δεν αλλάξαμε την eligibility logic του SocialMarket.</p>
 </section>
 <p style={{fontSize:12,color:"#8e99ad",marginTop:26}}>Δεν υπάρχει αυτόματο production activation. Το FITMATCH κρατά το staging noindex μέχρι να κλείσουν οι εμπορικοί και τεχνικοί έλεγχοι.</p>
 </div></main>;
}