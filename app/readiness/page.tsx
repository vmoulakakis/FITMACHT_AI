import {catalog} from "@/lib/catalog";
import data from "@/data/source-readiness.json";
import Link from "next/link";
export const dynamic="force-dynamic";
export const metadata={title:"FITMATCH | Readiness cockpit",robots:{index:false,follow:false}};
const metrics=[
 ["Merchant sources",data.merchant_commission_source_records],
 ["With program ID",data.merchant_rows_with_program_id],
 ["Unmapped program IDs",data.merchant_rows_needing_program_crosswalk],
 ["Historical feed records",data.legacy_feed_rows],
 ["Source facts",data.product_facts],
 ["Verified specifications",data.product_specifications]
];
export default async function Page(){
 const c=await catalog();
 return <main style={{maxWidth:980,margin:"50px auto",padding:"0 22px 110px"}}>
 <Link href="/" style={{color:"#527a46",fontWeight:800}}>← FITMATCH AI</Link>
 <p className="overline" style={{marginTop:32}}>SOURCE-OF-TRUTH • AUDIT DASHBOARD</p>
 <h1 style={{fontSize:"clamp(32px,5vw,52px)",letterSpacing:-2,lineHeight:1.15}}>Τι υπάρχει πραγματικά στη βάση;</h1>
 <p style={{color:"#697969",lineHeight:1.85,maxWidth:760}}>Αυτή είναι η κατάσταση του data pipeline, όχι διαφημιστικός κατάλογος. Οι αριθμοί είναι στιγμιότυπο ελέγχου από {new Date(data.checked_at).toLocaleString("el-GR",{timeZone:"Europe/Athens"})}, ενώ η σύνδεση με τον κατάλογο ελέγχεται σε κάθε φόρτωση.</p>
 <section aria-label="Βασικά στοιχεία" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:12,margin:"30px 0"}}>
 {metrics.map(([label,value])=><div key={label} style={{background:"white",border:"1px solid #e2e9df",borderRadius:15,padding:22}}><strong style={{fontSize:29,color:"#173b2c"}}>{Number(value).toLocaleString("el-GR")}</strong><p style={{fontSize:12,color:"#6b7e6c"}}>{label}</p></div>)}
 </section>
 <section style={{background:"#fef9eb",border:"1px solid #eadeb9",borderRadius:14,padding:24}}>
 <h2 style={{marginTop:0,fontSize:22}}>Publication gate: BLOCKED</h2>
 <p style={{lineHeight:1.85}}>Πραγματικό status δημοσιεύσιμου FITMATCH catalog: <b>{c.mode}</b>. Επαληθευμένες εγγραφές που διαβάζει η εφαρμογή: <b>{c.offers.length}</b>. Οι 334 εγγραφές είναι πηγές προμηθειών προς έλεγχο, όχι εγκεκριμένοι merchants.</p>
 <p style={{fontSize:12,color:"#826b4b"}}>Δεν εγκρίνουμε αυτόματα merchants και δεν μετατρέπουμε metadata σε τεχνικές προδιαγραφές.</p>
 </section>
 <section style={{marginTop:38,lineHeight:1.95}}>
 <h2>Ακριβής σειρά αποκατάστασης</h2>
 <ol style={{paddingLeft:23,color:"#566b59"}}>
 <li>Επιβεβαίωση Linkwise program IDs και crosswalk για 317 μη αντιστοιχισμένες εγγραφές.</li>
 <li>Νέα εισαγωγή feed: τρέχον απόθεμα, ημερομηνία και fitness taxonomy.</li>
 <li>Επαλήθευση συγκεκριμένων τεχνικών προδιαγραφών από πρωτογενείς merchant πηγές.</li>
 <li>Έλεγχος κατώτατης προμήθειας τουλάχιστον 10€, αποκλεισμών και δικαιωμάτων προώθησης.</li>
 <li>Έγκριση SKU στον απομονωμένο πίνακα και επανάληψη end-to-end acceptance.</li>
 </ol>
 </section>
 </main>;
}
