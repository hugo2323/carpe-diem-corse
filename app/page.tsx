import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HighlightsSection from "./components/HighlightsSection";
import VillaSection from "./components/VillaSection";
import GalleryPreview from "./components/GalleryPreview";
import AvailabilitySection from "./components/AvailabilitySection";
import PricingCTA from "./components/PricingCTA";
import CarSection from "./components/CarSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { BookingProvider } from "./components/BookingProvider";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HighlightsSection />
      <VillaSection />
      <GalleryPreview />
      <BookingProvider>
        <AvailabilitySection />
        <PricingCTA />
        <CarSection />
        <ContactSection />
      </BookingProvider>
      <Footer />
    </main>
  );
}
