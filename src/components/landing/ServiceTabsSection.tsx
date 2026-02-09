import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type TabType = "executive" | "vip" | "corporate" | "events";

const ServiceTabsSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>("executive");
  const navigate = useNavigate();

  const tabs = [
    { id: "executive" as TabType, label: "Executive Cars", icon: "🚗" },
    { id: "vip" as TabType, label: "Membership Packages", icon: "👑" },
    { id: "corporate" as TabType, label: "Corporate Services", icon: "🏢" },
    { id: "events" as TabType, label: "Special Events", icon: "🎉" },
  ];

  const executiveContent = [
    {
      title: "Premium Ride-Hailing",
      description: "On-demand luxury transportation with professional chauffeurs for executive travel and special occasions.",
      features: [
        "Mercedes S-Class & BMW 7 Series",
        "Professional Chauffeurs",
        "Wi-Fi & Refreshments",
        "Airport Transfers",
        "24/7 Availability"
      ],
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
      cta: "Book Now",
      action: () => navigate("/executive-cars")
    },
    {
      title: "Luxury Fleet",
      description: "Meticulously maintained premium vehicles across three distinct luxury categories.",
      features: [
        "Executive Sedan Class",
        "Luxury SUV Category",
        "Ultra-Luxury Tier",
        "Regular Maintenance",
        "Fully Insured"
      ],
      image: "/assets/luxury-fleet-card.png",
      cta: "View Fleet",
      action: () => {
        const fleetSection = document.getElementById("fleet");
        fleetSection?.scrollIntoView({ behavior: "smooth" });
      }
    }
  ];

  const vipContent = [
    {
      title: "Gold Membership",
      description: "Perfect for busy professionals who value reliability and premium service.",
      features: [
        "20 rides included per month",
        "Priority booking",
        "Basic concierge support",
        "Access to luxury fleet",
        "KSH 150,000/month"
      ],
      image: "/assets/gold-membership-card.png",
      cta: "View Packages",
      action: () => {
        const servicesSection = document.getElementById("services");
        servicesSection?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      title: "Platinum & Diamond",
      description: "Ultimate luxury experience with dedicated concierge and exclusive benefits.",
      features: [
        "40-60 rides per month",
        "24/7 dedicated concierge",
        "Personal account manager",
        "Unlimited family members",
        "Security detail included"
      ],
      image: "/assets/platinum-membership-card.png",
      cta: "Learn More",
      action: () => navigate("/vip-membership")
    }
  ];

  const corporateContent = [
    {
      title: "Corporate Accounts",
      description: "Streamlined transportation solutions for businesses of all sizes.",
      features: [
        "Bulk booking discounts",
        "Monthly invoicing",
        "Dedicated account manager",
        "Custom reporting",
        "Priority support"
      ],
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
      cta: "Contact Sales",
      action: () => navigate("/corporate-accounts")
    },
    {
      title: "Business Solutions",
      description: "Tailored transportation packages designed for your business needs.",
      features: [
        "Employee transportation",
        "Client hospitality",
        "Event transportation",
        "Flexible contracts",
        "Volume discounts"
      ],
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      cta: "Get Quote",
      action: () => navigate("/contact")
    }
  ];

  const eventsContent = [
    {
      title: "Weddings & Celebrations",
      description: "Make your special day unforgettable with our luxury transportation services.",
      features: [
        "Bridal party transportation",
        "Guest shuttles",
        "Custom decorations",
        "Flexible scheduling",
        "Professional coordination"
      ],
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      cta: "Get Quote",
      action: () => navigate("/contact")
    },
    {
      title: "Conferences & Events",
      description: "Professional transportation for corporate events, conferences, and gatherings.",
      features: [
        "Group transportation",
        "Multi-vehicle coordination",
        "Event planning support",
        "Flexible scheduling",
        "Professional service"
      ],
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      cta: "Contact Us",
      action: () => navigate("/contact")
    }
  ];

  const getContent = () => {
    switch (activeTab) {
      case "executive":
        return executiveContent;
      case "vip":
        return vipContent;
      case "corporate":
        return corporateContent;
      case "events":
        return eventsContent;
      default:
        return executiveContent;
    }
  };

  return (
    <section className="py-20 section-alternate relative">
      {/* Top Border Separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
      {/* Bottom Border Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 scroll-fade-up">
          <h2 className="text-3xl md:text-4xl brand-heading mb-4">Our Services</h2>
          <div className="h-1 w-20 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose from our comprehensive range of premium transportation solutions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-gray-200 scroll-fade-up scroll-delay-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 font-medium transition-all duration-300 relative
                ${activeTab === tab.id
                  ? "text-yellow-400"
                  : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 transform transition-all duration-300"></span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content - Vibrant Cards */}
        <div className="scroll-fade-up scroll-delay-200">
          <div className="grid md:grid-cols-2 gap-8">
            {getContent().map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-yellow-400/50 active:shadow-2xl active:shadow-yellow-400/50 transition-all transform hover:-translate-y-2 active:-translate-y-1 active:scale-[0.98] group touch-manipulation"
              >
                {/* Image with Dark Overlay or Gradient Background */}
                <div className="relative h-64 overflow-hidden">
                  {item.image ? (
                    <>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      {/* Dark backdrop for text readability */}
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 to-transparent"></div>
                    </>
                  ) : (
                    <div 
                      className="w-full h-full"
                      style={{ background: (item as any).gradient }}
                    >
                      {/* Decorative pattern overlay */}
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                      }}></div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-3">
                    {(item as any).icon && (
                      <span className="text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{(item as any).icon}</span>
                    )}
                    <h3 className={`text-2xl font-bold mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] [text-shadow:_0_2px_12px_rgba(0,0,0,0.9)] ${
                      item.image ? 'text-white' : 'text-gray-900'
                    }`}>{item.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
                  <p className="text-gray-900 mb-6 leading-relaxed font-medium">{item.description}</p>
                  
                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {item.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-gray-900 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <span className="text-gray-900 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={item.action}
                    className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-bold transition duration-200 hover:bg-gray-800 shadow-lg hover:shadow-xl"
                  >
                    {item.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default ServiceTabsSection;
