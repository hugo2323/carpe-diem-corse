"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type FilterType = "tous" | "exterieur" | "interieur";

const photos = [
  { src: "/photos/exterieur/exterieur-1.jpeg", alt: "Vue extérieure principale", category: "exterieur" as const },
  { src: "/photos/exterieur/exterieur-2.jpeg", alt: "Façade de la villa", category: "exterieur" as const },
  { src: "/photos/exterieur/exterieur-3.jpeg", alt: "Jardin et terrasse", category: "exterieur" as const },
  { src: "/photos/exterieur/exterieur-4.jpeg", alt: "Vue de la terrasse", category: "exterieur" as const },
  { src: "/photos/exterieur/Coucher de soleil rouppione.jpeg", alt: "Coucher de soleil sur le Ruppione", category: "exterieur" as const },
  { src: "/photos/interieur/salon - 2.jpeg", alt: "Salon vue 2", category: "interieur" as const },
  { src: "/photos/interieur/salon - 4.jpeg", alt: "Salon vue 4", category: "interieur" as const },
  { src: "/photos/interieur/chambre 4 - 1.jpeg", alt: "Chambre 4", category: "interieur" as const },
  { src: "/photos/interieur/cuisine.jpeg", alt: "Cuisine", category: "interieur" as const },
  { src: "/photos/interieur/terasse.jpeg", alt: "Terrasse intérieure", category: "interieur" as const },
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
                <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ⊕
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

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gold transition-colors"
            onClick={closeLightbox}
          >
            ×
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gold transition-colors p-4"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            ‹
          </button>
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              fill
              className="object-contain"
              quality={95}
            />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gold transition-colors p-4"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 font-lato text-sm">
            {lightboxIndex + 1} / {filtered.length} — {filtered[lightboxIndex].alt}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
