import { Button } from "@/components/ui/luxe-button"
import { ChevronDown, Phone, Menu, Sun, Moon } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import BookingModal from "@/components/BookingModal";
import React, { useState, useEffect } from "react";
import UserMenu from "@/components/UserMenu";
import { useTheme } from "next-themes";
import { supabase } from '@/lib/supabaseClient';

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#18181b] backdrop-blur-sm border-b border-luxe-dark-outline font-sans">
      <div className="container mx-auto px-8 sm:px-12 lg:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 mr-8">
            <img 
              src="/lovable-uploads/17e72a8b-49e0-4058-be7d-041219b45d45.png" 
              alt="LuxeRide" 
              className="h-12 w-auto"
            />
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-base font-medium">
            <Link to="/" className="text-white px-3 py-2 font-medium relative transition-colors duration-200 hover:text-luxe-gold-accent after:content-[''] after:block after:mx-auto after:w-3/5 after:border-b-2 after:border-luxe-gold-accent after:rounded after:mt-1 after:opacity-0 hover:after:opacity-100">Home</Link>
            <div className="relative">
              <button onClick={() => setServicesOpen(o => !o)} className="nav-link flex items-center gap-1">
                Services <ChevronDown className="w-4 h-4" />
              </button>
              {servicesOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-[#23232b] ring-1 ring-black ring-opacity-5 z-50">
                  <Link to="/executive-cars" className="block px-4 py-2 hover:bg-luxe-gold-accent/10 text-white">Executive Cars</Link>
                  <Link to="/helicopter-charters" className="block px-4 py-2 hover:bg-luxe-gold-accent/10 text-white">Helicopter Charters</Link>
                  <Link to="/speedboat-transfers" className="block px-4 py-2 hover:bg-luxe-gold-accent/10 text-white">Speedboat Transfers</Link>
                </div>
              )}
            </div>
            <Link to="/vip-membership" className="text-white px-3 py-2 font-medium relative transition-colors duration-200 hover:text-luxe-gold-accent after:content-[''] after:block after:mx-auto after:w-3/5 after:border-b-2 after:border-luxe-gold-accent after:rounded after:mt-1 after:opacity-0 hover:after:opacity-100">VIP Membership</Link>
            <Link to="/feedback" className="text-white px-3 py-2 font-medium relative transition-colors duration-200 hover:text-luxe-gold-accent after:content-[''] after:block after:mx-auto after:w-3/5 after:border-b-2 after:border-luxe-gold-accent after:rounded after:mt-1 after:opacity-0 hover:after:opacity-100">Feedback</Link>
            <Link to="/driver-onboarding" className="text-luxe-gold-accent px-3 py-2 font-medium hover:underline">Become a Driver</Link>
            <Link to="/corporate-registration" className="text-luxe-gold-accent px-3 py-2 font-medium hover:underline">Corporate Registration</Link>
          </nav>
          {/* CTA and User */}
          <div className="flex items-center space-x-4">
            <a href="tel:+254700123456" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#23232b] text-luxe-gold-accent hover:bg-luxe-gold-accent/10 transition font-medium text-base">
              <Phone className="h-4 w-4" />
              +254 700 123 456
            </a>
            <Button
              variant="premium"
              size="lg"
              className="shadow-lg text-lg px-6 py-3 font-bold bg-gradient-to-r from-[#bfa14a] to-[#e6c97b] hover:from-[#e6c97b] hover:to-[#bfa14a] border-2 border-[#bfa14a]"
              onClick={() => {
                if (!user) navigate('/login');
                else setModalOpen(true);
              }}
            >
              Book Now
            </Button>
            {/* Theme Toggle Button */}
            <button
              aria-label="Toggle theme"
              className="rounded-full p-2 bg-[#23232b] hover:bg-luxe-gold-accent/10 transition text-luxe-gold-accent focus:outline-none focus:ring-2 focus:ring-luxe-gold-accent"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {user ? <UserMenu /> : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
                <Button variant="premium" onClick={() => navigate('/signup')}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </div>
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-luxe-dark-outline">
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3">
              <img src="/lovable-uploads/17e72a8b-49e0-4058-be7d-041219b45d45.png" alt="LuxeRide" className="h-10 w-auto" />
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded text-luxe-gold-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <nav className="flex flex-col gap-2 px-8 py-6 text-lg font-medium">
            <Link to="/" onClick={() => setMobileOpen(false)} className="py-2 text-white border-b border-luxe-dark-outline">Home</Link>
            <div className="flex flex-col">
              <button onClick={() => setServicesOpen(o => !o)} className="flex items-center justify-between py-2 text-white border-b border-luxe-dark-outline">
                Services <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {servicesOpen && (
                <div className="flex flex-col ml-4">
                  <Link to="/executive-cars" onClick={() => setMobileOpen(false)} className="py-2 text-white">Executive Cars</Link>
                  <Link to="/helicopter-charters" onClick={() => setMobileOpen(false)} className="py-2 text-white">Helicopter Charters</Link>
                  <Link to="/speedboat-transfers" onClick={() => setMobileOpen(false)} className="py-2 text-white">Speedboat Transfers</Link>
                </div>
              )}
            </div>
            <Link to="/vip-membership" onClick={() => setMobileOpen(false)} className="py-2 text-white border-b border-luxe-dark-outline">VIP Membership</Link>
            <Link to="/feedback" onClick={() => setMobileOpen(false)} className="py-2 text-white border-b border-luxe-dark-outline">Feedback</Link>
            <Link to="/driver-onboarding" onClick={() => setMobileOpen(false)} className="py-2 text-luxe-gold-accent border-b border-luxe-dark-outline">Become a Driver</Link>
            <Link to="/corporate-registration" onClick={() => setMobileOpen(false)} className="py-2 text-luxe-gold-accent border-b border-luxe-dark-outline">Corporate Registration</Link>
            <a href="tel:+254700123456" className="flex items-center gap-2 py-2 text-luxe-gold-accent border-b border-luxe-dark-outline">
              <Phone className="h-5 w-5" />
              +254 700 123 456
            </a>
            <Button variant="premium" size="lg" className="my-4 w-full text-lg px-6 py-3 font-bold bg-gradient-to-r from-[#bfa14a] to-[#e6c97b] hover:from-[#e6c97b] hover:to-[#bfa14a] border-2 border-[#bfa14a]">
              Book Now
            </Button>
            <div className="mt-4"><UserMenu /></div>
            {/* Theme Toggle Button (Mobile) */}
            <button
              aria-label="Toggle theme"
              className="mt-4 rounded-full p-2 bg-[#23232b] hover:bg-luxe-gold-accent/10 transition text-luxe-gold-accent focus:outline-none focus:ring-2 focus:ring-luxe-gold-accent w-fit self-center"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header