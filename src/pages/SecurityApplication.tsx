import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { uploadFilesToApplicationsBucket } from "@/lib/storage";
import { validateEmail, validatePhoneKe, isNonEmpty } from "@/lib/validation";
import { useRateLimit } from "@/hooks/useRateLimit";

export default function SecurityApplication() {
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
      const years_experience = Number(formData.get("years_experience") || 0);
      const security_certifications = String(formData.get("security_certifications") || "");
      const previous_employers = String(formData.get("previous_employers") || "");
      const specializations = String(formData.get("specializations") || "");
      const languages = String(formData.get("languages") || "");
      const availability = String(formData.get("availability") || "");
      const why_luxeride = String(formData.get("why_luxeride") || "");
      const salary_expectations = String(formData.get("salary_expectations") || "");
      const docs = formData.getAll("documents") as File[];

      if (!isNonEmpty(full_name)) throw new Error("Full name is required");
      if (!validateEmail(email)) throw new Error("Valid email is required");
      if (!validatePhoneKe(phone)) throw new Error("Valid Kenyan phone is required");

      const uploads = await uploadFilesToApplicationsBucket(docs, `security/${encodeURIComponent(email)}`);
      const document_paths = uploads.map(u => u.path);

      const { error: insertError } = await supabase.from("security_applications").insert({
        full_name,
        email,
        phone,
        years_experience,
        security_certifications,
        previous_employers,
        specializations,
        languages,
        availability,
        why_luxeride,
        salary_expectations,
        document_paths,
      });
      if (insertError) throw new Error(insertError.message);
      setSuccess("Application submitted successfully. We will contact qualified candidates within 3-5 business days.");
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
          <h1 className="text-4xl font-bold text-luxe-gold-accent mb-4">Security Careers at LuxeRide</h1>
          <p className="text-zinc-300 text-lg">Join our elite security team and provide protection for our VIP clients. Complete the application below to be considered for our security positions.</p>
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
                <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="Enter your email address" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                <input 
                  name="phone" 
                  required 
                  placeholder="Enter your phone number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Years of Security Experience *</label>
                <input 
                  name="years_experience" 
                  type="number" 
                  min={0} 
                  required 
                  placeholder="Enter years of experience" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Security Certifications (e.g., CPO, PPS, etc.)</label>
              <input 
                name="security_certifications" 
                placeholder="Enter your security certifications" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Previous Employers & Roles</label>
              <textarea 
                name="previous_employers" 
                placeholder="Describe your previous employers and roles" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                rows={4}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Specializations (VIP protection, corporate security, event security, etc.)</label>
              <textarea 
                name="specializations" 
                placeholder="Describe your specializations" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                rows={3}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Languages Spoken (e.g., English, Swahili, French)</label>
              <input 
                name="languages" 
                placeholder="Enter languages you speak" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Availability (days/hours)</label>
              <textarea 
                name="availability" 
                placeholder="Describe your availability" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                rows={3}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Why do you want to work with LuxeRide?</label>
              <textarea 
                name="why_luxeride" 
                placeholder="Tell us why you want to work with LuxeRide" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                rows={4}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Salary Expectations</label>
              <textarea 
                name="salary_expectations" 
                placeholder="Describe your salary expectations" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                rows={3}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Documents (certificates, background checks, CV/resume, passport photo)</label>
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
                {submitting ? "Submitting Application..." : "Submit Security Application"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
