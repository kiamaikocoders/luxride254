import React, { useEffect } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import TrustSection from "./TrustSection";
import ServiceTabsSection from "./ServiceTabsSection";
import ChauffeurProfilesSection from "./ChauffeurProfilesSection";
import PackageSection from "./PackageSection";
import FleetSection from "./FleetSection";
import ExperienceSection from "./ExperienceSection";
import TestimonialsSection from "./TestimonialsSection";
import BrandCTASection from "./BrandCTASection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import { useScrollAnimation } from "@/utils/animations";

const LandingPage = () => {
  useEffect(() => {
    // Setup scroll-triggered animations for all sections
    const cleanup = useScrollAnimation({
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    });

    return cleanup;
  }, []);

  return (
    <div className="bg-white">
      <Header />
      <HeroSection />
      <AboutSection />
      <TrustSection />
      <ServiceTabsSection />
      <ChauffeurProfilesSection />
      <PackageSection />
      <ExperienceSection />
      <TestimonialsSection />
      <BrandCTASection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
