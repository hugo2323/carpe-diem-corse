export default function CarSection() {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-gold font-lato text-sm tracking-[0.3em] uppercase mb-3 block">
              Location de voiture
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl text-sea-blue mb-6 font-bold">
              Explorez la Corse<br />en toute liberté
            </h2>
            <p className="font-lato text-gray-700 text-lg leading-relaxed mb-8">
              Arrivez sereinement en Corse avec notre{" "}
              <strong className="text-sea-blue">Dacia Bigster 2025</strong>{" "}
              disponible à la location. Idéale pour explorer l&apos;île en toute
              liberté — des calanques aux cols de montagne.
            </p>
            <a
              href="mailto:hugo.valette@outlook.com?subject=Location voiture Dacia Bigster - Villa Carpe Diem"
              className="inline-flex items-center gap-3 bg-sea-blue hover:bg-sea-blue-light text-white px-8 py-4 rounded font-lato font-bold tracking-wider uppercase text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Nous contacter
            </a>
          </div>

          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-xl bg-sand flex items-center justify-center">
            <div className="text-center text-sea-blue/40">
              <div className="text-6xl mb-3">🚗</div>
              <p className="font-playfair text-xl font-semibold">Dacia Bigster 2025</p>
              <p className="font-lato text-sm mt-2">Photos à venir</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
