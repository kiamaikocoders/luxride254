import React from "react";
import { InfiniteCarousel } from "@/components/reactbits";

const TrustSection = () => {
  const trustFeatures = [
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16.2V10C16.2,7.8 14.4,6 12,6C9.6,6 7.8,7.8 7.8,10V11H9.2V10C9.2,8.6 10.6,7 12,7M8.8,11V10C8.8,8.9 9.7,8 10.8,8H13.2C14.3,8 15.2,8.9 15.2,10V11C15.2,12.1 14.3,13 13.2,13H10.8C9.7,13 8.8,12.1 8.8,11Z"/>
        </svg>
      ),
      title: "Fully Insured",
      description: "Comprehensive coverage for complete peace of mind on every journey",
      stat: "100% Coverage"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
        </svg>
      ),
      title: "Background Verified",
      description: "All chauffeurs undergo thorough background checks and certification",
      stat: "5+ Years Experience"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
        </svg>
      ),
      title: "5-Star Rated",
      description: "Consistently excellent service with outstanding customer satisfaction",
      stat: "4.9/5 Rating"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
        </svg>
      ),
      title: "24/7 Support",
      description: "Round-the-clock customer support and dedicated concierge service",
      stat: "Always Available"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9,11.24V7.5C9,6.12 10.12,5 11.5,5C12.88,5 14,6.12 14,7.5V11.24C14.61,11.09 15,10.5 15,9.81V9C15,7.9 14.1,7 13,7H11C9.9,7 9,7.9 9,9V9.81C9,10.5 9.39,11.09 10,11.24M19,11H17V9H19M19,15H17V13H19M11,15H9V13H11M15,15H13V13H15M19,19H5V5H19V19Z"/>
        </svg>
      ),
      title: "Regular Maintenance",
      description: "All vehicles undergo rigorous safety inspections and maintenance",
      stat: "Monthly Checks"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,1L8,5H11V14H13V5H16M18,23H6C4.89,23 4,22.1 4,21V9A2,2 0 0,1 6,7H9V9H6V21H18V9H15V7H18A2,2 0 0,1 20,9V21A2,2 0 0,1 18,23Z"/>
        </svg>
      ),
      title: "GPS Tracking",
      description: "Real-time tracking and monitoring for your safety and peace of mind",
      stat: "Live Updates"
    }
  ];

  return (
    <section className="py-20 section-gold-tint relative">
      {/* Top Border Separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
      {/* Bottom Border Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 scroll-fade-up">
          <h2 className="text-3xl md:text-4xl brand-heading mb-4">
            Your Safety is Our Priority
          </h2>
          <div className="h-1 w-20 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We go above and beyond to ensure every journey is safe, secure, and exceptional. 
            Your peace of mind is at the heart of everything we do.
          </p>
        </div>

        {/* Trust Features Infinite Carousel */}
        <InfiniteCarousel
          autoplay={true}
          autoplayInterval={4000}
          loop={true}
          className="w-full"
          itemClassName="h-full"
        >
          {trustFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl p-6 md:p-8 text-center shadow-xl hover:shadow-2xl hover:shadow-yellow-400/50 active:shadow-2xl active:shadow-yellow-400/50 transition-all transform hover:-translate-y-2 active:-translate-y-1 active:scale-[0.98] animate-fade-in touch-manipulation h-full flex flex-col"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 text-gray-900">
                {React.cloneElement(feature.icon, { className: "w-10 h-10" })}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-800 mb-6 leading-relaxed font-medium flex-grow">{feature.description}</p>
              <div className="inline-block bg-white/40 backdrop-blur-sm text-gray-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg">
                {feature.stat}
              </div>
            </div>
          ))}
        </InfiniteCarousel>

        {/* Additional Trust Indicators */}
        <div className="mt-12 md:mt-16 grid grid-cols-3 gap-3 md:gap-8 lg:gap-12 text-center max-w-5xl mx-auto scroll-stagger">
          <div>
            <div className="text-2xl md:text-4xl font-bold text-yellow-400 mb-1 md:mb-2">10,000+</div>
            <div className="text-xs md:text-base text-gray-600">Satisfied Customers</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-bold text-yellow-400 mb-1 md:mb-2">50,000+</div>
            <div className="text-xs md:text-base text-gray-600">Safe Journeys</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-bold text-yellow-400 mb-1 md:mb-2">99.8%</div>
            <div className="text-xs md:text-base text-gray-600">On-Time Rate</div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default TrustSection;
