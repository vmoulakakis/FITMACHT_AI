import type {Metadata} from "next";
import "./globals.css";
export const metadata:Metadata={title:"FITMATCH AI | Βρες εξοπλισμό που ταιριάζει στον χώρο σου",description:"Ελληνικός ανεξάρτητος σύμβουλος αγοράς εξοπλισμού γυμναστικής για το σπίτι. Πρώτα η ανάγκη, μετά η επιλογή.",robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="el"><body>{children}</body></html>}
