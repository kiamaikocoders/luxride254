import React from "react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">About LuxeRide</h2>
          <div className="h-1 w-20 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            LuxeRide is committed to achieving client equity in mobility, competence in service delivery, 
            care for every journey, and solution-oriented expertise across all transportation needs.
          </p>
        </div>
        
        {/* Core Pillars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Pillar 1: Equity */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg hover:border-yellow-400 transition-all duration-300 animate-fade-in-delay-1">
            <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Client Equity</h3>
            <p className="text-gray-600 leading-relaxed">
              Premium service for all clients, ensuring exceptional experiences regardless of journey length or destination.
            </p>
          </div>
          
          {/* Pillar 2: Competence */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg hover:border-yellow-400 transition-all duration-300 animate-fade-in-delay-2">
            <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Competence</h3>
            <p className="text-gray-600 leading-relaxed">
              Professional chauffeurs with 5+ years experience, certified training, and continuous performance evaluation.
            </p>
          </div>
          
          {/* Pillar 3: Care */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg hover:border-yellow-400 transition-all duration-300 animate-fade-in-delay-3">
            <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Care</h3>
            <p className="text-gray-600 leading-relaxed">
              Every journey crafted with attention to detail, comfort, and client satisfaction at the forefront.
            </p>
          </div>
          
          {/* Pillar 4: Solution-Oriented */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg hover:border-yellow-400 transition-all duration-300 animate-fade-in">
            <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Solution-Oriented</h3>
            <p className="text-gray-600 leading-relaxed">
              Innovative approaches to transportation challenges, leveraging technology for seamless experiences.
            </p>
          </div>
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
        .animate-fade-in, .animate-fade-in-delay-1, .animate-fade-in-delay-2, 
        .animate-fade-in-delay-3 { opacity: 0; }
      `}</style>
    </section>
  );
};

export default AboutSection;
