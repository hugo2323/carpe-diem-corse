// Moteur de TARIF INDICATIF de la villa.
//
// Remises :
// - « dernière minute » DÉGRESSIVE et calculée PAR NUIT selon la proximité de
//   chaque nuit avec aujourd'hui : semaine 1 (J+0→6) −40%, semaine 2 (J+7→13)
//   −20%, semaine 3 (J+14→20) −10%, au-delà 0%.
// - « pack véhicule » : ajouter le véhicule donne −5% calculé sur le TARIF DE
//   BASE (avant remise dernière minute). Cumulable avec la dernière minute.
//
// Total villa = base − (remises dernière minute par nuit) − (5% de la base si
// véhicule). Le prix du véhicule lui-même reste « sur demande ».

type RateSet = { veryHigh: number; high: number; mid: number; low: number };

// Tarif villa par nuit (EUR) — confirmés par le propriétaire.
const VILLA: RateSet = { veryHigh: 450, high: 320, mid: 220, low: 160 };

// Tarif véhicule par nuit — utilisé seulement si VEHICLE_PRICING_MODE="dynamic".
const CAR: RateSet = { veryHigh: 80, high: 70, mid: 60, low: 50 };

export const VEHICLE_PRICING_MODE: "on_request" | "dynamic" = "dynamic";

// Remise accordée sur la base villa quand le véhicule est ajouté au séjour.
export const VEHICLE_PACK_DISCOUNT_PCT = 5;

// Règles de réservation.
export const MIN_NIGHTS = 3; // durée minimale d'un séjour
export const MIN_LEAD_DAYS = 1; // délai minimum avant l'arrivée (pas le jour même)

type Tier = keyof RateSet;
type Period = { from: string; to: string; tier: Tier };

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

// --- Remise dernière minute dégressive, par NUIT ---
// Paliers par semaine de proximité, comptés à partir de la 1ʳᵉ nuit réservable
// (demain = J+1). Semaine 1 = J+1→7, semaine 2 = J+8→14, semaine 3 = J+15→21.
const NIGHT_DISCOUNT_TIERS = [
  { maxDays: 7, pct: 30 }, // semaine 1 (J+1 → J+7)
  { maxDays: 14, pct: 20 }, // semaine 2 (J+8 → J+14)
  { maxDays: 21, pct: 10 }, // semaine 3 (J+15 → J+21)
];

function daysBetween(fromIso: string, toIso: string): number {
  const a = Date.parse(`${fromIso}T00:00:00Z`);
  const b = Date.parse(`${toIso}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
  return Math.round((b - a) / 86400000);
}

export function nightDiscountPct(nightIso: string, today: string): number {
  const days = daysBetween(today, nightIso);
  if (Number.isNaN(days) || days < 0) return 0;
  for (const t of NIGHT_DISCOUNT_TIERS) {
    if (days <= t.maxDays) return t.pct;
  }
  return 0;
}

// Une ligne de remise dernière minute (un palier présent dans le séjour).
export type LastMinuteTier = { pct: number; nights: number; saved: number };

export type Quote = {
  nights: number;
  villaBase: number; // villa plein tarif
  lastMinuteTiers: LastMinuteTier[]; // paliers présents, triés −40 → −10
  lastMinuteSaved: number; // total remises dernière minute
  vehiclePackPct: number; // 5 si véhicule ajouté, sinon 0
  vehicleSaved: number; // 5% de la base si véhicule
  totalSaved: number; // lastMinuteSaved + vehicleSaved
  villaTotal: number; // villa après toutes remises
  withCar: boolean;
  vehicleOnRequest: boolean; // prix véhicule « sur demande »
  carTotal: number | null;
  total: number;
  avgPerNight: number;
};

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
  let carBase = 0;
  let nights = 0;
  // Cumul des remises dernière minute par palier (%).
  const tierAcc: Record<number, { nights: number; saved: number }> = {};

  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    const nightly = rateForDate(VILLA, iso);
    villaBase += nightly;
    carBase += rateForDate(CAR, iso);
    nights++;

    const pct = today ? nightDiscountPct(iso, today) : 0;
    if (pct > 0) {
      const acc = (tierAcc[pct] ??= { nights: 0, saved: 0 });
      acc.nights++;
      acc.saved += (nightly * pct) / 100;
    }
  }

  const lastMinuteTiers: LastMinuteTier[] = Object.keys(tierAcc)
    .map((k) => Number(k))
    .sort((a, b) => b - a)
    .map((pct) => ({
      pct,
      nights: tierAcc[pct].nights,
      saved: Math.round(tierAcc[pct].saved),
    }));

  const lastMinuteSaved = lastMinuteTiers.reduce((s, t) => s + t.saved, 0);

  // Remise pack véhicule : 5% de la base (avant remise dernière minute).
  const vehiclePackPct = withCar ? VEHICLE_PACK_DISCOUNT_PCT : 0;
  const vehicleSaved = withCar
    ? Math.round((villaBase * VEHICLE_PACK_DISCOUNT_PCT) / 100)
    : 0;

  const totalSaved = lastMinuteSaved + vehicleSaved;
  const villaTotal = Math.max(0, villaBase - totalSaved);

  const vehicleOnRequest = VEHICLE_PRICING_MODE === "on_request";
  const carTotal = vehicleOnRequest ? null : carBase;

  return {
    nights,
    villaBase,
    lastMinuteTiers,
    lastMinuteSaved,
    vehiclePackPct,
    vehicleSaved,
    totalSaved,
    villaTotal,
    withCar,
    vehicleOnRequest,
    carTotal,
    total: villaTotal + (withCar && carTotal ? carTotal : 0),
    avgPerNight: Math.round(villaBase / nights),
  };
}
