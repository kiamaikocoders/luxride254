import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen bg-luxe-dark-primary text-white">
      <Header />
      <main className="pt-20 max-w-5xl mx-auto px-4 pb-16">
        <h1 className="text-4xl font-bold text-luxe-gold-accent mb-6">Partner With LuxeRide</h1>
        <p className="text-zinc-300 mb-8">Transform your luxury vehicle into a premium income source. Submit your details below to get started.</p>

        {error && <div className="mb-4 text-red-400">{error}</div>}
        {success && <div className="mb-4 text-green-400">{success}</div>}

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900/60 p-4 md:p-6 rounded-lg">
          <input name="full_name" required placeholder="Full Name *" className="bg-zinc-800 rounded p-3" />
          <input name="email" type="email" required placeholder="Email Address *" className="bg-zinc-800 rounded p-3" />
          <input name="phone" required placeholder="Phone Number *" className="bg-zinc-800 rounded p-3" />
          <input name="vehicle_make" required placeholder="Vehicle Make *" className="bg-zinc-800 rounded p-3" />
          <input name="vehicle_model" required placeholder="Vehicle Model *" className="bg-zinc-800 rounded p-3" />
          <input name="vehicle_year" type="number" min={1990} required placeholder="Year *" className="bg-zinc-800 rounded p-3" />
          <input name="mileage_km" type="number" placeholder="Mileage (KM)" className="bg-zinc-800 rounded p-3" />
          <input name="location" required placeholder="Location *" className="bg-zinc-800 rounded p-3" />
          <textarea name="vehicle_condition" placeholder="Vehicle Condition *" className="bg-zinc-800 rounded p-3 md:col-span-2" rows={3}></textarea>
          <textarea name="availability" placeholder="Availability" className="bg-zinc-800 rounded p-3 md:col-span-2" rows={2}></textarea>
          <textarea name="expectations" placeholder="Expectations & Questions" className="bg-zinc-800 rounded p-3 md:col-span-2" rows={3}></textarea>
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm text-zinc-300">Upload Documents (registration, insurance, photos, service history)</label>
            <input name="documents" type="file" multiple className="block w-full text-sm" />
          </div>
          <div className="md:col-span-2">
            <button disabled={submitting} className="w-full bg-luxe-gold-accent text-black font-bold py-3 rounded">
              {submitting ? "Submitting…" : "Submit Partnership Application"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}


