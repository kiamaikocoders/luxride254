import { Button } from "@/components/ui/luxe-button"
import { ChevronDown, Phone, Menu, Sun, Moon } from "lucide-react"
import { Link } from "react-router-dom"
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { FaSun } from "react-icons/fa";

const Header = () => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#18181b] backdrop-blur-sm border-b border-luxe-dark-outline font-sans flex items-center h-16">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-4">
          {/* Logo */}
        <Link to="/" className="flex items-center h-16 mr-6">
          <img src="/luxride-logo.png" alt="LuxeRide Logo" className="h-12 w-auto" style={{ minWidth: 48, background: 'none', border: 'none', boxShadow: 'none' }} />
          </Link>
        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex flex-1 items-center space-x-6">
          <Link to="/" className="text-white font-semibold px-3 py-2 hover:text-luxe-gold-accent transition">Home</Link>
          <div className="relative group">
            <button className="text-white font-semibold px-3 py-2 hover:text-luxe-gold-accent transition flex items-center">Services <span className="ml-1">▼</span></button>
            <div className="absolute left-0 mt-2 w-48 bg-black border border-zinc-800 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
              <Link to="/executive-cars" className="block px-4 py-2 text-white hover:bg-luxe-gold-accent/10">Executive Cars</Link>
              <Link to="/helicopter-charters" className="block px-4 py-2 text-white hover:bg-luxe-gold-accent/10">Helicopter Charters</Link>
              <Link to="/speedboat-transfers" className="block px-4 py-2 text-white hover:bg-luxe-gold-accent/10">Speedboat Transfers</Link>
            </div>
          </div>
          <div className="relative group">
            <button className="text-white font-semibold px-3 py-2 hover:text-luxe-gold-accent transition flex items-center">Partnerships <span className="ml-1">▼</span></button>
            <div className="absolute left-0 mt-2 w-48 bg-black border border-zinc-800 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
              <Link to="/car-owner-partnership" className="block px-4 py-2 text-white hover:bg-luxe-gold-accent/10">Car Owner Partnership</Link>
              <Link to="/chauffeur-application" className="block px-4 py-2 text-white hover:bg-luxe-gold-accent/10">Chauffeur Application</Link>
              <Link to="/security-application" className="block px-4 py-2 text-white hover:bg-luxe-gold-accent/10">Security Careers</Link>
              <Link to="/corporate-accounts" className="block px-4 py-2 text-white hover:bg-luxe-gold-accent/10">Corporate Accounts</Link>
              <Link to="/application-status" className="block px-4 py-2 text-white hover:bg-luxe-gold-accent/10">Check Application Status</Link>
            </div>
          </div>
          <Link to="/vip-membership" className="text-luxe-gold-accent font-semibold px-3 py-2 hover:text-white transition">VIP Membership</Link>
        </nav>
        {/* Actions: Apply for VIP Access, Theme Toggle */}
        <div className="hidden md:flex items-center space-x-3">
          <Button
            variant="premium"
            size="lg"
            className="px-6 py-2 font-bold text-lg"
            onClick={() => window.open('mailto:info@luxeride.com?subject=VIP Access Application', '_blank')}
          >
            Apply for VIP Access
          </Button>
          {/* Theme Toggle */}
          <button
            className="ml-2 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-luxe-gold-accent transition"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
          >
            <FaSun className="text-luxe-gold-accent" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-lg text-luxe-gold-accent hover:bg-luxe-dark-outline transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-luxe-dark-outline">
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3">
              <img src="/luxride-logo.png" alt="LuxeRide" className="h-10 w-auto" />
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
            <div className="flex flex-col">
              <button onClick={() => setMoreOpen(o => !o)} className="flex items-center justify-between py-2 text-white border-b border-luxe-dark-outline">
                Partnerships <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <div className="flex flex-col ml-4">
                  <Link to="/car-owner-partnership" onClick={() => setMobileOpen(false)} className="py-2 text-white">Car Owner Partnership</Link>
                  <Link to="/chauffeur-application" onClick={() => setMobileOpen(false)} className="py-2 text-white">Chauffeur Application</Link>
                  <Link to="/security-application" onClick={() => setMobileOpen(false)} className="py-2 text-white">Security Careers</Link>
                  <Link to="/corporate-accounts" onClick={() => setMobileOpen(false)} className="py-2 text-white">Corporate Accounts</Link>
                  <Link to="/application-status" onClick={() => setMobileOpen(false)} className="py-2 text-white">Check Application Status</Link>
                </div>
              )}
            </div>
            <Link to="/vip-membership" onClick={() => setMobileOpen(false)} className="py-2 text-luxe-gold-accent border-b border-luxe-dark-outline">VIP Membership</Link>
            <a href="tel:+254700123456" className="flex items-center gap-2 py-2 text-luxe-gold-accent border-b border-luxe-dark-outline">
              <Phone className="h-5 w-5" />
              +254 700 123 456
            </a>
            <Button 
              variant="premium" 
              size="lg" 
              className="my-4 w-full text-lg px-6 py-3 font-bold bg-gradient-to-r from-[#bfa14a] to-[#e6c97b] hover:from-[#e6c97b] hover:to-[#bfa14a] border-2 border-[#bfa14a]"
              onClick={() => window.open('mailto:info@luxeride.com?subject=VIP Access Application', '_blank')}
            >
              Apply for VIP Access
            </Button>
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