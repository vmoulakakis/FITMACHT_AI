import type {Metadata} from "next";
import {notFound} from "next/navigation";
import Link from "next/link";
import {ArrowRight,ArrowUpRight,CheckCircle2,CircleAlert,ShieldCheck,Sparkles,Activity,ExternalLink} from "lucide-react";
import {catalog} from "@/lib/catalog";
import {buyerReason,getStoreListings,topItems,storeCategories} from "@/lib/storefront";
export const dynamic="force-dynamic";
type Params={params:Promise<{id:string}>};
async function resolve(id:string){
 const c=await catalog();
 const all=getStoreListings(c.offers);
 return {product:all.find(x=>x.id===id),all};
}
export async function generateMetadata({params}:Params):Promise<Metadata>{
 const {id}=await params;const {product}=await resolve(id);
 return {title:product?(product.name+" | FITMATCH AI — Πριν αγοράσεις"):"FITMATCH AI | Δεν βρέθηκε προϊόν",
 description:product?("Αξιολόγηση "+product.name+": τιμή αναφοράς, έλεγχοι καταλληλότητας, εναλλακτικές και πραγματικό affiliate status."):"Ανακάλυψε προϊόντα fitness",
 robots:{index:false,follow:false}};
}
export default async function ProductPage({params}:Params){
 const {id}=await params;const {product,all}=await resolve(id);
 if(!product)notFound();
 const reason=buyerReason(product);
 const category=storeCategories().find(x=>x.id===product.category);
 const alternatives=topItems(all,product.category,"",Number.MAX_SAFE_INTEGER).filter(x=>x.id!==product.id).slice(0,3);
 const buy=product.affiliateEligible&&product.approved;
 return <main className="fmDetail">
  <nav className="fmDetailNav"><Link href="/" className="fmBrand"><span className="fmBrandIcon">F<span>✦</span></span><strong>FITMATCH <em>AI</em></strong></Link><div><Link href="/#categories">Κατηγορίες</Link><Link href="/#products">Προϊόντα</Link><Link href="/readiness">Επαλήθευση</Link></div></nav>
  <div className="fmDetailTrail"><Link href="/">Αρχική</Link><ArrowRight size={14}/><Link href="/#products">{category?.name||"Fitness"}</Link><ArrowRight size={14}/><span>{product.name}</span></div>
  <section className="fmDetailHero">
   <div className="fmDetailArt"><div className="fmDetailArtGlow"/>{product.image?<img src={product.image} alt={product.name}/>:<Activity size={105}/>}<span>PRODUCT RESEARCH · {product.approved?"VERIFIED":"UNDER REVIEW"}</span></div>
   <div className="fmDetailCopy"><p className="fmMiniKicker">FITMATCH AI / UNIQUE PRODUCT INTELLIGENCE</p><h1>{product.name}</h1><div className="fmDetailTags"><span>{category?.name||"Fitness"}</span><span>{product.merchant}</span><span>{product.approved?"VERIFIED AFFILIATE":"RESEARCH ONLY"}</span></div>
    <p className="fmDetailLead">{reason.headline}</p><p>{reason.why}</p><div className="fmDetailPrice"><strong>{product.price.toLocaleString("el-GR",{style:"currency",currency:"EUR"})}</strong><small>Τιμή καταγραφής στο Linkwise feed, όχι ζωντανή προσφορά · {new Date(product.observedAt).toLocaleDateString("el-GR")}</small></div>
    {buy?<a className="fmDetailBuy" href={"/api/out?id="+encodeURIComponent(product.id)} rel="sponsored nofollow noopener">Συνέχισε στον merchant με affiliate link <ExternalLink size={18}/></a>:<div className="fmDetailHold"><CircleAlert size={22}/><div><strong>Το affiliate link δεν έχει ακόμη εγκριθεί.</strong><p>Δεν έχει ολοκληρωθεί η επαλήθευση προμήθειας αυστηρά πάνω από 20€, επιτρεπτού merchant προγράμματος και τεχνικών χαρακτηριστικών αυτού του SKU.</p></div></div>}
    <p className="fmDetailAffiliate"><ShieldCheck size={15}/> Εάν εμφανιστεί κουμπί αγοράς, οδηγεί στον πραγματικό merchant με το εγκεκριμένο affiliate tracking link. Δεν αγοράζεις μέσα από το FITMATCH.</p>
   </div>
  </section>
  <section className="fmDetailChecks"><div><p className="fmMiniKicker">BUYER INTELLIGENCE</p><h2>Τι αξίζει να ελέγξεις;</h2><p>Δεν παρουσιάζουμε τεχνικά specs που δεν έχουν επιβεβαιωθεί. Αυτά είναι τα κρίσιμα σημεία για τη σωστή αγορά.</p><div className="fmCheckGrid">{reason.check.map((x,i)=><article key={x}><span>0{i+1}</span><CheckCircle2 size={23}/><strong>{x}</strong><small>Να τεκμηριωθεί στην πρωτογενή πηγή</small></article>)}</div></div><aside><h3><CircleAlert size={20}/> Τι πρέπει να γνωρίζεις</h3><p>{reason.caution}</p><h3><ShieldCheck size={20}/> Κατάσταση εμπορικής αξιολόγησης</h3><p>{buy?"Η προσφορά έχει περάσει τα υποχρεωτικά εμπορικά φίλτρα.":"Το προϊόν είναι πραγματικό εύρημα από προϊοντικό feed, όχι εγκεκριμένη πρόταση αγοράς. Η προμήθεια και οι τεχνικές παράμετροι παραμένουν υπό έλεγχο."}</p></aside></section>
  <section className="fmDetailAlternatives"><div><p className="fmMiniKicker">DON'T MISS A BETTER FIT</p><h2>Κοντινές εναλλακτικές</h2><p>Σχετικά πραγματικά προϊόντα για σύγκριση πριν αποφασίσεις.</p></div><div className="fmAltGrid">{alternatives.map(x=><Link href={"/products/"+encodeURIComponent(x.id)} key={x.id} className="fmAltCard"><div>{x.image?<img src={x.image} alt=""/>:<Sparkles size={39}/>}</div><strong>{x.name}</strong><span>{x.price.toLocaleString("el-GR",{style:"currency",currency:"EUR"})} <ArrowUpRight size={16}/></span><small>{x.affiliateEligible?"Verified affiliate":"Under review"}</small></Link>)}</div></section>
  <section className="fmDetailBottom"><h2>Κάνε την αγορά μόνο όταν είσαι σίγουρος.</h2><p>Κανένα τεχνητό χρονόμετρο, πλασματικό stock ή ανεπιβεβαίωτη έκπτωση. Η αξία είναι η σαφήνεια πριν από το κλικ.</p><Link href="/#products">Δες περισσότερα fitness προϊόντα <ArrowRight size={18}/></Link></section>
  <footer className="fmDetailFooter"><Link href="/">FITMATCH AI</Link><Link href="/methodology">Μεθοδολογία</Link><Link href="/privacy">Απόρρητο</Link><span>© 2026 · Staging preview</span></footer>
 </main>;
}
