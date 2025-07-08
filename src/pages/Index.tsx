import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import ServicesSection from "@/components/ServicesSection"
import AboutSection from "@/components/AboutSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import VIPMembershipSection from "@/components/VIPMembershipSection"
import FleetSection from "@/components/FleetSection"
import Footer from "@/components/Footer"

const Index = () => {
  return (
    <div className="min-h-screen bg-luxe-dark-primary">
      <Header />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <VIPMembershipSection />
      <FleetSection />
      <Footer />
    </div>
  );
};

export default Index;
