"use client";

import { useEffect, useState } from "react";
import { useBooking } from "./BookingProvider";
import Icon, { type IconName } from "./Icon";
import {
  GOOGLE_MAPS_PLACE_URL,
  GOOGLE_MAPS_DIRECTIONS_URL,
} from "@/lib/location";

// Clé Web3Forms (publique par conception) — obtenue gratuitement sur
// https://web3forms.com en entrant l'adresse de réception.
const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
  "5d2024a2-f384-4502-9b1b-57e56fb1947c";

type Status = "idle" | "sending" | "success" | "error";

function frDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}/${m}/${y}` : iso;
}

export default function ContactSection() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    dateArrivee: "",
    dateDepart: "",
    personnes: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const { selection } = useBooking();

  // Pré-remplit le formulaire quand le visiteur sélectionne des dates dans le
  // calendrier de disponibilités (bouton « Demander ces dates »).
  useEffect(() => {
    if (!selection) return;
    const discountPart =
      selection.villaDiscountPct > 0
        ? ` Remise ${
            selection.villaDiscountKind === "vehicle_pack"
              ? "pack véhicule"
              : "dernière minute"
          } −${selection.villaDiscountPct}% incluse.`
        : "";
    const vehiclePart = selection.withCar
      ? " Je souhaite ajouter le véhicule au séjour (sur demande, sous réserve de disponibilité)."
      : "";
    setForm((f) => ({
      ...f,
      dateArrivee: selection.checkIn,
      dateDepart: selection.checkOut,
      message:
        f.message ||
        `Bonjour, je suis intéressé(e) par un séjour du ${frDate(
          selection.checkIn
        )} au ${frDate(selection.checkOut)} (${selection.nights} nuit${
          selection.nights > 1 ? "s" : ""
        }). Tarif villa indicatif : ~${selection.total.toLocaleString(
          "fr-FR"
        )} €.${discountPart}${vehiclePart} Merci de me confirmer la disponibilité et le tarif exact.`,
    }));
  }, [selection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "Demande de réservation - Villa Carpe Diem",
          from_name: "Site Carpe Diem",
          nom: form.nom,
          email: form.email,
          telephone: form.telephone,
          date_arrivee: form.dateArrivee,
          date_depart: form.dateDepart,
          personnes: form.personnes,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({
          nom: "",
          email: "",
          telephone: "",
          dateArrivee: "",
          dateDepart: "",
          personnes: "",
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section id="reserver" className="py-20 md:py-28 bg-sea-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold font-lato text-sm tracking-[0.3em] uppercase mb-3 block">
            Contact &amp; Réservation
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-white mb-4">
            Réservez votre séjour
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact info */}
          <div>
            <h3 className="font-playfair text-2xl text-white mb-8 font-semibold">
              Nous contacter directement
            </h3>

            <div className="space-y-6">
              {([
                { icon: "phone", label: "Téléphone", value: "06.74.25.63.36", href: "tel:+33674256336" },
                { icon: "mail", label: "Email", value: "hugo.valette@outlook.com", href: "mailto:hugo.valette@outlook.com" },
                { icon: "pin", label: "Adresse", value: "Pietrosella – Le Ruppione (20166), Corse-du-Sud", href: null },
                { icon: "concierge", label: "Conciergerie", value: "Accueil par Kalypso Conciergerie", href: null },
              ] as { icon: IconName; label: string; value: string; href: string | null }[]).map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <span className="text-gold w-8 flex-shrink-0 flex justify-center pt-0.5">
                    <Icon name={c.icon} size={22} />
                  </span>
                  <div>
                    <p className="font-lato text-white/60 text-xs uppercase tracking-wider mb-1">
                      {c.label}
                    </p>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="font-lato text-white hover:text-gold transition-colors duration-200"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <p className="font-lato text-white">{c.value}</p>
                    )}
                    {c.label === "Adresse" && (
                      <div className="flex flex-col gap-2 mt-3">
                        <a
                          href={GOOGLE_MAPS_PLACE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-lato text-gold hover:text-white transition-colors duration-200 text-sm inline-flex items-center gap-1.5"
                        >
                          <Icon name="pin" size={15} className="flex-shrink-0" />
                          Voir la villa sur Google Maps
                        </a>
                        <a
                          href={GOOGLE_MAPS_DIRECTIONS_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-lato text-white/70 hover:text-gold transition-colors duration-200 text-sm inline-flex items-center gap-1.5"
                        >
                          <Icon name="navigation" size={15} className="flex-shrink-0" />
                          Obtenir l&apos;itinéraire
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <p className="font-lato text-white/80 text-sm leading-relaxed">
                Pour une réponse rapide, contactez-nous par téléphone ou via
                les plateformes Airbnb et Abritel. Nous répondons généralement
                dans les 24h.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h3 className="font-playfair text-2xl text-sea-blue mb-6 font-semibold">
              Demande de réservation
            </h3>

            {selection && status !== "success" && (
              <div className="mb-6 bg-cream rounded-xl px-4 py-3 border border-gold/20 flex items-center justify-between gap-3">
                <span className="font-lato text-sm text-sea-blue flex items-center gap-2">
                  <Icon name="calendar" size={16} className="text-gold flex-shrink-0" />
                  <span>
                    {frDate(selection.checkIn)} → {frDate(selection.checkOut)}{" "}
                    <span className="text-gray-500">
                      ({selection.nights} nuit{selection.nights > 1 ? "s" : ""})
                    </span>
                    {selection.withCar && (
                      <span className="text-gray-500"> · véhicule (sur demande)</span>
                    )}
                  </span>
                </span>
                <span className="font-playfair text-lg text-sea-blue whitespace-nowrap">
                  ~{selection.total.toLocaleString("fr-FR")} €
                </span>
              </div>
            )}

            {status === "success" ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <span className="w-14 h-14 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                    <Icon name="check" size={28} strokeWidth={2} />
                  </span>
                </div>
                <p className="font-playfair text-xl text-sea-blue font-semibold mb-2">
                  Demande envoyée !
                </p>
                <p className="font-lato text-gray-600 text-sm">
                  Merci, nous vous répondrons généralement sous 24h.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 font-lato text-sm text-sea-blue underline hover:text-gold transition-colors"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-lato text-sm text-gray-600 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={form.nom}
                    onChange={handleChange}
                    className="w-full border border-sand rounded-lg px-4 py-3 font-lato text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sea-blue/30 focus:border-sea-blue transition-colors"
                    placeholder="Jean Dupont"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-lato text-sm text-gray-600 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border border-sand rounded-lg px-4 py-3 font-lato text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sea-blue/30 focus:border-sea-blue transition-colors"
                      placeholder="jean@email.com"
                    />
                  </div>
                  <div>
                    <label className="block font-lato text-sm text-gray-600 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={form.telephone}
                      onChange={handleChange}
                      className="w-full border border-sand rounded-lg px-4 py-3 font-lato text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sea-blue/30 focus:border-sea-blue transition-colors"
                      placeholder="06 xx xx xx xx"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-lato text-sm text-gray-600 mb-1">
                      Date d&apos;arrivée *
                    </label>
                    <input
                      type="date"
                      name="dateArrivee"
                      required
                      value={form.dateArrivee}
                      onChange={handleChange}
                      className="w-full border border-sand rounded-lg px-4 py-3 font-lato text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sea-blue/30 focus:border-sea-blue transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-lato text-sm text-gray-600 mb-1">
                      Date de départ *
                    </label>
                    <input
                      type="date"
                      name="dateDepart"
                      required
                      value={form.dateDepart}
                      onChange={handleChange}
                      className="w-full border border-sand rounded-lg px-4 py-3 font-lato text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sea-blue/30 focus:border-sea-blue transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-lato text-sm text-gray-600 mb-1">
                    Nombre de personnes *
                  </label>
                  <select
                    name="personnes"
                    required
                    value={form.personnes}
                    onChange={handleChange}
                    className="w-full border border-sand rounded-lg px-4 py-3 font-lato text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sea-blue/30 focus:border-sea-blue transition-colors"
                  >
                    <option value="">Sélectionner</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} personne{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-lato text-sm text-gray-600 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full border border-sand rounded-lg px-4 py-3 font-lato text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sea-blue/30 focus:border-sea-blue transition-colors resize-none"
                    placeholder="Questions, demandes particulières..."
                  />
                </div>

                {status === "error" && (
                  <p className="font-lato text-sm text-red-600">
                    Une erreur est survenue. Réessayez ou contactez-nous par
                    téléphone au 06.74.25.63.36.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-gold hover:bg-gold-light text-white py-4 rounded-lg font-lato font-bold tracking-wider uppercase text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {status === "sending" ? "Envoi en cours..." : "Envoyer la demande"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
