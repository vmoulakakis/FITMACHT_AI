import type {Metadata} from "next";
import Experience from "./Experience";
import "./next.css";
import {publicLinkwisePreviews} from "@/lib/linkwise-public";
import type {Category} from "@/lib/decision";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"FitMatch NEXT | Κίνηση που ταιριάζει στη ζωή σου",description:"Η κίνηση είναι περισσότερο από γυμναστική. Ανεξάρτητος ελληνικός οδηγός συνήθειας, λειτουργικότητας και τεκμηριωμένης υποστήριξης.",robots:{index:false,follow:false}};
export default async function Page(){
 const cats:Category[]=["exercise-bike","resistance-bands","fixed-dumbbells"];
 const sets=await Promise.all(cats.map(async category=>({category,rows:await publicLinkwisePreviews(category,1500,fetch,2)})));
 const previews=sets.flatMap(s=>s.rows.map(r=>({id:r.id,title:r.title,imageUrl:r.imageUrl,category:s.category,status:r.status})));
 return <Experience previews={previews}/>;
}