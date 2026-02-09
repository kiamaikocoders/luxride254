import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedButton } from "@/components/reactbits";

const BrandCTASection = () => {
  const navigate = useNavigate();

  const handlePackagesClick = () => {
    navigate("/vip-membership");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-400 via-yellow-500 via-yellow-600 to-yellow-700 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Brand Card with Car Inside on Right */}
          <div className="scroll-fade-left">
            {/* Card Container - position: relative */}
            <div className="relative bg-white rounded-xl shadow-2xl p-8 md:p-12 transform hover:scale-[1.02] transition-transform duration-300">
              
              {/* Content Container - Flex Layout */}
              <div className="flex items-center justify-between gap-8">
                {/* Brand Text - Left Side */}
                <div className="flex-grow">
                  <h1 className="luxe-brand-text">
                    <span className="luxe-part">LUXE</span>
                    <span className="ride-part">RIDE</span>
                  </h1>
                  
                  {/* Tagline */}
                  <p className="text-yellow-500 font-bold text-lg md:text-xl tracking-widest uppercase mt-4">
                    YOUR PREMIUM TRANSPORTATION
                  </p>
                </div>
                
                {/* Car Image - Right Side, Inside Card */}
                <div className="flex-shrink-0 relative">
                  <img 
                    src="/assets/luxeride-car-brand.png"
                    alt="LuxeRide Premium Vehicle"
                    className="w-32 h-32 md:w-44 md:h-44 lg:w-56 lg:h-56 object-contain"
                    style={{
                      filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.25)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))'
                    }}
                    onError={(e) => {
                      // Fallback to the original uploaded path if needed
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/image-31ca277b-e5d6-4873-9de5-7f9675f2abb4.png';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - CTA */}
          <div className="text-white scroll-fade-right">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight">
              JOIN US
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/95 leading-relaxed">
              Download the app and start your journey with LuxeRide today. Experience premium transportation at your fingertips.
            </p>
            
            {/* Single CTA Button */}
            <div className="flex justify-start">
              <AnimatedButton
                variant="gold"
                size="lg"
                onClick={handlePackagesClick}
                className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl hover:shadow-2xl px-8 py-4 text-lg font-semibold uppercase tracking-wide"
              >
                Check Our Packages
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCTASection;
