// Moteur de TARIF INDICATIF : villa + option voiture (Dacia Bigster).
//
// ⚠️ Montants indicatifs (affichés « à confirmer sous 24h »). La voiture suit
// la MÊME répartition saisonnière que la villa.

type RateSet = { veryHigh: number; high: number; mid: number; low: number };

// Tarif villa par nuit (EUR) — confirmés par le propriétaire.
const VILLA: RateSet = { veryHigh: 450, high: 320, mid: 220, low: 160 };

// Tarif voiture par nuit de séjour (EUR) — placeholders ajustables.
const CAR: RateSet = { veryHigh: 80, high: 70, mid: 60, low: 50 };

type Tier = keyof RateSet;
type Period = { from: string; to: string; tier: Tier }; // "MM-DD", bornes incluses

// Périodes ordonnées ; la première qui contient la date gagne.
const PERIODS: Period[] = [
  { from: "07-14", to: "08-24", tier: "veryHigh" },
  { from: "06-01", to: "07-13", tier: "high" },
  { from: "08-25", to: "09-15", tier: "high" },
  { from: "05-01", to: "05-31", tier: "mid" },
  { from: "09-16", to: "10-31", tier: "mid" },
];

function tierForDate(isoDate: string): Tier {
  const md = isoDate.slice(5); // "MM-DD"
  for (const p of PERIODS) {
    if (md >= p.from && md <= p.to) return p.tier;
  }
  return "low";
}

function rateForDate(set: RateSet, isoDate: string): number {
  return set[tierForDate(isoDate)];
}

// Tarif voiture « à partir de » (basse saison) — pour l'affichage avant sélection.
export const CAR_FROM_PER_NIGHT = CAR.low;

export type Quote = {
  nights: number;
  villaTotal: number;
  carTotal: number; // toujours calculé (coût de la voiture si ajoutée)
  total: number; // villa + voiture si withCar
  withCar: boolean;
  avgPerNight: number; // moyenne villa par nuit
};

// Devis indicatif pour [checkIn, checkOut[ (checkOut = jour de départ).
export function quote(
  checkIn: string,
  checkOut: string,
  withCar = false
): Quote | null {
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return null;
  }

  let villaTotal = 0;
  let carTotal = 0;
  let nights = 0;
  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    villaTotal += rateForDate(VILLA, iso);
    carTotal += rateForDate(CAR, iso);
    nights++;
  }

  return {
    nights,
    villaTotal,
    carTotal,
    total: villaTotal + (withCar ? carTotal : 0),
    withCar,
    avgPerNight: Math.round(villaTotal / nights),
  };
}
