import Link from "next/link";

export default function GalleryPreview() {
  return (
    <section id="galerie" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold font-lato text-sm tracking-[0.3em] uppercase mb-3 block">
            Galerie
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-sea-blue mb-4">
            La villa en images
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto" />
        </div>

        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border border-sand">
          <p className="font-lato text-gray-400 text-sm tracking-wider uppercase">
            Photos à venir
          </p>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/galerie"
            className="inline-flex items-center gap-3 border-2 border-sea-blue text-sea-blue hover:bg-sea-blue hover:text-white px-8 py-4 rounded font-lato font-bold tracking-wider uppercase text-sm transition-all duration-200"
          >
            Voir toutes les photos
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
