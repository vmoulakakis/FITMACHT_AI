import type {Goal} from "./decision";

export const FITCHECK_INTENTS = ["recovery","space","routine","strength","cardio","general"] as const;
export type FitCheckIntent = (typeof FITCHECK_INTENTS)[number];
export type FitCheckSource = "guided_rules" | "model_assisted";
export type FitCheckPlan = {
  intent:FitCheckIntent;
  heading:string;
  rationale:string;
  steps:[string,string,string];
  question:string;
  caution:string;
  suggestedGoal:Goal|null;
  equipmentAllowed:boolean;
  source:FitCheckSource;
};

function normalize(value:string):string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("el-GR");
}

const recoveryPattern=/πονο|πονα|τραυμα|φυσιοθερα|αποκαταστα|σπονδυλ|γονατ|αρθρ|εγχειρ|ασθεν|ζαλ|δυσπνοι|στηθο|αναπηρ|pain|injur|rehab|physio|surgery|chest pain/;

export function hasHealthConcern(issue:string):boolean {
  return recoveryPattern.test(normalize(issue));
}

export function classifyIssue(issue:string):FitCheckIntent {
  const text=normalize(issue);
  if(hasHealthConcern(text))return "recovery";
  if(/χωρο|χωρα|μικρο σπιτ|διαμερισ|αποθηκευ|διπλων|space|flat|apartmen/.test(text))return "space";
  if(/χρονο|γραφει|καθομ|κινουμ|βαριε|ξεκινη|συνηθει|κινητρ|work|desk|routine|habit|motivat/.test(text))return "routine";
  if(/δυναμ|μυ|βαρ|αλτηρ|strength|muscl|weights|resistan/.test(text))return "strength";
  if(/τρεξ|περπατ|αντοχ|καρδι|αεροβ|cardio|walk|runn|endur/.test(text))return "cardio";
  return "general";
}

const templates:Record<FitCheckIntent,Omit<FitCheckPlan,"intent"|"source">>={
  recovery:{
    heading:"Πρώτα ασφάλεια, μετά επιλογές",
    rationale:"Αναφέρεις πιθανή ενόχληση ή αποκατάσταση. Μια online περιγραφή δεν αρκεί για να οριστεί ασφαλές πρόγραμμα ή εξοπλισμός.",
    steps:["Κατάγραψε τι σε δυσκολεύει στην καθημερινότητα χωρίς να αυτοδιαγνωστείς.","Συζήτησε με κατάλληλο επαγγελματία υγείας τι είδους κίνηση επιτρέπεται.","Αφού υπάρξει σαφής καθοδήγηση, αξιολόγησε χώρο και εξοπλισμό με βάση τις πραγματικές προδιαγραφές."],
    question:"Έχεις ήδη συγκεκριμένες οδηγίες από επαγγελματία υγείας;",
    caution:"Δεν παρέχουμε ιατρική αξιολόγηση, φυσικοθεραπεία ή θεραπευτικές ασκήσεις. Σε έντονα ή επείγοντα συμπτώματα αναζήτησε άμεσα ιατρική βοήθεια.",
    suggestedGoal:null,equipmentAllowed:false
  },
  space:{
    heading:"Σχεδίασε τη γωνιά σου πριν αγοράσεις",
    rationale:"Η διαθέσιμη επιφάνεια και η αποθήκευση είναι ισχυρότεροι περιορισμοί από έναν γενικό κατάλογο fitness.",
    steps:["Μέτρησε ελεύθερο μήκος, πλάτος και ύψος στον χώρο άσκησης.","Άφησε επαρκή απόσταση ασφαλείας και υπολόγισε τον χώρο αποθήκευσης.","Σύγκρινε μόνο εξοπλισμό με επαληθευμένες διαστάσεις και κατάλληλη χρήση."],
    question:"Πόσο ελεύθερο μήκος και πλάτος διαθέτεις;",
    caution:"Δεν μπορούμε να ισχυριστούμε ότι ένα μηχάνημα χωράει χωρίς επιβεβαιωμένες διαστάσεις.",
    suggestedGoal:"walking",equipmentAllowed:true
  },
  routine:{
    heading:"Χτίσε ρεαλιστική ρουτίνα κίνησης",
    rationale:"Η συνέπεια προηγείται της αγοράς. Χρειάζεται ένα μικρό, επαναλήψιμο βήμα που ταιριάζει στην ημέρα σου.",
    steps:["Διάλεξε μια σταθερή σύντομη περίοδο της ημέρας για ήπια κίνηση.","Ξεκίνα με ό,τι μπορείς να κάνεις χωρίς νέο εξοπλισμό, στον δικό σου ρυθμό.","Αξιολόγησε μετά από μερικές ημέρες αν χρειάζεται πραγματικά κάποια αγορά."],
    question:"Ποια ώρα της ημέρας θα ήταν πιο εύκολο να διατηρήσεις αυτή τη συνήθεια;",
    caution:"Δεν προτείνουμε συγκεκριμένη ένταση ή άσκηση σε άτομα με ιατρικούς περιορισμούς χωρίς επαγγελματική καθοδήγηση.",
    suggestedGoal:"mixed",equipmentAllowed:true
  },
  strength:{
    heading:"Ενδυνάμωση χωρίς περιττό εξοπλισμό",
    rationale:"Η προοδευτική χρήση εξοπλισμού έχει νόημα μόνο όταν ταιριάζει σε χώρο, δυνατότητες και πραγματική ανάγκη.",
    steps:["Όρισε τι θέλεις να βελτιώσεις και πόσο συχνά μπορείς να ασχοληθείς.","Εξέτασε απλές επιλογές με μικρό αποθηκευτικό όγκο αντί για μεγάλο μηχάνημα.","Έλεγξε πραγματικά φορτία, ασφάλεια στερέωσης και οδηγίες πριν επιλέξεις προϊόν."],
    question:"Θέλεις εξοπλισμό που να αποθηκεύεται εύκολα;",
    caution:"Η καταλληλότητα ενός φορτίου είναι προσωπική και δεν τεκμαίρεται από τα στοιχεία του καταλόγου.",
    suggestedGoal:"strength",equipmentAllowed:true
  },
  cardio:{
    heading:"Βρες τον τρόπο κίνησης που σε εξυπηρετεί",
    rationale:"Περπάτημα, τρέξιμο και ποδήλατο έχουν διαφορετικές απαιτήσεις χώρου, θορύβου και καταλληλότητας.",
    steps:["Ξεχώρισε αν ο στόχος σου είναι κυρίως περπάτημα ή πιο έντονη αερόβια άσκηση.","Κατάγραψε αν έχεις περιορισμούς χώρου, θορύβου ή αποθήκευσης.","Πριν από αγορά έλεγξε τεχνικές προδιαγραφές, όριο βάρους και πραγματικές διαστάσεις."],
    question:"Σε ενδιαφέρει κυρίως περπάτημα ή τρέξιμο;",
    caution:"Δεν υποσχόμαστε αθόρυβη λειτουργία ή φυσική καταλληλότητα χωρίς στοιχεία.",
    suggestedGoal:"cardio",equipmentAllowed:true
  },
  general:{
    heading:"Από το πρόβλημα σε ένα σαφές επόμενο βήμα",
    rationale:"Για ουσιαστική πρόταση χρειάζεται να ξεκαθαρίσουμε τον στόχο, όχι να ξεκινήσουμε από προϊόντα.",
    steps:["Περιέγραψε σε μία πρόταση τι θέλεις να γίνει ευκολότερο στην καθημερινότητά σου.","Κατάγραψε χρόνο, χώρο και χρήματα που μπορείς ρεαλιστικά να διαθέσεις.","Δοκίμασε πρώτα μια λύση χωρίς αγορά και έλεγξε αν απαιτείται εξοπλισμός."],
    question:"Τι σε περιορίζει περισσότερο: χρόνος, χώρος ή δυσκολία να ξεκινήσεις;",
    caution:"Οι πληροφορίες είναι γενική καθοδήγηση και όχι ιατρική ή θεραπευτική συμβουλή.",
    suggestedGoal:"mixed",equipmentAllowed:true
  }
};

export function makeFitCheckPlan(issue:string, classified?:FitCheckIntent, source:FitCheckSource="guided_rules"):FitCheckPlan {
  const safeIntent=hasHealthConcern(issue)?"recovery":classified&&FITCHECK_INTENTS.includes(classified)?classified:classifyIssue(issue);
  return {intent:safeIntent,...templates[safeIntent],source:source==="model_assisted"&&classified===safeIntent?"model_assisted":"guided_rules"};
}
