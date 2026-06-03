"use client";

import { useEffect, useMemo, useState } from "react";

type SourceStatus = { name: string; configured: boolean; ok: boolean };
type Availability = { blocked: string[]; sources: SourceStatus[] };

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const WEEKDAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// Nombre de mois consultables vers le futur depuis le mois courant.
const MAX_MONTHS_AHEAD = 12;

function ymd(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// Index du mois (année*12 + mois) pour comparer/borner facilement.
function monthIndex(y: number, m: number): number {
  return y * 12 + m;
}

export default function AvailabilityCalendar() {
  const [data, setData] = useState<Availability | null>(null);
  const [failed, setFailed] = useState(false);
  // Calculés côté client (dans l'effet) pour éviter tout décalage d'hydratation.
  const [cursor, setCursor] = useState<{ y: number; m: number } | null>(null);
  const [today, setToday] = useState<string | null>(null);
  const [minMonth, setMinMonth] = useState<number | null>(null);

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
    // getDay(): 0=Dim..6=Sam -> on passe en semaine commençant le lundi.
    const firstWeekday = (new Date(y, m, 1).getDay() + 6) % 7;

    const out: ({ day: number; date: string } | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) out.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      out.push({ day, date: ymd(y, m, day) });
    }
    return out;
  }, [cursor]);

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
          const isAvailable = !isPast && !isBlocked;

          return (
            <div
              key={cell.date}
              className={[
                "aspect-square flex items-center justify-center rounded-lg font-lato text-sm transition-colors",
                isPast
                  ? "text-gray-300"
                  : isBlocked
                  ? "bg-gray-100 text-gray-400 line-through"
                  : "bg-gold/10 text-sea-blue font-semibold ring-1 ring-gold/30",
              ].join(" ")}
              title={
                isPast
                  ? undefined
                  : isAvailable
                  ? "Disponible"
                  : "Réservé"
              }
            >
              {cell.day}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="flex items-center justify-center gap-6 mt-6 font-lato text-sm text-gray-600">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-gold/10 ring-1 ring-gold/30 inline-block" />
          Disponible
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-gray-100 inline-block" />
          Réservé
        </span>
      </div>

      {/* État de la synchro */}
      <p className="text-center font-lato text-xs text-gray-400 mt-4">
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
