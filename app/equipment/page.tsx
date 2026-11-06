import type {Metadata} from "next";
import Advisor from "@/components/Advisor";
import {publicLinkwisePreviews} from "@/lib/linkwise-public";
export const dynamic="force-dynamic";
export const metadata:Metadata={
 title:"Σύμβουλος αγοράς εξοπλισμού | FitMatch AI",
 description:"Έξι βήματα για να αξιολογήσεις στόχο, χώρο, θόρυβο, budget και αποθήκευση, πριν επιλέξεις εξοπλισμό.",
 robots:{index:false,follow:false}
};
export default async function Equipment(){
 const sections=await Promise.all([
  publicLinkwisePreviews("exercise-bike",1500),
  publicLinkwisePreviews("adjustable-dumbbells",1500),
  publicLinkwisePreviews("resistance-bands",1500),
  publicLinkwisePreviews("treadmill",7000),
  publicLinkwisePreviews("fixed-dumbbells",1500),
  publicLinkwisePreviews("weight-bench",1500)
 ]);
 return <Advisor featured={sections.flatMap(items=>items.slice(0,1))}/>;
}
