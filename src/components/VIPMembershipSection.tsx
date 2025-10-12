import { Button } from "@/components/ui/luxe-button"
import { Clock, Gift, Headphones, Shield, Check, Crown } from "lucide-react"
import { useEffect, useState } from "react"

interface VIPMembershipSectionProps {
  selectedPackage?: string | null;
}

const VIPMembershipSection = ({ selectedPackage }: VIPMembershipSectionProps) => {
  const [highlightedPackage, setHighlightedPackage] = useState<string | null>(null);

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
      features: [
        "20 rides included per month",
        "Priority booking",
        "Basic concierge support",
        "Access to luxury fleet",
        "Standard response time",
        "No family members included"
      ]
    },
    {
      name: "Platinum",
      price: "KSH 300,000",
      monthlyFee: 300000,
      popular: true,
      rides: 40,
      features: [
        "40 rides included per month",
        "VIP priority booking",
        "24/7 dedicated concierge",
        "Premium fleet access",
        "Fast response time",
        "Up to 3 family members",
        "Optional security detail"
      ]
    },
    {
      name: "Diamond",
      price: "KSH 500,000",
      monthlyFee: 500000,
      popular: false,
      rides: 60,
      features: [
        "60 rides included per month",
        "Guaranteed availability",
        "Personal account manager",
        "Exclusive vehicle access",
        "Instant response time",
        "Unlimited family members",
        "Security detail included",
        "Custom route planning"
      ]
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

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
              className={`relative bg-white rounded-lg p-8 shadow-lg border transition-all duration-300 ${
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
                  <Crown className="h-8 w-8 text-yellow-400 mr-2" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    {tier.name}
                  </h3>
                </div>
                <div className="text-3xl font-bold text-yellow-400">
                  {tier.price}
                  <span className="text-lg text-gray-600 font-normal">/month</span>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">
                    {tier.rides} rides included • All-inclusive service
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Choose Button */}
              <Button 
                variant={tier.popular ? "premium" : "outline"} 
                className={`w-full ${tier.popular ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500' : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'} shadow-md font-semibold`}
                onClick={() => window.open('/vip-luxeride-com/signup', '_blank')}
              >
                Choose {tier.name}
              </Button>
            </div>
          ))}
        </div>

        {/* Membership Tiers - Mobile Horizontal Scroll */}
        <div className="lg:hidden overflow-x-auto mb-12">
          <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
            {membershipTiers.map((tier, index) => (
              <div 
                key={index}
                className={`relative bg-white rounded-lg p-6 min-w-[280px] max-w-sm flex-shrink-0 shadow-lg border transition-all duration-300 ${
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
                    <Crown className="h-6 w-6 text-yellow-400 mr-2" />
                    <h3 className="text-xl font-bold text-gray-900">
                      {tier.name}
                    </h3>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {tier.price}
                    <span className="text-sm text-gray-600 font-normal">/month</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-600">
                      {tier.rides} rides included • All-inclusive service
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Choose Button */}
                <Button 
                  variant={tier.popular ? "premium" : "outline"} 
                  className={`w-full text-sm ${tier.popular ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500' : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'} shadow-md font-semibold`}
                  onClick={() => window.open('/vip-luxeride-com/signup', '_blank')}
                >
                  Choose {tier.name}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Plan CTA */}
        <div className="text-center">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Need a Custom Plan?
            </h3>
            <p className="text-gray-600 mb-6">
              Our VIP team can create a bespoke membership package tailored to your specific requirements
            </p>
            <Button variant="premium" size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-md font-semibold">
              Contact Our VIP Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VIPMembershipSection