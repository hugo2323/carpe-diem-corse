"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function GaleriePage() {
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
        <div className="flex items-center justify-center h-80 bg-white rounded-xl border border-sand shadow-sm">
          <p className="font-lato text-gray-400 text-sm tracking-wider uppercase">
            Photos à venir
          </p>
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

      <Footer />
    </div>
  );
}
