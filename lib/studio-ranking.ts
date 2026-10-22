import type {Answers,Offer,Category} from "./decision";
import {eligible} from "./decision";
import researchData from "../data/fitness-research-shortlist.json";

export type Persona="cardio"|"strength"|"compact";
export type BuyerStudioProfile=Answers&{level:"beginner"|"intermediate"|"advanced";preference:"value"|"compact"|"balanced";pain:"space"|"budget"|"goal"|"noise"|"level"|"equipment"};
export type StudioItem={id:string;type:"verified"|"research"|"guide";name:string;subtitle:string;merchant?:string;price?:number;image?:string;category:string;lastSeen?:string;reason:string;isAffiliate:boolean;buyPath?:string};
export type StudioLane={id:Persona;title:string;subtitle:string;items:StudioItem[];verifiedCount:number;researchCount:number;rankVersion:string;selected:boolean};
type SourceCandidate={id:number;title:string;merchant:string;price:number;image:string;at:string;kind:string;status:string};
const research=researchData as SourceCandidate[];
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
 if(lane==="cardio")return /(treadmill|walking.?pad|bike|ποδηλατ|διαδρομος.{0,25}γυμναστ)/u.test(t);
 if(lane==="strength")return /(dumbbell|αλτηρ|βαρακ|παγκος.{0,22}γυμναστ|bench)/u.test(t);
 // Display only highly portable-looking research candidates and mark dimensions
 // explicitly UNVERIFIED; never assert the SKU fits a small home.
 return /(adjustable.?dumbbell|ρυθμιζ.{0,15}αλτηρ)/u.test(t);
};
const itemRank=(lane:Persona,product:SourceCandidate,profile:BuyerStudioProfile)=>{
 const t=norm(product.title);
 let score=60;
 // No unsupported specs inferred from the title: these are conservative RESEARCH screens.
 if(profile.level==="beginner"&&/(?:50|55|66)s?kg/u.test(t))return -999;
 if(profile.noise==="critical"&&/(treadmill|διαδρομος.{0,25}γυμναστ)/u.test(t))return -999;
 if(profile.space==="compact"&&/(bench|παγκος)/u.test(t))return -999;
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
  const verified=approved.filter(p=>allowed.includes(p.category as Category))
   .filter(p=>eligible(p,profile.budget,7,now).ok)
   .filter(p=>!(profile.noise==="critical"&&p.category==="treadmill"))
   .filter(p=>!(id==="compact"&&p.category==="walking-pad")) // no verified dimensions/noise field
   .sort((a,b)=>a.price-b.price||Date.parse(b.lastSeen)-Date.parse(a.lastSeen));
  for(const p of verified){
   if(items.length>=5)break;
   const dedup=norm(p.title).replace(/[^a-z0-9α-ω]/g,"").slice(0,80);
   if(chosen.has(dedup))continue;chosen.add(dedup);
   items.push({id:p.id,type:"verified",name:p.title,subtitle:"Ελεγμένα στοιχεία & εμπορικοί όροι",merchant:p.merchant,price:p.price,image:p.imageUrl??undefined,category:p.category,lastSeen:p.lastSeen,reason:"Περνά τους εμπορικούς ελέγχους και τα γνωστά φίλτρα.",isAffiliate:true,buyPath:"/api/out?id="+encodeURIComponent(p.id)});
  }
  const countVerified=items.length;
  if(profile.budget>0){
   const candidates=research.filter(p=>fitsResearch(id,p)&&p.price<=profile.budget)
    .filter(p=>Number.isFinite(Date.parse(p.at))&&(now-Date.parse(p.at))<=7*86400000&&(now-Date.parse(p.at))>=0)
    .filter(p=>itemRank(id,p,profile)>-900)
    .sort((a,b)=>itemRank(id,b,profile)-itemRank(id,a,profile)||a.price-b.price);
   for(const p of candidates){
    if(items.length>=5)break;
    const dedup=norm(p.title).replace(/[^a-z0-9α-ω]/g,"").slice(0,80);
    if(chosen.has(dedup))continue;chosen.add(dedup);
    items.push({id:"research-"+p.id,type:"research",name:p.title,subtitle:"Από πραγματικό feed · Όχι εγκεκριμένη προσφορά",merchant:p.merchant,price:p.price,image:p.image,category:p.kind,lastSeen:p.at,reason:"Απαιτούνται έλεγχοι τεχνικών specs, tracking και τρέχουσας προμήθειας.",isAffiliate:false});
   }
  }
  const researchCount=items.length-countVerified;
  for(let i=0;items.length<5;i++){
   const [name,reason]=d.guide[i%d.guide.length];
   if(items.some(x=>x.name===name))continue;
   items.push({id:id+"-guide-"+i,type:"guide",name,subtitle:"Πρακτική λύση · Χωρίς αγορά",category:id,reason,isAffiliate:false});
  }
  return {id,title:d.title,subtitle:d.subtitle,items,verifiedCount:countVerified,researchCount,rankVersion:"top-five-r1-gated",selected:id===selectedPersona(profile)};
 });
}
