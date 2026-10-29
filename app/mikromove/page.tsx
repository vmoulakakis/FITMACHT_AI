import type {Metadata} from "next";
import MikroMove from "@/components/MikroMove";
import type {Category} from "@/lib/decision";
import {publicLinkwisePreviews} from "@/lib/linkwise-public";
import "./mikromove.css";
export const dynamic="force-dynamic";
export const metadata:Metadata={
 title:"MIKRO/MOVE | Έξυπνη κίνηση & ευεξία για μικρούς χώρους",
 description:"AI οδηγός καθημερινής κίνησης και ευεξίας για την Ελλάδα. Ξεκίνα από το πρόβλημά σου, ανακάλυψε 100 εξειδικευμένους στόχους έρευνας και δες τεκμηριωμένες επιλογές — χωρίς ψεύτικες προσφορές.",
 keywords:["ευεξία στο σπίτι","γυμναστική μικρός χώρος","ήσυχη άσκηση","ενδυνάμωση στο σπίτι","μικρό σπίτι γυμναστική","εργονομία γραφείου","έξυπνες λύσεις σπιτιού"],
 robots:{index:true,follow:true},
 alternates:{canonical:"https://fitmatch-ai-taupe.vercel.app/mikromove"},
 twitter:{card:"summary_large_image",title:"MIKRO/MOVE · Λίγος χώρος. Πολλή ζωή.",description:"100 ιδέες, 10 καθημερινά προβλήματα, μια πιο έξυπνη επιλογή."},
 openGraph:{type:"website",locale:"el_GR",title:"MIKRO/MOVE | Λίγος χώρος. Πολλή ζωή.",description:"Ελληνικός οδηγός προϊόντων-λύσεων για μικρούς χώρους, καθημερινή κίνηση και ευεξία."}
};
export default async function MikroMovePage(){
 const categories:Category[]=["walking-pad","treadmill","exercise-bike","adjustable-dumbbells","fixed-dumbbells","resistance-bands","weight-bench"];
 const groups=await Promise.all(categories.map(async(category)=>({category,examples:await publicLinkwisePreviews(category,100000,fetch,80)})));
 const examples=groups.flatMap(g=>g.examples.map(p=>({id:p.id,title:p.title,price:p.price,category:g.category,imageUrl:p.imageUrl,observedAt:p.observedAt})));
 return <MikroMove examples={examples}/>;
}
