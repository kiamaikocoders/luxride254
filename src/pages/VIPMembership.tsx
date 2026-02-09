import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import VIPMembershipSection from "@/components/VIPMembershipSection"
import { Button } from "@/components/ui/luxe-button"
import { ArrowLeft, Crown } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import React, { useEffect, useState } from "react";

const VIPMembership = () => {
  const location = useLocation();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.package) {
      setSelectedPackage(location.state.package);
      // Scroll to packages section if coming from landing page
      setTimeout(() => {
        const packagesSection = document.getElementById('packages');
        if (packagesSection) {
          packagesSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="relative py-12 flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center gap-4 justify-center mb-8">
              <Link to="/">
                <Button variant="outline" size="sm" className="bg-white border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-md">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
            
            <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                      Membership <span className="text-yellow-400">Packages</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our three subscription tiers: Gold, Platinum, or Diamond - each designed to provide unparalleled luxury transportation experiences
            </p>
          </div>
        </section>

        {/* Membership Packages Component */}
        <div id="packages">
          <VIPMembershipSection selectedPackage={selectedPackage} />
        </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default VIPMembership