"use client";

import { useState } from "react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("Demande de réservation - Villa Carpe Diem");
    const body = encodeURIComponent(
      `Nom : ${form.nom}\nEmail : ${form.email}\nTéléphone : ${form.telephone}\nDate d'arrivée : ${form.dateArrivee}\nDate de départ : ${form.dateDepart}\nNombre de personnes : ${form.personnes}\n\nMessage :\n${form.message}`
    );
    window.location.href = `mailto:hugo.valette@outlook.com?subject=${subject}&body=${body}`;
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
              {[
                { icon: "📞", label: "Téléphone", value: "06.74.25.63.36", href: "tel:+33674256336" },
                { icon: "✉️", label: "Email", value: "hugo.valette@outlook.com", href: "mailto:hugo.valette@outlook.com" },
                { icon: "📍", label: "Adresse", value: "Pietrosella – Le Ruppione (20166), Corse-du-Sud", href: null },
                { icon: "🤝", label: "Conciergerie", value: "Accueil par Kalypso Conciergerie", href: null },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <span className="text-2xl w-8 flex-shrink-0">{c.icon}</span>
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
                      <a
                        href="https://www.google.com/maps/place/Villa+vue+mer+6%2F8+personnes+(SCI+horizon)/@41.8260299,8.7846614,17z"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-lato text-gold hover:text-white transition-colors duration-200 text-sm mt-1 inline-block"
                      >
                        📍 Voir sur Google Maps
                      </a>
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

              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-light text-white py-4 rounded-lg font-lato font-bold tracking-wider uppercase text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Envoyer la demande
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
