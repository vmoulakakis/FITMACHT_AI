import type {Answers,Category,Goal,Space,Noise,Activity} from "./decision";
export type Signals={run?:boolean;quiet?:boolean;small?:boolean;noBuy?:boolean;fold?:boolean;injury?:boolean};
export type Path={id:string;kind:"equipment"|"no_purchase";category:Category|null;title:string;reason:string;actions:string[]};
export type Plan={primary:Path;alternatives:Path[];insights:string[];reasoning:"contextual"|"hf-assisted"};
const normalize=(text:string)=>text.toLocaleLowerCase("el-GR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
export function parseIntent(text:string):Signals{
 const s=normalize(text).slice(0,600);
 return {
  run:!/(δεν.{0,22}(θελω|μπορω).{0,22}(τρεξ|τρεχ|run)|χωρις τρεξ|no running)/u.test(s)&&/τρεξ|τρεχ|running|jogging|trex|run\b/u.test(s),
  quiet:/ησυχ|αθορυβ|θορυβ|γειτον|πολυκατοικ|βραδυ|quiet|noise|thoriv/u.test(s),
  small:/μικρο.{0,12}(σπιτι|χωρο|διαμερισμα)|γκαρσονιερ|στενο|tiny|small space|ligo xoro/u.test(s),
  noBuy:/χωρις (αγορα|χρηματα|εξοπλισμ)|δωρεαν|δεν θελω να αγορασ|free|no equipment|0 ευρω/u.test(s),
  fold:/διπλ|μαζευ|αποθηκευ|ντουλαπ|fold|storage/u.test(s),
  injury:/τραυματισ|πονο|ποναω|χειρουργ|rehab|injur/u.test(s)
 };
}
const label:Record<Category,string>={"walking-pad":"Walking pad",treadmill:"Διάδρομος τρεξίματος","exercise-bike":"Ποδήλατο γυμναστικής","adjustable-dumbbells":"Ρυθμιζόμενοι αλτήρες","resistance-bands":"Λάστιχα αντίστασης"};
const actions:Record<Category,string[]>={
 "walking-pad":["Μέτρησε διαστάσεις χρήσης και αποθήκευσης.","Έλεγξε όριο βάρους και τεκμηρίωση θορύβου.","Σύγκρινε μόνο επαληθευμένα διαθέσιμα προϊόντα."],
 treadmill:["Βεβαιώσου ότι υποστηρίζει πραγματικό τρέξιμο.","Έλεγξε επιφάνεια, σταθερότητα και όριο βάρους.","Μέτρησε χώρο και θόρυβο στη θέση χρήσης."],
 "exercise-bike":["Μέτρησε τις διαστάσεις της βάσης.","Έλεγξε εργονομία και τύπο αντίστασης.","Επιβεβαίωσε όριο βάρους και θόρυβο."],
 "adjustable-dumbbells":["Έλεγξε τα πραγματικά διαθέσιμα κιλά.","Επιβεβαίωσε τον μηχανισμό ασφάλισης.","Μέτρησε χώρο χρήσης και αποθήκευσης."],
 "resistance-bands":["Επίλεξε σαφή βαθμίδα αντίστασης.","Έλεγξε ποιότητα, στερέωση και φθορά.","Ξεκίνα με ελεγχόμενες κινήσεις."]
};
const freePlans=(a:Answers,run:boolean):Path[]=>[
 {id:"free-movement",kind:"no_purchase",category:null,title:a.goal==="strength"?"Ασκήσεις με το βάρος του σώματος":run?"Περπάτημα ή τρέξιμο εκτός σπιτιού":"Κίνηση χωρίς εξοπλισμό",reason:"Ξεκίνα χωρίς αγορά ή δοκίμασε πρώτα τη συνήθεια που θέλεις να χτίσεις.",actions:["Επίλεξε μια απλή δραστηριότητα που μπορείς να κάνεις με ασφάλεια.","Όρισε ρεαλιστική συχνότητα.","Αξιολόγησε αν χρειάζεσαι πράγματι εξοπλισμό."]},
 {id:"free-existing",kind:"no_purchase",category:null,title:"Αξιοποίησε ό,τι έχεις",reason:"Έλεγξε πρώτα τι ήδη διαθέτεις για να μην κάνεις περιττή αγορά.",actions:["Κατάγραψε τον χώρο και τον υπάρχοντα εξοπλισμό.","Βάλε μια σύντομη επαναλαμβανόμενη ρουτίνα.","Αγόρασε μόνο όταν εντοπίσεις συγκεκριμένο κενό."]},
 {id:"free-try",kind:"no_purchase",category:null,title:"Δοκίμασε πριν αγοράσεις",reason:"Η δοκιμή μπορεί να μειώσει τον κίνδυνο λανθασμένης αγοράς.",actions:["Προσδιόρισε το πραγματικό πρόβλημα που θέλεις να λύσεις.","Δοκίμασε τη σχετική δραστηριότητα σε κατάλληλο ασφαλές περιβάλλον.","Σύγκρινε τεκμηριωμένες τεχνικές προδιαγραφές αργότερα."]}
];
export function solve(a:Answers,note="",remote?:Signals):Plan{
 const local=parseIntent(note),signals={...local};
 if(remote)for(const k of Object.keys(local) as (keyof Signals)[])if(remote[k]===true)signals[k]=true;
 const space:Space=signals.small?"compact":a.space;
 const noise:Noise=signals.quiet?"critical":a.noise;
 const fold=a.fold||!!signals.fold;
 const run=!!signals.run||(a.activity==="run"||a.activity==="both");
 const base:Record<Goal,Record<Category,number>>={
 walking:{"walking-pad":11,treadmill:1,"exercise-bike":4,"adjustable-dumbbells":1,"resistance-bands":1},
 cardio:{"walking-pad":6,treadmill:7,"exercise-bike":10,"adjustable-dumbbells":1,"resistance-bands":1},
 strength:{"walking-pad":0,treadmill:0,"exercise-bike":0,"adjustable-dumbbells":12,"resistance-bands":11},
 mixed:{"walking-pad":6,treadmill:3,"exercise-bike":5,"adjustable-dumbbells":8,"resistance-bands":9}
 };
 const score={...base[a.goal]};
 if(space==="compact"){score.treadmill-=9;score["exercise-bike"]-=4;score["walking-pad"]+=2;score["resistance-bands"]+=5;score["adjustable-dumbbells"]+=3;}
 if(noise==="critical"){score.treadmill-=8;score["walking-pad"]-=3;score["exercise-bike"]+=2;score["resistance-bands"]+=3;score["adjustable-dumbbells"]+=2;}
 if(fold){score.treadmill-=4;score["exercise-bike"]-=3;score["walking-pad"]+=2;score["resistance-bands"]+=2;}
 if(run && a.goal!=="strength"){score.treadmill+=11;score["walking-pad"]-=8;}
 const minBudget:Record<Category,number>={"walking-pad":180,treadmill:350,"exercise-bike":200,"adjustable-dumbbells":110,"resistance-bands":30};
 // Heuristic priorities, NOT real SKU price claims.
 const allowed:Record<Goal,Category[]>={
  walking:["walking-pad","exercise-bike","treadmill"],
  cardio:["exercise-bike","walking-pad","treadmill"],
  strength:["adjustable-dumbbells","resistance-bands"],
  mixed:["resistance-bands","adjustable-dumbbells","walking-pad","exercise-bike","treadmill"]
 };
 const order=allowed[a.goal].filter(c=>score[c]>0&&a.budget>=minBudget[c]).sort((x,y)=>score[y]-score[x]);
 const equipment=order.map((c):Path=>({
  id:c,kind:"equipment",category:c,title:label[c],
  reason:"Ταιριάζει προς διερεύνηση με βάση στόχο, χώρο και προτιμήσεις. Πρέπει να επαληθευτούν οι προδιαγραφές κάθε συγκεκριμένου προϊόντος.",
  actions:actions[c]
 }));
 const free=freePlans(a,run);
 const chooseFree=!!signals.noBuy || order.length===0 || (run&&noise==="critical"&&space==="compact"&&a.goal!=="strength");
 const primary=chooseFree?free[0]:equipment[0];
 const alternatives=chooseFree
  ? (signals.noBuy?[free[1],free[2]]:[equipment[0]??free[1],free[2]])
  : [equipment[1]??free[1],free[0]];
 const insights=[
  noise==="critical"?"Λαμβάνεται υπόψη ο περιορισμός θορύβου, χωρίς να θεωρείται κανένα μηχάνημα αθόρυβο.":"Η προτεραιότητα προκύπτει από τον στόχο και την καθημερινή χρήση.",
  space==="compact"?"Η εξοικονόμηση χώρου έχει αυξημένη σημασία.":"Οι πραγματικές διαστάσεις θα ελεγχθούν σε επίπεδο SKU.",
  order.length===0?"Προτείνεται πρακτική διαδρομή χωρίς αγορά, αντί ακατάλληλου εξοπλισμού.":"Δεν εμφανίζονται τιμές και προϊόντα χωρίς τρέχουσα επαλήθευση."
 ];
 if(signals.injury)insights.push("Σε πόνο ή τραυματισμό χρειάζεται αξιολόγηση από επαγγελματία υγείας πριν την άσκηση.");
 return {primary,alternatives,insights,reasoning:remote?"hf-assisted":"contextual"};
}
