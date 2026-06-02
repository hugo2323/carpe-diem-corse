export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-playfair text-2xl font-bold mb-2">
              Carpe Diem
            </h3>
            <p className="font-lato text-gray-400 text-sm mb-4">
              Pietrosella, Corse-du-Sud
            </p>
            <p className="font-lato text-gray-500 text-xs">
              Géré par{" "}
              <span className="text-gold">Kalypso Conciergerie</span>
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-lato text-xs uppercase tracking-wider text-gray-500 mb-4">
              Navigation
            </h4>
            <nav className="space-y-2">
              {[
                { label: "Accueil", href: "/" },
                { label: "La Villa", href: "/#villa" },
                { label: "Galerie", href: "/galerie" },
                { label: "Contact", href: "/#reserver" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block font-lato text-gray-400 hover:text-gold transition-colors duration-200 text-sm"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* External */}
          <div>
            <h4 className="font-lato text-xs uppercase tracking-wider text-gray-500 mb-4">
              Réserver
            </h4>
            <div className="space-y-3">
              <a
                href="https://www.airbnb.fr/rooms/24533933"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-lato text-gray-400 hover:text-gold transition-colors duration-200 text-sm"
              >
                <span className="text-base">🏠</span>
                Airbnb
              </a>
              <a
                href="https://www.google.com/maps/place/Villa+vue+mer+6%2F8+personnes+(SCI+horizon)/@41.8260299,8.7846614,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-lato text-gray-400 hover:text-gold transition-colors duration-200 text-sm"
              >
                <span className="text-base">📍</span>
                Voir sur Google Maps
              </a>
              <a
                href="mailto:hugo.valette@outlook.com"
                className="flex items-center gap-2 font-lato text-gray-400 hover:text-gold transition-colors duration-200 text-sm"
              >
                <span className="text-base">✉️</span>
                hugo.valette@outlook.com
              </a>
              <a
                href="tel:+33674256336"
                className="flex items-center gap-2 font-lato text-gray-400 hover:text-gold transition-colors duration-200 text-sm"
              >
                <span className="text-base">📞</span>
                06.74.25.63.36
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="font-lato text-gray-500 text-xs">
            © 2026 Carpe Diem • Pietrosella, Corse. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
