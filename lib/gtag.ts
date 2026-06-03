// Google Ads conversion tracking, à côté du GA4.
export const GADS_ID = "AW-17885406874";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Déclenche une conversion Google Ads.
 * @param label  L'identifiant de conversion (la partie après le `/`).
 * @param value  Montant optionnel associé à la conversion (en EUR).
 */
export function trackAdsConversion(label: string, value?: number): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "conversion", {
    send_to: `${GADS_ID}/${label}`,
    value,
    currency: "EUR",
  });
}
