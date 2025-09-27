import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { uploadFilesToApplicationsBucket } from "@/lib/storage";
import { validateEmail, isNonEmpty } from "@/lib/validation";
import { useRateLimit } from "@/hooks/useRateLimit";

export default function AffiliateProgram() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { canSubmit, record } = useRateLimit(3, 60_000);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit()) { setError("Too many attempts. Please wait a minute and try again."); return; }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    try {
      const full_name = String(formData.get("full_name") || "");
      const email = String(formData.get("email") || "");
      const phone = String(formData.get("phone") || "");
      const company = String(formData.get("company") || "");
      const website = String(formData.get("website") || "");
      const audience_size = String(formData.get("audience_size") || "");
      const channels = (formData.getAll("channels") as string[]) || [];
      const notes = String(formData.get("notes") || "");
      const docs = formData.getAll("documents") as File[];

      if (!isNonEmpty(full_name)) throw new Error("Full name is required");
      if (!validateEmail(email)) throw new Error("Valid email is required");
      const uploads = await uploadFilesToApplicationsBucket(docs, `affiliates/${encodeURIComponent(email)}`);
      const document_paths = uploads.map(u => u.path);

      const { error: insertError } = await supabase.from("affiliate_applications").insert({
        full_name,
        email,
        phone,
        company,
        website,
        audience_size,
        channels,
        notes,
        document_paths,
      });
      if (insertError) throw new Error(insertError.message);
      setSuccess("Affiliate application submitted. We’ll get back to you shortly.");
      form.reset();
      record();
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-luxe-dark-primary text-white">
      <Header />
      <main className="pt-20 max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-luxe-gold-accent mb-4">Join Our Affiliate Program</h1>
          <p className="text-zinc-300 text-lg">Monetize your audience by partnering with LuxeRide. Tell us about your channels below.</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400">{success}</div>}

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input 
                  name="full_name" 
                  required 
                  placeholder="Enter your full name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="Enter your email address" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input 
                  name="phone" 
                  placeholder="Enter your phone number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Company/Brand</label>
                <input 
                  name="company" 
                  placeholder="Enter your company or brand name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Website/Link</label>
              <input 
                name="website" 
                placeholder="Enter your website or social media link" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Audience Size (e.g., 200k monthly reach)</label>
              <input 
                name="audience_size" 
                placeholder="Enter your audience size" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Channels</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Instagram",
                  "YouTube",
                  "TikTok",
                  "Twitter/X",
                  "LinkedIn",
                  "Blogs/Websites",
                  "Email Newsletters",
                  "Other",
                ].map((label) => (
                  <label key={label} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" name="channels" value={label} className="h-4 w-4 text-luxe-gold-accent focus:ring-luxe-gold-accent border-gray-300 rounded" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Notes (niche, audience demographics, proposed collaboration)</label>
              <textarea 
                name="notes" 
                placeholder="Share details about your niche, audience demographics, and proposed collaboration" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                rows={4}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Media Kit or Supporting Docs</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-luxe-gold-accent transition-colors">
                <div className="space-y-2">
                  <div className="text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">
                    <label htmlFor="documents" className="cursor-pointer">
                      <span className="font-medium text-luxe-gold-accent hover:text-luxe-gold-accent/80">Choose Files</span> or drag and drop
                    </label>
                    <input 
                      id="documents" 
                      name="documents" 
                      type="file" 
                      multiple 
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                disabled={submitting} 
                className="w-full bg-luxe-gold-accent text-black font-bold py-4 px-6 rounded-lg hover:bg-luxe-gold-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting Application..." : "Submit Affiliate Application"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}


