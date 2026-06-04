import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HighlightsSection from "./components/HighlightsSection";
import VillaSection from "./components/VillaSection";
import GalleryPreview from "./components/GalleryPreview";
import VirtualTourSection from "./components/VirtualTourSection";
import AvailabilitySection from "./components/AvailabilitySection";
import PricingCTA from "./components/PricingCTA";
import CarSection from "./components/CarSection";
import ReviewsSection from "./components/ReviewsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { BookingProvider } from "./components/BookingProvider";
import { SITE_URL, VILLA_COORDS, GOOGLE_MAPS_PLACE_URL } from "@/lib/location";
import { AIRBNB_VERIFIED_SUMMARY } from "@/lib/reviews/config";

// Données structurées pour Google (référencement).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Villa Carpe Diem",
  description:
    "Villa 110 m² vue mer panoramique, 4 chambres, 8 personnes, à Pietrosella (Le Ruppione), Corse-du-Sud. Plage du Ruppione à 1 km.",
  url: SITE_URL,
  image: `${SITE_URL}/photos/exterieur/exterieur-1.jpeg`,
  hasMap: GOOGLE_MAPS_PLACE_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Le Ruppione",
    addressLocality: "Pietrosella",
    postalCode: "20166",
    addressRegion: "Corse-du-Sud",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: VILLA_COORDS.lat,
    longitude: VILLA_COORDS.lng,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: AIRBNB_VERIFIED_SUMMARY.rating,
    reviewCount: AIRBNB_VERIFIED_SUMMARY.count,
    bestRating: 5,
  },
  amenityFeature: [
    "Vue mer",
    "Fibre internet",
    "Terrasse",
    "Parking",
    "Climatisation",
    "Cuisine équipée",
  ].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <HeroSection />
      <HighlightsSection />
      <VillaSection />
      <GalleryPreview />
      <VirtualTourSection />
      <BookingProvider>
        <AvailabilitySection />
        <PricingCTA />
        <CarSection />
        <ReviewsSection />
        <ContactSection />
      </BookingProvider>
      <Footer />
    </main>
  );
}
