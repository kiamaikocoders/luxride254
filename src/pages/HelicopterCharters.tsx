import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/luxe-button"
import { ArrowLeft, Plane, Shield, Clock, Star } from "lucide-react"
import { Link } from "react-router-dom"
import helicopterImage from "@/assets/helicopter-charters.jpg"

const HelicopterCharters = () => {
  return (
    <div className="min-h-screen bg-luxe-dark-primary">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-96 flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${helicopterImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-hero-overlay"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-primary text-4xl md:text-5xl font-bold mb-4 text-luxe-white-primary">
              <span className="text-luxe-gold-accent">Helicopter</span> Charters
            </h1>
            <p className="font-secondary text-lg text-luxe-gray-secondary max-w-2xl mx-auto">
              Soar above the ordinary with our premium helicopter charter services
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-8">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-primary text-3xl font-bold text-luxe-white-primary mb-6">
                  Sky-High Luxury Experience
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Plane className="h-6 w-6 text-luxe-gold-accent mt-1" />
                    <div>
                      <h3 className="font-secondary font-semibold text-luxe-white-primary mb-2">Modern Fleet</h3>
                      <p className="text-luxe-gray-secondary">State-of-the-art helicopters with panoramic views</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Shield className="h-6 w-6 text-luxe-gold-accent mt-1" />
                    <div>
                      <h3 className="font-secondary font-semibold text-luxe-white-primary mb-2">Certified Pilots</h3>
                      <p className="text-luxe-gray-secondary">Highly trained and experienced aviation professionals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-luxe-gold-accent mt-1" />
                    <div>
                      <h3 className="font-secondary font-semibold text-luxe-white-primary mb-2">On-Demand Service</h3>
                      <p className="text-luxe-gray-secondary">Quick response times for urgent travel needs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Star className="h-6 w-6 text-luxe-gold-accent mt-1" />
                    <div>
                      <h3 className="font-secondary font-semibold text-luxe-white-primary mb-2">Scenic Routes</h3>
                      <p className="text-luxe-gray-secondary">Breathtaking aerial views of Kenya's landscapes</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button variant="premium" size="lg">
                    Charter Helicopter
                  </Button>
                </div>
              </div>

              <div className="lg:text-center">
                <img 
                  src={helicopterImage} 
                  alt="Helicopter Charters" 
                  className="rounded-lg shadow-luxe-card"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HelicopterCharters