import Storefront from "@/components/Storefront";
import {catalog} from "@/lib/catalog";
import {getStoreListings} from "@/lib/storefront";
export const dynamic="force-dynamic";
export default async function Home(){const c=await catalog();return <Storefront products={getStoreListings(c.offers)} catalogMode={c.mode}/>;}
