import { Button } from "@/components/ui/luxe-button"
import BookingModal from "@/components/BookingModal";
import React, { useState, useRef } from "react";

const vehicles = [
  {
    category: "Ultra Luxury",
    name: "Mercedes-Benz S-Class",
    price: "From KSH 8,000",
    period: "/hour",
    image: "https://media.ed.edmunds-media.com/mercedes-benz/s-class/2025/oem/2025_mercedes-benz_s-class_sedan_amg-s-63-e-performance_fq_oem_1_1600.jpg",
    features: [
      "Premium Leather Interior",
      "Professional Chauffeur",
      "Wi-Fi & Entertainment",
      "Climate Control",
      "Refreshment Service"
    ],
    type: "car"
  },
  {
    category: "Executive Sedan",
    name: "BMW 7 Series",
    price: "From KSH 6,500",
    period: "/hour",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: [
      "Luxury Appointments",
      "Experienced Driver",
      "Business Amenities",
      "Sound Insulation",
      "Mobile Charging"
    ],
    type: "car"
  },
  {
    category: "Premium SUV",
    name: "Range Rover Vogue",
    price: "From KSH 7,200",
    period: "/hour",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80 ",
    features: [
      "All-Terrain Capability",
      "Spacious Interior",
      "Advanced Safety",
      "Panoramic Sunroof",
      "Premium Audio System"
    ],
    type: "car"
  },
  {
    category: "Luxury Van",
    name: "Mercedes-Benz V-Class",
    price: "From KSH 5,800",
    period: "/hour",
    image: "https://www.topgear.com/sites/default/files/2024/11/Mercedes_VClass__0002.jpg",
    features: [
      "Spacious Seating",
      "Executive Comfort",
      "Onboard Wi-Fi",
      "Tinted Windows",
      "Luggage Space"
    ],
    type: "van"
  },
  {
    category: "Elite SUV",
    name: "Toyota Land Cruiser VX",
    price: "From KSH 6,800",
    period: "/hour",
    image: "https://carsguide-res.cloudinary.com/image/upload/f_auto,fl_lossy,q_auto,t_default/v1/editorial/2022-Toyota-Landcruiser-VX-White-1001x565.jpg",
    features: [
      "Rugged Luxury",
      "4x4 Capability",
      "Rear Seat Entertainment",
      "Climate Control",
      "Premium Sound"
    ],
    type: "suv"
  },
  {
    category: "Executive Sedan",
    name: "Audi A8 L",
    price: "From KSH 7,000",
    period: "/hour",
    image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/124141/a8-l-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80",
    features: [
      "Massage Seats",
      "Ambient Lighting",
      "Bang & Olufsen Audio",
      "Rear Tablet Controls",
      "Panoramic Roof"
    ],
    type: "car"
  },
  {
    category: "Premium SUV",
    name: "Porsche Cayenne",
    price: "From KSH 8,500",
    period: "/hour",
    image: "https://di-uploads-pod2.dealerinspire.com/waltersporsche/uploads/2024/06/2024-porsche-cayenne.jpg",
    features: [
      "Sport Chrono",
      "Adaptive Air Suspension",
      "Heated/Cooled Seats",
      "BOSE Surround Sound",
      "Navigation"
    ],
    type: "suv"
  },
  {
    category: "Performance Coupe",
    name: "Audi RS 5",
    price: "From KSH 9,000",
    period: "/hour",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: [
      "Quattro All-Wheel Drive",
      "Sport Seats with Massage",
      "Bang & Olufsen 3D Sound",
      "Carbon Fiber Accents",
      "Virtual Cockpit Display",
      "Adaptive Cruise Control"
    ],
    type: "coupe"
  }
];

const duplicatedVehicles = [...vehicles, ...vehicles];

const FleetSection = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  return (
    <section className="py-luxe-xxl bg-luxe-dark-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-primary text-3xl md:text-4xl lg:text-5xl font-bold text-luxe-white-primary mb-6">
            Premium Fleet
          </h2>
          <p className="font-secondary text-lg text-luxe-gray-secondary max-w-3xl mx-auto">
            Choose from our carefully curated selection of luxury vehicles, each maintained to the highest standards
          </p>
        </div>
        {/* Infinite Scroll Marquee */}
        <div
          className="overflow-x-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div
            ref={marqueeRef}
            className={`flex w-max gap-8 animate-fleet-marquee ${paused ? 'paused' : ''}`}
          >
            {duplicatedVehicles.map((vehicle, index) => (
              <div
                key={index}
                className="bg-luxe-dark-primary border border-luxe-dark-outline rounded-lg overflow-hidden min-w-[340px] max-w-xs mx-2 hover:shadow-luxe-card transition-all duration-300 hover:scale-105 flex-shrink-0"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxe-dark-primary/80 to-transparent"></div>
                  {/* Category Tag */}
                  <div className="absolute top-4 left-4 bg-luxe-gold-accent text-luxe-white-primary px-3 py-1 rounded-full text-sm font-semibold">
                    {vehicle.category}
                  </div>
                </div>
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-primary text-xl font-bold text-luxe-white-primary mb-2">
                    {vehicle.name}
                  </h3>
                  <div className="font-primary text-lg font-semibold text-luxe-gold-accent mb-4">
                    {vehicle.price}
                    <span className="text-sm text-luxe-gray-secondary font-normal">{vehicle.period}</span>
                  </div>
                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {vehicle.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-luxe-gold-accent rounded-full mr-3"></div>
                        <span className="font-secondary text-sm text-luxe-gray-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Select Button */}
                  <Button variant="premium" className="w-full" onClick={() => { setSelectedType(vehicle.type); setModalOpen(true); }}>
                    Select Vehicle
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes fleet-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-fleet-marquee {
            animation: fleet-marquee 70s linear infinite;
          }
          .paused {
            animation-play-state: paused !important;
          }
        `}</style>
      </div>
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} vehicleType={selectedType} />
    </section>
  )
}

export default FleetSection