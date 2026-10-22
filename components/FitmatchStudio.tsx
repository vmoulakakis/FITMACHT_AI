"use client";
import {useState,useEffect} from "react";
import {Building2,Wallet,Target,Volume2,ChartNoAxesCombined,Dumbbell,Sparkles,ArrowRight,ShieldCheck,ScanSearch,BrainCircuit,Boxes,ClipboardCheck,Search,ArrowUpRight,CheckCircle2,AlertCircle,MapPin,SlidersHorizontal,RotateCcw,Timer,Check} from "lucide-react";
import {rankStudio,selectedPersona,type BuyerStudioProfile,type StudioLane,type StudioItem} from "@/lib/studio-ranking";

const initial:BuyerStudioProfile={
 goal:"mixed",space:"compact",noise:"normal",activity:"walk",budget:600,fold:true,
 level:"beginner",preference:"compact",pain:"space"
};
type CardId=BuyerStudioProfile["pain"];
const painCards:{
 id:CardId;name:string;desc:string;art:string;icon:typeof Building2;mutate:Partial<BuyerStudioProfile>
}[]=[
 {id:"space",name:"Χώρος",desc:"Τι χωράει πραγματικά στο σπίτι μου;",art:"room",icon:Building2,mutate:{space:"compact",fold:true,preference:"compact"}},
 {id:"budget",name:"Budget",desc:"Πόσο αξίζει να ξοδέψω;",art:"budget",icon:Wallet,mutate:{budget:300,preference:"value"}},
 {id:"goal",name:"Στόχος",desc:"Περπάτημα, αντοχή ή δύναμη;",art:"goal",icon:Target,mutate:{goal:"cardio",activity:"walk"}},
 {id:"noise",name:"Θόρυβος",desc:"Δεν θέλω να ενοχλώ γείτονες.",art:"noise",icon:Volume2,mutate:{noise:"critical"}},
 {id:"level",name:"Fitness level",desc:"Τι μπορώ να χρησιμοποιώ σταθερά;",art:"level",icon:ChartNoAxesCombined,mutate:{level:"beginner"}},
 {id:"equipment",name:"Εξοπλισμός",desc:"Ποιος τύπος με εξυπηρετεί;",art:"equipment",icon:Dumbbell,mutate:{goal:"strength",preference:"balanced"}}
];
const engineSteps=[
 {icon:Search,title:"Pain-gap detection",sub:"Καταλαβαίνουμε τι θέλεις να λύσεις."},
 {icon:BrainCircuit,title:"Dynamic buyer profile",sub:"Μόνο οι ερωτήσεις που χρειάζονται."},
 {icon:Target,title:"Niche matching",sub:"Κατηγορία πριν από εμπορική προμήθεια."},
 {icon:Boxes,title:"Product discovery",sub:"Πραγματικό feed και ελεγμένες πηγές."},
 {icon:ChartNoAxesCombined,title:"Top 5 per path",sub:"Καταλληλότητα, budget και τεκμήρια."},
 {icon:ShieldCheck,title:"Affiliate verification",sub:"Η αγορά ανοίγει μόνο μετά το PASS."}
];
const agents=[
 ["PRODUCT","Pain-gap strategy"],["DESIGN","Cinematic UX"],["SEO","Search intent"],["LANGUAGE","HF optional"],["SOURCE","Linkwise feed"],["POLICY","Commission QA"],["RANK","Top 5 scoring"],["ATTRIBUTION","Merchant handoff"]
];
const heroIcons:Record<StudioLane["id"],typeof ChartNoAxesCombined>={cardio:ChartNoAxesCombined,strength:Dumbbell,compact:Building2};

function ResultRow({item,index}:{item:StudioItem;index:number}){
 return <div className={"studioProduct "+item.type}>
  <span className="studioProductRank">{index+1}</span>
  <div className="studioProductImg">
   {item.type==="guide"?<ClipboardCheck size={24} strokeWidth={1.5}/>:item.image?<img src={item.image} alt="" loading="lazy" onError={e=>{e.currentTarget.style.opacity="0";}}/>:<Dumbbell size={23}/>}
  </div>
  <div className="studioProductInfo">
   <strong title={item.name}>{item.name}</strong>
   {item.price!==undefined?<span className="studioProductMoney">{item.price.toLocaleString("el-GR",{style:"currency",currency:"EUR"})} <small>στο feed</small></span>:<span className="studioProductGuide">Πρακτικό βήμα</span>}
   <small className="studioProductSource">{item.type==="verified"?item.merchant:item.type==="research"?"Πραγματικό SKU · έλεγχος εκκρεμεί":item.subtitle}</small>
   {item.type==="verified"&&item.buyPath?<a className="studioOfferLink" rel="nofollow sponsored noopener" href={item.buyPath}>Affiliate αγορά <ArrowUpRight size={11}/></a>:<span className={"studioOfferState "+(item.type==="research"?"pending":"advice")}>{item.type==="research"?"ΜΗ ΕΓΚΕΚΡΙΜΕΝΟ":"ΛΥΣΗ ΧΩΡΙΣ ΑΓΟΡΑ"}</span>}
  </div>
 </div>;
}
export default function FitmatchStudio({onUseScenario}:{onUseScenario:(profile:BuyerStudioProfile)=>void}){
 const [profile,setProfile]=useState<BuyerStudioProfile>(initial);
 const [lanes,setLanes]=useState<StudioLane[]>(()=>rankStudio(initial,[]));
 const [status,setStatus]=useState<"ready"|"loading"|"error">("loading");
 const [catalogStatus,setCatalogStatus]=useState("no_approved_offers");
 const [reviewOpen,setReviewOpen]=useState(false);
 const set=(p:Partial<BuyerStudioProfile>)=>setProfile(prev=>({...prev,...p}));
 useEffect(()=>{
  const controller=new AbortController();
  async function load(){
   setStatus("loading");
   try{
    const res=await fetch("/api/studio",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(profile),signal:controller.signal});
    if(!res.ok)throw Error("studio_rank_unavailable");
    const data=await res.json() as {lanes:StudioLane[];catalogMode:string};
    if(!Array.isArray(data.lanes)||data.lanes.length!==3)throw Error("invalid_ranking");
    if(!controller.signal.aborted){setLanes(data.lanes);setCatalogStatus(data.catalogMode);setStatus("ready");}
   }catch{if(!controller.signal.aborted){setLanes(rankStudio(profile,[]));setStatus("error");}}
  }
  load();return()=>controller.abort();
 },[profile]);
 const chosen=selectedPersona(profile);
 return <section className="fitStudio" id="studio" aria-label="FITMATCH AI — Pain Gap to Top Five">
  <div className="fitStudioTop">
   <div className="fitStudioMonogram">F<span>✦</span></div>
   <div><p className="fitStudioOverline">SMART USERS · SMARTER MATCHES · REAL EVIDENCE</p><h2>FITMATCH <em>AI</em><span> / Pain-Gap → Solution → Top 5</span></h2></div>
   <span className="fitStudioLive"><span/> AGENTIC MATCHING STUDIO</span>
  </div>
  <div className="fitStudioGrid">
   <section className="studioPanel studioEntry" aria-label="Pain gap επιλογές">
    <header className="studioPanelHead"><span className="studioNumber">1</span><div><h3>Είσοδος χρήστη <em>/ Pain Gap</em></h3><small>ΔΙΑΛΕΞΕ ΤΙ ΣΕ ΔΥΣΚΟΛΕΥΕΙ</small></div></header>
    <div className="studioPainGrid">
     {painCards.map(p=><button type="button" key={p.id} className={"studioPain studio-"+p.art+(profile.pain===p.id?" selected":"")} onClick={()=>set({...p.mutate,pain:p.id})} aria-pressed={profile.pain===p.id}>
      <span className="studioPainArt"><p.icon size={35} strokeWidth={1.6}/></span>
      <strong>{p.name}</strong><small>{p.desc}</small>
     </button>)}
    </div>
    <div className="studioQuick">
     <div className="studioQuickHeader"><SlidersHorizontal size={16}/> Το δικό σου προφίλ</div>
     <label htmlFor="studio-budget">Budget <b>{profile.budget.toLocaleString("el-GR")}€</b></label>
     <input id="studio-budget" type="range" min={0} max={1500} step={50} value={Math.min(profile.budget,1500)} onChange={e=>set({budget:Number(e.target.value),pain:"budget"})}/>
     <div className="studioBudgetPresets">
      {[0,200,500,1000].map(b=><button key={b} type="button" aria-pressed={profile.budget===b} onClick={()=>set({budget:b,pain:"budget"})}>{b===0?"0€":b+"€"}</button>)}
     </div>
     <div className="studioSelects">
      <label>Στόχος <select aria-label="Studio στόχος" value={profile.goal} onChange={e=>set({goal:e.target.value as BuyerStudioProfile["goal"],pain:"goal"})}><option value="walking">Περπάτημα</option><option value="cardio">Cardio</option><option value="strength">Δύναμη</option><option value="mixed">Συνδυασμός</option></select></label>
      <label>Χώρος <select aria-label="Studio χώρος" value={profile.space} onChange={e=>set({space:e.target.value as BuyerStudioProfile["space"],pain:"space"})}><option value="compact">Μικρός</option><option value="medium">Μεσαίος</option><option value="large">Μεγάλος</option></select></label>
     </div>
     <div className="studioSwitches">
      <label><input type="checkbox" checked={profile.noise==="critical"} onChange={e=>set({noise:e.target.checked?"critical":"normal",pain:"noise"})}/> <Volume2 size={14}/> Αποφυγή θορύβου</label>
      <label><input type="checkbox" checked={profile.fold} onChange={e=>set({fold:e.target.checked,pain:"space"})}/> <Building2 size={14}/> Εύκολη αποθήκευση</label>
     </div>
     <div className="studioLevel">
      <small>Εμπειρία</small>
      {([["beginner","Αρχάριος"],["intermediate","Μέτριος"],["advanced","Έμπειρος"]] as const).map(([level,label])=><button type="button" key={level} onClick={()=>set({level,pain:"level"})} aria-pressed={profile.level===level}>{label}</button>)}
     </div>
    </div>
    <button className="studioApply" type="button" onClick={()=>onUseScenario(profile)}>Δες τη δική μου λύση <ArrowRight size={17}/></button>
    <p className="studioEntryFoot"><Check size={13}/> Δεν απαιτείται λογαριασμός. Όλα τα κουμπιά αλλάζουν πραγματικά το ranking.</p>
   </section>
   <section className="studioPanel studioBrain" aria-label="Αναλυτικό AI matching workflow">
    <header className="studioPanelHead"><span className="studioNumber">2</span><div><h3>AI Matching Engine</h3><small>ΑΠΟ ΠΡΟΒΛΗΜΑ ΣΕ ΤΕΚΜΗΡΙΩΜΕΝΗ ΛΥΣΗ</small></div></header>
    <div className="studioBrainContent">
     <div className="studioStepStack">
      {engineSteps.map((e,i)=><div key={e.title} className="studioEngineStep">
       <span className="studioEngineIndex">{i+1}</span><span className="studioEngineIcon"><e.icon size={21} strokeWidth={1.6}/></span><div><strong>{e.title}</strong><small>{e.sub}</small></div>
      </div>)}
     </div>
     <div className="studioFunnelVisual" aria-label="Understand, Match, Discover, Rank, Recommend">
      <div className="studioFlowSpark"/><div className="studioFlowBeam"/>
      {["UNDERSTAND","MATCH","DISCOVER","RANK","RECOMMEND"].map((e,i)=><div key={e} className={"studioFunnelLayer layer"+i}><strong>{e}</strong>{i===0&&<small>NEEDS & CONTEXT</small>}</div>)}
      <div className="studioFlowFloor"/>
     </div>
    </div>
    <div className="studioEngineFooter">
     <span className="studioPulse"><span/></span>
     <strong>{status==="loading"?"Ελέγχουμε τις επιλογές σου…":status==="error"?"Fallback engine ενεργό":"Οι αλλαγές σου επηρεάζουν το Top 5"}</strong>
     <small>Κανένα SKU δεν χαρακτηρίζεται συμβατό με περιορισμούς χώρου/θορύβου χωρίς τεκμηρίωση.</small>
    </div>
   </section>
   <section className="studioPanel studioResults" aria-label="Top πέντε λύσεις ανά διαδρομή">
    <header className="studioPanelHead"><span className="studioNumber">3</span><div><h3>Αποτελέσματα <em>/ Solutions</em></h3><small>TOP 5 ΓΙΑ ΚΑΘΕ ΔΙΑΔΡΟΜΗ</small></div></header>
    <div className="studioLaneGrid">
     {lanes.map(l=>{const Hero=heroIcons[l.id];return <div className={"studioLane "+(l.id===chosen?"active":"")} key={l.id}>
      <div className={"studioLanePhoto studioPhoto-"+l.id}><Hero size={31} strokeWidth={1.3}/><strong>{l.title}</strong><small>{l.subtitle}</small></div>
      <div className="studioLaneHead"><span>TOP 5</span><b>{l.verifiedCount} verified</b></div>
      {l.items.map((item,i)=><ResultRow key={item.id} item={item} index={i}/>)}
     </div>})}
    </div>
    <div className="studioResultsEnd"><ShieldCheck size={17}/><div><strong>Αγορά μόνο από πραγματικό affiliate link</strong><small>Τα SKU υπό έλεγχο ΔΕΝ έχουν αγορά. <a href="/research">Δες το product research ↗</a></small></div></div>
   </section>
  </div>
  <div className="studioBottom">
   <div className="studioTeam">
    <div className="studioBottomTitle"><span className="studioNumber">4</span><h3>Agentic Team & Tool Stack</h3><small>ΕΝΙΑΙΑ ΟΡΧΗΣΤΡΩΣΗ</small></div>
    <div className="studioAgentRail">{agents.map(([a,b],i)=><div className="studioAgentNode" key={a}><span className="studioAgentSymbol">{["⌘","✧","↗","◈","▤","⬡","◎","→"][i]}</span><strong>{a}</strong><small>{b}</small></div>)}</div>
    <p className="studioRailNote">Ολοκληρωμένο: contextual ranker, Linkwise feed scanner, privacy-first UI · Προγραμματισμένο/προαιρετικό: LLM provider, attribution conversions, νέα sources.</p>
   </div>
   <div className="studioBottomState">
    <div className="studioReviewBox"><div className="studioStateTitle"><AlertCircle size={19}/><strong>WHY UNDER REVIEW?</strong></div>
     <p>Το προϊόν πρέπει να έχει έγκυρη προμήθεια ≥10€, επιτρεπτό merchant πρόγραμμα, διαθέσιμο stock και επαληθευμένες προδιαγραφές.</p>
     <button type="button" onClick={()=>setReviewOpen(!reviewOpen)} aria-expanded={reviewOpen}>Λεπτομέρειες ελέγχου {reviewOpen?"−":"+"}</button>
     {reviewOpen&&<div className="studioReviewDetail">Τρέχουσα κατάσταση καταλόγου: {catalogStatus}. Υποψήφιο Linkwise SKU ≠ εγκεκριμένη affiliate προσφορά. Δεν επινοούμε ratings, fit percentages, προμήθειες ή αγορές.</div>}
    </div>
    <div className="studioTargetBox"><div className="studioStateTitle"><CheckCircle2 size={19}/><strong>TARGET STATE</strong></div><p>Κατανοούμε το pain gap → 5 σχετικές επιλογές → αγορά μόνο με ελεγμένα affiliate links.</p><a href="/readiness">Δες την πραγματική πρόοδο <ArrowUpRight size={13}/></a></div>
   </div>
  </div>
  <div className="studioLastLine"><span>REAL PEOPLE • REAL NEEDS • <b>REAL SOLUTIONS</b></span><span>Πρώτα το πρόβλημα. Μετά η σωστή απόφαση.</span></div>
 </section>;
}
