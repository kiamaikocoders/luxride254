import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import ExecutiveCars from "./pages/ExecutiveCars";
import HelicopterCharters from "./pages/HelicopterCharters";
import SpeedboatTransfers from "./pages/SpeedboatTransfers";
import VIPMembership from "./pages/VIPMembership";
import NotFound from "./pages/NotFound";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import Feedback from "./pages/Feedback";
import { ThemeProvider } from "next-themes";
import { FaComments } from "react-icons/fa";
import React from "react";
import LuxeRideChat from "@/components/LuxeRideChat";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import CorporateDashboard from "./pages/CorporateDashboard";
import DriverOnboarding from "./pages/DriverOnboarding";
import CorporateRegistration from "./pages/CorporateRegistration";
import Bookings from "./pages/Bookings";
import MyTrips from "./pages/MyTrips";
import Earnings from "./pages/Earnings";
import TeamBookings from "./pages/TeamBookings";
import Approvals from "./pages/Approvals";
import Reports from "./pages/Reports";
import ManageTeam from "./pages/ManageTeam";
import ManageUsers from "./pages/ManageUsers";
import ManageDrivers from "./pages/ManageDrivers";
import ManageVehicles from "./pages/ManageVehicles";

const queryClient = new QueryClient();

// SoftProtectedRoute: prompts login/signup if not authenticated, then returns to intended page
const SoftProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setChecking(false);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  if (checking) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!session) {
    // Save intended path and redirect to login
    navigate("/login", { state: { from: location.pathname } });
    return null;
  }
  return <>{children}</>;
};

const FloatingChatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Open chat"
    style={{
      position: "fixed",
      bottom: "2rem",
      right: "2rem",
      zIndex: 1000,
      background: "linear-gradient(135deg, #FFD700 60%, #333 100%)",
      color: "#222",
      border: "none",
      borderRadius: "50%",
      width: "64px",
      height: "64px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "box-shadow 0.2s",
    }}
  >
    <FaComments size={32} />
  </button>
);

const FloatingChatPanel: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => (
  <div
    style={{
      position: "fixed",
      bottom: "6.5rem",
      right: "2rem",
      zIndex: 1100,
      background: "#18181b",
      borderRadius: "1rem",
      boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
      overflow: "hidden",
      minWidth: 350,
      maxWidth: 400,
      minHeight: 420,
      maxHeight: "70vh",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "0.5rem 0.75rem", background: "#222", borderBottom: "1px solid #333" }}>
      <button
        onClick={onClose}
        aria-label="Close chat"
        style={{ background: "none", border: "none", color: "#FFD700", fontSize: 22, cursor: "pointer" }}
      >
        ×
      </button>
    </div>
    <div style={{ flex: 1, minHeight: 0, background: "#18181b" }}>{children}</div>
  </div>
);

const App = () => {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <CopilotKit publicApiKey="ck_pub_25482ba2f78d4e5167211dd3f918f309">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
                {/* Public pages */}
          <Route path="/" element={<Index />} />
          <Route path="/executive-cars" element={<ExecutiveCars />} />
          <Route path="/helicopter-charters" element={<HelicopterCharters />} />
          <Route path="/speedboat-transfers" element={<SpeedboatTransfers />} />
          <Route path="/vip-membership" element={<VIPMembership />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/driver-onboarding" element={<DriverOnboarding />} />
                <Route path="/corporate-registration" element={<CorporateRegistration />} />

                {/* Protected pages (soft gated) */}
                <Route path="/profile" element={<SoftProtectedRoute><Profile /></SoftProtectedRoute>} />
                <Route path="/feedback" element={<SoftProtectedRoute><Feedback /></SoftProtectedRoute>} />
                <Route path="/admin" element={<SoftProtectedRoute><AdminDashboard /></SoftProtectedRoute>} />
                <Route path="/driver-dashboard" element={<SoftProtectedRoute><DriverDashboard /></SoftProtectedRoute>} />
                <Route path="/corporate-dashboard" element={<SoftProtectedRoute><CorporateDashboard /></SoftProtectedRoute>} />
                <Route path="/bookings" element={<SoftProtectedRoute><Bookings /></SoftProtectedRoute>} />
                <Route path="/my-trips" element={<SoftProtectedRoute><MyTrips /></SoftProtectedRoute>} />
                <Route path="/earnings" element={<SoftProtectedRoute><Earnings /></SoftProtectedRoute>} />
                <Route path="/team-bookings" element={<SoftProtectedRoute><TeamBookings /></SoftProtectedRoute>} />
                <Route path="/approvals" element={<SoftProtectedRoute><Approvals /></SoftProtectedRoute>} />
                <Route path="/reports" element={<SoftProtectedRoute><Reports /></SoftProtectedRoute>} />
                <Route path="/manage-team" element={<SoftProtectedRoute><ManageTeam /></SoftProtectedRoute>} />
                <Route path="/manage-users" element={<SoftProtectedRoute><ManageUsers /></SoftProtectedRoute>} />
                <Route path="/manage-drivers" element={<SoftProtectedRoute><ManageDrivers /></SoftProtectedRoute>} />
                <Route path="/manage-vehicles" element={<SoftProtectedRoute><ManageVehicles /></SoftProtectedRoute>} />

                {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
            {chatOpen && (
              <FloatingChatPanel onClose={() => setChatOpen(false)}>
                <LuxeRideChat />
              </FloatingChatPanel>
            )}
            {!chatOpen && <FloatingChatButton onClick={() => setChatOpen(true)} />}
    </TooltipProvider>
  </QueryClientProvider>
      </ThemeProvider>
    </CopilotKit>
);
};

export default App;
