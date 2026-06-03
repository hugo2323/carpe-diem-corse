"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type BookingSelection = {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  villaBase: number; // villa plein tarif
  villaDiscountPct: number; // remise dernière minute appliquée (0 si aucune)
  villaTotal: number; // villa après remise
  carTotal: number; // coût voiture si ajoutée, sinon 0
  withCar: boolean;
  total: number; // tarif indicatif EUR (villa remisée + voiture si withCar)
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
