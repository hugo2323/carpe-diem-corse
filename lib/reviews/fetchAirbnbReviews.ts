// V2 — Récupération dynamique des avis Airbnb.
//
// ⚠️ IMPORTANT :
// - Cette fonction s'exécute UNIQUEMENT côté serveur (route API, server action)
//   ou via un job planifié (cron / GitHub Action). JAMAIS dans le navigateur.
// - On ne scrape PAS Airbnb directement : Airbnb n'a pas d'API publique d'avis.
//   On passe par une source légitime (channel manager, widget, API tierce).
// - Le résultat doit être PERSISTÉ dans le cache (data/reviews-cache.json ou une
//   base) par l'appelant, puis le site lit ce cache.
// - Garde-fou : en cas d'erreur de la source, NE PAS écraser le cache existant
//   (conserver les derniers avis valides).

import type { Review } from "./types";
import { REVIEWS_PROVIDER, AIRBNB_LISTING_ID } from "./config";

export async function fetchAirbnbReviews(): Promise<Review[]> {
  switch (REVIEWS_PROVIDER) {
    case "manual":
      // Aucune intégration dynamique : les avis individuels ne sont pas
      // récupérés automatiquement (la synthèse vérifiée vient de la config).
      return [];

    case "channel_manager":
      return fetchFromChannelManager();

    case "third_party_api":
      return fetchFromThirdPartyApi();

    case "widget":
      // Le widget s'affiche côté client via un embed : rien à récupérer ici.
      return [];

    default:
      return [];
  }
}

// --- Branches à implémenter le jour où une source réelle est branchée ---

async function fetchFromChannelManager(): Promise<Review[]> {
  // Exemple : Smoobu / Hospitable / Lodgify exposent les avis via leur API.
  const apiKey = process.env.CHANNEL_MANAGER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "REVIEWS_PROVIDER=channel_manager mais CHANNEL_MANAGER_API_KEY manquante."
    );
  }
  // const res = await fetch("https://api.<provider>.com/.../reviews", {
  //   headers: { Authorization: `Bearer ${apiKey}` },
  // });
  // return mapToReviews(await res.json());
  throw new Error("fetchFromChannelManager() non encore implémentée.");
}

async function fetchFromThirdPartyApi(): Promise<Review[]> {
  const apiKey = process.env.REVIEWS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "REVIEWS_PROVIDER=third_party_api mais REVIEWS_API_KEY manquante."
    );
  }
  // const res = await fetch(
  //   `https://api.<service>.com/airbnb/${AIRBNB_LISTING_ID}/reviews`,
  //   { headers: { "x-api-key": apiKey } }
  // );
  // return mapToReviews(await res.json());
  void AIRBNB_LISTING_ID;
  throw new Error("fetchFromThirdPartyApi() non encore implémentée.");
}
