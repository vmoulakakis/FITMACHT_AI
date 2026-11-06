
import {commerceEligible,journeyTier,type Barrier,type Need,type Safety} from "./movement-intelligence";
export type Preference="mediterranean"|"vegetarian"|"unsure";
export type Setting="home"|"outdoors"|"flexible";
export type Budget="low"|"medium"|"high";
export type PlanInput={need:Need;barrier:Barrier;minutes:3|5|10;safety:Safety;preference:Preference;setting:Setting;budget:Budget};
export type ProductOption={id:string;title:string;merchant:string;price:number;imageUrl:string|null;trackingUrl:string;category:string;lastSeen:string};
export type Program={tier:"wellness"|"professional"|"urgent";heading:string;goal:string;movement:string[];food:string[];weekly:string[];coaching:string[];expertReview:string;informationOnly:boolean;sources:{label:string;url:string}[]};
const objectives:Record<Need,string>={
 desk:"Να διακόπτω την πολύωρη καθιστική καθημερινότητα",
 motivation:"Να αποκτήσω μια κίνηση που πραγματικά μου αρέσει",
 confidence:"Να ξαναβρώ εμπιστοσύνη στις καθημερινές δυνατότητές μου",
 pain:"Να βρω κατάλληλη βοήθεια όταν η κίνηση με δυσκολεύει",
 rehab:"Να ακολουθήσω σωστά το πρόγραμμα του θεραπευτή μου",
 independence:"Να βελτιώσω τη συμμετοχή στην καθημερινότητά μου",
 care:"Να υποστηρίξω με ασφάλεια τον άνθρωπό μου",
 fitness:"Να εντάξω περισσότερη δραστηριότητα στη ζωή μου"
};
const barrierTips:Record<Barrier,string>={
 time:"Σύνδεσε την ευχάριστη δραστηριότητα με μία ήδη σταθερή στιγμή της ημέρας.",
 energy:"Διάλεξε ευχάριστη δραστηριότητα και τη μικρότερη δυνατή πρώτη εκδοχή της.",
 body:"Αν υπάρχει πόνος ή λειτουργικός περιορισμός, συζήτησε πρώτα με κατάλληλο επαγγελματία.",
 confidence:"Δώσε προτεραιότητα στη σιγουριά, στην ευκολία και στη σταδιακή επανεκκίνηση.",
 space:"Χρησιμοποίησε μόνο ασφαλές και προσβάσιμο περιβάλλον· η κίνηση δεν απαιτεί αγορά.",
 routine:"Διάλεξε μουσική, παρέα ή δραστηριότητα που ήδη απολαμβάνεις."
};
const foodGeneral=[
 "Φτιάξε γεύματα με ποικιλία λαχανικών, φρούτων, οσπρίων και δημητριακών ολικής άλεσης, ανάλογα με τις ανάγκες και τις προτιμήσεις σου.",
 "Προτίμησε τρόφιμα με μικρότερο βαθμό επεξεργασίας· περιόρισε το πολύ αλάτι, τα πρόσθετα σάκχαρα και τα λιπαρά που πρέπει να καταναλώνονται με μέτρο.",
 "Η διατροφή σου πρέπει να είναι επαρκής, ποικίλη, ισορροπημένη και ασφαλής. Δεν ορίζονται θερμίδες, ποσότητες ή θεραπευτικά διατροφικά σχήματα από το AI."
];
const foodVegetarian=[
 "Επίλεξε ποικιλία από όσπρια, λαχανικά, φρούτα, ξηρούς καρπούς και δημητριακά ολικής άλεσης.",
 "Για πλήρες εξατομικευμένο χορτοφαγικό πρόγραμμα ζήτησε από διαιτολόγο αξιολόγηση θρεπτικών συστατικών και προσωπικών αναγκών.",
 "Δεν προτείνονται αυτόματα θερμίδες, συμπληρώματα ή θεραπευτικές δίαιτες."
];
export const evidence=[
 {label:"WHO — Physical activity and sedentary behaviour guidelines",url:"https://www.ncbi.nlm.nih.gov/books/NBK566046/"},
 {label:"WHO — Healthy diet, 26 January 2026",url:"https://www.who.int/news-room/fact-sheets/detail/healthy-diet"},
 {label:"NICE — Behaviour change PH49",url:"https://www.nice.org.uk/guidance/ph49/chapter/Recommendations"}
];
export function validPlanInput(input:unknown):input is PlanInput{
 if(!input||typeof input!=="object")return false;
 const p=input as Record<string,unknown>;
 return ["desk","motivation","confidence","pain","rehab","independence","care","fitness"].includes(String(p.need)) &&
 ["time","energy","body","confidence","space","routine"].includes(String(p.barrier)) &&
 [3,5,10].includes(Number(p.minutes)) &&
 ["well","clinical","urgent"].includes(String(p.safety)) &&
 ["mediterranean","vegetarian","unsure"].includes(String(p.preference)) &&
 ["home","outdoors","flexible"].includes(String(p.setting)) &&
 ["low","medium","high"].includes(String(p.budget));
}
export function buildProgram(p:PlanInput):Program {
 const tier=journeyTier(p.need,p.barrier,p.safety);
 if(tier==="urgent")return {
 tier,heading:"Η ασφάλεια προηγείται",goal:objectives[p.need],
 movement:["Μην ξεκινήσεις πρόγραμμα δραστηριότητας ή ασκήσεις βάσει αυτού του οδηγού.","Για νέο, σοβαρό ή ξαφνικό σύμπτωμα αναζήτησε άμεση ιατρική βοήθεια — στην Ελλάδα 112 ή 166."],
 food:["Δεν παρέχεται διατροφική συνταγή σε αυτή την περίπτωση."],weekly:[],
 coaching:[],expertReview:"Απαιτείται κατάλληλη επείγουσα ιατρική αξιολόγηση.",informationOnly:true,sources:evidence};
 if(tier==="professional")return {
 tier,heading:"Η προσωπική σου διαδρομή υποστήριξης",goal:objectives[p.need],
 movement:["Συζήτησε με τον γιατρό ή τον φυσικοθεραπευτή ποιος λειτουργικός στόχος είναι κατάλληλος για σένα.","Χρησιμοποίησε μόνο τις ασκήσεις και τον εξοπλισμό που έχει εγκρίνει ο επαγγελματίας που σε παρακολουθεί.","Ζήτησε σαφείς οδηγίες για περιορισμούς, συχνότητα και πότε χρειάζεται επανεκτίμηση."],
 food:["Για κλινικές ή ειδικές διατροφικές ανάγκες, ατομική αξιολόγηση από διαιτολόγο-διατροφολόγο.","Δεν δημιουργείται αυτόματα δίαιτα, πρόγραμμα θερμίδων ή θεραπευτικές διατροφικές συστάσεις."],
 weekly:["Κατέγραψε ποιος λειτουργικός στόχος είναι σημαντικός για σένα.","Οργάνωσε τις συνεδρίες και τις οδηγίες που έχει ήδη εγκρίνει ο θεραπευτής.","Σημείωσε πρακτικά ερωτήματα για τον επόμενο επανέλεγχο."],
 coaching:["Μικρή, εφικτή οργάνωση χωρίς ενοχές.","Συντονισμός με επαγγελματίες υγείας, όχι αντικατάστασή τους."],
 expertReview:"Ασκήσεις και εξατομικευμένη διατροφή: χρειάζονται έγκριση γυμναστή/φυσικοθεραπευτή και διαιτολόγου-διατροφολόγου, ανά περίπτωση.",
 informationOnly:true,sources:evidence};
 const movement=[
 "Διάλεξε μια ευχάριστη, γενική δραστηριότητα, όπως περπάτημα ή ενεργό διάλειμμα, ανάλογα με τις δυνατότητές σου.",
 "Ξεκίνα από μικρή διάρκεια και προσάρμοσε σταδιακά, χωρίς να πιέζεσαι. Τα "+p.minutes+" λεπτά είναι στόχος οργάνωσης, όχι ιατρική συνταγή.",
 p.setting==="home"?"Σκέψου ένα ασφαλές, άνετο σημείο στο σπίτι.":p.setting==="outdoors"?"Σκέψου μια προσβάσιμη, ασφαλή εξωτερική διαδρομή.":"Μπορείς να επιλέγεις κάθε μέρα το περιβάλλον που σε εξυπηρετεί.",
 barrierTips[p.barrier]
 ];
 return {tier,heading:"Η δική σου 360° αφετηρία",goal:objectives[p.need],movement,
 food:p.preference==="vegetarian"?foodVegetarian:foodGeneral,
 weekly:["Δευτέρα — επέλεξε μια μικρή ευχάριστη στιγμή κίνησης.",
 "Τρίτη — αναγνώρισε τι σε βοήθησε ή σε εμπόδισε.",
 "Τετάρτη — δοκίμασε ξανά, χωρίς πίεση για επιδόσεις.",
 "Πέμπτη — πρόσθεσε παρέα, μουσική ή μια ευχάριστη υπενθύμιση.",
 "Παρασκευή — παρατήρησε πότε νιώθεις πιο διαθέσιμος.",
 "Σαββατοκύριακο — διάλεξε αν θέλεις να επαναλάβεις ή να προσαρμόσεις."],
 coaching:["Η συνέπεια δεν απαιτεί τελειότητα.",barrierTips[p.barrier]],
 expertReview:"Βάση γενικής ενημέρωσης WHO/NICE. Οι ασκήσεις με συγκεκριμένο εξοπλισμό και τα εξατομικευμένα διατροφικά πλάνα χρειάζονται έλεγχο και έγκριση από επαγγελματίες πριν παρουσιαστούν ως ειδικά εγκεκριμένα.",
 informationOnly:true,sources:evidence};
}
export function allowProductCheckout(p:PlanInput):boolean {
 return commerceEligible(p.need,p.barrier,p.safety);
}
