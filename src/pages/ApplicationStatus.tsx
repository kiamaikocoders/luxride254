import React, { useState } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
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
        supabase.from("corporate_account_applications").select("*").eq("contact_email", email)
      ]);

      const allApplications = [
        ...(carOwnerApps.data || []).map(app => ({ ...app, type: "Car Owner Partnership" })),
        ...(chauffeurApps.data || []).map(app => ({ ...app, type: "Chauffeur Application" })),
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
    <div className="min-h-screen bg-white text-gray-900 relative">
      {/* Blurred Background Logo */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 blur-sm"
          style={{ 
            backgroundImage: `url('/luxride-logo.svg')`,
            backgroundSize: '60%',
            backgroundPosition: 'center'
          }}
        />
      </div>
      
      <Header />
      <main className="pt-20 min-h-screen relative z-10 flex items-center justify-center px-4">
        {/* Centered Card Container */}
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl p-8 shadow-xl border border-gray-100">
            {/* Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400/10 rounded-full mb-4">
                <Search className="h-8 w-8 text-yellow-400" />
              </div>
              
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Check Application Status</h1>
              
              {/* Description */}
              <p className="text-gray-600 text-lg mb-8">Enter your email address to check the status of your applications</p>
            </div>

            {/* Form */}
            <form onSubmit={checkApplications} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-3 bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Check Status
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            </div>
          </div>
        )}

        {/* Applications Results */}
        {applications.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Applications</h2>
            <div className="space-y-4">
              {applications.map((app, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{app.type}</h3>
                    <div className={`flex items-center gap-2 ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="font-medium">{getStatusText(app.status)}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="text-gray-900 ml-2">{app.full_name || app.contact_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-900 ml-2">{app.email || app.contact_email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <span className="text-gray-900 ml-2">{app.phone || app.contact_phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Submitted:</span>
                      <span className="text-gray-900 ml-2">
                        {new Date(app.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {app.status === "approved" && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-green-600 text-sm">
                        🎉 Congratulations! Your application has been approved. Our team will contact you within 24 hours with next steps.
                      </p>
                    </div>
                  )}

                  {app.status === "under_review" && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-yellow-600 text-sm">
                        ⏳ Your application is currently under review. We'll notify you once the review is complete.
                      </p>
                    </div>
                  )}

                  {app.status === "rejected" && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-red-600 text-sm">
                        ❌ Unfortunately, your application was not approved at this time. You may reapply after 30 days.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
