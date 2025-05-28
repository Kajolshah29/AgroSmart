import Hero from "../components/Hero";
import Header from "../components/Nagivation";
import Features from "../components/Features";
import AboutSection from "../components/AboutSection";
import MarketplacePreview from "../components/MarketplacePreview";
import UserRoles from "../components/UserRoles";
import ContactSection from "../components/ContactSection";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";


export default function Home() {
  return (
    <div className="min-h-screen font-inter">
      <Header></Header>
      <Hero></Hero>
      <Features></Features>
      <AboutSection />
      <MarketplacePreview />
      <UserRoles />
      {/* <AIChatbot /> */}
      <ContactSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
