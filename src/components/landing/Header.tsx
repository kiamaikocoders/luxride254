import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Phone, Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [partnershipsOpen, setPartnershipsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } 
      // Hide header when scrolling down
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

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
    } ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
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
              onClick={() => navigate('/vip-membership')}
              className="font-medium transition-colors hover:text-yellow-400 text-white"
            >
              Packages
            </button>
            <button 
              onClick={() => navigate('/executive-cars')}
              className="font-medium transition-colors hover:text-yellow-400 text-white"
            >
              Fleet
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="font-medium transition-colors hover:text-yellow-400 text-white"
            >
              About Us
            </button>
            <button 
              onClick={() => navigate('/contact')}
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
        
        {/* Mobile Menu - Enhanced Design */}
        {mobileOpen && (
          <>
            {/* Enhanced Backdrop with blur */}
            <div 
              className={`fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden transition-opacity duration-300 ${
                mobileOpen ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => setMobileOpen(false)}
            />
            
            {/* Slide-in Menu Panel */}
            <div className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
              mobileOpen ? 'translate-x-0' : 'translate-x-full'
            }`} style={{ backgroundColor: '#ffffff' }}>
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-6 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">Menu</h3>
                  <p className="text-xs text-gray-300 mt-1">Navigate LuxeRide</p>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 active:scale-95"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              
              {/* Scrollable Content with solid background */}
              <div className="overflow-y-auto h-[calc(100vh-80px)] px-4 py-6 space-y-1 bg-white" style={{ backgroundColor: '#ffffff' }}>
                {/* Home */}
              <button 
                onClick={() => {navigate('/'); setMobileOpen(false);}}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 text-gray-800 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200 font-medium active:scale-[0.98] flex items-center group border border-gray-100"
              >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Home</span>
              </button>
              
              {/* Services Dropdown */}
                <div className="space-y-1">
                <button 
                  onClick={() => setServicesOpen(!servicesOpen)} 
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 text-gray-800 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200 font-medium active:scale-[0.98] group border border-gray-100"
                >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Services</span>
                    <ChevronDown className={`w-4 h-4 transition-all duration-300 ${servicesOpen ? 'rotate-180 text-yellow-600' : 'text-gray-600'}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    servicesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="ml-4 space-y-1 py-2 border-l-2 border-yellow-200 pl-4 bg-gray-50 rounded-r-lg">
                      <button 
                        onClick={() => {navigate('/executive-cars'); setMobileOpen(false);}} 
                        className="block w-full text-left px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200 text-sm active:scale-[0.98] border border-gray-100"
                      >
                        Executive Cars
                </button>
                    </div>
                  </div>
              </div>
              
              {/* Partnerships Dropdown */}
                <div className="space-y-1">
                <button 
                  onClick={() => setPartnershipsOpen(!partnershipsOpen)} 
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 text-gray-800 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200 font-medium active:scale-[0.98] group border border-gray-100"
                >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Partnerships</span>
                    <ChevronDown className={`w-4 h-4 transition-all duration-300 ${partnershipsOpen ? 'rotate-180 text-yellow-600' : 'text-gray-600'}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    partnershipsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="ml-4 space-y-1 py-2 border-l-2 border-yellow-200 pl-4 bg-gray-50 rounded-r-lg">
                      <button 
                        onClick={() => {navigate('/car-owner-partnership'); setMobileOpen(false);}} 
                        className="block w-full text-left px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200 text-sm active:scale-[0.98] border border-gray-100 mb-1"
                      >
                        Car Owner Partnership
                      </button>
                      <button 
                        onClick={() => {navigate('/chauffeur-application'); setMobileOpen(false);}} 
                        className="block w-full text-left px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200 text-sm active:scale-[0.98] border border-gray-100 mb-1"
                      >
                        Chauffeur Application
                      </button>
                      <button 
                        onClick={() => {navigate('/corporate-accounts'); setMobileOpen(false);}} 
                        className="block w-full text-left px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200 text-sm active:scale-[0.98] border border-gray-100 mb-1"
                      >
                        Corporate Accounts
                      </button>
                      <button 
                        onClick={() => {navigate('/application-status'); setMobileOpen(false);}} 
                        className="block w-full text-left px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200 text-sm active:scale-[0.98] border border-gray-100"
                      >
                        Check Application Status
                </button>
                    </div>
                  </div>
              </div>
              
                {/* Membership Packages - Highlighted */}
              <button 
                onClick={() => {navigate('/vip-membership'); setMobileOpen(false);}}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 font-semibold shadow-md active:scale-[0.98] flex items-center group"
              >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Membership Packages</span>
              </button>
                
                {/* About Us */}
              <button 
                onClick={() => {navigate('/about'); setMobileOpen(false);}}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 text-gray-800 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200 font-medium active:scale-[0.98] flex items-center group border border-gray-100"
              >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">About Us</span>
              </button>
                
                {/* Divider */}
                <div className="my-4 border-t border-gray-300"></div>
                
                {/* Contact Us Button */}
              <button 
                onClick={() => {navigate('/contact'); setMobileOpen(false);}}
                  className="w-full bg-gray-900 text-white px-6 py-3.5 rounded-lg hover:bg-gray-800 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                  <span className="group-hover:scale-110 transition-transform duration-200">Contact Us</span>
              </button>
              
                {/* Phone Number */}
                <a 
                  href="tel:+254700123456" 
                  className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-all duration-200 font-medium active:scale-[0.98] group border border-yellow-200"
                >
                  <Phone className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">+254 700 123 456</span>
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
