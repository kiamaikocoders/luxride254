import React from "react";
import { useNavigate } from "react-router-dom";
import { GradientText } from "@/components/reactbits/GradientText";
import { AnimatedButton } from "@/components/reactbits/AnimatedButton";
import { MeshBackground } from "@/components/reactbits/MeshBackground";
import { animationPresets } from "@/utils/animations";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
  };

  const handlePackagesClick = () => {
    const servicesSection = document.getElementById("services");
    servicesSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center' }}
        >
          <source src="/assets/Refined_Luxeride_Car_Service_Video.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/75"></div>
      </div>

      {/* Animated Mesh Background Overlay (subtle) */}
      <MeshBackground 
        className="opacity-20"
        colors={['#1a1a1a', '#2d2d2d', '#1a1a1a', '#3d3d3d']}
        intensity={0.2}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        
        {/* Main Headline with Gradient Text */}
        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-light mb-6 tracking-tight leading-tight ${animationPresets.hero.title}`}>
          <span className="text-white">Your Journey,</span>
          <br />
          <GradientText 
            animate={true}
            gradient="gold"
            className="font-medium"
          >
            Our Commitment
          </GradientText>
        </h1>
        
        {/* Mission Statement */}
        <p className={`text-lg md:text-xl text-gray-200 max-w-4xl mx-auto mb-10 leading-relaxed ${animationPresets.hero.subtitle}`}>
          Experience transportation that understands you. Every ride is crafted with care, 
          every moment matters. Premium service with professional chauffeurs and luxury vehicles 
          across Kenya's key markets.
        </p>
        
        {/* CTAs with Animated Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${animationPresets.hero.cta}`}>
          <AnimatedButton 
            variant="gold"
            size="lg"
            onClick={handleContactClick}
            className="shadow-lg"
          >
            <i className="fas fa-envelope mr-2"></i>
            Contact Us
          </AnimatedButton>
          <AnimatedButton 
            variant="outline"
            size="lg"
            onClick={handlePackagesClick}
            className="border-white text-white hover:bg-white hover:text-gray-900"
          >
            <i className="fas fa-crown mr-2"></i>
            View Packages
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
