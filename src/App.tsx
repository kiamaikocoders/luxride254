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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/executive-cars" element={<ExecutiveCars />} />
          <Route path="/helicopter-charters" element={<HelicopterCharters />} />
          <Route path="/speedboat-transfers" element={<SpeedboatTransfers />} />
          <Route path="/vip-membership" element={<VIPMembership />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
