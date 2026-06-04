"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type BookingSelection = {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  villaBase: number; // villa plein tarif
  timeSaved: number; // remise « temps » appliquée (meilleure des 3)
  timeDiscountKind: "none" | "last_minute" | "length_of_stay" | "gap";
  vehicleSaved: number; // remise pack véhicule (5% de la base) si véhicule
  villaTotal: number; // villa après toutes remises
  withCar: boolean; // véhicule ajouté au séjour
  vehicleOnRequest: boolean; // prix véhicule « sur demande »
  carTotal: number | null; // coût véhicule si tarif dynamique, sinon null
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
