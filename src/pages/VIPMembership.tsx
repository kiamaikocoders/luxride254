import Header from "@/components/Header"
import Footer from "@/components/Footer"
import VIPMembershipSection from "@/components/VIPMembershipSection"
import { Button } from "@/components/ui/luxe-button"
import { ArrowLeft, Crown } from "lucide-react"
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react";
import { safeFetchJson } from "@/lib/safeFetch";

const VIPMembership = () => {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    const res = await safeFetchJson("/functions/v1/recommendation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: "demo-user" }),
    });
    if (!res.ok) setError(res.error || "Failed to fetch");
    else if ((res.data as any)?.recommendations) setRecommendations((res.data as any).recommendations);
    else setError("No recommendations found.");
    setLoading(false);
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-luxe-dark-primary">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-primary text-3xl md:text-4xl font-bold text-luxe-gold-accent mb-6">VIP Membership</h1>
          {/* Recommendations */}
          <div className="mb-8">
            <button
              className="mb-2 px-4 py-2 rounded bg-luxe-gold-accent text-luxe-dark-primary font-semibold hover:bg-luxe-gold-accent/80 transition"
              onClick={fetchRecommendations}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Get New Recommendations"}
            </button>
            {loading && <div className="text-luxe-gray-secondary">Loading personalized recommendations...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {recommendations && (
              <div className="p-4 bg-luxe-dark-outline rounded mb-4">
                <div className="font-semibold mb-2 text-luxe-gold-accent">Personalized for you:</div>
                <div className="text-luxe-white-primary whitespace-pre-line">{recommendations}</div>
              </div>
            )}
          </div>
        {/* Hero Section */}
        <section className="relative py-20 flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center gap-4 justify-center mb-8">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
            
            <Crown className="h-16 w-16 text-luxe-gold-accent mx-auto mb-6" />
            <h1 className="font-primary text-4xl md:text-5xl font-bold mb-4 text-luxe-white-primary">
              <span className="text-luxe-gold-accent">VIP</span> Membership
            </h1>
            <p className="font-secondary text-lg text-luxe-gray-secondary max-w-2xl mx-auto">
              Elevate your experience with exclusive benefits and priority access to our premium services
            </p>
          </div>
        </section>

        {/* VIP Membership Component */}
        <VIPMembershipSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default VIPMembership