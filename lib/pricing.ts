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

// Remise à la durée de séjour (calée sur les réglages Airbnb : semaine / mois).
const LENGTH_OF_STAY_DISCOUNTS = [
  { minNights: 28, pct: 25 }, // 28 nuits et + (mensuel)
  { minNights: 7, pct: 15 }, // 7 nuits et + (hebdo)
];
export function lengthOfStayDiscountPct(nights: number): number {
  for (const d of LENGTH_OF_STAY_DISCOUNTS) if (nights >= d.minNights) return d.pct;
  return 0;
}

// Remise sur les créneaux orphelins coincés entre deux réservations (difficiles
// à vendre). Appliquée seulement quand le séjour comble EXACTEMENT un trou de 1
// à 9 nuits (détecté côté calendrier). Côté client, libellé neutre « Offre
// spéciale » (on ne dit pas « trou »).
const GAP_MAX_NIGHTS = 9;
const GAP_DISCOUNT_PCT = 40;
export function gapDiscountPctForNights(gapNights: number): number {
  return gapNights >= 1 && gapNights <= GAP_MAX_NIGHTS ? GAP_DISCOUNT_PCT : 0;
}

// Frais de ménage : forfait réglé sur place auprès de Kalypso Conciergerie.
// Non inclus dans le tarif indicatif (payé à part, sur place).
export const CLEANING_FEE = 200;

// Règles de réservation.
export const MIN_LEAD_DAYS = 1; // délai minimum avant l'arrivée (pas le jour même)
export const DEFAULT_MIN_NIGHTS = 1; // hors saison : pas de minimum (1 nuit OK)
// Séjour minimum variable selon la saison (date d'arrivée).
const MIN_STAY_PERIODS = [
  { from: "07-14", to: "08-24", nights: 7 }, // très haute saison
  { from: "06-01", to: "07-13", nights: 5 }, // haute
  { from: "08-25", to: "09-15", nights: 5 }, // haute
];
export function minNightsForDate(checkInIso: string): number {
  const md = checkInIso.slice(5);
  for (const p of MIN_STAY_PERIODS) if (md >= p.from && md <= p.to) return p.nights;
  return DEFAULT_MIN_NIGHTS;
}

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

// Remise « temps » réellement appliquée (la meilleure des trois candidates).
export type TimeDiscountKind = "none" | "last_minute" | "length_of_stay" | "gap";

export type Quote = {
  nights: number;
  villaBase: number; // villa plein tarif
  // Candidats de remise (calculés)
  lastMinuteTiers: LastMinuteTier[]; // paliers dégressifs présents
  lastMinuteSaved: number;
  lengthOfStayPct: number;
  lengthOfStaySaved: number;
  gapDiscountPct: number;
  gapDiscountSaved: number;
  // Remise « temps » appliquée = la meilleure des trois (pas de cumul entre elles)
  timeDiscountKind: TimeDiscountKind;
  timeSaved: number;
  // Pack véhicule (cumulable avec la remise temps)
  vehiclePackPct: number;
  vehicleSaved: number;
  totalSaved: number; // timeSaved + vehicleSaved
  villaTotal: number; // villa après toutes remises
  withCar: boolean;
  vehicleOnRequest: boolean;
  carTotal: number | null;
  total: number;
  avgPerNight: number;
};

export function quote(
  checkIn: string,
  checkOut: string,
  withCar = false,
  today?: string,
  gapDiscountPct = 0
): Quote | null {
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return null;
  }

  let villaBase = 0;
  let carBase = 0;
  let nights = 0;
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

  // Candidat 1 : dernière minute dégressive (par nuit).
  const lastMinuteTiers: LastMinuteTier[] = Object.keys(tierAcc)
    .map((k) => Number(k))
    .sort((a, b) => b - a)
    .map((pct) => ({
      pct,
      nights: tierAcc[pct].nights,
      saved: Math.round(tierAcc[pct].saved),
    }));
  const lastMinuteSaved = lastMinuteTiers.reduce((s, t) => s + t.saved, 0);

  // Candidat 2 : remise à la durée de séjour.
  const lengthOfStayPct = lengthOfStayDiscountPct(nights);
  const lengthOfStaySaved = Math.round((villaBase * lengthOfStayPct) / 100);

  // Candidat 3 : remise « créneau » (trou comblé), % fourni par l'appelant.
  const gapDiscountSaved = Math.round((villaBase * gapDiscountPct) / 100);

  // On applique la MEILLEURE des trois remises « temps » (pas de cumul).
  let timeSaved = 0;
  let timeDiscountKind: TimeDiscountKind = "none";
  if (lastMinuteSaved > timeSaved) {
    timeSaved = lastMinuteSaved;
    timeDiscountKind = "last_minute";
  }
  if (lengthOfStaySaved > timeSaved) {
    timeSaved = lengthOfStaySaved;
    timeDiscountKind = "length_of_stay";
  }
  if (gapDiscountSaved > timeSaved) {
    timeSaved = gapDiscountSaved;
    timeDiscountKind = "gap";
  }

  // Pack véhicule : 5% de la base, cumulable avec la remise temps.
  const vehiclePackPct = withCar ? VEHICLE_PACK_DISCOUNT_PCT : 0;
  const vehicleSaved = withCar
    ? Math.round((villaBase * VEHICLE_PACK_DISCOUNT_PCT) / 100)
    : 0;

  const totalSaved = timeSaved + vehicleSaved;
  const villaTotal = Math.max(0, villaBase - totalSaved);

  const vehicleOnRequest = VEHICLE_PRICING_MODE === "on_request";
  const carTotal = vehicleOnRequest ? null : carBase;

  return {
    nights,
    villaBase,
    lastMinuteTiers,
    lastMinuteSaved,
    lengthOfStayPct,
    lengthOfStaySaved,
    gapDiscountPct,
    gapDiscountSaved,
    timeDiscountKind,
    timeSaved,
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
