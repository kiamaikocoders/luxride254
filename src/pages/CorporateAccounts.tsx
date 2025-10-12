import React, { useState } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { supabase } from "@/lib/supabaseClient";
import { uploadFilesToApplicationsBucket } from "@/lib/storage";
import { validateEmail, validatePhoneKe, isNonEmpty } from "@/lib/validation";
import { useRateLimit } from "@/hooks/useRateLimit";

export default function CorporateAccounts() {
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
      const company_name = String(formData.get("company_name") || "");
      const industry = String(formData.get("industry") || "");
      const employees_range = String(formData.get("employees_range") || "");
      const primary_location = String(formData.get("primary_location") || "");
      const contact_name = String(formData.get("contact_name") || "");
      const contact_email = String(formData.get("contact_email") || "");
      const contact_phone = String(formData.get("contact_phone") || "");
      const services_required = (formData.getAll("services_required") as string[]) || [];
      const billing_preference = String(formData.get("billing_preference") || "");
      const current_provider = String(formData.get("current_provider") || "");
      const special_requirements = String(formData.get("special_requirements") || "");
      const expectations = String(formData.get("expectations") || "");
      const docs = formData.getAll("documents") as File[];

      if (!isNonEmpty(company_name)) throw new Error("Company name is required");
      if (!validateEmail(contact_email)) throw new Error("Valid contact email is required");
      if (!validatePhoneKe(contact_phone)) throw new Error("Valid contact phone is required");
      const uploads = await uploadFilesToApplicationsBucket(docs, `corporates/${encodeURIComponent(contact_email || company_name)}`);
      const document_paths = uploads.map(u => u.path);

      const { error: insertError } = await supabase.from("corporate_account_applications").insert({
        company_name,
        industry,
        employees_range,
        primary_location,
        contact_name,
        contact_email,
        contact_phone,
        services_required,
        billing_preference,
        current_provider,
        special_requirements,
        expectations,
        document_paths,
      });
      if (insertError) throw new Error(insertError.message);
      setSuccess("Corporate account application submitted. Our team will reach out promptly.");
      form.reset();
      record();
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="pt-20 max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">Apply for Corporate Account</h1>
          <p className="text-gray-600 text-lg">Join businesses that trust LuxeRide for premium transportation solutions.</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">{success}</div>}

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Company Name *</label>
                <input 
                  name="company_name" 
                  required 
                  placeholder="Enter company name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Industry *</label>
                <input 
                  name="industry" 
                  required 
                  placeholder="Enter industry" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Number of Employees (range)</label>
                <input 
                  name="employees_range" 
                  placeholder="Enter employee range" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Primary Location</label>
                <input 
                  name="primary_location" 
                  placeholder="Enter primary location" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Contact Person *</label>
                <input 
                  name="contact_name" 
                  required 
                  placeholder="Enter contact person name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Contact Email *</label>
                <input 
                  name="contact_email" 
                  type="email" 
                  required 
                  placeholder="Enter contact email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Contact Phone *</label>
                <input 
                  name="contact_phone" 
                  required 
                  placeholder="Enter contact phone" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Services Required</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Executive Car Services",
                  "Airport Transfers",
                  "Event Transportation",
                  "Roadshow Support",
                ].map((label) => (
                  <label key={label} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" name="services_required" value={label} className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Billing Preference</label>
              <input 
                name="billing_preference" 
                placeholder="Enter billing preference" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Current Transportation Provider (if any)</label>
              <input 
                name="current_provider" 
                placeholder="Enter current provider" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Special Requirements</label>
              <textarea 
                name="special_requirements" 
                placeholder="Describe special requirements" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                rows={3}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Expectations & Goals</label>
              <textarea 
                name="expectations" 
                placeholder="Describe your expectations and goals" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                rows={4}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Company Documents (registration, tax compliance, profile)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors">
                <div className="space-y-2">
                  <div className="text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">
                    <label htmlFor="documents" className="cursor-pointer">
                      <span className="font-medium text-yellow-400 hover:text-yellow-300">Choose Files</span> or drag and drop
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
                className="w-full bg-yellow-400 text-gray-900 font-bold py-4 px-6 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting Application..." : "Submit Corporate Account Application"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}


