import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import ServicesSection from "@/components/ServicesSection"
import AboutSection from "@/components/AboutSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import VIPMembershipSection from "@/components/VIPMembershipSection"
import FleetSection from "@/components/FleetSection"
import Footer from "@/components/Footer"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/luxe-button";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  // Demo: set to true to show analytics
  const isAdmin = true;
  const [analytics, setAnalytics] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("last7");
  const [serviceType, setServiceType] = useState("all");
  const [feedback, setFeedback] = useState([
    { user: "Sarah Kimani", rating: 5, comment: "Exceptional helicopter service!", date: "2024-06-01" },
    { user: "David Ochieng", rating: 5, comment: "Immaculate executive car, seamless booking.", date: "2024-05-30" },
    { user: "Grace Wanjiku", rating: 4, comment: "Speedboat was great, but a bit late.", date: "2024-05-28" },
  ]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [respondModal, setRespondModal] = useState<{ open: boolean; feedbackIndex: number | null }>({ open: false, feedbackIndex: null });
  const [flagModal, setFlagModal] = useState<{ open: boolean; feedbackIndex: number | null }>({ open: false, feedbackIndex: null });
  const [adminResponse, setAdminResponse] = useState("");

  // Key metrics (simulate for now)
  const avgRating = (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(2);
  const mostPopular = "Executive Cars";

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    fetch("/functions/v1/cx-analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dateRange, serviceType }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.cx_insights) setAnalytics(data.cx_insights);
        else setError("No analytics found.");
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAdmin, dateRange, serviceType, refreshKey]);

  const handleRespond = (index: number) => {
    setRespondModal({ open: true, feedbackIndex: index });
    setAdminResponse("");
  };
  const handleFlag = (index: number) => {
    setFlagModal({ open: true, feedbackIndex: index });
  };
  const submitResponse = () => {
    setRespondModal({ open: false, feedbackIndex: null });
    toast({ title: "Response sent", description: `Response: ${adminResponse}` });
  };
  const submitFlag = () => {
    setFlagModal({ open: false, feedbackIndex: null });
    toast({ title: "Feedback flagged", description: "This feedback has been flagged for review." });
  };

  return (
    <div className="min-h-screen bg-luxe-dark-primary">
      <Header />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <VIPMembershipSection />
      <FleetSection />
      <Footer />
    </div>
  );
};

export default Index;
