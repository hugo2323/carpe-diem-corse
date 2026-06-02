import Image from "next/image";

const equipements = [
  "Vue mer panoramique",
  "Wi-Fi haut débit",
  "4 chambres (8 pers.)",
  "Terrasse avec barbecue",
  "Salle de bain complète",
  "Jardin paysager",
  "2 WC indépendants",
  "4 climatiseurs portables",
  "Douche extérieure",
  "Parking résidence",
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
              barbecue et douche extérieure. Wi-Fi inclus. Parking résidence.
              La plage du Ruppione est à 1 km (10 min à pied, 3 min en voiture).
              À 30 minutes de l&apos;aéroport d&apos;Ajaccio.
            </p>

            <h3 className="font-playfair text-2xl text-sea-blue mb-6 font-semibold">
              Équipements
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {equipements.map((eq) => (
                <div key={eq} className="flex items-center gap-3">
                  <span className="text-gold font-bold text-lg flex-shrink-0">✓</span>
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
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative h-44 rounded-lg overflow-hidden">
              <Image
                src="/photos/interieur/salon - 4.jpeg"
                alt="Salon"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative h-44 rounded-lg overflow-hidden">
              <Image
                src="/photos/exterieur/exterieur-4.jpeg"
                alt="Terrasse"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
