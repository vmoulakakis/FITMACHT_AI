import type {Metadata} from "next";
import FitMatchHome from "@/components/FitMatchHome";
import "./home.css";
export const metadata:Metadata={
 title:"FitMatch AI | Η σωστή επιλογή αρχίζει από εσένα",
 description:"Ελληνικός fitness buying advisor για εξοπλισμό, χώρο και καθημερινή κίνηση. Δωρεάν FitCheck, έξυπνη αξιολόγηση και FitMatch 360° Studio.",
 robots:{index:false,follow:false}
};
export default function Home(){return <FitMatchHome/>;}
