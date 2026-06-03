import AvailabilityCalendar from "./AvailabilityCalendar";

export default function AvailabilitySection() {
  return (
    <section id="disponibilites" className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold font-lato text-sm tracking-[0.3em] uppercase mb-3 block">
            Disponibilités
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-sea-blue mb-4">
            Calendrier en temps réel
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-6" />
          <p className="font-lato text-gray-600 text-lg">
            Disponibilités de la villa synchronisées depuis Airbnb et Abritel.
          </p>
        </div>

        <AvailabilityCalendar />
      </div>
    </section>
  );
}
