import type {Metadata} from "next";
import CommercialLab from "@/components/CommercialLab";
import {publicLinkwisePreviews} from "@/lib/linkwise-public";
import type {Category} from "@/lib/decision";
import {extraMerchantResearch,historicalMybrandAllowlist} from "@/lib/mikromove-commercial";
import type {ScreenedCandidate} from "@/lib/mikromove-commercial";
import "./lab.css";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"MIKRO/MOVE · Έρευνα εμπορικών προϊόντων",description:"Ερευνητικός πίνακας πραγματικών home-fitness προϊόντων με συντηρητικό οικονομικό μοντέλο και τεκμηριωμένα κενά προμηθειών.",robots:{index:false,follow:false}};
const cats:Category[]=["walking-pad","treadmill","exercise-bike","adjustable-dumbbells","fixed-dumbbells","weight-bench","resistance-bands"];
export default async function CommercialResearchPage(){
 const subsets=await Promise.all(cats.map(async category=>({category,items:await publicLinkwisePreviews(category,100000,fetch,100)})));
 const known = new Set<string>(historicalMybrandAllowlist);
 const historical:ScreenedCandidate[]=subsets.flatMap(group=>group.items.filter(p=>known.has(p.id)).map(p=>({
  id:p.id,title:p.title,priceEur:p.price,category:group.category,imageUrl:p.imageUrl,sourceDate:p.observedAt,
  source:"historical_feed" as const,merchant:"Mybrand.shoes",review:"program_pending" as const,
  sourcePage:"https://mybrand.shoes/el/446_hms"
 })));
 return <CommercialLab items={[...historical,...extraMerchantResearch]}/>;
}
