import type {Metadata} from "next";
import "./globals.css";
import {canonicalOrigin,publicLaunchEnabled} from "@/lib/release";
const launched=publicLaunchEnabled();
const origin=canonicalOrigin();
export const metadata:Metadata={title:"FITMATCH AI | Βρες εξοπλισμό που ταιριάζει στον χώρο σου",description:"Ελληνικός ανεξάρτητος σύμβουλος αγοράς εξοπλισμού γυμναστικής για το σπίτι. Πρώτα η ανάγκη, μετά η επιλογή.",robots:{index:launched,follow:launched},...(launched&&origin?{metadataBase:new URL(origin),alternates:{canonical:"/"}}:{})};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="el"><body>{children}</body></html>}
