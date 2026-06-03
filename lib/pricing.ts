// Moteur de TARIF INDICATIF de la villa.
//
// ⚠️ Les montants ci-dessous sont des PLACEHOLDERS à remplacer par tes vrais
// tarifs. Le prix affiché sur le site est clairement présenté comme
// « indicatif, à confirmer » — il sert juste à donner un ordre d'idée au
// visiteur au moment de la demande.
//
// nightly = prix par nuit (EUR) selon la période.

type Period = { from: string; to: string; nightly: number }; // from/to au format "MM-DD" (bornes incluses)

const VERY_HIGH = 450; // très haute saison (mi-juillet → mi-août)
const HIGH = 320; // haute saison (juin, début juillet, fin août → mi-septembre)
const MID = 220; // moyenne saison (mai, fin septembre, octobre)
const LOW = 160; // basse saison (le reste)

// Périodes ordonnées ; la première qui contient la date gagne.
const PERIODS: Period[] = [
  { from: "07-14", to: "08-24", nightly: VERY_HIGH },
  { from: "06-01", to: "07-13", nightly: HIGH },
  { from: "08-25", to: "09-15", nightly: HIGH },
  { from: "05-01", to: "05-31", nightly: MID },
  { from: "09-16", to: "10-31", nightly: MID },
];

function nightlyRate(isoDate: string): number {
  const md = isoDate.slice(5); // "MM-DD"
  for (const p of PERIODS) {
    if (md >= p.from && md <= p.to) return p.nightly;
  }
  return LOW;
}

export type Quote = {
  nights: number;
  total: number; // total indicatif EUR (somme des nuits)
  avgPerNight: number;
};

// Calcule un devis indicatif pour un séjour [checkIn, checkOut[ (checkOut = jour
// de départ, non facturé comme nuit).
export function quote(checkIn: string, checkOut: string): Quote | null {
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return null;
  }

  let total = 0;
  let nights = 0;
  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    total += nightlyRate(d.toISOString().slice(0, 10));
    nights++;
  }

  return { nights, total, avgPerNight: Math.round(total / nights) };
}
