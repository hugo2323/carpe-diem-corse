import Icon from "./Icon";

// URL de la visite virtuelle 3D (Matterport, Klapty, etc.).
// Renseigner NEXT_PUBLIC_VIRTUAL_TOUR_URL le jour où elle est disponible :
// le bloc affiche alors l'embed plein écran. Sinon, message discret.
const TOUR_URL = process.env.NEXT_PUBLIC_VIRTUAL_TOUR_URL || "";

export default function VirtualTourSection() {
  return (
    <section id="visite-virtuelle" className="py-20 md:py-28 bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold font-lato text-sm tracking-[0.3em] uppercase mb-3 block">
            Immersion
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-sea-blue mb-4">
            Visite virtuelle 3D
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-6" />
          <p className="font-lato text-gray-600 text-lg">
            Explorez la villa pièce par pièce, comme si vous y étiez.
          </p>
        </div>

        {TOUR_URL ? (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src={TOUR_URL}
              title="Visite virtuelle 3D de la villa Carpe Diem"
              className="absolute inset-0 w-full h-full"
              allow="fullscreen; xr-spatial-tracking; accelerometer; gyroscope"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-sea-blue/20 bg-white/60 py-16 px-6 text-center">
            <span className="inline-flex text-sea-blue/40 mb-4">
              <Icon name="cube" size={48} strokeWidth={1.2} />
            </span>
            <p className="font-playfair text-2xl text-sea-blue mb-2">
              Visite virtuelle bientôt disponible
            </p>
            <p className="font-lato text-gray-500 text-sm max-w-md mx-auto">
              En attendant, découvrez la villa à travers notre galerie photos et
              n&apos;hésitez pas à nous contacter pour toute question.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
