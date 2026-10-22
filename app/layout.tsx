import type {Metadata} from "next";
import "./globals.css";
export const metadata:Metadata={title:"FITMATCH AI | Βρες το κατάλληλο fitness προϊόν",description:"Cinematic AI fitness buying advisor: πραγματικά προϊόντα, κατανοητή αξιολόγηση, ανεξάρτητη landing page ανά SKU και επαληθευμένα affiliate links μόνο με προμήθεια πάνω από 20€.",robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="el"><body>{children}</body></html>}
