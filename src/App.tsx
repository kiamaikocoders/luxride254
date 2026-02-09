import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./components/landing/LandingPage";
import ExecutiveCars from "./pages/ExecutiveCars";
import VIPMembership from "./pages/VIPMembership";
import NotFound from "./pages/NotFound";
import { CopilotKit } from "@copilotkit/react-core";
import { ThemeProvider } from "next-themes";
import { FaComments } from "react-icons/fa";
import React, { useState } from "react";
import LuxeRideChat from "@/components/LuxeRideChat";
import CarOwnerPartnership from "./pages/CarOwnerPartnership";
import ChauffeurApplication from "./pages/ChauffeurApplication";
import CorporateAccounts from "./pages/CorporateAccounts";
import ApplicationStatus from "./pages/ApplicationStatus";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import { AdminRoutes } from "../admin/routes";

const queryClient = new QueryClient();

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
      boxShadow: "0 8px 32px rgba(0,0,0,0.28), 0 0 0 9999px rgba(0,0,0,0)",
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
    <div style={{ flex: 1, minHeight: 0, background: "#18181b", overflow: "hidden" }}>{children}</div>
  </div>
);

/** Wraps app with CopilotKit only when not on admin routes to avoid 404 API errors during admin login */
function AppWithOptionalCopilot() {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const isAdminRoute = location.pathname.startsWith("/admin");

  const appContent = (
    <>
      <Routes>
        {/* New Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Legacy Homepage (backup) */}
        <Route path="/legacy-home" element={<Index />} />

        {/* Service Pages */}
        <Route path="/executive-cars" element={<ExecutiveCars />} />
        <Route path="/vip-membership" element={<VIPMembership />} />

        {/* Contact & Support */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />

        {/* Admin System */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Partnership and Application pages */}
        <Route path="/car-owner-partnership" element={<CarOwnerPartnership />} />
        <Route path="/chauffeur-application" element={<ChauffeurApplication />} />
        <Route path="/corporate-accounts" element={<CorporateAccounts />} />
        <Route path="/application-status" element={<ApplicationStatus />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute && (
        <>
          {chatOpen && (
            <FloatingChatPanel onClose={() => setChatOpen(false)}>
              <LuxeRideChat />
            </FloatingChatPanel>
          )}
          {!chatOpen && <FloatingChatButton onClick={() => setChatOpen(true)} />}
        </>
      )}
    </>
  );

  return isAdminRoute ? (
    appContent
  ) : (
    <CopilotKit publicApiKey="ck_pub_25482ba2f78d4e5167211dd3f918f309">
      {appContent}
    </CopilotKit>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppWithOptionalCopilot />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
