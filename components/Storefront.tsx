"use client";
import {useMemo,useState} from "react";
import {Activity,ArrowRight,ArrowUpRight,BarChart3,Bike,Check,CheckCircle2,ChevronRight,CircleAlert,Dumbbell,ExternalLink,Flower2,House,Search,ShieldCheck,ShoppingBag,SlidersHorizontal,Sparkles,TrendingUp,Wallet,X} from "lucide-react";
import {storeCategories,topItems,merchantAudit,type Listing,type CategoryId} from "@/lib/storefront";
import FitQuiz from "@/components/FitQuiz";

const categoryIcons={cardio:Activity,strength:Dumbbell,"home-gym":House,recovery:Flower2,accessories:ShoppingBag};
const money=(x:number)=>x.toLocaleString("el-GR",{style:"currency",currency:"EUR"});
const heroImage="https://cdn.creativeclaw.co/u/cfc13856/images/6b08545e-b428-41b3-b733-2b4f0f84fa32.png";

function ProductThumb({item,className}:{item:Listing;className?:string}){
 const [failed,setFailed]=useState(false);
 const Icon=categoryIcons[item.category];
 return <div className={"shopProductThumb "+(className||"")}><div className="shopProductFallback" aria-hidden="true"><Icon size={58} strokeWidth={1.15}/></div>
 {item.image&&!failed&&<img src={item.image} alt={item.name} loading="lazy" onError={()=>setFailed(true)}/>}</div>;
}
export default function Storefront({products,catalogMode}:{products:Listing[];catalogMode:string}){
 const [category,setCategory]=useState<CategoryId|"all">("all");
 const [query,setQuery]=useState("");
 const [budget,setBudget]=useState(600);
 const [showAll,setShowAll]=useState(false);
 const [mobileMenu,setMobileMenu]=useState(false);
 const categories=storeCategories();
 const merchantData=useMemo(()=>merchantAudit(products),[products]);
 const visible=useMemo(()=>topItems(products,category,query,budget),[products,category,query,budget]);
 const shown=visible.slice(0,showAll?24:5);
 const verified=products.filter(x=>x.affiliateEligible);
 const featured=products.filter(p=>p.category!=="accessories").sort((a,b)=>b.price-a.price).filter((p,i,arr)=>arr.findIndex(x=>x.kind===p.kind)===i).slice(0,4);
 function navigateProducts(next:CategoryId|"all"="all"){
  setCategory(next);setShowAll(false);
  requestAnimationFrame(()=>document.getElementById("products")?.scrollIntoView({behavior:"smooth",block:"start"}));
 }
 return <div className="fmFinal">
  <header className="fmNav">
   <a className="fmBrand" href="/" aria-label="FITMATCH AI Αρχική"><span className="fmBrandIcon">F<span>✦</span></span><strong>FITMATCH <em>AI</em></strong></a>
   <nav className={mobileMenu?"fmNavLinks open":"fmNavLinks"} aria-label="Κύριο μενού">
    <a href="#how" onClick={()=>setMobileMenu(false)}>Πώς λειτουργεί</a>
    <a href="#categories" onClick={()=>setMobileMenu(false)}>Κατηγορίες</a><a href="#fit-quiz" onClick={()=>setMobileMenu(false)}>AI Match</a>
    <a href="#products" onClick={()=>setMobileMenu(false)}>Προϊόντα</a>
    <a href="#merchants" onClick={()=>setMobileMenu(false)}>Merchants</a>
   </nav>
   <div className="fmNavActions"><button type="button" className="fmSearchIcon" aria-label="Μετάβαση στην αναζήτηση" onClick={()=>navigateProducts()}><Search size={21}/></button>
    <button className="fmNavCta" type="button" onClick={()=>navigateProducts()}>Βρες προϊόν <ArrowRight size={16}/></button>
    <button className="fmHamburger" type="button" aria-label={mobileMenu?"Κλείσιμο μενού":"Άνοιγμα μενού"} onClick={()=>setMobileMenu(!mobileMenu)}>{mobileMenu?<X size={22}/>:<SlidersHorizontal size={22}/>}</button>
   </div>
  </header>
  <main>
   <section className="fmHero" aria-labelledby="fmHeroTitle">
    <div className="fmHeroBg" aria-hidden="true"></div><div className="fmHeroShade" aria-hidden="true"></div>
    <div className="fmHeroInner">
     <div className="fmHeroCopy">
      <p className="fmEyebrow"><span className="fmSignal"/> SMARTER FITNESS SHOPPING WITH AI</p>
      <h1 id="fmHeroTitle">FITMATCH <em>AI</em></h1>
      <h2>Το κατάλληλο fitness προϊόν.<br/><span>Όχι άλλη λάθος αγορά.</span></h2>
      <p className="fmHeroDesc">Εξερευνούμε πραγματικά προϊόντα, αξιολογούμε τη συνάφειά τους με τον στόχο σου και συγκρίνουμε τις διαθέσιμες επιλογές. Κάθε προϊόν έχει τη δική του landing page με όσα πρέπει να ξέρεις.</p>
      <div className="fmTrustBar">
       <div><Wallet size={22}/><span><b>Προμήθεια &gt;20€</b><small>μόνο όταν επαληθευτεί</small></span></div>
       <div><BarChart3 size={22}/><span><b>AI-fit επιλογές</b><small>με εξήγηση και εναλλακτικές</small></span></div>
       <div><ShieldCheck size={22}/><span><b>Χωρίς fake offers</b><small>ελεγμένο status αγοράς</small></span></div>
      </div>
      <form className="fmHeroSearch" onSubmit={e=>{e.preventDefault();navigateProducts(category);}}>
       <Search size={20}/><input aria-label="Τι fitness προϊόν αναζητάς;" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Τι προϊόν χρειάζεσαι; Π.χ. ποδήλατο ή αλτήρες"/><button type="submit">Αναζήτηση <ArrowRight size={15}/></button>
      </form>
      <div className="fmHeroButtons"><button type="button" className="fmBigCta" onClick={()=>navigateProducts()}>Βρες το προϊόν μου <ArrowRight size={18}/></button><button type="button" className="fmOutline" onClick={()=>document.getElementById("categories")?.scrollIntoView({behavior:"smooth"})}>Δες κατηγορίες</button></div>
      <p className="fmHeroDisclosure">* Στο σημερινό feed υπάρχουν υποψήφια SKU· κανένα δεν χαρακτηρίζεται εγκεκριμένο affiliate offer χωρίς έλεγχο όρων και tracking.</p>
     </div>
     <div className="fmHeroPreview">
      <div className="fmPreviewFrame">
       <div className="fmPreviewHeader"><b>F<span>✦</span> FITMATCH AI</b><span><Sparkles size={14}/> PRODUCT INTELLIGENCE</span></div>
       <div className="fmPreviewSearch"><Search size={15}/> Ανακάλυψε πραγματικά προϊόντα… <ArrowRight size={15}/></div>
       <div className="fmPreviewProducts">{featured.map(x=><a key={x.id} href={"/products/"+encodeURIComponent(x.id)}><ProductThumb item={x}/><b>{x.name}</b><small>{money(x.price)} · τιμή feed</small><span>Δες αν ταιριάζει <ArrowUpRight size={13}/></span></a>)}</div>
       <p><CheckCircle2 size={14}/> Πραγματικές εγγραφές feed · Χωρίς κατασκευασμένα reviews ή commissions</p>
      </div>
      <div className="fmFloatingCommission"><span>✦</span><strong>&gt;20€</strong><small>VERIFIED<br/>PAYOUT ONLY</small></div>
     </div>
    </div>
   </section>

   <section id="categories" className="fmSection fmCategorySection">
    <div className="fmSectionTitle"><div><p className="fmMiniKicker">FIND YOUR FIT</p><h2>Δημοφιλείς fitness κατηγορίες</h2><p>Πες μας ποιος είναι ο στόχος σου. Τα προϊόντα θα ταξινομηθούν με βάση την ανάγκη σου.</p></div><button className="fmTextAction" onClick={()=>navigateProducts()}>Όλα τα προϊόντα <ArrowRight size={16}/></button></div>
    <div className="fmCategoryGrid">{categories.map(c=>{
      const Icon=categoryIcons[c.id];const n=products.filter(x=>x.category===c.id).length;
      return <button type="button" className={"fmCategoryCard cat-"+c.id} key={c.id} onClick={()=>navigateProducts(c.id)}>
       <div className="fmCategoryArt"><Icon size={57} strokeWidth={1.2}/><span className="fmCategoryGlow"/></div>
       <div className="fmCategoryDetails"><span className="fmCategoryIcon"><Icon size={21}/></span><strong>{c.name}</strong><small>{c.subtitle}</small><span className="fmCategoryAvailable">{n?n+" ερευνημένα προϊόντα":"Κατηγορία υπό εμπλουτισμό"}</span><span className="fmCategoryArrow"><ArrowRight size={16}/></span></div>
      </button>;
    })}</div>
   </section>

   <FitQuiz products={products}/>
   <section id="how" className="fmSection fmHow"><div className="fmSectionTitle"><div><p className="fmMiniKicker">THE FITMATCH METHOD</p><h2>Πώς λειτουργεί το FITMATCH AI</h2><p>Μια ξεκάθαρη διαδρομή από την ανάγκη σου μέχρι την απόφαση αγοράς.</p></div></div>
    <div className="fmHowSteps">{[
     {Icon:Search,title:"Επιλογή κατηγορίας",desc:"Πες τι χρειάζεσαι."},
     {Icon:BarChart3,title:"Αξιολόγηση merchants",desc:"Ελέγχουμε πραγματικά στοιχεία."},
     {Icon:Sparkles,title:"Ranking προϊόντων",desc:"Συνάφεια, budget και όρια."},
     {Icon:ShoppingBag,title:"Μοναδική landing page",desc:"Οφέλη, κίνδυνοι, εναλλακτικές."},
     {Icon:ExternalLink,title:"Στον merchant",desc:"Μόνο με επιβεβαιωμένο affiliate link."}
    ].map((s,i)=><div className="fmHowStep" key={i}><span className="fmHowNumber">{i+1}</span><div className="fmHowIcon"><s.Icon size={28}/></div><strong>{s.title}</strong><small>{s.desc}</small>{i<4&&<ArrowRight className="fmHowArrow" size={23}/>}</div>)}</div>
   </section>

   <section id="merchants" className="fmSection fmMerchants"><div className="fmSectionTitle"><div><p className="fmMiniKicker">TRUST BEFORE COMMISSIONS</p><h2>Merchants με στόχο προμήθεια &gt;20€</h2><p>Το ranking δεν επινοεί score, δημοτικότητα ή εμπορικούς όρους.</p></div></div>
    {verified.length>0?<div className="fmMerchantGrid">{merchantData.filter(m=>m.approved>0).map((m,i)=><div className="fmMerchantCard" key={m.name}><span className="fmMerchantBadge">#{i+1} · VERIFIED</span><h3>{m.name}</h3><p>{m.approved} επαληθευμένες ενεργές προσφορές με προμήθεια &gt;20€</p><button type="button" onClick={()=>{setQuery(m.name);navigateProducts();}}>Προβολή προϊόντων <ArrowRight size={14}/></button></div>)}</div>:
    <div className="fmMerchantsHold"><div className="fmHoldIcon"><ShieldCheck size={30}/></div><div><strong>Δεν υπάρχει ακόμη merchant με επαληθευμένη προμήθεια πάνω από 20€.</strong><p>Έχουμε εντοπίσει πραγματικούς merchants, αλλά πρέπει να επιβεβαιωθούν συμμετοχή στο πρόγραμμα, όροι, εξαιρέσεις και προμήθεια ανά προϊόν. Δεν θα εμφανίσουμε ψεύτικους νικητές ή βαθμολογίες.</p></div></div>}
    <div className="fmResearchMerchantGrid">{merchantData.map(m=><div className="fmMerchantResearch" key={m.name}><span>MERCHANT SOURCE · ΥΠΟ ΕΛΕΓΧΟ</span><strong>{m.name}</strong><small>{m.count} προϊόντα στο ερευνητικό δείγμα · {m.approved} εγκεκριμένα &gt;20€</small></div>)}</div>
   </section>

   <section id="products" className="fmSection fmProducts"><div className="fmSectionTitle"><div><p className="fmMiniKicker">REAL PRODUCTS / NO FAKE RATINGS</p><h2>Fitness προϊόντα για τη δική σου ανάγκη</h2><p>Εξερεύνησε πραγματικά SKU. Όταν δεν υπάρχει εγκεκριμένη προσφορά, εμφανίζουμε την ανάλυση — όχι ψεύτικο κουμπί αγοράς.</p></div><span className="fmFilterCount">{visible.length} σχετικές επιλογές</span></div>
    <div className="fmProductFilters"><div className="fmFilterPills"><button type="button" className={category==="all"?"selected":""} aria-pressed={category==="all"} onClick={()=>setCategory("all")}>Όλα</button>{categories.map(c=><button type="button" key={c.id} className={category===c.id?"selected":""} aria-pressed={category===c.id} onClick={()=>setCategory(c.id)}>{c.name}</button>)}</div>
     <div className="fmBudgetFilter"><label htmlFor="fm-budget">Μέχρι {money(budget)}</label><input id="fm-budget" type="range" min={50} max={2500} step={50} value={budget} onChange={e=>setBudget(Number(e.target.value))}/></div>
     <label className="fmInlineSearch"><Search size={17}/><input aria-label="Φίλτρο ονομασίας προϊόντος" placeholder="Αναζήτηση προϊόντος" value={query} onChange={e=>setQuery(e.target.value)}/></label>
    </div>
    {shown.length>0?<div className="fmProductGrid">{shown.map((x,i)=><article className="fmProductCard" key={x.id}>
       <span className="fmProductRank">#{i+1}</span><ProductThumb item={x}/>
       <div className="fmProductContent"><span className="fmProductMerchant">{x.merchant} · {categories.find(c=>c.id===x.category)?.name}</span><h3>{x.name}</h3><p className="fmProductPrice">{money(x.price)} <small>καταγραφή feed</small></p>
        <div className={"fmProductStatus "+(x.affiliateEligible?"published":"research")}>{x.affiliateEligible?<><CheckCircle2 size={13}/> Εγκεκριμένη affiliate προσφορά</>:<><CircleAlert size={13}/> Επαλήθευση προμήθειας σε εκκρεμότητα</>}</div>
        <a href={"/products/"+encodeURIComponent(x.id)} className="fmProductButton">Άνοιξε τη μοναδική ανάλυση <ArrowRight size={15}/></a>
       </div></article>)}</div>:
       <div className="fmNoResults"><Sparkles size={29}/><h3>Δεν υπάρχουν καταγεγραμμένα προϊόντα με αυτόν τον συνδυασμό.</h3><p>Δοκίμασε πιο κοντινή κατηγορία, περισσότερη ευελιξία στο budget ή άλλη αναζήτηση. Δεν εμφανίζουμε πλασματικές καταχωρίσεις.</p><button onClick={()=>{setCategory("all");setQuery("");setBudget(2500)}}>Εξερεύνησε όλες τις εναλλακτικές</button></div>}
    {visible.length>5&&<button type="button" className="fmShowMore" onClick={()=>setShowAll(!showAll)}>{showAll?"Λιγότερα προϊόντα":"Δες περισσότερα προϊόντα"} <ChevronRight size={17}/></button>}
   </section>

   <section className="fmSection fmLandingExplain"><div><p className="fmMiniKicker">CONVERSION WITH CLARITY</p><h2>Μία μοναδική landing page<br/><em>για κάθε προϊόν.</em></h2><p>Πριν πατήσεις αγορά, θα δεις για ποιον είναι κατάλληλο το προϊόν, ποια στοιχεία πρέπει να επαληθευτούν, πιθανές εναλλακτικές και το πραγματικό status του affiliate link.</p><button className="fmBigCta" type="button" onClick={()=>navigateProducts()}>Εξερεύνησε τις σελίδες προϊόντων <ArrowRight size={17}/></button></div><div className="fmExplainShowcase">{featured[0]&&<><ProductThumb item={featured[0]}/><div><span>YOUR AI SHOPPING BRIEF</span><strong>{featured[0].name}</strong><small>Πραγματική τιμή αναφοράς: {money(featured[0].price)}</small><p><ShieldCheck size={15}/> Προδιαγραφές & affiliate status πριν από την αγορά</p></div></>}</div></section>
  </main>
  <footer className="fmFooter"><div className="fmFooterTop"><span className="fmBrand"><span className="fmBrandIcon">F<span>✦</span></span><strong>FITMATCH <em>AI</em></strong></span><p>Smart decisions, not more products.</p><nav><a href="/methodology">Μεθοδολογία</a><a href="/privacy">Απόρρητο</a><a href="/readiness">Δεδομένα & κατάσταση</a></nav></div><div className="fmFooterBottom"><span>© 2026 FITMATCH AI · Staging Preview</span><span>Προμήθεια &gt;20€ μόνο με τεκμηρίωση · {verified.length} τρέχουσες εγκεκριμένες προσφορές · {catalogMode}</span></div></footer>
 </div>;
}
