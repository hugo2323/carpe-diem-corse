// Bande « Avis voyageurs ».
//
// ⚠️ Airbnb et Turo n'ont pas d'API publique pour récupérer les avis : les
// extraits ci-dessous sont sélectionnés à la main. Remplace-les par tes vrais
// avis (et ajuste les notes/nombre d'avis). Les boutons renvoient vers les
// avis complets sur les plateformes.

const AIRBNB_REVIEWS_URL = "https://www.airbnb.fr/rooms/24533933/reviews";
const TURO_REVIEWS_URL =
  "https://turo.com/fr/fr/location-suv/france/undefined/dacia/bigster-hybrid/3517110";

// Notes globales (à remplacer par les vraies).
const AIRBNB_RATING = { score: "4,9", count: 38 };
const TURO_RATING = { score: "5,0", count: 12 };

type Review = {
  platform: "Airbnb" | "Turo";
  name: string;
  date: string;
  stars: number;
  text: string;
};

// Extraits d'avis — PLACEHOLDERS à remplacer par de vrais avis.
const REVIEWS: Review[] = [
  {
    platform: "Airbnb",
    name: "Sophie",
    date: "Août 2025",
    text: "Villa magnifique avec une vue mer à couper le souffle. Tout était impeccable, la plage à deux pas. On reviendra sans hésiter !",
    stars: 5,
  },
  {
    platform: "Airbnb",
    name: "Marc",
    date: "Juillet 2025",
    text: "Emplacement idéal, maison spacieuse et très bien équipée. Accueil au top par la conciergerie. Parfait pour des vacances en famille.",
    stars: 5,
  },
  {
    platform: "Turo",
    name: "Julie",
    date: "Août 2025",
    text: "Voiture récente, propre et parfaite pour explorer la Corse. Remise des clés simple et rapide. Je recommande vivement !",
    stars: 5,
  },
];

function Stars({ n }: { n: number }) {
  return (
    <span className="text-gold text-sm tracking-tight" aria-label={`${n} sur 5`}>
      {"★".repeat(n)}
      <span className="text-gray-300">{"★".repeat(5 - n)}</span>
    </span>
  );
}

const PLATFORM_BADGE: Record<Review["platform"], string> = {
  Airbnb: "bg-[#FF5A5F]/10 text-[#E04848]",
  Turo: "bg-[#593BFB]/10 text-[#593BFB]",
};

export default function ReviewsSection() {
  return (
    <section id="avis" className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold font-lato text-sm tracking-[0.3em] uppercase mb-3 block">
            Avis voyageurs
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-sea-blue mb-4">
            Ils ont séjourné chez nous
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-8" />

          {/* Bande notes + liens plateformes */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={AIRBNB_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white rounded-full pl-6 pr-6 py-3 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <span className="text-left">
                <span className="block font-lato text-xs text-gray-500 uppercase tracking-wider">
                  Airbnb
                </span>
                <span className="font-lato text-sm text-sea-blue font-bold">
                  ★ {AIRBNB_RATING.score}{" "}
                  <span className="text-gray-400 font-normal">
                    · {AIRBNB_RATING.count} avis
                  </span>
                </span>
              </span>
              <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </a>

            <a
              href={TURO_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white rounded-full pl-6 pr-6 py-3 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <span className="text-left">
                <span className="block font-lato text-xs text-gray-500 uppercase tracking-wider">
                  Turo
                </span>
                <span className="font-lato text-sm text-sea-blue font-bold">
                  ★ {TURO_RATING.score}{" "}
                  <span className="text-gray-400 font-normal">
                    · {TURO_RATING.count} avis
                  </span>
                </span>
              </span>
              <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </a>
          </div>
        </div>

        {/* Cartes d'avis */}
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-md flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <Stars n={r.stars} />
                <span
                  className={`font-lato text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${PLATFORM_BADGE[r.platform]}`}
                >
                  {r.platform}
                </span>
              </div>
              <p className="font-lato text-gray-700 text-sm leading-relaxed flex-1">
                « {r.text} »
              </p>
              <p className="font-lato text-sm text-sea-blue font-semibold mt-4">
                {r.name}
                <span className="text-gray-400 font-normal"> · {r.date}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
