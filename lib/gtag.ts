// Google Ads conversion tracking + événements GA4.
export const GADS_ID = "AW-17885406874";

// Label de l'action de conversion Google Ads (à créer dans Google Ads →
// Objectifs → Conversions → « Demande de réservation »). Une fois créé, mettre
// le label dans NEXT_PUBLIC_GADS_CONVERSION_LABEL : la conversion Ads précise
// se déclenchera en plus de l'événement GA4 ci-dessous.
export const GADS_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL || "";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Événement GA4 générique (marquable comme conversion dans GA4, puis importable
// dans Google Ads — fonctionne sans label Ads).
export function trackEvent(
  name: string,
  params: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/**
 * Déclenche une conversion Google Ads (si un label est configuré).
 * @param label  L'identifiant de conversion (la partie après le `/`).
 * @param value  Montant optionnel associé à la conversion (en EUR).
 */
export function trackAdsConversion(label: string, value?: number): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (!label) return;
  window.gtag("event", "conversion", {
    send_to: `${GADS_ID}/${label}`,
    value,
    currency: "EUR",
  });
}

// Demande de réservation (lead) : envoie l'événement GA4 + la conversion Ads.
export function trackLead(value?: number): void {
  trackEvent("generate_lead", { currency: "EUR", value });
  trackAdsConversion(GADS_CONVERSION_LABEL, value);
}
