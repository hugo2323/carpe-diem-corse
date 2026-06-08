import AvailabilityCalendar from "./AvailabilityCalendar";
import ContactSection from "./ContactSection";
import Icon, { type IconName } from "./Icon";
import {
  GOOGLE_MAPS_PLACE_URL,
  GOOGLE_MAPS_DIRECTIONS_URL,
} from "@/lib/location";

const CONTACTS: {
  icon: IconName;
  label: string;
  value: string;
  href: string | null;
}[] = [
  { icon: "phone", label: "Téléphone", value: "06.74.25.63.36", href: "tel:+33674256336" },
  { icon: "mail", label: "Email", value: "hugo.valette@outlook.com", href: "mailto:hugo.valette@outlook.com" },
  { icon: "pin", label: "Adresse", value: "Pietrosella – Le Ruppione (20166), Corse-du-Sud", href: null },
  { icon: "concierge", label: "Conciergerie", value: "Accueil par Kalypso Conciergerie", href: null },
];

export default function AvailabilitySection() {
  return (
    <section id="disponibilites" className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold font-lato text-sm tracking-[0.3em] uppercase mb-3 block">
            Disponibilités &amp; Réservation
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-sea-blue mb-4">
            Réservez votre séjour
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-6" />
          <p className="font-lato text-gray-600 text-lg">
            Choisissez vos dates dans le calendrier : votre demande se remplit
            automatiquement à côté.
          </p>
        </div>

        {/* Calendrier (gauche) + formulaire (droite, collant sur grand écran) */}
        <div
          id="reserver"
          className="grid xl:grid-cols-5 gap-8 xl:gap-12 items-start"
        >
          <div className="xl:col-span-3 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gold/10">
            <AvailabilityCalendar />
          </div>
          <div className="xl:col-span-2 xl:sticky xl:top-24">
            <ContactSection />
          </div>
        </div>

        {/* Coordonnées directes */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTACTS.map((c) => (
            <div key={c.label} className="flex items-start gap-3">
              <span className="text-gold w-7 flex-shrink-0 flex justify-center pt-0.5">
                <Icon name={c.icon} size={20} />
              </span>
              <div className="min-w-0">
                <p className="font-lato text-gray-400 text-xs uppercase tracking-wider mb-1">
                  {c.label}
                </p>
                {c.href ? (
                  <a
                    href={c.href}
                    className="font-lato text-sea-blue hover:text-gold transition-colors duration-200 break-words"
                  >
                    {c.value}
                  </a>
                ) : (
                  <p className="font-lato text-sea-blue break-words">{c.value}</p>
                )}
                {c.label === "Adresse" && (
                  <div className="flex flex-col gap-1.5 mt-2">
                    <a
                      href={GOOGLE_MAPS_PLACE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-lato text-gold hover:text-sea-blue transition-colors duration-200 text-sm inline-flex items-center gap-1.5"
                    >
                      <Icon name="pin" size={14} className="flex-shrink-0" />
                      Voir sur Google Maps
                    </a>
                    <a
                      href={GOOGLE_MAPS_DIRECTIONS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-lato text-gray-500 hover:text-gold transition-colors duration-200 text-sm inline-flex items-center gap-1.5"
                    >
                      <Icon name="navigation" size={14} className="flex-shrink-0" />
                      Itinéraire
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
