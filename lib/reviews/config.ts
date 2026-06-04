// Configuration centralisée des avis.
//
// RÈGLE ABSOLUE : ne jamais inventer d'avis, de note ou de nombre d'avis.
// Les valeurs ci-dessous doivent refléter la VRAIE page Airbnb. Elles sont
// maintenues à la main tant que REVIEWS_PROVIDER = "manual".

export const AIRBNB_LISTING_URL = "https://www.airbnb.fr/rooms/24533933";
export const AIRBNB_LISTING_ID = "24533933";
export const AIRBNB_REVIEWS_URL = `${AIRBNB_LISTING_URL}/reviews`;

// Mode d'alimentation des avis :
// - manual          : synthèse saisie à la main (ci-dessous), pas de cartes auto
// - channel_manager : via l'API d'un PMS/channel manager (Smoobu, Hospitable…)
// - widget          : embed client d'un service tiers (ex. widget d'avis)
// - third_party_api  : API tierce dédiée aux avis
export type ReviewsProvider =
  | "manual"
  | "channel_manager"
  | "widget"
  | "third_party_api";

export const REVIEWS_PROVIDER: ReviewsProvider = "manual";

// Synthèse Airbnb VÉRIFIÉE (confirmée par le propriétaire d'après la vraie
// page Airbnb). Mettre à jour ces chiffres dès qu'ils changent sur Airbnb.
export const AIRBNB_VERIFIED_SUMMARY = {
  rating: 4.5, // note réelle sur 5
  count: 4, // nombre réel d'avis
  updatedAt: "2026-06-04", // date de dernière vérification manuelle
} as const;

// Avis Turo (voiture) : section SÉPARÉE, affichée uniquement si le véhicule est
// proposé ET que l'on dispose de VRAIS avis Turo. Pas de données inventées :
// laissé désactivé tant qu'aucune source réelle n'est configurée.
export const SHOW_TURO_REVIEWS = false;
export const TURO_LISTING_URL =
  "https://turo.com/fr/fr/location-suv/france/undefined/dacia/bigster-hybrid/3517110";
