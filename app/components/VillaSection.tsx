import Image from "next/image";
import Icon, { type IconName } from "./Icon";

// Atouts mis en avant, utiles notamment pour une location hors saison.
const atouts: { icon: IconName; label: string }[] = [
  { icon: "wifi", label: "Fibre — télétravail" },
  { icon: "sea", label: "Vue mer" },
  { icon: "terrace", label: "Terrasse" },
  { icon: "parking", label: "Parking" },
  { icon: "kitchen", label: "Cuisine équipée" },
  { icon: "pin", label: "Proche Ajaccio" },
];

const equipements = [
  "Fibre internet haut débit — idéale télétravail",
  "Vue mer panoramique",
  "Terrasse avec barbecue",
  "Parking résidence",
  "Cuisine équipée",
  "4 chambres (8 pers.)",
  "Salle de bain complète",
  "2 WC indépendants",
  "4 climatiseurs portables",
  "Jardin paysager",
  "Douche extérieure",
  "Conciergerie sur place",
];

export default function VillaSection() {
  return (
    <section id="villa" className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold font-lato text-sm tracking-[0.3em] uppercase mb-3 block">
            La villa
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-sea-blue mb-4">
            Un havre de paix en Corse
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto" />
        </div>

        {/* Bande d'atouts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
          {atouts.map((a) => (
            <div
              key={a.label}
              className="flex flex-col items-center text-center gap-2 bg-white rounded-xl py-5 px-3 shadow-sm"
            >
              <span className="text-gold">
                <Icon name={a.icon} size={26} />
              </span>
              <span className="font-lato text-xs text-sea-blue font-semibold leading-tight">
                {a.label}
              </span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <p className="font-lato text-gray-700 text-lg leading-relaxed mb-8">
              Située à Pietrosella – Le Ruppione (20166), cette villa de 110 m²
              offre un cadre paisible avec une superbe vue panoramique sur la
              mer et les îles Sanguinaires. Le logement peut accueillir jusqu&apos;à
              8 personnes et dispose de 4 chambres, dont 2 mansardées. Il
              comprend une salle de bain avec baignoire et douche, ainsi que
              deux WC indépendants. La maison est équipée de 4 climatiseurs portables
              pour votre confort. À l&apos;extérieur : terrasse, jardin paysager,
              barbecue et douche extérieure. La{" "}
              <strong className="text-sea-blue">fibre internet haut débit</strong>{" "}
              en fait un point de chute idéal pour le télétravail, dans un
              environnement calme. Parking résidence. La plage du Ruppione est à
              1 km (10 min à pied, 3 min en voiture), à 30 minutes de
              l&apos;aéroport d&apos;Ajaccio.
            </p>

            <h3 className="font-playfair text-2xl text-sea-blue mb-6 font-semibold">
              Équipements
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {equipements.map((eq) => (
                <div key={eq} className="flex items-start gap-3">
                  <span className="text-gold flex-shrink-0 mt-0.5">
                    <Icon name="check" size={18} strokeWidth={2} />
                  </span>
                  <span className="font-lato text-gray-700 text-sm">{eq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 relative h-64 md:h-72 rounded-lg overflow-hidden">
              <Image
                src="/photos/exterieur/exterieur-1.jpeg"
                alt="Extérieur de la villa"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative h-44 rounded-lg overflow-hidden">
              <Image
                src="/photos/interieur/salon - 4.jpeg"
                alt="Salon"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative h-44 rounded-lg overflow-hidden">
              <Image
                src="/photos/exterieur/exterieur-4.jpeg"
                alt="Terrasse"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
