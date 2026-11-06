import type {Goal as AdvisorGoal,Space as AdvisorSpace} from "./decision";

export type Goal = "walking" | "cardio" | "strength";
export type Space = "compact" | "medium" | "large";
export type FitcheckSelection = {goal:Goal;space:Space};
export const goals:readonly {id:Goal;label:string;detail:string}[]=[
 {id:"walking",label:"Περπάτημα",detail:"Περισσότερη κίνηση στο σπίτι"},
 {id:"cardio",label:"Αντοχή / cardio",detail:"Συστηματική αερόβια άσκηση"},
 {id:"strength",label:"Ενδυνάμωση",detail:"Δύναμη με ελεγχόμενο χώρο"}
];
export const spaces:readonly {id:Space;label:string;detail:string}[]=[
 {id:"compact",label:"Μικρός",detail:"Έως μία γωνιά δωματίου"},
 {id:"medium",label:"Μεσαίος",detail:"Ελεύθερο σημείο άσκησης"},
 {id:"large",label:"Άνετος",detail:"Ξεχωριστός χώρος"}
];
type Hint={title:string;description:string;check:string};
const hints:Record<Goal,Record<Space,Hint>>={
 walking:{
  compact:{title:"Σημασία έχει το αποτύπωμα",description:"Για περπάτημα σε περιορισμένο χώρο, το μήκος, η αποθήκευση και η ασφάλεια χρειάζονται τεχνική επιβεβαίωση.",check:"Διαστάσεις χρήσης και αποθήκευσης"},
  medium:{title:"Χώρος για καθημερινό περπάτημα",description:"Εξέτασε κατηγορία χαμηλής έντασης πριν αγοράσεις μεγάλο μηχάνημα. Η τελική σύσταση εξαρτάται και από θόρυβο και budget.",check:"Χώρος ασφαλούς πρόσβασης"},
  large:{title:"Πρώτα η συνήθεια, έπειτα ο εξοπλισμός",description:"Έχεις περισσότερες επιλογές, αλλά η καθημερινή χρήση και ο τύπος δραστηριότητας έχουν μεγαλύτερη αξία από το μέγεθος.",check:"Πραγματικός τρόπος χρήσης"}
 },
 cardio:{
  compact:{title:"Cardio με πραγματικά όρια χώρου",description:"Το ότι ένας εξοπλισμός χαρακτηρίζεται compact δεν αποδεικνύει ότι χωράει. Θα ελεγχθούν και ο θόρυβος και ο τρόπος άσκησης.",check:"Αποτύπωμα, θόρυβος και όρια χρήσης"},
  medium:{title:"Εξισορρόπηση αντοχής και χώρου",description:"Ποδήλατο ή άλλη κατηγορία cardio μπορεί να αξίζει αξιολόγηση. Η τελική επιλογή απαιτεί περισσότερα στοιχεία.",check:"Διαστάσεις, αντίσταση, συντήρηση"},
  large:{title:"Περισσότερη ελευθερία, όχι αυτόματη αγορά",description:"Ο χώρος σου δίνει ευελιξία αλλά δεν καθορίζει την κατάλληλη κατηγορία χωρίς στόχο χρήσης, budget και πραγματικές προδιαγραφές.",check:"Πρόθεση χρήσης και τεχνικά χαρακτηριστικά"}
 },
 strength:{
  compact:{title:"Δύναμη χωρίς περιττό όγκο",description:"Λάστιχα ή επιλεγμένα ελεύθερα βάρη είναι κατηγορίες που μπορούν να εξεταστούν. Δεν προκύπτει ακόμη επαληθευμένο προϊόν.",check:"Φορτίο, αποθήκευση, ασφάλεια"},
  medium:{title:"Ευελιξία στην ενδυνάμωση",description:"Ρυθμιζόμενα βάρη και βοηθητικός εξοπλισμός αξιολογούνται με βάση τον χώρο, το πραγματικό φορτίο και την προπονητική χρήση.",check:"Χώρος κίνησης και εύρος βαρών"},
  large:{title:"Σχεδίαση από τον στόχο, όχι το μηχάνημα",description:"Ο διαθέσιμος χώρος μπορεί να επιτρέπει μεγαλύτερο εξοπλισμό, αλλά η λειτουργική αξία προηγείται της αγοράς.",check:"Ασφάλεια, φόρτιση και εγγύηση"}
 }
};
export function getFitCheckSuggestion(goal:Goal,space:Space):Hint {return hints[goal][space];}
export function fitCheckAdvisorUrl(selection:FitcheckSelection):string {
 const query=new URLSearchParams({start:"1",goal:selection.goal,space:selection.space});
 return "/equipment?"+query.toString();
}
export function parseFitCheckSeed(params:Record<string,string|string[]|undefined>):{goal:AdvisorGoal;space:AdvisorSpace}|null{
 const value=(key:string)=>typeof params[key]==="string"?params[key]:null;
 const goal=value("goal"),space=value("space");
 if(value("start")!=="1"||!goals.some(v=>v.id===goal)||!spaces.some(v=>v.id===space))return null;
 return {goal:goal as AdvisorGoal,space:space as AdvisorSpace};
}
