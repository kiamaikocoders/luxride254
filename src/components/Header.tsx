import { Button } from "@/components/ui/luxe-button"
import { Phone } from "lucide-react"

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-luxe-dark-primary/95 backdrop-blur-sm border-b border-luxe-dark-outline">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/17e72a8b-49e0-4058-be7d-041219b45d45.png" 
              alt="LuxeRide" 
              className="h-8 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#home" className="font-secondary text-luxe-white-primary hover:text-luxe-gold-accent transition-colors duration-300">
              Home
            </a>
            <a href="#executive-cars" className="font-secondary text-luxe-white-primary hover:text-luxe-gold-accent transition-colors duration-300">
              Executive Cars
            </a>
            <a href="#helicopter-charters" className="font-secondary text-luxe-white-primary hover:text-luxe-gold-accent transition-colors duration-300">
              Helicopter Charters
            </a>
            <a href="#speedboat-transfers" className="font-secondary text-luxe-white-primary hover:text-luxe-gold-accent transition-colors duration-300">
              Speedboat Transfers
            </a>
            <a href="#vip-membership" className="font-secondary text-luxe-white-primary hover:text-luxe-gold-accent transition-colors duration-300">
              VIP Membership
            </a>
          </nav>

          {/* Phone and Book Now */}
          <div className="flex items-center space-x-4">
            <Button variant="premium" size="sm" className="hidden md:flex">
              <Phone className="h-4 w-4" />
              +254 700 123 456
            </Button>
            <Button variant="premium" size="sm">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header