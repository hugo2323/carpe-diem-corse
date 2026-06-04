import Icon, { type IconName } from "./Icon";

const highlights: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "sea",
    title: "Vue mer panoramique",
    desc: "Sur le Golfe d'Ajaccio et les îles Sanguinaires",
  },
  {
    icon: "beach",
    title: "Plage du Ruppione",
    desc: "À 1 km à pied — 10 min de marche, 3 min en voiture",
  },
  {
    icon: "home",
    title: "110 m² • 4 chambres",
    desc: "Capacité jusqu'à 8 personnes",
  },
  {
    icon: "plane",
    title: "30 min de l'aéroport",
    desc: "Aéroport d'Ajaccio Napoléon Bonaparte",
  },
];

export default function HighlightsSection() {
  return (
    <section className="py-16 md:py-20 bg-sea-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {highlights.map((h) => (
            <div key={h.title} className="text-center">
              <div className="flex justify-center mb-4 text-gold">
                <Icon name={h.icon} size={34} strokeWidth={1.4} />
              </div>
              <h3 className="font-playfair text-white text-lg mb-2 font-semibold">
                {h.title}
              </h3>
              <p className="font-lato text-white/70 text-sm leading-relaxed">
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
