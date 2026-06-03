"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type BookingSelection = {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  total: number; // tarif indicatif EUR
};

type BookingCtx = {
  selection: BookingSelection | null;
  setSelection: (s: BookingSelection | null) => void;
};

// Valeur par défaut « no-op » : si un composant consomme le contexte hors
// provider, rien ne casse (selection null, setter ignoré).
const Ctx = createContext<BookingCtx>({
  selection: null,
  setSelection: () => {},
});

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<BookingSelection | null>(null);
  return <Ctx.Provider value={{ selection, setSelection }}>{children}</Ctx.Provider>;
}

export function useBooking() {
  return useContext(Ctx);
}
