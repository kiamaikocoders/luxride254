import { Button } from "@/components/ui/luxe-button"
import { Clock, Gift, Headphones, Shield, Check, Crown } from "lucide-react"

const VIPMembershipSection = () => {
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
      price: "KSH 50,000",
      popular: false,
      features: [
        "5% discount on all services",
        "Priority booking",
        "Basic concierge support",
        "Quarterly service credits",
        "Access to luxury fleet"
      ]
    },
    {
      name: "Platinum",
      price: "KSH 120,000",
      popular: true,
      features: [
        "15% discount on all services",
        "VIP priority booking",
        "24/7 dedicated concierge",
        "Monthly service credits",
        "Premium fleet access",
        "Complimentary upgrades",
        "Airport lounge access"
      ]
    },
    {
      name: "Diamond",
      price: "KSH 250,000",
      popular: false,
      features: [
        "25% discount on all services",
        "Guaranteed availability",
        "Personal account manager",
        "Weekly service credits",
        "Exclusive vehicle access",
        "Unlimited upgrades",
        "Private terminal access",
        "Custom route planning"
      ]
    }
  ]

  return (
    <section className="py-luxe-xxl bg-luxe-dark-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-primary text-3xl md:text-4xl lg:text-5xl font-bold text-luxe-white-primary mb-6">
            VIP Membership
          </h2>
          <p className="font-secondary text-lg text-luxe-gray-secondary max-w-3xl mx-auto">
            Elevate your experience with exclusive benefits and premium privileges designed for our most valued clients
          </p>
        </div>

        {/* Perks Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {perks.map((perk, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-luxe-gold-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <perk.icon className="h-8 w-8 text-luxe-gold-accent" />
              </div>
              <h3 className="font-primary text-lg font-semibold text-luxe-white-primary mb-2">
                {perk.title}
              </h3>
              <p className="font-secondary text-sm text-luxe-gray-secondary">
                {perk.description}
              </p>
            </div>
          ))}
        </div>

        {/* Membership Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {membershipTiers.map((tier, index) => (
            <div 
              key={index}
              className={`relative bg-luxe-dark-primary rounded-lg p-8 hover:shadow-luxe-card transition-all duration-300 ${
                tier.popular 
                  ? 'border-2 border-luxe-gold-accent shadow-luxe-gold-glow' 
                  : 'border border-luxe-dark-outline'
              }`}
            >
              {/* Most Popular Tag */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-luxe-gold-accent text-luxe-white-primary px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Tier Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="h-8 w-8 text-luxe-gold-accent mr-2" />
                  <h3 className="font-primary text-2xl font-bold text-luxe-white-primary">
                    {tier.name}
                  </h3>
                </div>
                <div className="font-primary text-3xl font-bold text-luxe-gold-accent">
                  {tier.price}
                  <span className="text-lg text-luxe-gray-secondary font-normal">/year</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-luxe-gold-accent mr-3 flex-shrink-0" />
                    <span className="font-secondary text-luxe-gray-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Choose Button */}
              <Button 
                variant={tier.popular ? "premium" : "outline"} 
                className="w-full"
              >
                Choose {tier.name}
              </Button>
            </div>
          ))}
        </div>

        {/* Custom Plan CTA */}
        <div className="text-center">
          <div className="bg-luxe-dark-primary border border-luxe-dark-outline rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="font-primary text-xl font-bold text-luxe-white-primary mb-4">
              Need a Custom Plan?
            </h3>
            <p className="font-secondary text-luxe-gray-secondary mb-6">
              Our VIP team can create a bespoke membership package tailored to your specific requirements
            </p>
            <Button variant="premium" size="lg">
              Contact Our VIP Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VIPMembershipSection