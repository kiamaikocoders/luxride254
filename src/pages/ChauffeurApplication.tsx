import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { uploadFilesToApplicationsBucket } from "@/lib/storage";
import { validateEmail, validatePhoneKe, isNonEmpty } from "@/lib/validation";
import { useRateLimit } from "@/hooks/useRateLimit";

export default function ChauffeurApplication() {
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
      const license_number = String(formData.get("license_number") || "");
      const license_category = String(formData.get("license_category") || "");
      const languages = String(formData.get("languages") || "");
      const availability = String(formData.get("availability") || "");
      const why_luxeride = String(formData.get("why_luxeride") || "");
      const salary_expectations = String(formData.get("salary_expectations") || "");
      const docs = formData.getAll("documents") as File[];

      if (!isNonEmpty(full_name)) throw new Error("Full name is required");
      if (!validateEmail(email)) throw new Error("Valid email is required");
      if (!validatePhoneKe(phone)) throw new Error("Valid Kenyan phone is required");
      const uploads = await uploadFilesToApplicationsBucket(docs, `chauffeurs/${encodeURIComponent(email)}`);
      const document_paths = uploads.map(u => u.path);

      const { error: insertError } = await supabase.from("chauffeur_applications").insert({
        full_name,
        email,
        phone,
        years_experience,
        license_number,
        license_category,
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
      <main className="pt-20 max-w-5xl mx-auto px-4 pb-16">
        <h1 className="text-4xl font-bold text-luxe-gold-accent mb-6">Apply to Join Us</h1>
        <p className="text-zinc-300 mb-8">Complete the application below. Only qualified candidates will be contacted for interviews.</p>

        {error && <div className="mb-4 text-red-400">{error}</div>}
        {success && <div className="mb-4 text-green-400">{success}</div>}

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900/60 p-4 md:p-6 rounded-lg">
          <input name="full_name" required placeholder="Full Name *" className="bg-zinc-800 rounded p-3" />
          <input name="email" type="email" required placeholder="Email Address *" className="bg-zinc-800 rounded p-3" />
          <input name="phone" required placeholder="Phone Number *" className="bg-zinc-800 rounded p-3" />
          <input name="years_experience" type="number" min={0} placeholder="Years of Driving Experience" className="bg-zinc-800 rounded p-3" />
          <input name="license_number" placeholder="Driving License Number" className="bg-zinc-800 rounded p-3" />
          <input name="license_category" placeholder="License Category (e.g., BCE)" className="bg-zinc-800 rounded p-3" />
          <input name="languages" placeholder="Languages Spoken (e.g., English, Swahili)" className="bg-zinc-800 rounded p-3 md:col-span-2" />
          <textarea name="availability" placeholder="Availability (days/hours)" className="bg-zinc-800 rounded p-3 md:col-span-2" rows={2}></textarea>
          <textarea name="why_luxeride" placeholder="Why LuxeRide?" className="bg-zinc-800 rounded p-3 md:col-span-2" rows={3}></textarea>
          <textarea name="salary_expectations" placeholder="Salary Expectations" className="bg-zinc-800 rounded p-3 md:col-span-2" rows={2}></textarea>
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm text-zinc-300">Upload Documents (license front/back, CV/resume, passport photo)</label>
            <input name="documents" type="file" multiple className="block w-full text-sm" />
          </div>
          <div className="md:col-span-2">
            <button disabled={submitting} className="w-full bg-luxe-gold-accent text-black font-bold py-3 rounded">
              {submitting ? "Submitting…" : "Submit Chauffeur Application"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}


