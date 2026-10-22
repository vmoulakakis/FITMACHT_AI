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
   id:x.id,name:x.name,merchant:x.merchant,price:x.price,image:safeImage(x.image),
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
