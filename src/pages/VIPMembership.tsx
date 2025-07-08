import Header from "@/components/Header"
import Footer from "@/components/Footer"
import VIPMembershipSection from "@/components/VIPMembershipSection"
import { Button } from "@/components/ui/luxe-button"
import { ArrowLeft, Crown } from "lucide-react"
import { Link } from "react-router-dom"

const VIPMembership = () => {
  return (
    <div className="min-h-screen bg-luxe-dark-primary">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center gap-4 justify-center mb-8">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
            
            <Crown className="h-16 w-16 text-luxe-gold-accent mx-auto mb-6" />
            <h1 className="font-primary text-4xl md:text-5xl font-bold mb-4 text-luxe-white-primary">
              <span className="text-luxe-gold-accent">VIP</span> Membership
            </h1>
            <p className="font-secondary text-lg text-luxe-gray-secondary max-w-2xl mx-auto">
              Elevate your experience with exclusive benefits and priority access to our premium services
            </p>
          </div>
        </section>

        {/* VIP Membership Component */}
        <VIPMembershipSection />
      </main>

      <Footer />
    </div>
  )
}

export default VIPMembership