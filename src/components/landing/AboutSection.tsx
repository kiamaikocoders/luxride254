import React from "react";
import { InfiniteCarousel } from "@/components/reactbits";

const AboutSection = () => {
  const pillars = [
    {
      id: 1,
      title: "Client Equity",
      description: "Premium service for all clients, ensuring exceptional experiences regardless of journey length or destination.",
      icon: (
        <svg className="w-10 h-10 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      ),
      gradient: "from-yellow-400 via-yellow-500 to-yellow-600"
    },
    {
      id: 2,
      title: "Competence",
      description: "Professional chauffeurs with 5+ years experience, certified training, and continuous performance evaluation.",
      icon: (
        <svg className="w-10 h-10 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      gradient: "from-yellow-500 via-yellow-600 to-yellow-700"
    },
    {
      id: 3,
      title: "Care",
      description: "Every journey crafted with attention to detail, comfort, and client satisfaction at the forefront.",
      icon: (
        <svg className="w-10 h-10 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ),
      gradient: "from-yellow-400 via-yellow-500 to-yellow-600"
    },
    {
      id: 4,
      title: "Solution-Oriented",
      description: "Innovative approaches to transportation challenges, leveraging technology for seamless experiences.",
      icon: (
        <svg className="w-10 h-10 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
        </svg>
      ),
      gradient: "from-yellow-500 via-yellow-600 to-yellow-700"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white relative">
      {/* Top Border Separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
      {/* Bottom Border Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 scroll-fade-up">
          <h2 className="text-3xl md:text-4xl brand-heading mb-4">About LuxeRide</h2>
          <div className="h-1 w-20 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            LuxeRide is committed to achieving client equity in mobility, competence in service delivery, 
            care for every journey, and solution-oriented expertise across all transportation needs.
          </p>
        </div>
        
        {/* Mobile: Carousel, Desktop: Grid */}
        <div className="md:hidden">
          <InfiniteCarousel
            autoplay={true}
            autoplayInterval={4000}
            loop={true}
            className="w-full"
            itemClassName="h-full"
          >
            {pillars.map((pillar, index) => (
              <div
                key={pillar.id}
                className={`bg-gradient-to-br ${pillar.gradient} rounded-xl p-8 text-center shadow-xl active:shadow-2xl active:shadow-yellow-400/50 transition-all transform active:scale-[0.98] h-full flex flex-col touch-manipulation`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                  {pillar.icon}
            </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{pillar.title}</h3>
                <p className="text-gray-800 leading-relaxed font-medium flex-grow">
                  {pillar.description}
            </p>
          </div>
            ))}
          </InfiniteCarousel>
          </div>
          
        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 scroll-stagger">
          {pillars.map((pillar) => {
            return (
              <div
                key={pillar.id}
                className={`bg-gradient-to-br ${pillar.gradient} rounded-xl p-8 text-center shadow-xl hover:shadow-2xl hover:shadow-yellow-400/50 active:shadow-2xl active:shadow-yellow-400/50 transition-all transform hover:-translate-y-2 active:-translate-y-1 active:scale-[0.98] touch-manipulation`}
              >
                <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                  {pillar.icon}
            </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{pillar.title}</h3>
                <p className="text-gray-800 leading-relaxed font-medium">
                  {pillar.description}
            </p>
          </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default AboutSection;
