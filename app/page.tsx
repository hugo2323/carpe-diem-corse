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

export default function Home() {
  return (
    <main>
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
