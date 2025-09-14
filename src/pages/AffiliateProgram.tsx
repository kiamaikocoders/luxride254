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
      <main className="pt-20 max-w-5xl mx-auto px-4 pb-16">
        <h1 className="text-4xl font-bold text-luxe-gold-accent mb-6">Join Our Affiliate Program</h1>
        <p className="text-zinc-300 mb-8">Monetize your audience by partnering with LuxeRide. Tell us about your channels below.</p>

        {error && <div className="mb-4 text-red-400">{error}</div>}
        {success && <div className="mb-4 text-green-400">{success}</div>}

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900/60 p-4 md:p-6 rounded-lg">
          <input name="full_name" required placeholder="Full Name *" className="bg-zinc-800 rounded p-3" />
          <input name="email" type="email" required placeholder="Email *" className="bg-zinc-800 rounded p-3" />
          <input name="phone" placeholder="Phone" className="bg-zinc-800 rounded p-3" />
          <input name="company" placeholder="Company/Brand" className="bg-zinc-800 rounded p-3" />
          <input name="website" placeholder="Website/Link" className="bg-zinc-800 rounded p-3 md:col-span-2" />

          <input name="audience_size" placeholder="Audience Size (e.g., 200k monthly reach)" className="bg-zinc-800 rounded p-3 md:col-span-2" />

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <label key={label} className="flex items-center gap-2 bg-zinc-800 rounded p-3">
                <input type="checkbox" name="channels" value={label} />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <textarea name="notes" placeholder="Notes (niche, audience demographics, proposed collaboration)" className="bg-zinc-800 rounded p-3 md:col-span-2" rows={3}></textarea>
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm text-zinc-300">Upload Media Kit or Supporting Docs</label>
            <input name="documents" type="file" multiple className="block w-full text-sm" />
          </div>
          <div className="md:col-span-2">
            <button disabled={submitting} className="w-full bg-luxe-gold-accent text-black font-bold py-3 rounded">
              {submitting ? "Submitting…" : "Submit Affiliate Application"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}


