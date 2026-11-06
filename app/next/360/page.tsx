import type {Metadata} from "next";
import Studio from "./Studio";
import "./studio.css";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"FitMatch 360° | Προσωπικό πρόγραμμα, κίνηση, διατροφή & εξοπλισμός",description:"Προσωπικός οδηγός 360° με γενικές αρχές κίνησης και διατροφής, έως 5 επαληθευμένες επιλογές προϊόντων και A4 PDF με QR codes.",robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const p=await searchParams;
 const get=(key:string)=>typeof p[key]==="string"?p[key] as string:"";
 return <Studio initial={{need:get("need"),barrier:get("barrier"),minutes:get("minutes"),safety:get("safety")}}/>;
}
