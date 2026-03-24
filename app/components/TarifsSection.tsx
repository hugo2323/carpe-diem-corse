const tarifs = [
  { saison: "Basse saison", periode: "Novembre → Mars", prix: "120 €", color: "bg-gray-50 border-gray-200" },
  { saison: "Moyenne saison", periode: "Avril, Octobre", prix: "142 €", color: "bg-blue-50 border-blue-200" },
  { saison: "Haute saison", periode: "Mai, Juin", prix: "169 €", color: "bg-amber-50 border-amber-200" },
  { saison: "Très haute saison", periode: "Juillet, Août", prix: "356 €", color: "bg-orange-50 border-orange-300", highlight: true },
  { saison: "Arrière-saison", periode: "Septembre", prix: "266 €", color: "bg-yellow-50 border-yellow-200" },
];

export default function TarifsSection() {
  return (
    <section id="tarifs" className="py-20 md:py-28 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold font-lato text-sm tracking-[0.3em] uppercase mb-3 block">
            Tarifs
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-sea-blue mb-4">
            Nos tarifs
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto" />
        </div>

        <div className="space-y-3 mb-10">
          {tarifs.map((t) => (
            <div
              key={t.saison}
              className={`border rounded-xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-shadow hover:shadow-md ${t.color} ${t.highlight ? "ring-2 ring-gold" : ""}`}
            >
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-playfair text-sea-blue text-lg font-semibold">
                    {t.saison}
                  </h3>
                  {t.highlight && (
                    <span className="bg-gold text-white text-xs font-lato font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Haute saison
                    </span>
                  )}
                </div>
                <p className="font-lato text-gray-500 text-sm mt-0.5">
                  {t.periode}
                </p>
              </div>
              <div className="text-right">
                <span className="font-playfair text-2xl md:text-3xl text-sea-blue font-bold">
                  {t.prix}
                </span>
                <span className="font-lato text-gray-500 text-sm"> / nuit</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-sand rounded-xl p-6 mb-10 text-center">
          <p className="font-lato text-gray-600 text-sm leading-relaxed">
            Tarifs par nuit, pour la villa complète (8 personnes max).<br />
            Séjour minimum 3 nuits. Ménage fin de séjour inclus.<br />
            <span className="text-gray-500">
              Les tarifs exacts sont disponibles sur Airbnb et Abritel.
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.airbnb.fr/rooms/24533933"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FF5A5F] hover:bg-[#E04848] text-white px-8 py-4 rounded font-lato font-bold tracking-wider uppercase text-sm text-center transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Réserver sur Airbnb
          </a>
          <a
            href="https://www.airbnb.fr/rooms/24533933"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sea-blue hover:bg-sea-blue-light text-white px-8 py-4 rounded font-lato font-bold tracking-wider uppercase text-sm text-center transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Réserver sur Abritel
          </a>
        </div>
      </div>
    </section>
  );
}
