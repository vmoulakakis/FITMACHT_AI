import candidates from "@/data/fitness-research-candidates.json";
import type {Offer} from "@/lib/decision";
import {eligible} from "@/lib/decision";

export type CategoryId="cardio"|"strength"|"home-gym"|"recovery"|"accessories";
export type Listing={
 id:string;name:string;merchant:string;price:number;image:string|null;
 category:CategoryId;kind:string;observedAt:string;stockSignal:string;
 approved:boolean;affiliateEligible:boolean;source:"linkwise"|"audited";
 evidence:"pending"|"verified";verifiedCommissionEur?:number|null;
};
type Candidate=typeof candidates.products[number];
const kindCategory=(kind:string):CategoryId=>{
 if(["treadmill","walking-pad","exercise-bike"].includes(kind))return "cardio";
 if(["adjustable-dumbbells","fixed-dumbbells","resistance-bands"].includes(kind))return "strength";
 if(kind==="weight-bench")return "home-gym";
 return "accessories";
};
const safeImage=(x:string|null|undefined):string|null=>typeof x==="string"&&/^https:\/\//.test(x)?x:null;
/** Stable public slug per source merchant + model, independent of feed ordering.
 * This is a routing identifier, not a secret, tracking link or quality proof. */
export function stableProductId(merchant:string,name:string):string{
 const key=(merchant.trim()+"\u0000"+name.trim()).normalize("NFKC").toLocaleLowerCase("el-GR");
 let h=2166136261;for(const c of key){h=Math.imul(h^c.charCodeAt(0),16777619);}
 return "snapshot-"+(h>>>0).toString(36);
}

export function getStoreListings(offers:Offer[],now=Date.now()):Listing[]{
 const verified=offers.filter(x=>eligible(x,Number.MAX_SAFE_INTEGER,7,now).ok).map(x=>({
  id:x.id,name:x.title,merchant:x.merchant,price:x.price,image:safeImage(x.imageUrl),
  category:kindCategory(x.category),kind:x.category,observedAt:x.lastSeen,
  stockSignal:"in_stock",approved:true,affiliateEligible:true,source:"audited" as const,
  evidence:"verified" as const,verifiedCommissionEur:x.verifiedCommissionEur
 }));
 const known=new Set(verified.map(x=>x.merchant.toLowerCase()+"|"+x.name.toLowerCase()));
 const research=(candidates.products as Candidate[]).filter(x=>x.quality==="candidate_unverified")
  .filter(x=>Number.isFinite(x.price)&&x.price>0)
  .filter(x=>!known.has(x.merchant.toLowerCase()+"|"+x.name.toLowerCase()))
  .map(x=>({
   id:stableProductId(x.merchant,x.sourceProductId),name:x.name,merchant:x.merchant,price:x.price,image:safeImage(x.image),
   category:kindCategory(x.kind),kind:x.kind,observedAt:x.observedAt,
   stockSignal:x.stockSignal,approved:false,affiliateEligible:false,source:"linkwise" as const,
   evidence:"pending" as const
  }));
 return [...verified,...research];
}
export function storeCategories():{id:CategoryId;name:string;subtitle:string;icon:string;hint:string}[]{
 return [
 {id:"cardio",name:"Cardio",subtitle:"Διάδρομοι, ποδήλατα, walking pads",icon:"activity",hint:"Για καθημερινή κίνηση και αντοχή"},
 {id:"strength",name:"Ενδυνάμωση",subtitle:"Αλτήρες και λάστιχα",icon:"dumbbell",hint:"Βρες τον σωστό εξοπλισμό δύναμης"},
 {id:"home-gym",name:"Home Gym",subtitle:"Πάγκοι και σταθμοί",icon:"house",hint:"Λύσεις ανάλογα με τον χώρο"},
 {id:"recovery",name:"Αποκατάσταση",subtitle:"Κινητικότητα και ευεξία",icon:"flower",hint:"Πρώτα ασφαλής επιλογή, μετά αγορά"},
 {id:"accessories",name:"Αξεσουάρ",subtitle:"Πρακτικές προσθήκες",icon:"bag",hint:"Μόνο όσα χρειάζεσαι πραγματικά"}
 ];
}
export function buyerReason(item:Listing):{headline:string;why:string;check:string[];caution:string}{
 const choices:Record<string,{headline:string;why:string;check:string[];caution:string}>={
 "treadmill":{headline:"Επιλογή για τρέξιμο στο σπίτι",why:"Αφορά τον στόχο του τρεξίματος, αλλά η πραγματική καταλληλότητα για το σπίτι εξαρτάται από την επιφάνεια, τον χώρο και τα όρια χρήσης.",check:["Επιφάνεια τρεξίματος και διαστάσεις","Όριο βάρους χρήστη","Θόρυβος με έγκυρη πηγή"],caution:"Δεν θεωρείται αθόρυβο ή αναδιπλούμενο χωρίς τεχνικό τεκμήριο."},
 "walking-pad":{headline:"Διερεύνησε λύση για περπάτημα",why:"Εστιάζει σε καθημερινή κίνηση. Δεν υποκαθιστά ένα πιστοποιημένο μηχάνημα τρεξίματος.",check:["Πραγματικές διαστάσεις χρήσης","Διαστάσεις αποθήκευσης","Όρια ταχύτητας και βάρους"],caution:"Έλεγξε τεχνικά χαρακτηριστικά πριν συμπεράνεις ότι χωρά."},
 "exercise-bike":{headline:"Εναλλακτικό cardio με ποδήλατο",why:"Προσφέρει διαφορετικό τρόπο αερόβιας δραστηριότητας. Δεν είναι ισοδύναμο με το περπάτημα ή το τρέξιμο.",check:["Τύπος αντίστασης και ρυθμίσεις","Διαστάσεις βάσης","Θόρυβος, συντήρηση και εγγύηση"],caution:"Μην υποθέσεις συμβατότητα με μικρό χώρο χωρίς διαστάσεις."},
 "adjustable-dumbbells":{headline:"Μεταβλητή αντίσταση σε λιγότερο εξοπλισμό",why:"Εναλλακτική σε πολλά ζευγάρια σταθερών βαρών, εφόσον το πραγματικό εύρος και ο μηχανισμός ταιριάζουν στον αγοραστή.",check:["Πραγματικό εύρος κιλών","Ασφάλεια αλλαγής βάρους","Όροι εγγύησης"],caution:"Τα βάρη και οι συνθήκες χρήσης χρειάζονται επιβεβαίωση."},
 "fixed-dumbbells":{headline:"Εστιασμένη επιλογή για ενδυνάμωση",why:"Σταθερό βάρος που μπορεί να εξυπηρετεί συγκεκριμένο πρόγραμμα. Απαιτείται έλεγχος πραγματικών κιλών και επιπέδου.",check:["Βάρος ανά τεμάχιο ή σετ","Υλικό και λαβή","Αποθήκευση και ασφαλής χρήση"],caution:"Μη διαλέξεις βάρος μόνο βάσει της φωτογραφίας."},
 "resistance-bands":{headline:"Ευέλικτη δύναμη σε μικρό χώρο",why:"Προϊόντα αντίστασης μπορούν να υποστηρίξουν διαφορετικές ασκήσεις με μικρό χώρο αποθήκευσης, όχι όμως ίδιες φορτίσεις με αλτήρες.",check:["Εύρος αντίστασης","Υλικό και μηχανισμός στερέωσης","Οδηγίες ασφαλούς χρήσης"],caution:"Χρειάζεται επαλήθευση αντοχής και σωστής χρήσης."},
 "weight-bench":{headline:"Πρόσθετη βάση για οργανωμένη άσκηση",why:"Ένας πάγκος είναι χρήσιμος όταν υπάρχει σαφές πρόγραμμα και χώρος, όχι υποχρεωτικά η πρώτη αγορά.",check:["Συνολικό επιτρεπόμενο φορτίο","Διαστάσεις και σταθερότητα","Ρυθμίσεις και εγγύηση"],caution:"Απαιτείται επιβεβαίωση προδιαγραφών από τον κατασκευαστή."}
 };
 return choices[item.kind]??{headline:"Προϊόν προς εξατομικευμένο έλεγχο",why:"Αξιολόγησε το συγκεκριμένο είδος σε σχέση με τον στόχο σου.",check:["Χαρακτηριστικά","Τιμή","Αξιοπιστία πηγής"],caution:"Άγνωστα specs σημαίνουν μη εγκεκριμένη πρόταση."};
}
export function topItems(list:Listing[],category:CategoryId|"all",query="",budget=5000){
 const q=query.trim().toLocaleLowerCase("el-GR").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
 const normal=(s:string)=>s.toLocaleLowerCase("el-GR").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
 const tolerance=budget>=1e7?Number.MAX_SAFE_INTEGER:Math.min(Math.max(budget*0.35,12),120);
 return list.filter(x=>category==="all"||x.category===category)
 .filter(x=>!q||normal(x.name+" "+x.merchant+" "+x.kind).includes(q))
 .filter(x=>x.price<=budget+tolerance)
 // Product value and high-ticket research relevance first; no merchant payout is inferred or displayed.
 .map(x=>({x,score:(x.affiliateEligible?200:0)+(x.price<=budget?22:0)+(x.stockSignal==="in_stock"?8:0)+Math.min(35,x.price/14)}))
 .sort((a,b)=>b.score-a.score||a.x.price-b.x.price||a.x.name.localeCompare(b.x.name,"el-GR")).map(r=>r.x);
}
export function merchantAudit(list:Listing[]){
 const groups=new Map<string,{name:string,count:number,approved:number,observed:number}>();
 for(const l of list){let x=groups.get(l.merchant);if(!x){x={name:l.merchant,count:0,approved:0,observed:0};groups.set(l.merchant,x)}x.count++;if(l.affiliateEligible)x.approved++;if(l.stockSignal==="in_stock")x.observed++;}
 return [...groups.values()].sort((a,b)=>b.approved-a.approved||b.count-a.count);
}


export type BuyerGoal="cardio"|"strength"|"home-gym"|"recovery";
export type BuyerAnswer={goal:BuyerGoal;budget:number;space:"compact"|"regular"};
export type BuyerRank={product:Listing;fit:"direct"|"near"|"alternative";reason:string;budgetGap:number;score:number};
/** Simple evidence-aware buyer matching.
 * Never infer payout, specs or stock from product names. Every result is a real SKU.
 * Relevance comes BEFORE commission; verified status is a tie-breaker only.
 */
export function rankForBuyer(products:Listing[],answers:BuyerAnswer,maxResults=5):BuyerRank[]{
 const budget=Math.max(0,Math.min(Number.isFinite(answers.budget)?answers.budget:0,20000));
 const wanted:Record<BuyerGoal,Record<string,number>>={
  cardio:{"exercise-bike":100,"walking-pad":98,"treadmill":92,"resistance-bands":25,"adjustable-dumbbells":20},
  strength:{"adjustable-dumbbells":100,"fixed-dumbbells":93,"resistance-bands":88,"weight-bench":71,"exercise-bike":34},
  "home-gym":{"weight-bench":100,"adjustable-dumbbells":93,"fixed-dumbbells":86,"resistance-bands":74,"treadmill":70,"exercise-bike":64},
  recovery:{"resistance-bands":55,"exercise-bike":35,"fixed-dumbbells":23,"walking-pad":20}
 };
 const scores=wanted[answers.goal];
 const ranked=products.filter(p=>p.price>0&&Number.isFinite(p.price)&&p.kind!=="unknown"&&p.kind!=="accessory")
  .map(product=>{
   let fitScore=scores[product.kind]??0;
   if(answers.space==="compact"&&["treadmill","weight-bench","exercise-bike"].includes(product.kind))fitScore-=25;
   if(answers.space==="compact"&&["resistance-bands","adjustable-dumbbells"].includes(product.kind))fitScore+=10;
   if(answers.goal==="recovery"&&product.kind==="fixed-dumbbells")fitScore-=15;
   const gap=Math.max(0,product.price-budget);
   const overPenalty=gap===0?0:Math.min(70,16+Math.log1p(gap)*8);
   // An unverified "in stock" feed signal does not prove live availability.
   const score=fitScore-overPenalty+(product.affiliateEligible?0.15:0);
   const fit:"direct"|"near"|"alternative"=fitScore>=84?"direct":fitScore>=55?"near":"alternative";
   let reason=fit==="direct"?"Η κατηγορία αντιστοιχεί άμεσα στον στόχο σου.":fit==="near"?"Κοντινή επιλογή που αξίζει σύγκριση.":"Διαφορετικός τύπος εξοπλισμού — ενδέχεται να μην καλύπτει τον αρχικό σου στόχο.";
   if(answers.goal==="recovery")reason="Δεν αποτελεί ιατρική αποκατάσταση ή θεραπευτική σύσταση. Χρειάζεται αξιολόγηση της ασφαλούς χρήσης.";
   if(answers.space==="compact"&&["treadmill","weight-bench","exercise-bike"].includes(product.kind))reason+=" Οι διαστάσεις για μικρό χώρο δεν έχουν επιβεβαιωθεί.";
   if(gap>0)reason+=" Υπερβαίνει το budget κατά "+gap.toLocaleString("el-GR",{style:"currency",currency:"EUR"})+".";
   return {product,fit,reason,budgetGap:gap,score};
  }).sort((a,b)=>b.score-a.score||a.budgetGap-b.budgetGap||a.product.price-b.product.price||a.product.id.localeCompare(b.product.id));
 // Return an honest nearby product rather than an empty card grid when the user
 // chooses a category with limited supply or an unrealistic budget.
 return ranked.slice(0,Math.max(1,Math.min(5,maxResults)));
}
