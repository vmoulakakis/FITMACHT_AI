import type {Metadata} from "next";
import ProductExplorer from "@/components/ProductExplorer";
import {publicLinkwisePreviews} from "@/lib/linkwise-public";
import type {Category} from "@/lib/decision";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Πραγματικά προϊόντα home fitness | FITMATCH AI",robots:{index:false,follow:false}};
const categories:Category[]=["exercise-bike","treadmill","walking-pad","adjustable-dumbbells","fixed-dumbbells","weight-bench","resistance-bands"];
export default async function ProductsPage(){
 const groups=await Promise.all(categories.map(async category=>({category,products:await publicLinkwisePreviews(category,100000,fetch,90)})));
 const items=groups.flatMap(g=>g.products.map(p=>({...p,category:g.category})));
 return <ProductExplorer items={items}/>;
}
