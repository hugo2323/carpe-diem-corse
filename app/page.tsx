import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HighlightsSection from "./components/HighlightsSection";
import VillaSection from "./components/VillaSection";
import GalleryPreview from "./components/GalleryPreview";
import TarifsSection from "./components/TarifsSection";
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
      <TarifsSection />
      <CarSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
