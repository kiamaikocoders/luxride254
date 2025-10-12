import React from "react";
import { useNavigate } from "react-router-dom";

const FleetSection = () => {
  const navigate = useNavigate();

  const handleViewAllFleet = () => {
    navigate('/executive-cars'); // or create a dedicated fleet page
  };

  return (
    <section id="fleet" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Our Premium Fleet</h2>
          <div className="h-1 w-20 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meticulously curated vehicles across three distinct luxury categories, 
            maintained to the highest standards of excellence.
          </p>
          <button 
            onClick={handleViewAllFleet}
            className="mt-6 bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-yellow-300 transition duration-200"
          >
            View All Fleet
          </button>
        </div>
        
        {/* Fleet Categories */}
        <div className="space-y-12">
          {/* Executive Sedan */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-yellow-400 transition-all duration-300 animate-fade-in-delay-1">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-64 md:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Executive Sedan" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">Executive Sedan Class</h3>
                <p className="text-gray-600 mb-4">BMW 5 Series, Mercedes-Benz E-Class, Audi A6</p>
                <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Premium leather interiors
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Wi-Fi connectivity & mobile charging
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Climate control & privacy glass
                </li>
                </ul>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Available in all VIP packages</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Luxury SUV */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-yellow-400 transition-all duration-300 animate-fade-in-delay-2">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-64 md:h-auto md:order-2">
                <img 
                  src="https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Luxury SUV" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-8 flex flex-col justify-center md:order-1">
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">Luxury SUV Category</h3>
                <p className="text-gray-600 mb-4">BMW X7, Mercedes-Benz GLS, Range Rover</p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                    6-7 passenger capacity
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                    Premium entertainment & privacy glass
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                    All-terrain capability
                  </li>
                </ul>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Available in all VIP packages</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ultra-Luxury */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-yellow-400 transition-all duration-300 animate-fade-in-delay-3">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-64 md:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Ultra-Luxury" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">Ultra-Luxury Tier</h3>
                <p className="text-gray-600 mb-4">Mercedes-Maybach, Bentley Flying Spur</p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                    Executive rear seating & massage seats
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                    Champagne cooler & refreshments
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                    Personal concierge service
                  </li>
                </ul>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Available in Platinum & Diamond packages</p>
                </div>
              </div>
            </div>
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

export default FleetSection;
