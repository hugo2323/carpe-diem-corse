// Moteur de TARIF INDICATIF de la villa, avec :
// - remise « dernière minute » dégressive (selon la date d'arrivée) ;
// - offre « pack véhicule » : ajouter le véhicule au séjour donne 5% de remise
//   sur la VILLA uniquement (le prix du véhicule reste « sur demande »).
//
// Règle de cumul ACTUELLE : on n'additionne pas les remises, on applique la
// MEILLEURE des deux (dernière minute vs pack véhicule). La structure est prête
// pour d'autres règles de cumul à l'avenir (voir resolveVillaDiscount).

type RateSet = { veryHigh: number; high: number; mid: number; low: number };

// Tarif villa par nuit (EUR) — confirmés par le propriétaire.
const VILLA: RateSet = { veryHigh: 450, high: 320, mid: 220, low: 160 };

// Tarif véhicule par nuit (EUR) — utilisé uniquement si VEHICLE_PRICING_MODE
// passe à "dynamic". En mode "on_request", le prix du véhicule n'est pas affiché
// (sur demande) et n'entre pas dans le total.
const CAR: RateSet = { veryHigh: 80, high: 70, mid: 60, low: 50 };

// Mode de tarification du véhicule.
export const VEHICLE_PRICING_MODE: "on_request" | "dynamic" = "on_request";

// Remise accordée quand le véhicule est ajouté au séjour (sur la villa).
export const VEHICLE_PACK_DISCOUNT_PCT = 5;

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

// --- Remise dernière minute (sur la villa, selon la date d'arrivée) ---
const LAST_MINUTE_TIERS = [
  { maxDaysAhead: 6, pct: 40 },
  { maxDaysAhead: 14, pct: 20 },
];
const END_OF_MONTH_PCT = 10;

function daysBetween(fromIso: string, toIso: string): number {
  const a = Date.parse(`${fromIso}T00:00:00Z`);
  const b = Date.parse(`${toIso}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
  return Math.round((b - a) / 86400000);
}

export function lastMinuteDiscountPct(checkIn: string, today: string): number {
  const days = daysBetween(today, checkIn);
  if (Number.isNaN(days) || days < 0) return 0;
  for (const t of LAST_MINUTE_TIERS) {
    if (days <= t.maxDaysAhead) return t.pct;
  }
  if (checkIn.slice(0, 7) === today.slice(0, 7)) return END_OF_MONTH_PCT;
  return 0;
}

export type DiscountKind = "none" | "last_minute" | "vehicle_pack";

// Détermine la remise villa appliquée à partir des remises candidates.
// Règle actuelle : pas de cumul -> on garde la meilleure. À faire évoluer ici
// si une règle de cumul est décidée plus tard.
function resolveVillaDiscount(
  lastMinutePct: number,
  vehiclePackPct: number
): { pct: number; kind: DiscountKind } {
  let pct = 0;
  let kind: DiscountKind = "none";
  if (lastMinutePct > 0) {
    pct = lastMinutePct;
    kind = "last_minute";
  }
  if (vehiclePackPct > pct) {
    pct = vehiclePackPct;
    kind = "vehicle_pack";
  }
  return { pct, kind };
}

export type Quote = {
  nights: number;
  villaBase: number; // villa plein tarif
  lastMinutePct: number; // remise dernière minute candidate
  vehiclePackPct: number; // remise pack véhicule candidate (5 si véhicule, sinon 0)
  villaDiscountPct: number; // remise réellement appliquée
  villaDiscountKind: DiscountKind; // origine de la remise appliquée
  villaTotal: number; // villa après remise
  villaSaved: number; // économie sur la villa
  withCar: boolean;
  vehicleOnRequest: boolean; // true => prix véhicule non affiché (sur demande)
  carTotal: number | null; // null si sur demande
  total: number; // villa après remise (+ véhicule si tarification dynamique)
  avgPerNight: number; // moyenne villa plein tarif par nuit
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
  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    villaBase += rateForDate(VILLA, iso);
    carBase += rateForDate(CAR, iso);
    nights++;
  }

  const lastMinutePct = today ? lastMinuteDiscountPct(checkIn, today) : 0;
  const vehiclePackPct = withCar ? VEHICLE_PACK_DISCOUNT_PCT : 0;
  const { pct: villaDiscountPct, kind: villaDiscountKind } = resolveVillaDiscount(
    lastMinutePct,
    vehiclePackPct
  );

  const villaTotal = Math.round(villaBase * (1 - villaDiscountPct / 100));
  const villaSaved = villaBase - villaTotal;

  const vehicleOnRequest = VEHICLE_PRICING_MODE === "on_request";
  const carTotal = vehicleOnRequest ? null : carBase;

  return {
    nights,
    villaBase,
    lastMinutePct,
    vehiclePackPct,
    villaDiscountPct,
    villaDiscountKind,
    villaTotal,
    villaSaved,
    withCar,
    vehicleOnRequest,
    carTotal,
    total: villaTotal + (withCar && carTotal ? carTotal : 0),
    avgPerNight: Math.round(villaBase / nights),
  };
}
