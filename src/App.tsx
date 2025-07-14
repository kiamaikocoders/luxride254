import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Supabase session (getSession):", session);
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Supabase session (onAuthStateChange):", session);
      setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  console.log("ProtectedRoute session state:", session);
  if (session === null) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!session) {
    window.location.href = "/login";
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

                {/* Protected pages */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />

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
