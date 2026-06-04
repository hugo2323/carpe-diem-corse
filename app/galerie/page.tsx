"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Lightbox from "../components/Lightbox";
import Icon from "../components/Icon";

type FilterType = "tous" | "exterieur" | "interieur";

const photos = [
  // Extérieur - photos nommées
  { src: "/photos/exterieur/exterieur-1.jpeg", alt: "Vue extérieure principale", category: "exterieur" as const },
  { src: "/photos/exterieur/exterieur-2.jpeg", alt: "Façade de la villa", category: "exterieur" as const },
  { src: "/photos/exterieur/exterieur-3.jpeg", alt: "Jardin et terrasse", category: "exterieur" as const },
  { src: "/photos/exterieur/exterieur-4.jpeg", alt: "Vue de la terrasse", category: "exterieur" as const },
  { src: "/photos/exterieur/exterieur-5.jpeg", alt: "Extérieur 5", category: "exterieur" as const },
  { src: "/photos/exterieur/Coucher%20de%20soleil%20rouppione.jpeg", alt: "Coucher de soleil sur le Ruppione", category: "exterieur" as const },
  // Extérieur - photos WA
  { src: "/photos/exterieur/IMG-20220916-WA0002.jpg", alt: "Extérieur", category: "exterieur" as const },
  { src: "/photos/exterieur/IMG-20220916-WA0007.jpg", alt: "Extérieur", category: "exterieur" as const },
  { src: "/photos/exterieur/IMG-20220916-WA0019.jpg", alt: "Extérieur", category: "exterieur" as const },
  { src: "/photos/exterieur/IMG-20220916-WA0020.jpg", alt: "Extérieur", category: "exterieur" as const },
  { src: "/photos/exterieur/IMG-20220916-WA0025.jpg", alt: "Extérieur", category: "exterieur" as const },
  { src: "/photos/exterieur/IMG-20220916-WA0026.jpg", alt: "Extérieur", category: "exterieur" as const },
  { src: "/photos/exterieur/IMG-20220916-WA0027.jpg", alt: "Extérieur", category: "exterieur" as const },
  { src: "/photos/exterieur/IMG-20220916-WA0034.jpg", alt: "Extérieur", category: "exterieur" as const },
  // Intérieur - photos nommées
  { src: "/photos/interieur/salon%20-%201.jpeg", alt: "Salon vue 1", category: "interieur" as const },
  { src: "/photos/interieur/salon%20-%202.jpeg", alt: "Salon vue 2", category: "interieur" as const },
  { src: "/photos/interieur/salon%20-%203.jpeg", alt: "Salon vue 3", category: "interieur" as const },
  { src: "/photos/interieur/salon%20-%204.jpeg", alt: "Salon vue 4", category: "interieur" as const },
  { src: "/photos/interieur/cuisine.jpeg", alt: "Cuisine", category: "interieur" as const },
  { src: "/photos/interieur/terasse.jpeg", alt: "Terrasse", category: "interieur" as const },
  { src: "/photos/interieur/chambre%201%20-%201.jpeg", alt: "Chambre 1", category: "interieur" as const },
  { src: "/photos/interieur/chambre%201%20-%202.jpeg", alt: "Chambre 1 vue 2", category: "interieur" as const },
  { src: "/photos/interieur/chambre%202.jpeg", alt: "Chambre 2", category: "interieur" as const },
  { src: "/photos/interieur/chambre%203.jpeg", alt: "Chambre 3", category: "interieur" as const },
  { src: "/photos/interieur/chambre%204%20-%201.jpeg", alt: "Chambre 4", category: "interieur" as const },
  { src: "/photos/interieur/chambre%204%20-%202.jpeg", alt: "Chambre 4 vue 2", category: "interieur" as const },
  { src: "/photos/interieur/salle%20de%20bain%20-1.jpeg", alt: "Salle de bain", category: "interieur" as const },
  { src: "/photos/interieur/salle%20de%20bain%20-%202.jpeg", alt: "Salle de bain vue 2", category: "interieur" as const },
  // Intérieur - photos WA
  { src: "/photos/interieur/IMG-20220916-WA0000.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0003.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0004.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0008.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0009.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0010.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0011.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0012.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0013.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0015.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0016.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0017.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0021.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0022.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0023.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0024.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0028.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0029.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0030.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0031.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0032.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0033.jpg", alt: "Intérieur", category: "interieur" as const },
  { src: "/photos/interieur/IMG-20220916-WA0037.jpg", alt: "Intérieur", category: "interieur" as const },
];

export default function GaleriePage() {
  const [filter, setFilter] = useState<FilterType>("tous");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = filter === "tous" ? photos : photos.filter((p) => p.category === filter);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null));

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <div className="pt-24 pb-12 bg-sea-blue text-center px-4">
        <span className="text-gold font-lato text-sm tracking-[0.3em] uppercase mb-3 block">
          Photos
        </span>
        <h1 className="font-playfair text-4xl md:text-5xl text-white mb-4">
          Galerie
        </h1>
        <p className="font-lato text-white/70 text-base max-w-xl mx-auto">
          Découvrez la villa Carpe Diem sous toutes ses facettes
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex justify-center gap-3 mb-10">
          {(["tous", "exterieur", "interieur"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-lato text-sm uppercase tracking-wider px-6 py-2.5 rounded-full border transition-all duration-200 ${
                filter === f
                  ? "bg-sea-blue text-white border-sea-blue"
                  : "bg-white text-sea-blue border-sea-blue/30 hover:border-sea-blue"
              }`}
            >
              {f === "tous" ? "Tous" : f === "exterieur" ? "Extérieur" : "Intérieur"}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {filtered.map((photo, index) => (
            <div
              key={photo.src}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Icon name="expand" size={30} />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-lato text-sea-blue hover:text-gold transition-colors duration-200 text-sm uppercase tracking-wider"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>

      <Lightbox
        photos={filtered}
        index={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prev}
        onNext={next}
      />

      <Footer />
    </div>
  );
}
