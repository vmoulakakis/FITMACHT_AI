import Link from "next/link";
import ResearchExplorer from "@/components/ResearchExplorer";
import items from "@/data/fitness-research-shortlist.json";
export const metadata={title:"FITMATCH | Real Product Research",robots:{index:false,follow:false}};
export default function Page(){return <main className="sourcePage">
 <nav className="sourceNav"><Link href="/">← FITMATCH AI</Link><Link href="/readiness">Data Intelligence ↗</Link></nav>
 <section className="sourceLead">
 <p>FITMATCH / MERCHANT INTELLIGENCE / RESEARCH STUDIO</p>
 <h1>Πραγματικά προϊόντα.<br/><em>Χωρίς πλασματικές αγορές.</em></h1>
 <p>Δέκα συγκεκριμένα προϊόντα από το Linkwise feed, με πραγματικές φωτογραφίες του merchant και καταγεγραμμένη τιμή. Εδώ τα ερευνούμε — δεν τα προωθούμε μέχρι να περάσουν το αυστηρό εμπορικό φίλτρο.</p>
 <div className="sourceFacts"><span>10 υψηλής αξίας υποψήφια</span><span>2 προγράμματα προς επιβεβαίωση</span><span>0 εγκεκριμένα affiliate offers</span></div></section>
 <ResearchExplorer products={items}/>
 <section className="sourceMethod"><h2>Γιατί δεν υπάρχει ακόμα κουμπί αγοράς;</h2>
 <p>Οι υποψήφιοι αριθμοί tracking 11706 (Mybrand.shoes) και 100 (Z-mall) δεν έχουν πιστοποιηθεί από Linkwise. Οι διαθέσιμες προμήθειες είναι ιστορικοί όροι και ενδέχεται να εξαιρούν προϊόντα ή κατηγορίες. Απαιτείται επίσης τεκμηρίωση specs ανά SKU, σημερινή διαθεσιμότητα και άδεια προώθησης της συγκεκριμένης ιστοσελίδας. Η εμφάνιση προϊόντος εδώ δεν αποτελεί πρόταση αγοράς.</p>
 </section></main>}