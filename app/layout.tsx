import type {Metadata} from "next";
import "./globals.css";
export const metadata:Metadata={title:"FITMATCH AI | Δεν έχεις χώρο; Δεν θέλεις θόρυβο; Βρες τη λύση σου",description:"Cinematic Pain-Gap Solver για άσκηση στο σπίτι: μικρός χώρος, θόρυβος, λάθος αγορές. Αναγνώριση ανάγκης, προσωποποιημένες λύσεις και μόνο επαληθευμένα affiliate προϊόντα.",robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="el"><body>{children}</body></html>}
