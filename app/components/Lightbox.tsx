"use client";

import { useEffect } from "react";
import Image from "next/image";

export type LightboxPhoto = { src: string; alt: string };

type LightboxProps = {
  photos: LightboxPhoto[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  // Navigation clavier + blocage du scroll de fond.
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, onClose, onPrev, onNext]);

  if (index === null) return null;
  const photo = photos[index];
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute top-4 right-4 text-white/80 hover:text-gold transition-colors p-2"
        onClick={onClose}
        aria-label="Fermer"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <button
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-gold transition-colors p-3"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Photo précédente"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <div
        className="relative max-w-5xl max-h-[85vh] w-full h-full mx-14 sm:mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-contain"
          quality={95}
          sizes="100vw"
        />
      </div>

      <button
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-gold transition-colors p-3"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Photo suivante"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 font-lato text-sm text-center px-4">
        {index + 1} / {photos.length}
        {photo.alt ? ` — ${photo.alt}` : ""}
      </div>
    </div>
  );
}
