import Image from "next/image";
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {/* First photo - full width */}
          <div className="col-span-2 md:col-span-3 relative h-64 md:h-96 rounded-xl overflow-hidden">
            <Image
              src="/photos/exterieur/exterieur-1.jpeg"
              alt="Vue extérieure de la villa Carpe Diem"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Row 2 */}
          <div className="relative h-48 md:h-64 rounded-xl overflow-hidden">
            <Image
              src="/photos/interieur/salon - 4.jpeg"
              alt="Salon"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="relative h-48 md:h-64 rounded-xl overflow-hidden">
            <Image
              src="/photos/exterieur/exterieur-4.jpeg"
              alt="Extérieur"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="col-span-2 md:col-span-1 relative h-48 md:h-64 rounded-xl overflow-hidden">
            <Image
              src="/photos/exterieur/Coucher de soleil rouppione.jpeg"
              alt="Coucher de soleil"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Row 3 */}
          <div className="relative h-48 md:h-64 rounded-xl overflow-hidden">
            <Image
              src="/photos/interieur/chambre 4 - 1.jpeg"
              alt="Chambre"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="relative h-48 md:h-64 rounded-xl overflow-hidden">
            <Image
              src="/photos/interieur/cuisine.jpeg"
              alt="Cuisine"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="relative h-48 md:h-64 rounded-xl overflow-hidden">
            <Image
              src="/photos/interieur/terasse.jpeg"
              alt="Terrasse"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
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
