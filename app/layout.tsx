import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

// URL canonique du site — à passer au domaine personnalisé via la variable
// d'environnement NEXT_PUBLIC_SITE_URL le jour où il est branché.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://carpe-diem-corse.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Carpe Diem - Location Villa Vue Mer Corse | Pietrosella Ruppione",
  description:
    "Villa 110m² vue mer panoramique, 4 chambres, 8 personnes. Plage du Ruppione à 1km. Location vacances Pietrosella, Corse du Sud.",
  keywords:
    "villa corse location, pietrosella, ruppione, vue mer, ajaccio, vacances corse",
  openGraph: {
    title: "Carpe Diem - Villa Vue Mer en Corse",
    description:
      "Villa 110m² vue mer panoramique, 4 chambres, 8 personnes. Plage du Ruppione à 1km.",
    images: ["/photos/exterieur/exterieur-1.jpeg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
