// Moteur de TARIF INDICATIF : villa + option voiture (Dacia Bigster),
// avec remise « dernière minute » dégressive sur la villa.
//
// ⚠️ Montants indicatifs (affichés « à confirmer sous 24h »). La voiture suit
// la MÊME répartition saisonnière que la villa. La remise s'applique selon la
// proximité de la date d'ARRIVÉE et ne concerne QUE la villa (pas la voiture).

type RateSet = { veryHigh: number; high: number; mid: number; low: number };

// Tarif villa par nuit (EUR) — confirmés par le propriétaire.
const VILLA: RateSet = { veryHigh: 450, high: 320, mid: 220, low: 160 };

// Tarif voiture par nuit de séjour (EUR) — placeholders ajustables.
const CAR: RateSet = { veryHigh: 80, high: 70, mid: 60, low: 50 };

type Tier = keyof RateSet;
type Period = { from: string; to: string; tier: Tier }; // "MM-DD", bornes incluses

const PERIODS: Period[] = [
  { from: "07-14", to: "08-24", tier: "veryHigh" },
  { from: "06-01", to: "07-13", tier: "high" },
  { from: "08-25", to: "09-15", tier: "high" },
  { from: "05-01", to: "05-31", tier: "mid" },
  { from: "09-16", to: "10-31", tier: "mid" },
];

function tierForDate(isoDate: string): Tier {
  const md = isoDate.slice(5);
  for (const p of PERIODS) {
    if (md >= p.from && md <= p.to) return p.tier;
  }
  return "low";
}

function rateForDate(set: RateSet, isoDate: string): number {
  return set[tierForDate(isoDate)];
}

export const CAR_FROM_PER_NIGHT = CAR.low;

// --- Remise dernière minute (sur la villa, selon la date d'arrivée) ---
// Paliers ajustables. Au-delà, le -10% court jusqu'à la fin du MOIS courant.
const LAST_MINUTE_TIERS = [
  { maxDaysAhead: 6, pct: 40 }, // arrivée dans les 7 prochains jours (J+0 → J+6)
  { maxDaysAhead: 14, pct: 20 }, // arrivée dans 8 → 15 jours (J+7 → J+14)
];
const END_OF_MONTH_PCT = 10; // arrivée du 16ᵉ jour jusqu'à fin du mois courant

function daysBetween(fromIso: string, toIso: string): number {
  const a = Date.parse(`${fromIso}T00:00:00Z`);
  const b = Date.parse(`${toIso}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
  return Math.round((b - a) / 86400000);
}

// % de remise villa pour une arrivée donnée par rapport à « aujourd'hui ».
export function lastMinuteDiscountPct(checkIn: string, today: string): number {
  const days = daysBetween(today, checkIn);
  if (Number.isNaN(days) || days < 0) return 0;
  for (const t of LAST_MINUTE_TIERS) {
    if (days <= t.maxDaysAhead) return t.pct;
  }
  // -10% tant que l'arrivée reste dans le mois courant.
  if (checkIn.slice(0, 7) === today.slice(0, 7)) return END_OF_MONTH_PCT;
  return 0;
}

export type Quote = {
  nights: number;
  villaBase: number; // villa plein tarif
  villaDiscountPct: number; // 0 / 10 / 20 / 40
  villaTotal: number; // villa après remise
  villaSaved: number; // économie sur la villa
  carTotal: number; // coût voiture (si ajoutée)
  withCar: boolean;
  total: number; // villaTotal + (withCar ? carTotal : 0)
  avgPerNight: number; // moyenne villa plein tarif par nuit
};

// Devis indicatif pour [checkIn, checkOut[ (checkOut = jour de départ).
// `today` (YYYY-MM-DD) sert au calcul de la remise dernière minute.
export function quote(
  checkIn: string,
  checkOut: string,
  withCar = false,
  today?: string
): Quote | null {
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return null;
  }

  let villaBase = 0;
  let carTotal = 0;
  let nights = 0;
  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    villaBase += rateForDate(VILLA, iso);
    carTotal += rateForDate(CAR, iso);
    nights++;
  }

  const villaDiscountPct = today ? lastMinuteDiscountPct(checkIn, today) : 0;
  const villaTotal = Math.round(villaBase * (1 - villaDiscountPct / 100));
  const villaSaved = villaBase - villaTotal;

  return {
    nights,
    villaBase,
    villaDiscountPct,
    villaTotal,
    villaSaved,
    carTotal,
    withCar,
    total: villaTotal + (withCar ? carTotal : 0),
    avgPerNight: Math.round(villaBase / nights),
  };
}
