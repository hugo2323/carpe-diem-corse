"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox, { type LightboxPhoto } from "./Lightbox";
import Icon from "./Icon";

// Ordre = ordre d'ouverture dans la lightbox.
const photos: (LightboxPhoto & { className: string; size: string })[] = [
  {
    src: "/photos/exterieur/exterieur-1.jpeg",
    alt: "Vue extérieure de la villa Carpe Diem",
    className: "col-span-2 md:col-span-3 h-64 md:h-96",
    size: "100vw",
  },
  {
    src: "/photos/interieur/salon%20-%204.jpeg",
    alt: "Salon",
    className: "h-48 md:h-64",
    size: "(max-width: 768px) 50vw, 33vw",
  },
  {
    src: "/photos/exterieur/exterieur-4.jpeg",
    alt: "Extérieur",
    className: "h-48 md:h-64",
    size: "(max-width: 768px) 50vw, 33vw",
  },
  {
    src: "/photos/exterieur/Coucher%20de%20soleil%20rouppione.jpeg",
    alt: "Coucher de soleil",
    className: "col-span-2 md:col-span-1 h-48 md:h-64",
    size: "(max-width: 768px) 100vw, 33vw",
  },
  {
    src: "/photos/interieur/chambre%204%20-%201.jpeg",
    alt: "Chambre",
    className: "h-48 md:h-64",
    size: "(max-width: 768px) 50vw, 33vw",
  },
  {
    src: "/photos/interieur/cuisine.jpeg",
    alt: "Cuisine",
    className: "h-48 md:h-64",
    size: "(max-width: 768px) 50vw, 33vw",
  },
  {
    src: "/photos/interieur/terasse.jpeg",
    alt: "Terrasse",
    className: "h-48 md:h-64",
    size: "(max-width: 768px) 50vw, 33vw",
  },
];

export default function GalleryPreview() {
  const [index, setIndex] = useState<number | null>(null);

  const close = () => setIndex(null);
  const prev = () =>
    setIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null));
  const next = () =>
    setIndex((i) => (i !== null ? (i + 1) % photos.length : null));

  return (
    <section id="galerie" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold font-lato text-sm tracking-[0.3em] uppercase mb-3 block">
            Galerie
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-sea-blue mb-4">
            La villa en images
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {photos.map((photo, i) => (
            <button
              type="button"
              key={photo.src}
              onClick={() => setIndex(i)}
              aria-label={`Agrandir : ${photo.alt}`}
              className={`group relative rounded-xl overflow-hidden ${photo.className}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={photo.size}
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Icon name="expand" size={28} />
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/galerie"
            className="inline-flex items-center gap-3 border-2 border-sea-blue text-sea-blue hover:bg-sea-blue hover:text-white px-8 py-4 rounded font-lato font-bold tracking-wider uppercase text-sm transition-all duration-200"
          >
            Voir toutes les photos
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <Lightbox
        photos={photos}
        index={index}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </section>
  );
}
