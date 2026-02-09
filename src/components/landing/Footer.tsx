import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      const element = document.getElementById(path.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        {/* Mobile: Compact 2-column grid, Desktop: 6-column */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
          {/* Company Info - Mobile: Full width, Desktop: 2 columns */}
          <div className="col-span-2 md:col-span-2">
            <div className="mb-2 md:mb-3">
              <img 
                src="/luxride-logo.svg" 
                alt="LuxeRide" 
                className="h-10 md:h-12 w-auto"
              />
            </div>
            {/* Hide description on mobile, show on desktop */}
            <p className="hidden md:block text-xs md:text-sm text-gray-400 leading-relaxed mb-2 md:mb-3">
              Kenya's premier luxury transportation platform.
            </p>
            <div className="flex space-x-2 md:space-x-3">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-xs md:text-sm font-semibold mb-1 md:mb-2 text-white uppercase tracking-wider">Services</h4>
            <ul className="space-y-0.5 md:space-y-1.5 text-xs md:text-sm">
              <li><button onClick={() => handleNavigation('/executive-cars')} className="text-gray-400 hover:text-yellow-400 transition">Executive Cars</button></li>
              <li><button onClick={() => handleNavigation('/vip-membership')} className="text-gray-400 hover:text-yellow-400 transition">Membership Packages</button></li>
            </ul>
          </div>
          
          {/* Partners */}
          <div>
            <h4 className="text-xs md:text-sm font-semibold mb-1 md:mb-2 text-white uppercase tracking-wider">Partners</h4>
            <ul className="space-y-0.5 md:space-y-1.5 text-xs md:text-sm">
              <li><button onClick={() => handleNavigation('/car-owner-partnership')} className="text-gray-400 hover:text-yellow-400 transition">Car Owner Partnership</button></li>
              <li><button onClick={() => handleNavigation('/chauffeur-application')} className="text-gray-400 hover:text-yellow-400 transition">Chauffeur Application</button></li>
              <li><button onClick={() => handleNavigation('/corporate-accounts')} className="text-gray-400 hover:text-yellow-400 transition">Corporate Accounts</button></li>
            </ul>
          </div>
          
          {/* Markets - Compact grid on mobile */}
          <div>
            <h4 className="text-xs md:text-sm font-semibold mb-1 md:mb-2 text-white uppercase tracking-wider">Markets</h4>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-0.5 md:space-y-1.5 text-xs md:text-sm">
              <span className="text-gray-400">Nairobi</span>
              <span className="text-gray-400">Mombasa</span>
              <span className="text-gray-400">Kisumu</span>
              <span className="text-gray-400">Eldoret</span>
              <span className="text-gray-400 col-span-2 md:col-span-1">Nakuru</span>
            </div>
          </div>
          
          {/* Connect */}
          <div>
            <h4 className="text-xs md:text-sm font-semibold mb-1 md:mb-2 text-white uppercase tracking-wider">Connect</h4>
            <ul className="space-y-0.5 md:space-y-1.5 text-xs md:text-sm">
              <li><button onClick={() => handleNavigation('/contact')} className="text-gray-400 hover:text-yellow-400 transition">Contact Us</button></li>
              <li><button onClick={() => handleNavigation('/application-status')} className="text-gray-400 hover:text-yellow-400 transition">Check Status</button></li>
              <li><a href="tel:+254700123456" className="text-gray-400 hover:text-yellow-400 transition">+254 700 123 456</a></li>
              <li><a href="mailto:info@luxeride.org" className="text-gray-400 hover:text-yellow-400 transition break-all">info@luxeride.org</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar - More compact */}
        <div className="border-t border-gray-800 mt-3 md:mt-4 pt-3 md:pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
            <p className="text-xs md:text-sm text-gray-400 text-center md:text-left">
              © 2024 LuxeRide. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-xs md:text-sm">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition">Terms</a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
