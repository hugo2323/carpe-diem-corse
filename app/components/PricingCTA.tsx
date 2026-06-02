export default function PricingCTA() {
  return (
    <section id="tarifs" className="py-20 md:py-28 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-gold font-lato text-sm tracking-[0.3em] uppercase mb-3 block">
          Tarifs
        </span>
        <h2 className="font-playfair text-4xl md:text-5xl text-sea-blue mb-4">
          Contactez-nous pour connaître nos tarifs
        </h2>
        <div className="w-20 h-0.5 bg-gold mx-auto mb-6" />
        <p className="font-lato text-gray-600 text-lg mb-10">
          ou retrouvez-nous sur Airbnb
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/#reserver"
            className="bg-gold hover:bg-gold-light text-white px-8 py-4 rounded font-lato font-bold tracking-wider uppercase text-sm text-center transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Nous contacter
          </a>
          <a
            href="https://www.airbnb.fr/rooms/24533933"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FF5A5F] hover:bg-[#E04848] text-white px-8 py-4 rounded font-lato font-bold tracking-wider uppercase text-sm text-center transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Voir l&apos;annonce Airbnb
          </a>
        </div>
      </div>
    </section>
  );
}
