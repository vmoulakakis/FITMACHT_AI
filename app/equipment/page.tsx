import type {Metadata} from "next";
import Advisor from "@/components/Advisor";
import {publicLinkwisePreviews} from "@/lib/linkwise-public";
import {parseFitCheckSeed} from "@/lib/fitcheck";
export const dynamic="force-dynamic";
export const metadata:Metadata={
 title:"Σύμβουλος αγοράς εξοπλισμού | FitMatch AI",
 description:"Βρες τεκμηριωμένα κατάλληλη κατηγορία εξοπλισμού για τον στόχο, τον χώρο, τον θόρυβο και το budget σου.",
 robots:{index:false,follow:false}
};
export default async function Equipment({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const [p,sections]=await Promise.all([searchParams,Promise.all([
  publicLinkwisePreviews("exercise-bike",1500),
  publicLinkwisePreviews("adjustable-dumbbells",1500),
  publicLinkwisePreviews("resistance-bands",1500),
  publicLinkwisePreviews("treadmill",7000),
  publicLinkwisePreviews("fixed-dumbbells",1500),
  publicLinkwisePreviews("weight-bench",1500)
 ])]);
 return <Advisor seed={parseFitCheckSeed(p)} featured={sections.flatMap(items=>items.slice(0,1))}/>;
}
