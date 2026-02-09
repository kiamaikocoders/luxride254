import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/luxe-button"
import { ArrowLeft, Car, Shield, Clock, Star, ChevronLeft, ChevronRight, Users, Wifi, Thermometer, Sparkles, Crown, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"
import executiveCarsImage from "@/assets/executive-cars.jpg"
import React, { useState, useEffect } from "react";
import { GradientText, AnimatedButton, MeshBackground } from '@/components/reactbits';

const ExecutiveCars = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Comprehensive vehicle fleet data
  const vehicles = [
    {
      id: 1,
      category: "Executive Sedan Class",
      models: "BMW 5 Series, Mercedes-Benz E-Class, Audi A6",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        { icon: <CheckCircle className="w-5 h-5" />, text: "Premium leather interiors" },
        { icon: <Wifi className="w-5 h-5" />, text: "Wi-Fi connectivity & mobile charging" },
        { icon: <Thermometer className="w-5 h-5" />, text: "Climate control & privacy glass" }
      ],
      availability: "Available in all membership packages",
      tier: "Executive"
    },
    {
      id: 2,
      category: "Luxury SUV Category",
      models: "BMW X7, Mercedes-Benz GLS, Range Rover",
      image: "https://lacddam.lexusasia.com/lexus-v3-blueprint/models/suv/lx/mlp/my22/overview/overview-mlp.jpg",
      features: [
        { icon: <Users className="w-5 h-5" />, text: "6-7 passenger capacity" },
        { icon: <Sparkles className="w-5 h-5" />, text: "Premium entertainment & privacy glass" },
        { icon: <Car className="w-5 h-5" />, text: "All-terrain capability" }
      ],
      availability: "Available in all membership packages",
      tier: "Luxury"
    },
    {
      id: 3,
      category: "Ultra-Luxury Tier",
      models: "Mercedes-Maybach, Bentley Flying Spur",
      image: "https://static.moniteurautomobile.be/imgcontrol/images_tmp/clients/moniteur/c680-d465/content/medias/images/test_drives/9000/900/60/audirsq8_15.jpg",
      features: [
        { icon: <Crown className="w-5 h-5" />, text: "Executive rear seating & massage seats" },
        { icon: <Sparkles className="w-5 h-5" />, text: "Champagne cooler & refreshments" },
        { icon: <Star className="w-5 h-5" />, text: "Personal concierge service" }
      ],
      availability: "Available in Platinum & Diamond packages",
      tier: "Ultra-Luxury"
    },
    {
      id: 4,
      category: "Premium Sedan Collection",
      models: "BMW 7 Series, Mercedes S-Class, Audi A8",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        { icon: <Crown className="w-5 h-5" />, text: "Executive rear seating with reclining" },
        { icon: <Wifi className="w-5 h-5" />, text: "High-speed internet & premium audio" },
        { icon: <Thermometer className="w-5 h-5" />, text: "4-zone climate control system" }
      ],
      availability: "Available in Gold & Platinum packages",
      tier: "Ultra-Luxury"
    },
    {
      id: 5,
      category: "Luxury Convertible Series",
      models: "BMW 8 Series, Mercedes SL-Class, Porsche 911",
      image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        { icon: <Sparkles className="w-5 h-5" />, text: "Convertible top with climate control" },
        { icon: <Star className="w-5 h-5" />, text: "Premium sound system & ambient lighting" },
        { icon: <Car className="w-5 h-5" />, text: "High-performance engine & handling" }
      ],
      availability: "Available in Diamond package",
      tier: "Ultra-Luxury"
    },
    {
      id: 6,
      category: "Business Class Sedans",
      models: "BMW 3 Series, Mercedes C-Class, Audi A4",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        { icon: <CheckCircle className="w-5 h-5" />, text: "Comfortable seating for 4 passengers" },
        { icon: <Wifi className="w-5 h-5" />, text: "Business connectivity & charging ports" },
        { icon: <Clock className="w-5 h-5" />, text: "Punctual and reliable service" }
      ],
      availability: "Available in all packages",
      tier: "Executive"
    },
    {
      id: 7,
      category: "Premium SUV Collection",
      models: "BMW X5, Mercedes GLE, Audi Q7",
      image: "https://media.whichcar.com.au/uploads/2024/02/6103fd01-2024-porsche-cayenne-s-white-suv-13.jpg",
      features: [
        { icon: <Users className="w-5 h-5" />, text: "Spacious 5-7 passenger seating" },
        { icon: <Car className="w-5 h-5" />, text: "Advanced all-wheel drive system" },
        { icon: <Sparkles className="w-5 h-5" />, text: "Premium interior & entertainment" }
      ],
      availability: "Available in Silver & Gold packages",
      tier: "Luxury"
    },
    {
      id: 8,
      category: "Luxury Electric Fleet",
      models: "Tesla Model S, BMW iX, Mercedes EQS",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        { icon: <Sparkles className="w-5 h-5" />, text: "Zero-emission luxury transportation" },
        { icon: <Wifi className="w-5 h-5" />, text: "Advanced tech & autonomous features" },
        { icon: <Star className="w-5 h-5" />, text: "Silent operation & smooth ride" }
      ],
      availability: "Available in Platinum & Diamond packages",
      tier: "Ultra-Luxury"
    },
    {
      id: 9,
      category: "Executive Van Service",
      models: "Mercedes V-Class, BMW 2 Series Gran Tourer",
      image: "https://redcentrecaravans.com.au/wp-content/uploads/2024/08/mercedes-sprinter-banner-image.jpg",
      features: [
        { icon: <Users className="w-5 h-5" />, text: "8-passenger capacity with luggage space" },
        { icon: <Car className="w-5 h-5" />, text: "Spacious interior & comfortable seating" },
        { icon: <Shield className="w-5 h-5" />, text: "Group transportation & airport transfers" }
      ],
      availability: "Available in all packages",
      tier: "Executive"
    },
    {
      id: 10,
      category: "High-Profile Executive Collection",
      models: "Cadillac Escalade, Mercedes-Maybach GLS, Bentley Bentayga",
      image: "https://carsforsale.co.ke/wp-content/uploads/elementor/thumbs/5849987_carP_l_1-r647v86ud6mtlbb13dn23gqmdm1j4uewlgdppicqrg.jpg",
      features: [
        { icon: <Crown className="w-5 h-5" />, text: "Ultimate luxury for high-profile individuals" },
        { icon: <Star className="w-5 h-5" />, text: "Executive protection & privacy features" },
        { icon: <Sparkles className="w-5 h-5" />, text: "Celebrity & VIP event transportation" }
      ],
      availability: "Available in Diamond package only",
      tier: "Ultra-Luxury"
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % vehicles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, vehicles.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % vehicles.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + vehicles.length) % vehicles.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-96 flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${executiveCarsImage})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              <span className="text-yellow-400">Executive</span> Cars
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Experience luxury and comfort with our premium fleet of executive vehicles
            </p>
          </div>
        </section>

        {/* Back Button */}
        <section className="py-8 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Fleet Showcase Section */}
        <section className="py-16 bg-gray-900 relative overflow-hidden">
          {/* Subtle Mesh Background */}
          <MeshBackground 
            className="opacity-20"
            colors={['#1a1a1a', '#2d2d2d', '#D4AF37', '#1a1a1a']}
            intensity={0.2}
          />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-white">Our Premium </span>
                <GradientText animate={true} gradient="gold" className="font-bold">
                  Fleet
                </GradientText>
                </h2>
              <div className="h-1 w-20 bg-yellow-400 mx-auto mb-6"></div>
              <p className="text-white text-lg max-w-3xl mx-auto leading-relaxed">
                Meticulously curated vehicles across three distinct luxury categories, 
                maintained to the highest standards of excellence.
              </p>
            </div>

            {/* Desktop Carousel */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="overflow-hidden rounded-xl">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="w-full flex-shrink-0">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-400 transition-all duration-300">
                          <div className="grid md:grid-cols-2 gap-0">
                            <div className="h-80 md:h-96">
                              <img 
                                src={vehicle.image} 
                                alt={vehicle.category} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="p-8 flex flex-col justify-center">
                              <div className="flex items-center gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  vehicle.tier === 'Ultra-Luxury' 
                                    ? 'bg-yellow-400 text-gray-900' 
                                    : vehicle.tier === 'Luxury'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-white'
                                }`}>
                                  {vehicle.tier}
                                </span>
                              </div>
                              <h3 className="text-2xl font-semibold mb-3 text-white">{vehicle.category}</h3>
                              <p className="text-gray-100 mb-4">{vehicle.models}</p>
                              <ul className="space-y-3 mb-6">
                                {vehicle.features.map((feature, index) => (
                                  <li key={index} className="flex items-center text-gray-100">
                                    <span className="text-yellow-400 mr-3 flex-shrink-0">{feature.icon}</span>
                                    {feature.text}
                                  </li>
                                ))}
                              </ul>
                              <div className="text-center">
                                <p className="text-sm text-yellow-400">{vehicle.availability}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                    ))}
                  </div>
                </div>

                {/* Carousel Controls */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800/80 hover:bg-yellow-400 text-white hover:text-gray-900 p-3 rounded-full transition-all duration-300 shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800/80 hover:bg-yellow-400 text-white hover:text-gray-900 p-3 rounded-full transition-all duration-300 shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Carousel Indicators */}
                <div className="flex justify-center mt-8 space-x-2">
                  {vehicles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-yellow-400' 
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
                    </div>
                  </div>
                  
            {/* Mobile Infinite Scroll */}
            <div className="lg:hidden">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 pb-4" style={{ width: `${vehicles.length * 320}px` }}>
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex-shrink-0 w-80">
                      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-400 transition-all duration-300">
                        <div className="h-48">
                          <img 
                            src={vehicle.image} 
                            alt={vehicle.category} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              vehicle.tier === 'Ultra-Luxury' 
                                ? 'bg-yellow-400 text-gray-900' 
                                : vehicle.tier === 'Luxury'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-600 text-white'
                            }`}>
                              {vehicle.tier}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold mb-2 text-white">{vehicle.category}</h3>
                          <p className="text-gray-300 mb-4 text-sm">{vehicle.models}</p>
                          <ul className="space-y-2 mb-4">
                            {vehicle.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-gray-100 text-sm">
                                <span className="text-yellow-400 mr-2 flex-shrink-0">{feature.icon}</span>
                                {feature.text}
                              </li>
                            ))}
                          </ul>
                          <div className="text-center">
                            <p className="text-xs text-yellow-400">{vehicle.availability}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 relative z-10">
              <h2 className="text-3xl font-bold mb-6">
                <span className="text-white">Why Choose Our </span>
                <GradientText animate={true} gradient="gold" className="font-bold">
                  Executive Fleet?
                </GradientText>
              </h2>
                  </div>
                  
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {/* Luxury Vehicles - Vibrant Gold Card */}
              <div className="text-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl p-8 shadow-xl hover:shadow-2xl hover:shadow-yellow-400/50 transition-all transform hover:-translate-y-2">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Car className="h-10 w-10 text-gray-900" />
                    </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Luxury Vehicles</h3>
                <p className="text-gray-800 text-sm font-medium leading-relaxed">Mercedes S-Class, BMW 7 Series, and other premium vehicles</p>
                  </div>
              
              {/* Professional Chauffeurs - Deep Gold Card */}
              <div className="text-center bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 rounded-xl p-8 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/50 transition-all transform hover:-translate-y-2">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Shield className="h-10 w-10 text-gray-900" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Professional Chauffeurs</h3>
                <p className="text-gray-800 text-sm font-medium leading-relaxed">Experienced, licensed, and background-checked drivers</p>
                </div>

              {/* 24/7 Availability - Gold Gradient Card */}
              <div className="text-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl p-8 shadow-xl hover:shadow-2xl hover:shadow-yellow-400/50 transition-all transform hover:-translate-y-2">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Clock className="h-10 w-10 text-gray-900" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">24/7 Availability</h3>
                <p className="text-gray-800 text-sm font-medium leading-relaxed">Round-the-clock service for all your transportation needs</p>
              </div>

              {/* 5-Star Service - Premium Gold Card */}
              <div className="text-center bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 rounded-xl p-8 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/50 transition-all transform hover:-translate-y-2">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Star className="h-10 w-10 text-gray-900" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">5-Star Service</h3>
                <p className="text-gray-800 text-sm font-medium leading-relaxed">Exceptional service quality guaranteed</p>
              </div>
            </div>

            <div className="text-center mt-12 relative z-10">
                <Link to="/vip-membership" className="inline-block">
                <AnimatedButton
                  variant="gold"
                  size="lg"
                >
                  Learn About VIP Access
                </AnimatedButton>
                </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default ExecutiveCars