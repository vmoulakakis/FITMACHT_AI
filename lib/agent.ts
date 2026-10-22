import type {Answers,Offer} from "./decision";
import type {Signals} from "./solutions";
import {solve,parseIntent} from "./solutions";
import {matchAll} from "./matching";
import {suggestNearby} from "./studio-ranking";
export type AgentStage={id:"understand"|"plan"|"verify";title:string;detail:string;state:"done"|"review_needed"};
/** Buyer agent orchestrates contextual understanding, alternative planning,
 * verified catalog retrieval and evidence disclosure. No fabricated data.
 */
export function runAdvisorAgent(a:Answers,note:string,offers:Offer[],catalogMode:string,remote?:Signals){
 const plan=solve(a,note,remote),paths=[plan.primary,...plan.alternatives];
 const matchesByPath=matchAll(paths,a,offers);
 const total=Object.values(matchesByPath).reduce((n,rows)=>n+rows.length,0);
 const researchByPath=Object.fromEntries(paths.map(path=>[path.id,suggestNearby(a,path.category)]));
 const nearby=Object.values(researchByPath).flat().length;
 const intent=parseIntent(note);
 const stages:AgentStage[]=[
  {id:"understand",title:"Κατανόηση του προβλήματος",detail:"Συνδύασα τον στόχο, τον χώρο, το budget και όσα περιέγραψες.",state:"done"},
  {id:"plan",title:"Αξιολόγηση εναλλακτικών",detail:"Εξέτασα εφικτές λύσεις χωρίς να μετρήσω την προμήθεια ως καταλληλότητα.",state:"done"},
  {id:"verify",title:"Εμπορική επαλήθευση",detail:total>0?String(total)+" ελεγμένες προσφορές στις προτεινόμενες λύσεις.":nearby>0?"Προτείνονται "+nearby+" κοντινά πραγματικά SKU προς έλεγχο, χωρίς να βαφτίζονται έτοιμες αγορές.":"Δεν υπάρχουν ακόμα εμπορικά εγκεκριμένα SKU· δίνονται πρακτικές εναλλακτικές λύσεις.",state:total>0?"done":"review_needed"}
 ];
 return {
  plan,matchesByPath,researchByPath,stages,
  sourceStatus:{mode:catalogMode,verifiedMatches:total,purchaseReady:total>0},
  intent:{spaceConcern:!!intent.small,noiseConcern:!!intent.quiet,noBuy:!!intent.noBuy,runConcern:!!intent.run},
  version:"adaptive-near-match-agent-v2"
 };
}
