"use client";

import { useEffect, useMemo, useState } from "react";
import { quote } from "@/lib/pricing";
import { useBooking } from "./BookingProvider";

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
  const [minMonth, setMinMonth] = useState<number | null>(null);

  // Sélection de séjour
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [withCar, setWithCar] = useState(false);

  useEffect(() => {
    const now = new Date();
    setCursor({ y: now.getFullYear(), m: now.getMonth() });
    setMinMonth(monthIndex(now.getFullYear(), now.getMonth()));
    setToday(ymd(now.getFullYear(), now.getMonth(), now.getDate()));

    fetch("/api/availability")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Availability) => setData(d))
      .catch(() => setFailed(true));
  }, []);

  const blocked = useMemo(() => new Set(data?.blocked ?? []), [data]);

  const cells = useMemo(() => {
    if (!cursor) return [];
    const { y, m } = cursor;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstWeekday = (new Date(y, m, 1).getDay() + 6) % 7;

    const out: ({ day: number; date: string } | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) out.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      out.push({ day, date: ymd(y, m, day) });
    }
    return out;
  }, [cursor]);

  const currentQuote = useMemo(
    () => (checkIn && checkOut ? quote(checkIn, checkOut, withCar) : null),
    [checkIn, checkOut, withCar]
  );

  if (!cursor || !today || minMonth === null) {
    return (
      <div className="max-w-xl mx-auto h-80 rounded-2xl bg-gray-100 animate-pulse" />
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
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    // On complète la sélection (checkIn déjà posé).
    // Clic sur une date <= arrivée : on redémarre depuis cette date.
    if (date <= checkIn!) {
      if (!isBlocked) {
        setCheckIn(date);
        setCheckOut(null);
      }
      return;
    }

    // La plage [checkIn, date[ ne doit contenir aucune nuit réservée.
    if (rangeHasBlocked(checkIn!, date, blocked)) {
      if (!isBlocked) {
        setCheckIn(date);
        setCheckOut(null);
      }
      return;
    }

    // Valide : `date` devient le jour de départ (peut être un jour d'arrivée
    // d'un autre séjour, donc autorisé même s'il est "réservé").
    setCheckOut(date);
  };

  const resetSelection = () => {
    setCheckIn(null);
    setCheckOut(null);
    setWithCar(false);
  };

  const confirmSelection = () => {
    if (!checkIn || !checkOut || !currentQuote) return;
    setSelection({
      checkIn,
      checkOut,
      nights: currentQuote.nights,
      villaTotal: currentQuote.villaTotal,
      carTotal: currentQuote.withCar ? currentQuote.carTotal : 0,
      withCar: currentQuote.withCar,
      total: currentQuote.total,
    });
    document.getElementById("reserver")?.scrollIntoView({ behavior: "smooth" });
  };

  const syncedNames = data?.sources.filter((s) => s.ok).map((s) => s.name) ?? [];
  const syncError = data?.sources.some((s) => s.configured && !s.ok) ?? false;

  return (
    <div className="max-w-xl mx-auto">
      {/* En-tête : navigation mois */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={!canPrev}
          aria-label="Mois précédent"
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-sea-blue hover:bg-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>
        <span className="font-playfair text-2xl text-sea-blue">
          {MONTHS_FR[cursor.m]} {cursor.y}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={!canNext}
          aria-label="Mois suivant"
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-sea-blue hover:bg-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ›
        </button>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {WEEKDAYS_FR.map((d) => (
          <div
            key={d}
            className="text-center font-lato text-xs font-bold uppercase tracking-wider text-gray-400 pb-2"
          >
            {d}
          </div>
        ))}

        {cells.map((cell, i) => {
          if (!cell) return <div key={`empty-${i}`} />;
          const isPast = cell.date < today;
          const isBlocked = blocked.has(cell.date);
          const isCheckIn = cell.date === checkIn;
          const isCheckOut = cell.date === checkOut;
          const isInRange =
            !!checkIn &&
            !!checkOut &&
            cell.date > checkIn &&
            cell.date < checkOut;
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
            cls = "bg-gold/10 text-sea-blue font-semibold ring-1 ring-gold/30 hover:bg-gold/25";
          }

          return (
            <button
              type="button"
              key={cell.date}
              onClick={() => handleDayClick(cell.date, isPast, isBlocked)}
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
              {cell.day}
            </button>
          );
        })}
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
      <div className="mt-6 min-h-[1px]">
        {!checkIn && (
          <p className="text-center font-lato text-sm text-gray-500">
            👆 Cliquez sur une date d&apos;arrivée puis une date de départ pour
            estimer votre séjour.
          </p>
        )}

        {checkIn && !checkOut && (
          <p className="text-center font-lato text-sm text-sea-blue">
            Arrivée le <strong>{frDate(checkIn)}</strong> — sélectionnez
            maintenant votre date de départ.
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

            {/* Ventilation villa + voiture */}
            <div className="mt-4 space-y-2 font-lato text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">
                  Villa{" "}
                  <span className="text-gray-400">
                    (~{currentQuote.avgPerNight} €/nuit)
                  </span>
                </span>
                <span className="text-sea-blue font-semibold">
                  ~{currentQuote.villaTotal.toLocaleString("fr-FR")} €
                </span>
              </div>

              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={withCar}
                    onChange={(e) => setWithCar(e.target.checked)}
                    className="w-4 h-4 accent-gold"
                  />
                  🚗 Voiture (Dacia Bigster)
                </span>
                <span
                  className={
                    withCar ? "text-sea-blue font-semibold" : "text-gray-400"
                  }
                >
                  +{currentQuote.carTotal.toLocaleString("fr-FR")} €
                </span>
              </label>
            </div>

            {/* Total */}
            <div className="flex items-end justify-between mt-4 pt-4 border-t border-gold/20">
              <span className="font-lato text-sm text-gray-600">
                Total {withCar ? "tout inclus" : "villa"}
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
              Tarif estimatif hors frais de ménage et taxe de séjour — le tarif
              exact vous est confirmé sous 24h.
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
