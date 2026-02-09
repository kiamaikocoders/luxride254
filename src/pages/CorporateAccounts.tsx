import React, { useState } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import MultiStepForm, { Step } from "@/components/MultiStepForm";
import { FileUploadWithPreview } from "@/components/FileUploadWithPreview";
import { supabase } from "@/lib/supabaseClient";
import { uploadFilesToApplicationsBucket } from "@/lib/storage";
import { validateEmail, validatePhoneKe, isNonEmpty } from "@/lib/validation";
import { useRateLimit } from "@/hooks/useRateLimit";
import { Building2, Briefcase, FileText } from "lucide-react";

export default function CorporateAccounts() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { canSubmit, record } = useRateLimit(3, 60_000);

  async function onSubmit(formData: FormData) {
    if (!canSubmit()) {
      setError("Too many attempts. Please wait a minute and try again.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);

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
        status: 'pending',
      });
      if (insertError) throw new Error(insertError.message);
      setSuccess("Corporate account application submitted. Our team will reach out promptly.");
      record();
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setSubmitting(false);
    }
  }

  const steps: Step[] = [
    {
      id: "company",
      title: "COMPANY",
      content: (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Company & Contact Information</h2>
              <p className="text-sm text-gray-600">Enter your company details and contact information</p>
            </div>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
                <input 
                  name="company_name" 
                  required 
                  placeholder="Enter company name" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
              </div>
              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Industry <span className="text-red-500">*</span>
              </label>
                <input 
                  name="industry" 
                  required 
                  placeholder="Enter industry" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Number of Employees (range)</label>
                <input 
                  name="employees_range" 
                placeholder="e.g. 50-100, 100-500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Primary Location</label>
                <input 
                  name="primary_location" 
                  placeholder="Enter primary location" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
              </div>
              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Contact Person <span className="text-red-500">*</span>
              </label>
                <input 
                  name="contact_name" 
                  required 
                  placeholder="Enter contact person name" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
              </div>
              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Contact Email <span className="text-red-500">*</span>
              </label>
                <input 
                  name="contact_email" 
                  type="email" 
                  required 
                  placeholder="Enter contact email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
              </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Contact Phone <span className="text-red-500">*</span>
              </label>
                <input 
                  name="contact_phone" 
                  required 
                  placeholder="Enter contact phone" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
              </div>
          </div>
        </div>
      ),
    },
    {
      id: "services",
      title: "SERVICES",
      content: (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Services & Requirements</h2>
              <p className="text-sm text-gray-600">Tell us about your transportation needs and preferences</p>
            </div>
          </div>
          <div className="space-y-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Services Required</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Executive Car Services",
                  "Airport Transfers",
                  "Event Transportation",
                  "Roadshow Support",
                ].map((label) => (
                  <label
                    key={label}
                    className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      name="services_required"
                      value={label}
                      className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Billing Preference</label>
              <input 
                name="billing_preference" 
                placeholder="e.g. Monthly invoice, Weekly billing"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Current Transportation Provider (if any)</label>
              <input 
                name="current_provider" 
                placeholder="Enter current provider" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Special Requirements</label>
              <textarea 
                name="special_requirements" 
                placeholder="Describe special requirements" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Expectations & Goals</label>
              <textarea 
                name="expectations" 
                placeholder="Describe your expectations and goals" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                rows={4}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "docs",
      title: "DOCS",
      content: (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
              <p className="text-sm text-gray-600">Upload required company documents (registration, tax compliance, profile)</p>
            </div>
          </div>
          <div className="mt-6">
            <FileUploadWithPreview
              name="documents"
              id="documents"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple={true}
              maxSize={10 * 1024 * 1024}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Apply for <span className="text-yellow-400">Corporate Account</span>
          </h1>
          <p className="text-gray-600 text-lg">Join businesses that trust LuxeRide for premium transportation solutions.</p>
        </div>

        <MultiStepForm
          steps={steps}
          onSubmit={onSubmit}
          submitting={submitting}
          error={error}
          success={success}
        />
      </main>
      <Footer />
    </div>
  );
}
