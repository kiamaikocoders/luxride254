import { Button } from "@/components/ui/luxe-button"
import { ArrowRight, Star, Shield, Clock } from "lucide-react"
import heroImage from "@/assets/hero-luxury-car.jpg"

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero-overlay"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="font-primary text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-luxe-gold-accent">Premium</span>{" "}
            <span className="text-luxe-white-primary">Mobility Redefined</span>
          </h1>

          {/* Sub-headline */}
          <p className="font-secondary text-lg md:text-xl text-luxe-gray-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience Kenya's first luxury mobility platform offering executive cars, 
            helicopter charters, and speedboat transfers with unmatched sophistication.
          </p>

          {/* Value Propositions */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center space-x-3">
              <Star className="h-6 w-6 text-luxe-gold-accent" />
              <span className="font-secondary text-luxe-white-primary font-medium">5-Star Service</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-luxe-gold-accent" />
              <span className="font-secondary text-luxe-white-primary font-medium">Fully Insured</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-luxe-gold-accent" />
              <span className="font-secondary text-luxe-white-primary font-medium">24/7 Available</span>
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="premium" size="lg" className="text-lg">
              Book Your Ride
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg">
              Join VIP Club
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection