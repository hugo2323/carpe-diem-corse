// Section « Avis voyageurs » de la villa (Airbnb).
// Aucune donnée inventée : synthèse vérifiée (config) + éventuels avis réels
// issus du cache (is_verified=true). Sinon, lien vers Airbnb sans faux contenu.
// Les avis Turo (voiture) sont gérés séparément et n'apparaissent ici jamais.

import {
  AIRBNB_REVIEWS_URL,
  AIRBNB_VERIFIED_SUMMARY,
} from "@/lib/reviews/config";
import { getCachedAirbnbReviews } from "@/lib/reviews/cache";

function frRating(n: number): string {
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function frDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}/${m}/${y}` : iso;
}

function Stars({ n }: { n: number }) {
  // Remplissage proportionnel à la vraie note (ex. 4,5/5 -> 90% doré).
  const pct = Math.max(0, Math.min(100, (n / 5) * 100));
  return (
    <span
      className="relative inline-block leading-none align-middle"
      aria-hidden="true"
    >
      <span className="text-gray-300">★★★★★</span>
      <span
        className="absolute inset-0 overflow-hidden text-gold whitespace-nowrap"
        style={{ width: `${pct}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}

export default function ReviewsSection() {
  const { reviews, fetchedAt } = getCachedAirbnbReviews();
  const { rating, count, updatedAt } = AIRBNB_VERIFIED_SUMMARY;
  const lastUpdate = fetchedAt || updatedAt;

  return (
    <section id="avis" className="py-20 md:py-28 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold font-lato text-sm tracking-[0.3em] uppercase mb-3 block">
            Avis voyageurs
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-sea-blue mb-4">
            La villa notée sur Airbnb
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto" />
        </div>

        {/* Synthèse vérifiée */}
        <div className="bg-white rounded-2xl shadow-md px-8 py-10 text-center max-w-md mx-auto">
          <p className="font-lato text-xs text-gray-500 uppercase tracking-[0.2em] mb-3">
            Airbnb
          </p>
          <p className="font-playfair text-5xl text-sea-blue leading-none mb-2">
            {frRating(rating)}
            <span className="text-2xl text-gray-400"> / 5</span>
          </p>
          <div className="text-xl mb-2">
            <Stars n={rating} />
          </div>
          <p className="font-lato text-gray-600 text-sm mb-6">
            {count} avis vérifié{count > 1 ? "s" : ""}
          </p>

          <a
            href={AIRBNB_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-sea-blue hover:bg-sea-blue-light text-white px-7 py-3.5 rounded font-lato font-bold tracking-wider uppercase text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Voir les avis sur Airbnb
            <span aria-hidden="true">→</span>
          </a>

          {lastUpdate && (
            <p className="font-lato text-[11px] text-gray-400 mt-5">
              Dernière mise à jour : {frDate(lastUpdate)}
            </p>
          )}
        </div>

        {/* Avis individuels : uniquement s'ils sont réels et vérifiés (cache). */}
        {reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <Stars n={r.rating} />
                  <span className="font-lato text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Airbnb
                  </span>
                </div>
                <p className="font-lato text-gray-700 text-sm leading-relaxed">
                  « {r.review_text} »
                </p>
                <p className="font-lato text-sm text-sea-blue font-semibold mt-4">
                  {r.author_name}
                  {r.review_date && (
                    <span className="text-gray-400 font-normal">
                      {" "}
                      · {frDate(r.review_date)}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center font-lato text-gray-500 text-sm mt-8">
            Les avis vérifiés sont consultables directement sur Airbnb.
          </p>
        )}
      </div>
    </section>
  );
}
