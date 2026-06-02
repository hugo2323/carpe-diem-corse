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

export const metadata: Metadata = {
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
    <html lang="fr">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
