import { Button } from "@/components/ui/luxe-button"
import { Clock, Gift, Headphones, Shield, Check } from "lucide-react"
import { useEffect, useState } from "react"
import PackageDetailsModal from "@/components/landing/PackageDetailsModal"

interface VIPMembershipSectionProps {
  selectedPackage?: string | null;
}

const VIPMembershipSection = ({ selectedPackage }: VIPMembershipSectionProps) => {
  const [highlightedPackage, setHighlightedPackage] = useState<string | null>(null);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [selectedPackageType, setSelectedPackageType] = useState<"gold" | "platinum" | "diamond">("gold");

  useEffect(() => {
    if (selectedPackage) {
      setHighlightedPackage(selectedPackage);
      // Remove highlight after 5 seconds
      setTimeout(() => setHighlightedPackage(null), 5000);
    }
  }, [selectedPackage]);
  const perks = [
    {
      icon: Clock,
      title: "Priority Booking",
      description: "Skip the queue with guaranteed availability and instant confirmations"
    },
    {
      icon: Gift,
      title: "Exclusive Perks",
      description: "Access to premium amenities, upgrades, and member-only services"
    },
    {
      icon: Headphones,
      title: "24/7 Concierge",
      description: "Dedicated support team available around the clock for your needs"
    },
    {
      icon: Shield,
      title: "Premium Insurance",
      description: "Enhanced coverage and protection for ultimate peace of mind"
    }
  ]

  const membershipTiers = [
    {
      name: "Gold",
      price: "KSH 150,000",
      monthlyFee: 150000,
      popular: false,
      rides: 20,
      description: "Perfect for busy professionals who value reliability",
      tagline: "Your time is precious. We're here to make every journey effortless.",
      features: [
        "Enjoy 20 stress-free journeys every month",
        "Skip the queue with priority booking",
        "We're here when you need us - dedicated support",
        "Arrive in style, every time with our luxury fleet",
        "Reliable service you can count on",
        "Focus on what matters most to you"
      ]
    },
    {
      name: "Platinum",
      price: "KSH 300,000",
      monthlyFee: 300000,
      popular: true,
      rides: 40,
      description: "Ideal for families who want peace of mind",
      tagline: "Your family's safety and comfort are our priority.",
      features: [
        "40 worry-free journeys for your family each month",
        "VIP treatment that makes you feel special",
        "Speak with Jane, David, or Mary - your concierge team is always a call away",
        "Premium vehicles that exceed expectations",
        "Lightning-fast response when you need us most",
        "Up to 3 family members included - everyone matters",
        "Optional security detail for complete peace of mind"
      ]
    },
    {
      name: "Diamond",
      price: "KSH 500,000",
      monthlyFee: 500000,
      popular: false,
      rides: 60,
      description: "Designed for executives who demand excellence",
      tagline: "Running late to the airport? Your Diamond concierge has you covered.",
      features: [
        "60 seamless journeys that fit your demanding schedule",
        "Guaranteed availability - never worry about transport again",
        "Your personal account manager knows your preferences",
        "Exclusive access to our most prestigious vehicles",
        "Instant response time - we understand urgency",
        "Unlimited family members - everyone deserves the best",
        "Complete peace of mind with included security detail",
        "Custom route planning for your unique needs"
      ]
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Compelling Intro Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
            Your Time is Precious
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Whether you're heading to important meetings or quality time with family, 
            we're here to make every journey effortless. Join 5,000+ Nairobi professionals 
            who trust LuxeRide for their most important moments.
          </p>
          
          {/* Social Proof */}
          <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center mb-4">
              <div className="flex -space-x-2">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80" alt="Member" className="w-10 h-10 rounded-full border-2 border-white" />
                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80" alt="Member" className="w-10 h-10 rounded-full border-2 border-white" />
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80" alt="Member" className="w-10 h-10 rounded-full border-2 border-white" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80" alt="Member" className="w-10 h-10 rounded-full border-2 border-white" />
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80" alt="Member" className="w-10 h-10 rounded-full border-2 border-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              "My dedicated driver knows my schedule better than I do" - <strong>Samson Muga, CEO</strong>
            </p>
          </div>
        </div>

        {/* Perks Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {perks.map((perk, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <perk.icon className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {perk.title}
              </h3>
              <p className="text-sm text-gray-600">
                {perk.description}
              </p>
            </div>
          ))}
        </div>

        {/* Membership Tiers - Desktop Grid */}
        <div className="hidden lg:grid grid-cols-3 gap-8 mb-12">
          {membershipTiers.map((tier, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-lg p-8 shadow-lg border transition-all duration-300 flex flex-col ${
                tier.popular 
                  ? 'border-2 border-yellow-400 shadow-yellow-100' 
                  : highlightedPackage === tier.name.toLowerCase()
                  ? 'border-2 border-yellow-400 shadow-yellow-100 animate-pulse'
                  : 'border-gray-200'
              }`}
            >
              {/* Most Popular Tag */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}
              
              {/* Selected from Landing Page Tag */}
              {highlightedPackage === tier.name.toLowerCase() && !tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Selected from Landing Page
                  </div>
                </div>
              )}

              {/* Tier Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl mr-2">
                    {tier.name === "Gold" ? "👑" : tier.name === "Platinum" ? "⭐" : "💎"}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {tier.name}
                  </h3>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-800 mb-2">
                    {tier.description}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    {tier.tagline}
                  </p>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">
                    {tier.rides} rides included • All-inclusive service
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Choose Button - Fixed at bottom */}
              <div className="mt-auto">
                <Button 
                  variant={tier.popular ? "premium" : "outline"} 
                  className={`w-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    tier.popular 
                      ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 hover:shadow-yellow-200' 
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-gray-200'
                  } shadow-md font-semibold`}
                  onClick={() => {
                    setSelectedPackageType(tier.name.toLowerCase() as "gold" | "platinum" | "diamond");
                    setPackageModalOpen(true);
                  }}
                >
                  Choose {tier.name}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Membership Tiers - Mobile Horizontal Scroll */}
        <div className="lg:hidden overflow-x-auto mb-12">
          <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
            {membershipTiers.map((tier, index) => (
              <div 
                key={index}
                className={`relative bg-white rounded-lg p-6 min-w-[280px] max-w-sm flex-shrink-0 shadow-lg border transition-all duration-300 flex flex-col ${
                  tier.popular 
                    ? 'border-2 border-yellow-400 shadow-yellow-100' 
                    : 'border-gray-200'
                }`}
              >
                {/* Most Popular Tag */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Tier Header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-3">
                    <span className="text-3xl mr-2">
                      {tier.name === "Gold" ? "👑" : tier.name === "Platinum" ? "⭐" : "💎"}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      {tier.name}
                    </h3>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-800 mb-1">
                      {tier.description}
                    </p>
                    <p className="text-xs text-gray-600 italic">
                      {tier.tagline}
                    </p>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-600">
                      {tier.rides} rides included • All-inclusive service
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-6 flex-grow">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Choose Button - Fixed at bottom */}
                <div className="mt-auto">
                  <Button 
                    variant={tier.popular ? "premium" : "outline"} 
                    className={`w-full text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                      tier.popular 
                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 hover:shadow-yellow-200' 
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-gray-200'
                    } shadow-md font-semibold`}
                    onClick={() => {
                      setSelectedPackageType(tier.name.toLowerCase() as "gold" | "platinum" | "diamond");
                      setPackageModalOpen(true);
                    }}
                  >
                    Choose {tier.name}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Success Stories */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Real Stories from Our Members
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80" alt="James M." className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold text-gray-900">James M.</h4>
                  <p className="text-sm text-gray-600">CEO, Tech Company</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Sarah's Diamond membership helped her manage 40+ client meetings last month. 
                Never worry about surge pricing again - it's been a game-changer."
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80" alt="Grace W." className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold text-gray-900">Grace W.</h4>
                  <p className="text-sm text-gray-600">Family of 4</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Tired of unreliable transport? Not anymore. Our family's safety is their priority, 
                and we've never felt more secure."
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80" alt="David O." className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold text-gray-900">David O.</h4>
                  <p className="text-sm text-gray-600">Executive</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Meet Samuel, your Gold tier chauffeur with 15 years of experience. 
                He knows Nairobi better than anyone and always gets me there on time."
              </p>
            </div>
          </div>
        </div>

        {/* Custom Plan CTA */}
        <div className="text-center">
          <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl mx-auto shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Every Journey is Unique
            </h3>
            <p className="text-gray-600 mb-6">
              Let's create something special for you. Our VIP team understands that your needs are unique, 
              and we're here to design the perfect membership package that fits your lifestyle.
            </p>
            <Button variant="premium" size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-md font-semibold">
              Let's Create Something Special
            </Button>
          </div>
        </div>
      </div>

      {/* Package Details Modal */}
      <PackageDetailsModal
        open={packageModalOpen}
        onClose={() => setPackageModalOpen(false)}
        packageType={selectedPackageType}
      />
    </section>
  )
}

export default VIPMembershipSection