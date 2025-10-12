import React, { useState } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { supabase } from "@/lib/supabaseClient";
import { uploadFilesToApplicationsBucket } from "@/lib/storage";
import { validateEmail, validatePhoneKe, isNonEmpty } from "@/lib/validation";
import { useRateLimit } from "@/hooks/useRateLimit";

export default function CarOwnerPartnership() {
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
      const vehicle_make = String(formData.get("vehicle_make") || "");
      const vehicle_model = String(formData.get("vehicle_model") || "");
      const vehicle_year = Number(formData.get("vehicle_year") || 0);
      const mileage_km = Number(formData.get("mileage_km") || 0);
      const location = String(formData.get("location") || "");
      const vehicle_condition = String(formData.get("vehicle_condition") || "");
      const availability = String(formData.get("availability") || "");
      const expectations = String(formData.get("expectations") || "");
      const docs = formData.getAll("documents") as File[];

      if (!isNonEmpty(full_name)) throw new Error("Full name is required");
      if (!validateEmail(email)) throw new Error("Valid email is required");
      if (!validatePhoneKe(phone)) throw new Error("Valid Kenyan phone is required (e.g., +2547XXXXXXXX or 07XXXXXXXX)");

      const uploads = await uploadFilesToApplicationsBucket(docs, `car-owners/${encodeURIComponent(email)}`);
      const document_paths = uploads.map(u => u.path);

      const { error: insertError } = await supabase.from("car_owner_applications").insert({
        full_name,
        email,
        phone,
        vehicle_make,
        vehicle_model,
        vehicle_year,
        mileage_km,
        location,
        vehicle_condition,
        availability,
        expectations,
        document_paths,
      });
      if (insertError) throw new Error(insertError.message);
      setSuccess("Application submitted successfully. Our team will contact you within 24 hours.");
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
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">Partner With LuxeRide</h1>
          <p className="text-gray-600 text-lg">Transform your luxury vehicle into a premium income source. Submit your details below to get started.</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">{success}</div>}

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input 
                  name="full_name" 
                  required 
                  placeholder="Enter your full name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="Enter your email address" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                <input 
                  name="phone" 
                  required 
                  placeholder="Enter your phone number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Vehicle Make *</label>
                <input 
                  name="vehicle_make" 
                  required 
                  placeholder="Enter vehicle make" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Vehicle Model *</label>
                <input 
                  name="vehicle_model" 
                  required 
                  placeholder="Enter vehicle model" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Year *</label>
                <input 
                  name="vehicle_year" 
                  type="number" 
                  min={1990} 
                  required 
                  placeholder="Enter vehicle year" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mileage (KM)</label>
                <input 
                  name="mileage_km" 
                  type="number" 
                  placeholder="Enter mileage in KM" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location *</label>
                <input 
                  name="location" 
                  required 
                  placeholder="Enter your location" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Vehicle Condition *</label>
              <textarea 
                name="vehicle_condition" 
                required 
                placeholder="Describe your vehicle condition" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                rows={4}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Availability</label>
              <textarea 
                name="availability" 
                placeholder="Describe your availability" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                rows={3}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Expectations & Questions</label>
              <textarea 
                name="expectations" 
                placeholder="Share your expectations and any questions" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxe-gold-accent focus:border-transparent transition-colors" 
                rows={4}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Documents (registration, insurance, photos, service history)</label>
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
                {submitting ? "Submitting Application..." : "Submit Partnership Application"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}


