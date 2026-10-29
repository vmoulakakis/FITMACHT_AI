import Advisor from "@/components/Advisor";
import {publicLinkwisePreviews} from "@/lib/linkwise-public";
export const dynamic="force-dynamic";
export default async function Home(){
 const sections=await Promise.all([
  publicLinkwisePreviews("exercise-bike",1500),
  publicLinkwisePreviews("adjustable-dumbbells",1500),
  publicLinkwisePreviews("resistance-bands",1500),
  publicLinkwisePreviews("treadmill",7000)
 ]);
 const featured=sections.flatMap((items)=>items.slice(0,1));
 return <Advisor featured={featured}/>;
}
