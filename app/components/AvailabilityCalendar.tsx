"use client";

import { useEffect, useMemo, useState } from "react";
import {
  quote,
  minNightsForDate,
  gapDiscountPctForNights,
  MIN_LEAD_DAYS,
} from "@/lib/pricing";
import { useBooking } from "./BookingProvider";
import Icon from "./Icon";

type SourceStatus = { name: string; configured: boolean; ok: boolean };
type Availability = { blocked: string[]; sources: SourceStatus[] };

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const WEEKDAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const MAX_MONTHS_AHEAD = 12;

function ymd(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function monthIndex(y: number, m: number): number {
  return y * 12 + m;
}

function frDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function nightsBetween(a: string, b: string): number {
  return Math.round(
    (Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000
  );
}

// Y a-t-il au moins une nuit réservée dans la plage [checkIn, checkOut[ ?
function rangeHasBlocked(
  checkIn: string,
  checkOut: string,
  blocked: Set<string>
): boolean {
  const end = new Date(`${checkOut}T00:00:00Z`);
  for (
    let d = new Date(`${checkIn}T00:00:00Z`);
    d < end;
    d.setUTCDate(d.getUTCDate() + 1)
  ) {
    if (blocked.has(d.toISOString().slice(0, 10))) return true;
  }
  return false;
}

export default function AvailabilityCalendar() {
  const { setSelection } = useBooking();

  const [data, setData] = useState<Availability | null>(null);
  const [failed, setFailed] = useState(false);
  const [cursor, setCursor] = useState<{ y: number; m: number } | null>(null);
  const [today, setToday] = useState<string | null>(null);
  const [minDate, setMinDate] = useState<string | null>(null); // 1ʳᵉ date réservable
  const [minMonth, setMinMonth] = useState<number | null>(null);

  // Sélection de séjour
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [withCar, setWithCar] = useState(false);
  const [shortStay, setShortStay] = useState(false); // tentative < séjour mini

  useEffect(() => {
    const now = new Date();
    setCursor({ y: now.getFullYear(), m: now.getMonth() });
    setMinMonth(monthIndex(now.getFullYear(), now.getMonth()));
    const todayStr = ymd(now.getFullYear(), now.getMonth(), now.getDate());
    setToday(todayStr);
    setMinDate(addDaysIso(todayStr, MIN_LEAD_DAYS));

    fetch("/api/availability")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Availability) => setData(d))
      .catch(() => setFailed(true));
  }, []);

  const blocked = useMemo(() => new Set(data?.blocked ?? []), [data]);

  // % remise « créneau » : non nul seulement si le séjour comble exactement un
  // trou (mur à gauche = réservation/début ; mur à droite = réservation).
  const gapDiscountPctFor = (ci: string, co: string, min: string): number => {
    const leftWall =
      addDaysIso(ci, -1) < min || blocked.has(addDaysIso(ci, -1));
    const rightWall = blocked.has(co);
    if (!(leftWall && rightWall)) return 0;
    return gapDiscountPctForNights(nightsBetween(ci, co));
  };

  // Longueur (en nuits) du créneau libre continu qui contient `night`, borné
  // par les indispos (ou la 1ʳᵉ date réservable à gauche).
  const gapLengthAround = (night: string, min: string): number => {
    let first = night;
    for (let g = 0; g < 400; g++) {
      const prev = addDaysIso(first, -1);
      if (prev < min || blocked.has(prev)) break;
      first = prev;
    }
    let last = night;
    for (let g = 0; g < 400; g++) {
      const next = addDaysIso(last, 1);
      if (blocked.has(next)) break;
      last = next;
    }
    return nightsBetween(first, last) + 1;
  };

  const currentQuote = useMemo(() => {
    if (!checkIn || !checkOut || !today || !minDate) return null;
    const gapPct = gapDiscountPctFor(checkIn, checkOut, minDate);
    return quote(checkIn, checkOut, withCar, today, gapPct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut, withCar, today, minDate, blocked]);

  if (!cursor || !today || !minDate || minMonth === null) {
    return (
      <div className="max-w-3xl mx-auto h-80 rounded-2xl bg-gray-100 animate-pulse" />
    );
  }

  const curIdx = monthIndex(cursor.y, cursor.m);
  const canPrev = curIdx > minMonth;
  const canNext = curIdx < minMonth + MAX_MONTHS_AHEAD;

  const step = (delta: number) => {
    setCursor((c) => {
      if (!c) return c;
      const idx = monthIndex(c.y, c.m) + delta;
      if (idx < minMonth || idx > minMonth + MAX_MONTHS_AHEAD) return c;
      return { y: Math.floor(idx / 12), m: idx % 12 };
    });
  };

  const handleDayClick = (date: string, isPast: boolean, isBlocked: boolean) => {
    if (isPast) return;

    const selecting = checkIn && !checkOut;

    // Démarrage d'une nouvelle sélection -> doit être une nuit disponible.
    if (!selecting) {
      if (isBlocked) return;
      setShortStay(false);
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    // Clic sur une date <= arrivée : on redémarre depuis cette date.
    if (date <= checkIn!) {
      if (!isBlocked) {
        setShortStay(false);
        setCheckIn(date);
        setCheckOut(null);
      }
      return;
    }

    // La plage [checkIn, date[ ne doit contenir aucune nuit réservée.
    if (rangeHasBlocked(checkIn!, date, blocked)) {
      if (!isBlocked) {
        setShortStay(false);
        setCheckIn(date);
        setCheckOut(null);
      }
      return;
    }

    // Séjour minimum (variable selon la saison) — SAUF si le créneau libre qui
    // contient l'arrivée est lui-même plus court que ce minimum : on autorise
    // alors n'importe quel séjour à l'intérieur (pour ne pas perdre ces nuits).
    const min = minNightsForDate(checkIn!);
    if (
      nightsBetween(checkIn!, date) < min &&
      gapLengthAround(checkIn!, minDate) >= min
    ) {
      setShortStay(true);
      return;
    }

    // Valide : `date` devient le jour de départ.
    setShortStay(false);
    setCheckOut(date);
  };

  const resetSelection = () => {
    setCheckIn(null);
    setCheckOut(null);
    setWithCar(false);
    setShortStay(false);
  };

  const confirmSelection = () => {
    if (!checkIn || !checkOut || !currentQuote) return;
    setSelection({
      checkIn,
      checkOut,
      nights: currentQuote.nights,
      villaBase: currentQuote.villaBase,
      timeSaved: currentQuote.timeSaved,
      timeDiscountKind: currentQuote.timeDiscountKind,
      vehicleSaved: currentQuote.vehicleSaved,
      villaTotal: currentQuote.villaTotal,
      withCar: currentQuote.withCar,
      vehicleOnRequest: currentQuote.vehicleOnRequest,
      carTotal: currentQuote.withCar ? currentQuote.carTotal : null,
      total: currentQuote.total,
    });
    document.getElementById("reserver")?.scrollIntoView({ behavior: "smooth" });
  };

  // --- Rendu d'une cellule jour ---
  const renderCell = (date: string, day: number) => {
    // Avant la 1ʳᵉ date réservable (today + délai mini) -> non sélectionnable.
    const isPast = date < minDate;
    const isBlocked = blocked.has(date);
    const isCheckIn = date === checkIn;
    const isCheckOut = date === checkOut;
    const isInRange =
      !!checkIn && !!checkOut && date > checkIn && date < checkOut;
    const isEndpoint = isCheckIn || isCheckOut;
    const isAvailable = !isPast && !isBlocked;
    const clickable = !isPast && (!isBlocked || (!!checkIn && !checkOut));

    let cls: string;
    if (isEndpoint) {
      cls = "bg-gold text-white font-bold ring-2 ring-gold";
    } else if (isInRange) {
      cls = "bg-gold/20 text-sea-blue font-semibold";
    } else if (isPast) {
      cls = "text-gray-300";
    } else if (isBlocked) {
      cls = "bg-gray-100 text-gray-400 line-through";
    } else {
      cls =
        "bg-gold/10 text-sea-blue font-semibold ring-1 ring-gold/30 hover:bg-gold/25";
    }

    return (
      <button
        type="button"
        key={date}
        onClick={() => handleDayClick(date, isPast, isBlocked)}
        disabled={!clickable}
        className={[
          "aspect-square flex items-center justify-center rounded-lg font-lato text-sm transition-colors",
          clickable ? "cursor-pointer" : "cursor-default",
          cls,
        ].join(" ")}
        title={
          isPast
            ? undefined
            : isEndpoint
            ? isCheckIn
              ? "Arrivée"
              : "Départ"
            : isAvailable
            ? "Disponible — cliquez pour sélectionner"
            : "Réservé"
        }
      >
        {day}
      </button>
    );
  };

  // --- Rendu d'un mois complet ---
  const renderMonth = (y: number, m: number) => {
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstWeekday = (new Date(y, m, 1).getDay() + 6) % 7;
    const leading = Array.from({ length: firstWeekday });

    return (
      <div>
        <p className="text-center font-playfair text-xl text-sea-blue mb-4">
          {MONTHS_FR[m]} {y}
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS_FR.map((d) => (
            <div
              key={d}
              className="text-center font-lato text-[11px] font-bold uppercase tracking-wider text-gray-400 pb-1"
            >
              {d}
            </div>
          ))}
          {leading.map((_, i) => (
            <div key={`lead-${y}-${m}-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) =>
            renderCell(ymd(y, m, i + 1), i + 1)
          )}
        </div>
      </div>
    );
  };

  const nextIdx = curIdx + 1;
  const nextY = Math.floor(nextIdx / 12);
  const nextM = nextIdx % 12;

  const syncedNames = data?.sources.filter((s) => s.ok).map((s) => s.name) ?? [];
  const syncError = data?.sources.some((s) => s.configured && !s.ok) ?? false;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Offre dernière minute dégressive — présentation sobre, 3 paliers distincts */}
      <div className="mb-6 text-center">
        <p className="font-lato text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2.5">
          Offre dernière minute dégressive
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-gold/50 bg-gold/5 text-sea-blue text-xs font-semibold px-3.5 py-1.5">
            −30% · semaine 1
          </span>
          <span className="rounded-full border border-gold/30 bg-gold/5 text-sea-blue text-xs font-semibold px-3.5 py-1.5">
            −20% · semaine 2
          </span>
          <span className="rounded-full border border-gold/20 bg-gold/5 text-sea-blue text-xs font-semibold px-3.5 py-1.5">
            −10% · semaine 3
          </span>
        </div>
        <p className="font-lato text-[11px] text-gray-400 mt-2.5">
          Réduction séjour : −15% dès 7 nuits · −25% dès 28 nuits
        </p>
      </div>

      {/* Navigation mois */}
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={!canPrev}
          aria-label="Mois précédent"
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-sea-blue hover:bg-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span aria-hidden="true" className="text-lg">‹</span>
        </button>
        <span className="font-lato text-xs uppercase tracking-[0.2em] text-gray-400">
          Sélectionnez vos dates
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={!canNext}
          aria-label="Mois suivant"
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-sea-blue hover:bg-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span aria-hidden="true" className="text-lg">›</span>
        </button>
      </div>

      {/* Deux mois côte à côte (1 seul sur mobile) */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        <div>{renderMonth(cursor.y, cursor.m)}</div>
        <div className="hidden md:block">{renderMonth(nextY, nextM)}</div>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 font-lato text-sm text-gray-600">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-gold/10 ring-1 ring-gold/30 inline-block" />
          Disponible
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-gold inline-block" />
          Vos dates
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-gray-100 inline-block" />
          Réservé
        </span>
      </div>

      {/* Panneau de sélection / devis indicatif */}
      <div className="mt-6 max-w-xl mx-auto">
        {!checkIn && (
          <p className="text-center font-lato text-sm text-gray-500">
            Cliquez sur une date d&apos;arrivée puis une date de départ pour
            estimer votre séjour.{" "}
            <span className="text-gray-400">
              Séjour minimum jusqu&apos;à 7 nuits en haute saison.
            </span>
          </p>
        )}

        {checkIn && !checkOut && (
          <p className="text-center font-lato text-sm text-sea-blue">
            Arrivée le <strong>{frDate(checkIn)}</strong> — sélectionnez
            maintenant votre date de départ.
            {shortStay && (
              <span className="block text-gold font-semibold mt-1">
                Séjour minimum {minNightsForDate(checkIn)} nuits sur cette période.
              </span>
            )}
          </p>
        )}

        {checkIn && checkOut && currentQuote && (
          <div className="bg-cream rounded-2xl p-6 border border-gold/20">
            <p className="font-lato text-sm text-gray-600">
              Du <strong className="text-sea-blue">{frDate(checkIn)}</strong> au{" "}
              <strong className="text-sea-blue">{frDate(checkOut)}</strong>
              <span className="text-gray-500">
                {" "}
                · {currentQuote.nights} nuit{currentQuote.nights > 1 ? "s" : ""}
              </span>
            </p>

            {/* Détail du tarif villa */}
            <div className="mt-4 space-y-2 font-lato text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">
                  Tarif villa{" "}
                  <span className="text-gray-400">
                    (~{currentQuote.avgPerNight} €/nuit)
                  </span>
                </span>
                <span
                  className={
                    currentQuote.totalSaved > 0
                      ? "text-gray-400 line-through"
                      : "text-sea-blue font-semibold"
                  }
                >
                  ~{currentQuote.villaBase.toLocaleString("fr-FR")} €
                </span>
              </div>

              {/* Remise « temps » appliquée = la meilleure des trois */}
              {currentQuote.timeDiscountKind === "last_minute" &&
                currentQuote.lastMinuteTiers.map((t) => (
                  <div
                    key={t.pct}
                    className="flex items-center justify-between text-gold"
                  >
                    <span>
                      Dernière minute −{t.pct}%{" "}
                      <span className="text-gold/70">
                        · {t.nights} nuit{t.nights > 1 ? "s" : ""}
                      </span>
                    </span>
                    <span>−{t.saved.toLocaleString("fr-FR")} €</span>
                  </div>
                ))}

              {currentQuote.timeDiscountKind === "length_of_stay" && (
                <div className="flex items-center justify-between text-gold">
                  <span>
                    Réduction séjour −{currentQuote.lengthOfStayPct}%{" "}
                    <span className="text-gold/70">
                      · {currentQuote.nights} nuits
                    </span>
                  </span>
                  <span>−{currentQuote.timeSaved.toLocaleString("fr-FR")} €</span>
                </div>
              )}

              {currentQuote.timeDiscountKind === "gap" && (
                <div className="flex items-center justify-between text-gold">
                  <span>Offre spéciale −{currentQuote.gapDiscountPct}%</span>
                  <span>−{currentQuote.timeSaved.toLocaleString("fr-FR")} €</span>
                </div>
              )}

              {/* Remise pack véhicule (5% de la base, cumulable) */}
              {currentQuote.vehicleSaved > 0 && (
                <div className="flex items-center justify-between text-gold">
                  <span>Remise pack véhicule −5%</span>
                  <span>−{currentQuote.vehicleSaved.toLocaleString("fr-FR")} €</span>
                </div>
              )}

              {currentQuote.totalSaved > 0 && (
                <div className="flex items-center justify-between pt-1 border-t border-gold/10">
                  <span className="text-gray-700 font-semibold">
                    Tarif villa après remise
                  </span>
                  <span className="text-sea-blue font-semibold">
                    ~{currentQuote.villaTotal.toLocaleString("fr-FR")} €
                  </span>
                </div>
              )}
            </div>

            {/* Ligne véhicule (payant, ajouté au total) */}
            {withCar && currentQuote.carTotal != null && (
              <div className="flex items-center justify-between mt-3 font-lato text-sm">
                <span className="text-gray-700">Véhicule (Dacia Bigster)</span>
                <span className="text-sea-blue font-semibold">
                  +{currentQuote.carTotal.toLocaleString("fr-FR")} €
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex items-end justify-between mt-4 pt-4 border-t border-gold/20">
              <span className="font-lato text-sm text-gray-600">
                Total {withCar ? "séjour" : "villa"}
              </span>
              <span className="text-right">
                <span className="font-playfair text-3xl text-sea-blue block leading-none">
                  ~{currentQuote.total.toLocaleString("fr-FR")} €
                </span>
                <span className="font-lato text-[11px] text-gray-500 uppercase tracking-wider">
                  Tarif indicatif
                </span>
              </span>
            </div>

            {/* Option véhicule — carte discrète */}
            <label className="block mt-4 rounded-xl border border-gold/30 bg-white p-4 cursor-pointer select-none">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={withCar}
                  onChange={(e) => setWithCar(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-gold flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="flex items-center gap-2 font-lato text-sm font-semibold text-sea-blue">
                    <Icon name="car" size={18} className="flex-shrink-0" />
                    Ajouter le véhicule au séjour
                  </span>
                  <p className="font-lato text-xs text-gray-500 leading-relaxed mt-1">
                    Besoin d&apos;un véhicule sur place ? Ajoutez le véhicule à
                    votre séjour et bénéficiez de 5% de remise sur le tarif de la
                    villa.
                  </p>
                  {withCar && (
                    <p className="font-lato text-xs text-gray-500 mt-2">
                      Véhicule ajouté au séjour. Sous réserve de disponibilité du
                      véhicule.
                    </p>
                  )}
                </div>
              </div>
            </label>

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={confirmSelection}
                className="flex-1 bg-gold hover:bg-gold-light text-white py-3 rounded-lg font-lato font-bold tracking-wider uppercase text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Demander ces dates
              </button>
              <button
                type="button"
                onClick={resetSelection}
                className="px-5 py-3 rounded-lg font-lato text-sm text-gray-500 hover:text-sea-blue border border-gray-200 hover:border-sea-blue transition-colors"
              >
                Effacer
              </button>
            </div>

            <p className="font-lato text-[11px] text-gray-400 mt-3 text-center">
              Tarif estimatif hors frais de ménage et taxe de séjour — demande de
              disponibilité, le tarif exact vous est confirmé sous 24h.
            </p>
          </div>
        )}
      </div>

      {/* État de la synchro */}
      <p className="text-center font-lato text-xs text-gray-400 mt-5">
        {failed
          ? "Disponibilités indicatives — synchronisation momentanément indisponible."
          : syncedNames.length > 0
          ? `Synchronisé avec ${syncedNames.join(" et ")} — mis à jour automatiquement.`
          : syncError
          ? "Disponibilités indicatives — synchronisation momentanément indisponible."
          : "Calendrier en cours de configuration."}
      </p>
    </div>
  );
}
