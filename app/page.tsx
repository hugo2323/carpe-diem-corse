import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HighlightsSection from "./components/HighlightsSection";
import VillaSection from "./components/VillaSection";
import GalleryPreview from "./components/GalleryPreview";
import PricingCTA from "./components/PricingCTA";
import CarSection from "./components/CarSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HighlightsSection />
      <VillaSection />
      <GalleryPreview />
      <PricingCTA />
      <CarSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
