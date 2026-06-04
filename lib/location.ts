// Localisation de la villa — liens Google Maps centralisés.
//
// Le lien principal doit ouvrir la FICHE Google Maps référencée
// « Villa vue mer 6/8 personnes (SCI horizon) », pas seulement des coordonnées.
// On garde l'identifiant de lieu (feature id 1s0x…:0x… + 16s/g/…) qui
// sélectionne la fiche exacte ; on retire les paramètres de session (g_ep)
// éphémères pour un lien stable.

// URL canonique du site (domaine custom via NEXT_PUBLIC_SITE_URL le moment venu).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://carpe-diem-corse.vercel.app";

export const VILLA_COORDS = { lat: 41.8260299, lng: 8.7846614 };

export const GOOGLE_MAPS_PLACE_URL =
  "https://www.google.com/maps/place/Villa+vue+mer+6%2F8+personnes+(SCI+horizon)/@41.8279568,8.7835665,17.71z/data=!4m6!3m5!1s0x12da419ffcd79f3d:0xde03629f03c16051!8m2!3d41.8260299!4d8.7846614!16s%2Fg%2F11mzjpkf2b";

// Itinéraire vers la villa (coordonnées exactes pour une navigation fiable).
export const GOOGLE_MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${VILLA_COORDS.lat},${VILLA_COORDS.lng}`;
