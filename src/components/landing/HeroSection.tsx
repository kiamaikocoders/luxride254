import React from "react";
import { useNavigate } from "react-router-dom";

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
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/75"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        
        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-tight leading-tight animate-fade-in-delay-1">
          Elevating the<br />
          <span className="text-yellow-400 font-medium">Ride Experience</span>
        </h1>
        
        {/* Mission Statement */}
        <p className="text-lg md:text-xl text-gray-200 max-w-4xl mx-auto mb-10 leading-relaxed animate-fade-in-delay-2">
          Premium transportation with professional chauffeurs and luxury vehicles across Kenya's key markets
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-4">
          <button 
            onClick={handleContactClick}
            className="inline-flex items-center bg-yellow-400 text-gray-900 px-8 py-4 rounded-md text-lg font-medium hover:bg-yellow-300 transition duration-200 shadow-lg"
          >
            <i className="fas fa-envelope mr-2"></i>
            Contact Us
          </button>
          <button 
            onClick={handlePackagesClick}
            className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-white hover:text-gray-900 transition duration-200"
          >
            <i className="fas fa-crown mr-2"></i>
            View Packages
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-in-delay-1 { animation: fadeIn 0.8s ease-out 0.2s forwards; }
        .animate-fade-in-delay-2 { animation: fadeIn 0.8s ease-out 0.4s forwards; }
        .animate-fade-in-delay-3 { animation: fadeIn 0.8s ease-out 0.6s forwards; }
        .animate-fade-in-delay-4 { animation: fadeIn 0.8s ease-out 0.8s forwards; }
        .animate-fade-in, .animate-fade-in-delay-1, .animate-fade-in-delay-2, 
        .animate-fade-in-delay-3, .animate-fade-in-delay-4 { opacity: 0; }
      `}</style>
    </section>
  );
};

export default HeroSection;
