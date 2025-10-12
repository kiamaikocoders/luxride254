import { Facebook, Instagram, Twitter, Linkedin, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

const Footer = () => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [partnersOpen, setPartnersOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  return (
    <footer className="bg-luxe-dark-primary border-t border-luxe-dark-outline">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/luxride-logo.png" 
                alt="LuxeRide" 
                className="h-8 w-auto"
              />
            </div>
            <p className="font-secondary text-luxe-gray-footer text-sm leading-relaxed mb-6">
              Kenya's first premium mobility platform providing unparalleled luxury transportation services 
              across executive cars, helicopter charters, and speedboat transfers.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, index) => (
                <div 
                  key={index}
                  className="w-10 h-10 bg-luxe-dark-social rounded-full flex items-center justify-center hover:bg-luxe-gold-accent transition-colors duration-300 cursor-pointer group"
                >
                  <Icon className="h-5 w-5 text-luxe-white-primary group-hover:text-luxe-white-primary" />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 - Services */}
          <div>
            <button 
              onClick={() => setServicesOpen(!servicesOpen)}
              className="flex items-center justify-between w-full md:block font-primary text-lg font-bold text-luxe-white-primary mb-4"
            >
              <span>Services</span>
              <ChevronDown className={`w-5 h-5 md:hidden transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-3 ${servicesOpen ? 'block' : 'hidden md:block'}`}>
              <li><a href="/executive-cars" className="font-secondary text-luxe-gray-footer hover:text-luxe-gold-accent transition-colors duration-300">Executive Cars</a></li>
              <li><a href="/helicopter-charters" className="font-secondary text-luxe-gray-footer hover:text-luxe-gold-accent transition-colors duration-300">Helicopter Charters</a></li>
              <li><a href="/speedboat-transfers" className="font-secondary text-luxe-gray-footer hover:text-luxe-gold-accent transition-colors duration-300">Speedboat Transfers</a></li>
              <li><a href="/vip-membership" className="font-secondary text-luxe-gray-footer hover:text-luxe-gold-accent transition-colors duration-300">VIP Membership</a></li>
            </ul>
          </div>

          {/* Column 3 - Partners */}
          <div>
            <button 
              onClick={() => setPartnersOpen(!partnersOpen)}
              className="flex items-center justify-between w-full md:block font-primary text-lg font-bold text-luxe-white-primary mb-4"
            >
              <span>Partners</span>
              <ChevronDown className={`w-5 h-5 md:hidden transition-transform ${partnersOpen ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-3 ${partnersOpen ? 'block' : 'hidden md:block'}`}>
              <li><a href="/car-owner-partnership" className="font-secondary text-luxe-gray-footer hover:text-luxe-gold-accent transition-colors duration-300">Car Owner Partnership</a></li>
              <li><a href="/chauffeur-application" className="font-secondary text-luxe-gray-footer hover:text-luxe-gold-accent transition-colors duration-300">Chauffeur Application</a></li>
              <li><a href="/corporate-accounts" className="font-secondary text-luxe-gray-footer hover:text-luxe-gold-accent transition-colors duration-300">Corporate Accounts</a></li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <button 
              onClick={() => setContactOpen(!contactOpen)}
              className="flex items-center justify-between w-full md:block font-primary text-lg font-bold text-luxe-white-primary mb-4"
            >
              <span>Contact</span>
              <ChevronDown className={`w-5 h-5 md:hidden transition-transform ${contactOpen ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-3 ${contactOpen ? 'block' : 'hidden md:block'}`}>
              <li className="font-secondary text-luxe-gray-footer">
                Phone: +254 700 123 456
              </li>
              <li className="font-secondary text-luxe-gray-footer">
                Email: hello@luxeride.ke
              </li>
              <li className="font-secondary text-luxe-gray-footer">
                Address: Westlands, Nairobi Kenya
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-luxe-dark-outline pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <p className="font-secondary text-sm text-luxe-gray-footer mb-4 md:mb-0">
              © 2024 LuxeRide Kenya. All rights reserved.
            </p>

            {/* Policy Links - Hidden on mobile to save space */}
            <div className="hidden md:flex space-x-6">
              <a href="/car-owner-partnership" className="font-secondary text-sm text-luxe-gray-footer hover:text-luxe-gold-accent transition-colors duration-300">Car Owner Partnership</a>
              <a href="/chauffeur-application" className="font-secondary text-sm text-luxe-gray-footer hover:text-luxe-gold-accent transition-colors duration-300">Chauffeur Application</a>
              <a href="/corporate-accounts" className="font-secondary text-sm text-luxe-gray-footer hover:text-luxe-gold-accent transition-colors duration-300">Corporate Accounts</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer