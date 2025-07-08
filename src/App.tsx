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
import ChatbotWidget from "@/components/ChatbotWidget";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import Feedback from "./pages/Feedback";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  if (session === null) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!session) {
    window.location.href = "/login";
    return null;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/executive-cars" element={<ProtectedRoute><ExecutiveCars /></ProtectedRoute>} />
          <Route path="/helicopter-charters" element={<ProtectedRoute><HelicopterCharters /></ProtectedRoute>} />
          <Route path="/speedboat-transfers" element={<ProtectedRoute><SpeedboatTransfers /></ProtectedRoute>} />
          <Route path="/vip-membership" element={<ProtectedRoute><VIPMembership /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatbotWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
