export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background gradient (photos à venir) */}
      <div className="absolute inset-0 bg-gradient-to-b from-sea-blue via-sea-blue/80 to-sea-blue/90" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-4 inline-block">
          <span className="text-gold font-lato text-sm md:text-base tracking-[0.3em] uppercase">
            Location saisonnière
          </span>
        </div>

        <h1 className="font-playfair text-6xl md:text-8xl lg:text-9xl text-white font-bold mb-4 text-shadow-lg">
          Carpe Diem
        </h1>

        <p className="font-lato text-xl md:text-2xl text-white/90 mb-6 text-shadow tracking-wide">
          Villa vue mer • Pietrosella, Corse
        </p>

        <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-10">
          <span className="text-white font-lato text-sm md:text-base">
            8 personnes
          </span>
          <span className="text-gold">•</span>
          <span className="text-white font-lato text-sm md:text-base">
            110 m²
          </span>
          <span className="text-gold">•</span>
          <span className="text-white font-lato text-sm md:text-base">
            Vue panoramique
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#reserver"
            className="bg-gold hover:bg-gold-light text-white px-8 py-4 rounded font-lato font-bold tracking-wider uppercase text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Voir les disponibilités
          </a>
          <a
            href="#villa"
            className="bg-white/15 backdrop-blur-sm hover:bg-white/25 border border-white/50 text-white px-8 py-4 rounded font-lato font-bold tracking-wider uppercase text-sm transition-all duration-200"
          >
            Découvrir la villa
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/80 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
