import type {Metadata} from "next";
import FitMatchHome from "@/components/FitMatchHome";
import {publicLinkwisePreviews} from "@/lib/linkwise-public";
import type {Category} from "@/lib/decision";
import "./home.css";
export const dynamic="force-dynamic";
export const metadata:Metadata={
 title:"FitMatch AI | Βρες τον κατάλληλο fitness εξοπλισμό για εσένα",
 description:"Έξυπνος ελληνικός σύμβουλος fitness εξοπλισμού. Στόχος, διαθέσιμος χώρος, θόρυβος, budget και τεκμηριωμένη επιλογή, χωρίς υποχρεωτική αγορά.",
 robots:{index:false,follow:false}
};
export default async function Home(){
 const categories:Category[]=["exercise-bike","adjustable-dumbbells","resistance-bands","treadmill"];
 const results=await Promise.all(categories.map(async category=>({category,items:await publicLinkwisePreviews(category,1500,fetch,1)})));
 const featured=results.flatMap(group=>group.items.map(item=>({...item,category:group.category}))).slice(0,3);
 return <FitMatchHome featured={featured}/>;
}
