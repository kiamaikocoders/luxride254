import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen bg-luxe-dark-primary text-white">
      <Header />
      <main className="pt-20 max-w-6xl mx-auto px-4 pb-16">
        <h1 className="text-4xl font-bold text-luxe-gold-accent mb-6">Apply for Corporate Account</h1>
        <p className="text-zinc-300 mb-8">Join businesses that trust LuxeRide for premium transportation solutions.</p>

        {error && <div className="mb-4 text-red-400">{error}</div>}
        {success && <div className="mb-4 text-green-400">{success}</div>}

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900/60 p-4 md:p-6 rounded-lg">
          <input name="company_name" required placeholder="Company Name *" className="bg-zinc-800 rounded p-3" />
          <input name="industry" required placeholder="Industry *" className="bg-zinc-800 rounded p-3" />
          <input name="employees_range" placeholder="Number of Employees (range)" className="bg-zinc-800 rounded p-3" />
          <input name="primary_location" placeholder="Primary Location" className="bg-zinc-800 rounded p-3" />
          <input name="contact_name" required placeholder="Contact Person *" className="bg-zinc-800 rounded p-3" />
          <input name="contact_email" type="email" required placeholder="Contact Email *" className="bg-zinc-800 rounded p-3" />
          <input name="contact_phone" required placeholder="Contact Phone *" className="bg-zinc-800 rounded p-3" />

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Executive Car Services",
              "Airport Transfers",
              "Event Transportation",
              "Helicopter Charters",
              "Marine Transport",
              "Roadshow Support",
            ].map((label) => (
              <label key={label} className="flex items-center gap-2 bg-zinc-800 rounded p-3">
                <input type="checkbox" name="services_required" value={label} />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <input name="billing_preference" placeholder="Billing Preference" className="bg-zinc-800 rounded p-3 md:col-span-2" />
          <input name="current_provider" placeholder="Current Transportation Provider (if any)" className="bg-zinc-800 rounded p-3 md:col-span-2" />
          <textarea name="special_requirements" placeholder="Special Requirements" className="bg-zinc-800 rounded p-3 md:col-span-2" rows={2}></textarea>
          <textarea name="expectations" placeholder="Expectations & Goals" className="bg-zinc-800 rounded p-3 md:col-span-2" rows={3}></textarea>
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm text-zinc-300">Upload Company Documents (registration, tax compliance, profile)</label>
            <input name="documents" type="file" multiple className="block w-full text-sm" />
          </div>
          <div className="md:col-span-2">
            <button disabled={submitting} className="w-full bg-luxe-gold-accent text-black font-bold py-3 rounded">
              {submitting ? "Submitting…" : "Submit Corporate Account Application"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}


