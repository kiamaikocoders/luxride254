import { Shield, Award } from "lucide-react"

const AboutSection = () => {
  return (
    <section className="py-luxe-xxl bg-luxe-dark-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h2 className="font-primary text-3xl md:text-4xl font-bold mb-6">
              <span className="text-luxe-white-primary">Kenya's First </span>
              <span className="text-luxe-gold-accent">Premium</span>
              <span className="text-luxe-white-primary"> Mobility Platform</span>
            </h2>
            
            <p className="font-secondary text-lg text-luxe-white-primary mb-8 leading-relaxed">
              LuxeRide revolutionizes transportation in Kenya by combining cutting-edge technology 
              with unparalleled luxury. Our mission is to provide discerning clients with seamless, 
              sophisticated mobility solutions that transcend traditional transportation boundaries.
            </p>

            {/* Value Propositions */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-luxe-gold-accent/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-luxe-gold-accent" />
                </div>
                <div>
                  <h3 className="font-primary text-xl font-semibold text-luxe-white-primary mb-2">
                    Uncompromising Safety
                  </h3>
                  <p className="font-secondary text-luxe-gray-secondary">
                    All our vehicles and aircraft are meticulously maintained and fully insured, 
                    with certified professionals ensuring your safety at every journey.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-luxe-gold-accent/20 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-luxe-gold-accent" />
                </div>
                <div>
                  <h3 className="font-primary text-xl font-semibold text-luxe-white-primary mb-2">
                    Luxury Redefined
                  </h3>
                  <p className="font-secondary text-luxe-gray-secondary">
                    Experience transportation that goes beyond mere conveyance – each journey 
                    is crafted to provide exceptional comfort, style, and sophistication.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image with Floating Tag */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Luxury car interior"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-luxe-dark-primary/30"></div>
            </div>
            
            {/* Floating Gold Tag */}
            <div className="absolute -top-4 -right-4 bg-gradient-gold text-luxe-white-primary px-6 py-3 rounded-full shadow-luxe-gold-glow">
              <span className="font-primary font-semibold text-sm">Kenya's #1 Luxury Mobility</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection