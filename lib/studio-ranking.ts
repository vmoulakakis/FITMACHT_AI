import type {Answers,Offer,Category} from "./decision";
import {eligible} from "./decision";
import researchData from "../data/fitness-research-candidates.json";

export type Persona="cardio"|"strength"|"compact";
export type BuyerStudioProfile=Answers&{level:"beginner"|"intermediate"|"advanced";preference:"value"|"compact"|"balanced";pain:"space"|"budget"|"goal"|"noise"|"level"|"equipment"};
export type MatchLevel="direct"|"near"|"alternative"|"action";
export type StudioItem={id:string;type:"verified"|"research"|"guide";name:string;subtitle:string;merchant?:string;price?:number;image?:string;category:string;lastSeen?:string;reason:string;tradeoff?:string;matchLevel:MatchLevel;isAffiliate:boolean;buyPath?:string};
export type StudioLane={id:Persona;title:string;subtitle:string;items:StudioItem[];verifiedCount:number;researchCount:number;rankVersion:string;selected:boolean};
type SourceCandidate={id:number;title:string;merchant:string;price:number;image:string;at:string;kind:string;status:string;quality:string;productKind:string};
const research:SourceCandidate[]=researchData.products.map((p,i)=>({id:i+1,title:p.name,merchant:p.merchant,price:p.price,image:p.image,at:p.observedAt,kind:p.kind==="treadmill"||p.kind==="exercise-bike"||p.kind==="walking-pad"?"cardio":"strength",status:"UNVERIFIED",quality:p.quality,productKind:p.kind}));
const descriptors:Record<Persona,{title:string;subtitle:string;guide:[string,string][]}>={
 cardio:{title:"Cardio στο σπίτι",subtitle:"Κίνηση, περπάτημα και αντοχή",guide:[
 ["Walking pad vs διάδρομος","Ξεχώρισε περπάτημα από τρέξιμο πριν εξετάσεις μηχάνημα."],
 ["Διαστάσεις & αποθήκευση","Μέτρησε πραγματικό χώρο χρήσης και μεταφοράς."],
 ["Ποδήλατο γυμναστικής","Εναλλακτική για σταθερό cardio, εφόσον χωρά πραγματικά."],
 ["Τεκμηρίωση θορύβου","Δεν θεωρούμε κανένα μηχάνημα αθόρυβο χωρίς μετρήσεις."],
 ["Δοκίμασε τη συνήθεια","Ξεκίνα ήπια κίνηση χωρίς αγορά πριν δεσμεύσεις budget."]]},
 strength:{title:"Δύναμη & ενδυνάμωση",subtitle:"Ευέλικτος εξοπλισμός",guide:[
 ["Αλτήρες: ποιους χρειάζεσαι;","Ξεχώρισε σταθερά βάρη από ρυθμιζόμενα σετ."],
 ["Ασφάλεια φόρτισης","Έλεγξε πραγματικά κιλά, κλείδωμα και τις οδηγίες."],
 ["Λάστιχα αντίστασης","Εξερεύνησε λύση με μικρό αποθηκευτικό αποτύπωμα."],
 ["Πάγκος μόνο αν χρειάζεται","Μη δεσμεύεις χώρο χωρίς σαφή ανάγκη."],
 ["Δοκίμασε ασκήσεις χωρίς όργανα","Κράτησε την αγορά για πραγματικό κενό εξοπλισμού."]]},
 compact:{title:"Μικρός χώρος",subtitle:"Λιγότερος όγκος, περισσότερη χρήση",guide:[
 ["Μέτρα το διαθέσιμο δάπεδο","Σχεδίασε ζώνη κίνησης και χώρο κυκλοφορίας."],
 ["Έλεγξε τη θέση αποθήκευσης","Αναδιπλούμενο δεν σημαίνει κατάλληλο για κάθε σπίτι."],
 ["Μείωσε τον θόρυβο","Απέφυγε βέβαιους ισχυρισμούς χωρίς δοκιμαστικές μετρήσεις."],
 ["Αγόρασε μόνο ό,τι χρησιμοποιείς","Προτεραιότητα σε ευέλικτες ανάγκες και προσιτό budget."],
 ["Ξεκίνα με μηδενική αγορά","Κατάστρωσε ρουτίνα με ελεύθερο χώρο."]]}
};
const inputCategory:Record<Persona,Category[]>={
 cardio:["walking-pad","treadmill","exercise-bike"],
 strength:["adjustable-dumbbells","resistance-bands"],
 compact:["resistance-bands","adjustable-dumbbells","walking-pad"]
};
const norm=(s:string)=>s.toLocaleLowerCase("el-GR").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const fitsResearch=(lane:Persona,c:SourceCandidate)=>{
 const t=norm(c.title);
 if(c.productKind==="accessory"||c.productKind==="unknown")return false;
 if(lane==="cardio")return ["treadmill","walking-pad","exercise-bike"].includes(c.productKind);
 if(lane==="strength")return ["adjustable-dumbbells","fixed-dumbbells","resistance-bands","weight-bench"].includes(c.productKind);
 // Flexible small-space discovery: do not claim any specific dimensions without evidence.
 return ["resistance-bands","adjustable-dumbbells","fixed-dumbbells","walking-pad","exercise-bike"].includes(c.productKind);
};
const itemRank=(lane:Persona,product:SourceCandidate,profile:BuyerStudioProfile)=>{
 const t=norm(product.title);
 let score=60;
 // No unsupported specs inferred from the title: these are conservative RESEARCH screens.
 if(profile.level==="beginner"&&/(?:50|55|66) ?kg/u.test(t))return -999;
 if(profile.noise==="critical"&&/(treadmill|διαδρομος.{0,25}γυμναστ)/u.test(t))score-=38;
 if(profile.space==="compact"&&/(bench|παγκος)/u.test(t))score-=29;
 if(profile.fold&&lane==="cardio"&&/treadmill/u.test(t))score-=14;
 if(profile.level==="beginner"&&/bike|ποδηλατ/u.test(t))score+=7;
 if(profile.level==="advanced"&&/dumbbell|αλτηρ|βαρακ/u.test(t))score+=8;
 if(profile.preference==="value")score+=Math.max(0,20-(product.price/Math.max(1,profile.budget))*20);
 if(lane==="cardio"){
  if(/bike|ποδηλατ/u.test(t))score+=profile.noise==="critical"?12:6;
  if(/treadmill|διαδρομος/u.test(t))score+=profile.activity==="run"&&profile.noise!=="critical"?15:-17;
 }
 if(lane==="strength"){
  if(/ρυθμιζ|adjustable/u.test(t))score+=profile.preference==="compact"?10:6;
  if(/bench|παγκος/u.test(t))score-=profile.space==="compact"?25:4;
 }
 score+=Math.max(0,14-(product.price/Math.max(1,profile.budget))*14);
 return score;
};
export function selectedPersona(profile:BuyerStudioProfile):Persona{
 if(profile.goal==="strength")return "strength";
 if(profile.space==="compact" && profile.goal==="mixed")return "compact";
 return "cardio";
}
/** Generate up to five REAL verified purchasable offers, otherwise transparent
 * source-research candidates and practical plans. Research candidates never get affiliate links.
 * Sale status derives only from the protected reviewed-offers table.
 */
export function rankStudio(profile:BuyerStudioProfile,approved:Offer[],now=Date.now()):StudioLane[]{
 return (["cardio","strength","compact"] as const).map(id=>{
  const d=descriptors[id],chosen=new Set<string>();
  const allowed=inputCategory[id],items:StudioItem[]=[];
  // Budget and category are preference gradients. Commercial eligibility is still a hard gate.
  const tolerance=Math.min(Math.max(profile.budget*0.35,12),120);
  const verified=profile.budget>0?approved.filter(p=>allowed.includes(p.category as Category))
   .filter(p=>p.price<=profile.budget+tolerance)
   .filter(p=>eligible(p,Math.max(profile.budget,p.price),7,now).ok)
   .sort((a,b)=>(a.price>profile.budget?1:0)-(b.price>profile.budget?1:0)||a.price-b.price):[];
  for(const p of verified){
   if(items.length>=5)break;
   const dedup=norm(p.title).replace(/[^a-z0-9α-ω]/g,"").slice(0,80);
   if(chosen.has(dedup))continue;chosen.add(dedup);
   items.push({id:p.id,type:"verified",name:p.title,subtitle:"Ελεγμένα στοιχεία & εμπορικοί όροι",merchant:p.merchant,price:p.price,image:p.imageUrl??undefined,category:p.category,lastSeen:p.lastSeen,reason:"Επαληθευμένη εμπορική προσφορά στην αντίστοιχη κατηγορία.",tradeoff:p.price>profile.budget?"Λίγο πάνω από το budget: "+(p.price-profile.budget).toFixed(2)+"€. Αποφασίζεις εσύ.":(profile.noise==="critical"?"Απαραίτητος έλεγχος πραγματικού θορύβου και διαστάσεων.":"Έλεγξε τη φυσική καταλληλότητα του SKU."),matchLevel:p.price>profile.budget?"near":"direct",isAffiliate:true,buyPath:"/api/out?id="+encodeURIComponent(p.id)});
  }
  const countVerified=items.length;
  if(profile.budget>0){
   const candidates=research.filter(p=>fitsResearch(id,p)&&p.price<=profile.budget+tolerance&&p.quality!=="needs_source_recheck")
    .filter(p=>Number.isFinite(Date.parse(p.at))&&(now-Date.parse(p.at))<=30*86400000&&(now-Date.parse(p.at))>=0)
    .filter(p=>itemRank(id,p,profile)>-900)
    .sort((a,b)=>{const pa=a.price>profile.budget?22:0,pb=b.price>profile.budget?22:0;return (itemRank(id,b,profile)-pb)-(itemRank(id,a,profile)-pa)||a.price-b.price;});
   for(const p of candidates){
    if(items.length>=5)break;
    const dedup=norm(p.title).replace(/[^a-z0-9α-ω]/g,"").slice(0,80);
    if(chosen.has(dedup))continue;chosen.add(dedup);
    const over=p.price>profile.budget;
    const possible= id==="cardio"&&p.productKind==="exercise-bike"&&profile.activity==="run"?"Εναλλακτική για αντοχή, όχι ισοδύναμο με τρέξιμο.":id==="compact"&&["exercise-bike","walking-pad"].includes(p.productKind)?"Οι διαστάσεις/θόρυβος ΔΕΝ έχουν ελεγχθεί· ίσως δεν ταιριάζει στον χώρο.":id==="compact"&&profile.goal==="cardio"&&p.kind==="strength"?"Εναλλακτική ενδυνάμωσης, δεν υποκαθιστά το cardio.":"Παρόμοια λύση με γνωστό είδος εξοπλισμού· τα τεχνικά χαρακτηριστικά εκκρεμούν.";
    const grade:MatchLevel=over||profile.noise==="critical"&&["treadmill","exercise-bike"].includes(p.productKind)?"near":id==="compact"&&p.kind==="strength"&&profile.goal==="cardio"?"alternative":"direct";
    items.push({id:"research-"+p.id,type:"research",name:p.title,subtitle:"Πραγματικό feed · ΜΗ ΕΓΚΕΚΡΙΜΕΝΟ",merchant:p.merchant,price:p.price,image:p.image,category:p.productKind,lastSeen:p.at,reason:possible,tradeoff:(over?"Λίγο πάνω από το budget ("+(p.price-profile.budget).toFixed(2)+"€). ":"")+possible+" Επιβεβαίωσε stock, specs και εμπορικούς όρους.",matchLevel:grade,isAffiliate:false});
   }
  }
  const researchCount=items.length-countVerified;
  for(let i=0;items.length<5;i++){
   const [name,reason]=d.guide[i%d.guide.length];
   if(items.some(x=>x.name===name))continue;
   items.push({id:id+"-guide-"+i,type:"guide",name,subtitle:"Πρακτική λύση · Χωρίς αγορά",category:id,reason,matchLevel:"action",isAffiliate:false});
  }
  return {id,title:d.title,subtitle:d.subtitle,items,verifiedCount:countVerified,researchCount,rankVersion:"adaptive-near-match-v2",selected:id===selectedPersona(profile)};
 });
}
