"use client";

import Image from "next/image";
import { trackEvent } from "@/lib/gtag";

const photos = [1, 6, 7, 8, 9, 10, 11, 17].map((n) => ({
  src: `/photos/voiture/bigster-${n}.jpg`,
  alt: `Dacia Bigster - photo ${n}`,
}));

const [hero, ...gallery] = photos;

export default function CarSection() {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <span className="text-gold font-lato text-sm tracking-[0.3em] uppercase mb-3 block">
              Location de voiture
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl text-sea-blue mb-6 font-bold">
              Explorez la Corse<br />en toute liberté
            </h2>
            <p className="font-lato text-gray-700 text-lg leading-relaxed mb-8">
              Arrivez sereinement en Corse avec notre{" "}
              <strong className="text-sea-blue">Dacia Bigster 2025</strong>{" "}
              disponible à la location. Idéale pour explorer l&apos;île en toute
              liberté — des calanques aux cols de montagne.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://turo.com/fr/fr/location-suv/france/undefined/dacia/bigster-hybrid/3517110"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("click_turo")}
                className="inline-flex items-center justify-center gap-3 bg-gold hover:bg-gold-light text-white px-8 py-4 rounded font-lato font-bold tracking-wider uppercase text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Réserver sur Turo
              </a>
              <a
                href="mailto:hugo.valette@outlook.com?subject=Location voiture Dacia Bigster - Villa Carpe Diem"
                className="inline-flex items-center justify-center gap-3 bg-sea-blue hover:bg-sea-blue-light text-white px-8 py-4 rounded font-lato font-bold tracking-wider uppercase text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Nous contacter
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {gallery.map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Guide de réservation du véhicule (via Turo) */}
        <div className="mt-16 bg-cream rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h3 className="font-playfair text-2xl md:text-3xl text-sea-blue mb-2">
              Comment réserver le véhicule
            </h3>
            <p className="font-lato text-gray-600 text-sm">
              La location se fait via Turo — assurance et assistance incluses.
              Nous vous accompagnons à chaque étape.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                t: "Réservez votre séjour",
                d: "Faites votre demande pour la villa et indiquez que vous souhaitez le véhicule.",
              },
              {
                t: "Créez un compte Turo",
                d: "Inscription gratuite sur Turo. L'assurance et l'assistance sont comprises.",
              },
              {
                t: "Recevez le lien",
                d: "Nous vous envoyons le lien du véhicule au tarif convenu — celui affiché sur le site.",
              },
              {
                t: "Validez & profitez",
                d: "Vous réglez la voiture sur Turo en toute sécurité. Elle vous attend à la villa.",
              },
            ].map((step, i) => (
              <div key={step.t} className="text-center">
                <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-gold text-white flex items-center justify-center font-playfair text-lg">
                  {i + 1}
                </div>
                <h4 className="font-lato text-sm font-bold text-sea-blue mb-2">
                  {step.t}
                </h4>
                <p className="font-lato text-xs text-gray-600 leading-relaxed">
                  {step.d}
                </p>
              </div>
            ))}
          </div>

          <p className="font-lato text-[11px] text-gray-400 text-center mt-8">
            Tarif du véhicule indicatif, ajusté sur Turo pour correspondre au
            montant affiché. Sous réserve de disponibilité.
          </p>
        </div>
      </div>
    </section>
  );
}
