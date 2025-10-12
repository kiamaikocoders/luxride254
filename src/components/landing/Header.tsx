import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Phone, Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [partnershipsOpen, setPartnershipsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      const element = document.getElementById(path.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' 
        : 'bg-gray-900/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex-shrink-0"
            >
              <img 
                src="/luxride-logo.svg" 
                alt="LuxeRide" 
                className="h-16 w-auto"
              />
            </button>
          </div>
          
          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('#services')}
              className="font-medium transition-colors hover:text-yellow-400 text-white"
            >
              Packages
            </button>
            <button 
              onClick={() => handleNavigation('#fleet')}
              className="font-medium transition-colors hover:text-yellow-400 text-white"
            >
              Fleet
            </button>
            <button 
              onClick={() => handleNavigation('#about')}
              className="font-medium transition-colors hover:text-yellow-400 text-white"
            >
              About
            </button>
            <button 
              onClick={() => handleNavigation('#contact')}
              className="bg-yellow-400 text-gray-900 px-6 py-2.5 rounded-md hover:bg-yellow-300 font-medium transition duration-200 shadow-md"
            >
              Contact Us
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-md transition-colors text-white hover:text-yellow-400"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu - Dropdown like HTML */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <div className="md:hidden bg-white border-t border-gray-200 shadow-lg relative z-50">
            <div className="px-4 py-4 space-y-3">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              <button 
                onClick={() => {navigate('/'); setMobileOpen(false);}}
                className="block w-full text-left text-gray-700 hover:text-yellow-400 transition duration-200 font-medium py-2"
              >
                Home
              </button>
              
              {/* Services Dropdown */}
              <div className="space-y-2">
                <button 
                  onClick={() => setServicesOpen(!servicesOpen)} 
                  className="flex items-center justify-between w-full text-left text-gray-700 hover:text-yellow-400 transition duration-200 font-medium py-2"
                >
                  Services <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {servicesOpen && (
                  <div className="ml-4 space-y-2">
                    <button onClick={() => {navigate('/executive-cars'); setMobileOpen(false);}} className="block w-full text-left text-gray-600 hover:text-yellow-400 py-1">Executive Cars</button>
                  </div>
                )}
              </div>
              
              {/* Partnerships Dropdown */}
              <div className="space-y-2">
                <button 
                  onClick={() => setPartnershipsOpen(!partnershipsOpen)} 
                  className="flex items-center justify-between w-full text-left text-gray-700 hover:text-yellow-400 transition duration-200 font-medium py-2"
                >
                  Partnerships <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${partnershipsOpen ? 'rotate-180' : ''}`} />
                </button>
                {partnershipsOpen && (
                  <div className="ml-4 space-y-2">
                    <button onClick={() => {navigate('/car-owner-partnership'); setMobileOpen(false);}} className="block w-full text-left text-gray-600 hover:text-yellow-400 py-1">Car Owner Partnership</button>
                    <button onClick={() => {navigate('/chauffeur-application'); setMobileOpen(false);}} className="block w-full text-left text-gray-600 hover:text-yellow-400 py-1">Chauffeur Application</button>
                    <button onClick={() => {navigate('/corporate-accounts'); setMobileOpen(false);}} className="block w-full text-left text-gray-600 hover:text-yellow-400 py-1">Corporate Accounts</button>
                    <button onClick={() => {navigate('/application-status'); setMobileOpen(false);}} className="block w-full text-left text-gray-600 hover:text-yellow-400 py-1">Check Application Status</button>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => {navigate('/vip-membership'); setMobileOpen(false);}}
                className="block w-full text-left text-yellow-400 hover:text-yellow-500 transition duration-200 font-medium py-2"
              >
                VIP Membership
              </button>
              <button 
                onClick={() => {navigate('/contact'); setMobileOpen(false);}}
                className="block w-full bg-yellow-400 text-gray-900 px-6 py-2.5 rounded-md hover:bg-yellow-300 font-medium transition duration-200 text-center"
              >
                Contact Us
              </button>
              
              <a href="tel:+254700123456" className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 py-2">
                <Phone className="h-4 w-4" />
                +254 700 123 456
              </a>
            </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
