export type Goal = "walking" | "cardio" | "strength" | "mixed";
export type Space = "compact" | "medium" | "large";
export type Noise = "critical" | "normal";
export type Activity = "walk" | "run" | "both";
export type Answers = { goal:Goal; space:Space; noise:Noise; activity:Activity; budget:number; fold:boolean };
export type Category = "walking-pad" | "treadmill" | "exercise-bike" | "adjustable-dumbbells" | "resistance-bands";
export type Advice = { category:Category; label:string; reason:string; caution:string; checks:string[]; wait:boolean };
export function advise(a:Answers):Advice {
  if (!Number.isFinite(a.budget) || a.budget < 0) throw new Error("invalid_budget");
  if (a.goal==="strength" || (a.goal==="mixed" && a.budget<250)) {
    const bands=a.budget<120;
    return { category:bands?"resistance-bands":"adjustable-dumbbells", label:bands?"Λάστιχα αντίστασης":"Ρυθμιζόμενοι αλτήρες",
      reason:bands?"Ελάχιστος όγκος αποθήκευσης και χαμηλή αρχική δαπάνη.":"Προπόνηση δύναμης με ευέλικτο φορτίο χωρίς μεγάλο σταθερό μηχάνημα.",
      caution:"Έλεγξε πραγματικά κιλά, ασφάλεια στερέωσης, διαθέσιμο χώρο και οδηγίες χρήσης.",checks:["Ακριβές εύρος φορτίου","Διαστάσεις αποθήκευσης","Πραγματικοί όροι εγγύησης"],wait:a.budget<30 };
  }
  if(a.activity==="run" || a.activity==="both"){
    return {category:"treadmill",label:"Διάδρομος τρεξίματος",reason:"Το τρέξιμο απαιτεί επιφάνεια, κινητήρα και όρια χρήσης που δεν τεκμαίρονται από ένα walking pad.",caution:"Έλεγξε αναλυτικά διαστάσεις, επιφάνεια τρεξίματος, όριο βάρους και πραγματική καταλληλότητα για το κτίριο.",checks:["Επιφάνεια τρεξίματος","Μέγιστο βάρος χρήστη","Διαστάσεις σε χρήση"],wait:a.budget<200};
  }
  if(a.goal==="cardio" && a.space==="large" && a.noise==="normal"){
    return {category:"exercise-bike",label:"Ποδήλατο γυμναστικής",reason:"Σταθερός χώρος και στόχος cardio επιτρέπουν να εξεταστεί πρώτα το ποδήλατο.",caution:"Η αθόρυβη λειτουργία δεν θεωρείται δεδομένη. Έλεγξε διαστάσεις και τεχνικές προδιαγραφές.",checks:["Τύπος αντίστασης","Διαστάσεις βάσης","Μέγιστο βάρος χρήστη"],wait:a.budget<120};
  }
  return {category:"walking-pad",label:"Walking pad",reason:"Για περπάτημα σε περιορισμένο χώρο, προτεραιότητα έχει το μικρό αποτύπωμα και η ευκολία αποθήκευσης.",caution:a.noise==="critical"?"Δεν υπάρχουν καθολικά «αθόρυβα» μηχανήματα· χρειάζονται τεκμηριωμένα στοιχεία θορύβου.":"Ο έλεγχος διαστάσεων και ορίου βάρους είναι απαραίτητος πριν από αγορά.",checks:["Πλάτος × μήκος σε χρήση","Διαστάσεις αποθήκευσης","Επίπεδο θορύβου με πηγή"],wait:a.budget<130};
}
export type Offer = { id:string;title:string;category:string;price:number;currency:string;merchant:string;trackingUrl:string;inStock:boolean;lastSeen:string;verifiedCommissionEur:number|null;commissionEvidence:boolean;specsVerified:boolean;imageUrl?:string|null;urlEvidence?:string|null };
export type Eligibility = {ok:boolean;reason:string};
export function eligible(o:Offer,budget:number,cutoffDays=7,now=Date.now()):Eligibility{
 if (!o.id||!o.title||!o.trackingUrl) return {ok:false,reason:"missing_offer_data"};
 if(o.currency!=="EUR")return {ok:false,reason:"unverified_currency"};
 if(!o.inStock)return {ok:false,reason:"out_of_stock"};
 if(!Number.isFinite(o.price)||o.price<=0||o.price>budget)return {ok:false,reason:"budget_or_price"};
 if(!o.commissionEvidence||o.verifiedCommissionEur===null)return {ok:false,reason:"pending_commission"};
 if(o.verifiedCommissionEur<10)return {ok:false,reason:"commission_under_10"};
 if(!o.specsVerified)return {ok:false,reason:"specifications_unverified"};
 const age=(now-new Date(o.lastSeen).getTime())/86400000;
 if(!Number.isFinite(age)||age<0||age>cutoffDays)return {ok:false,reason:"stale_offer"};
 return {ok:true,reason:"verified"};
}
export function choose(offers:Offer[],a:Answers,category:Category,now=Date.now()){
 const ranked=offers.filter(o=>o.category===category).map(o=>({offer:o,gate:eligible(o,a.budget,7,now)})).filter(x=>x.gate.ok).sort((x,y)=> x.offer.price-y.offer.price);
 return ranked.slice(0,3).map((x,i)=>({...x.offer,tag:i===0?"Καλύτερη τιμή":i===1?"Εναλλακτική":"Επιπλέον επιλογή"}));
}
