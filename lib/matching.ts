import {eligible,type Answers,type Offer} from "./decision";
import type {Path} from "./solutions";
export type MatchOffer=Pick<Offer,"id"|"title"|"merchant"|"price"|"lastSeen"|"imageUrl"> & {tag:string;reason:string;evidenceUrl:string|null;category:string;review:"verified"};
export type MatchMap=Record<string,MatchOffer[]>;
export function matchPath(path:Path,a:Answers,offers:Offer[],now=Date.now()):MatchOffer[]{
 if(path.kind!=="equipment"||!path.category)return [];
 return offers.filter(o=>o.category===path.category && eligible(o,a.budget,7,now).ok)
  .sort((x,y)=>x.price-y.price||Date.parse(y.lastSeen)-Date.parse(x.lastSeen))
  .slice(0,3).map((o,i)=>({
   id:o.id,title:o.title,merchant:o.merchant,price:o.price,lastSeen:o.lastSeen,
   imageUrl:o.imageUrl??null,evidenceUrl:o.urlEvidence??null,category:o.category,review:"verified",
   tag:i===0?"Επαληθευμένη οικονομικότερη":i===1?"Εναλλακτική":"Επιπλέον ελεγμένη",
   reason:"Πληροί τα ελάχιστα τεκμηριωμένα κριτήρια κατηγορίας, τιμής, stock και εμπορικών όρων. Έλεγξε τα τεχνικά χαρακτηριστικά στην πρωτογενή πηγή."
  }));
}
export function matchAll(paths:Path[],a:Answers,offers:Offer[],now=Date.now()):MatchMap{
 return Object.fromEntries(paths.map(p=>[p.id,matchPath(p,a,offers,now)]));
}
