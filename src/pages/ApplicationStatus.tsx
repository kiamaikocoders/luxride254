import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/luxe-button";
import { Search, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function ApplicationStatus() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const checkApplications = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError(null);
    setApplications([]);

    try {
      // Check all application tables
      const [carOwnerApps, chauffeurApps, securityApps, corporateApps] = await Promise.all([
        supabase.from("car_owner_applications").select("*").eq("email", email),
        supabase.from("chauffeur_applications").select("*").eq("email", email),
        supabase.from("security_applications").select("*").eq("email", email),
        supabase.from("corporate_account_applications").select("*").eq("contact_email", email)
      ]);

      const allApplications = [
        ...(carOwnerApps.data || []).map(app => ({ ...app, type: "Car Owner Partnership" })),
        ...(chauffeurApps.data || []).map(app => ({ ...app, type: "Chauffeur Application" })),
        ...(securityApps.data || []).map(app => ({ ...app, type: "Security Application" })),
        ...(corporateApps.data || []).map(app => ({ ...app, type: "Corporate Account" }))
      ];

      if (allApplications.length === 0) {
        setError("No applications found for this email address");
      } else {
        setApplications(allApplications);
      }
    } catch (err: any) {
      setError("Failed to check applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "under_review":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "under_review":
        return "Under Review";
      default:
        return "Pending";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-400";
      case "rejected":
        return "text-red-400";
      case "under_review":
        return "text-yellow-400";
      default:
        return "text-blue-400";
    }
  };

  return (
    <div className="min-h-screen bg-luxe-dark-primary text-white">
      <Header />
      <main className="pt-20 max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-luxe-gold-accent mb-6">Check Application Status</h1>
          <p className="text-zinc-300 mb-8">Enter your email address to check the status of your applications</p>
        </div>

        <div className="bg-zinc-900/60 rounded-lg p-6 mb-8">
          <form onSubmit={checkApplications} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-zinc-800 rounded p-3 text-white placeholder-zinc-400"
              required
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 bg-luxe-gold-accent text-black font-bold hover:bg-luxe-gold-accent/90 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  Checking...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Check Status
                </div>
              )}
            </Button>
          </form>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          </div>
        )}

        {applications.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-luxe-gold-accent mb-6">Your Applications</h2>
            {applications.map((app, index) => (
              <div key={index} className="bg-zinc-900/60 rounded-lg p-6 border border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{app.type}</h3>
                  <div className={`flex items-center gap-2 ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    <span className="font-medium">{getStatusText(app.status)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-400">Name:</span>
                    <span className="text-white ml-2">{app.full_name || app.contact_name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Email:</span>
                    <span className="text-white ml-2">{app.email || app.contact_email}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Phone:</span>
                    <span className="text-white ml-2">{app.phone || app.contact_phone}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Submitted:</span>
                    <span className="text-white ml-2">
                      {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {app.status === "approved" && (
                  <div className="mt-4 p-3 bg-green-900/20 border border-green-500/50 rounded">
                    <p className="text-green-400 text-sm">
                      🎉 Congratulations! Your application has been approved. Our team will contact you within 24 hours with next steps.
                    </p>
                  </div>
                )}

                {app.status === "under_review" && (
                  <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/50 rounded">
                    <p className="text-yellow-400 text-sm">
                      ⏳ Your application is currently under review. We'll notify you once the review is complete.
                    </p>
                  </div>
                )}

                {app.status === "rejected" && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded">
                    <p className="text-red-400 text-sm">
                      ❌ Unfortunately, your application was not approved at this time. You may reapply after 30 days.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
