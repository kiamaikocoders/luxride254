import React, { useState } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import MultiStepForm, { Step } from "@/components/MultiStepForm";
import { FileUploadWithPreview } from "@/components/FileUploadWithPreview";
import { CategorizedFileUpload } from "@/components/CategorizedFileUpload";
import { supabase } from "@/lib/supabaseClient";
import { uploadFilesToApplicationsBucket } from "@/lib/storage";
import { validateEmail, validatePhoneKe, isNonEmpty } from "@/lib/validation";
import { useRateLimit } from "@/hooks/useRateLimit";
import { User, Briefcase, FileText, Camera } from "lucide-react";

export default function ChauffeurApplication() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categorizedDocuments, setCategorizedDocuments] = useState<{ [key: string]: File[] }>({});
  const [profilePhoto, setProfilePhoto] = useState<File[]>([]);
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

      if (!isNonEmpty(full_name)) throw new Error("Full name is required");
      if (!validateEmail(email)) throw new Error("Valid email is required");
      if (!validatePhoneKe(phone)) throw new Error("Valid Kenyan phone is required");
      if (!profilePhoto || profilePhoto.length === 0) throw new Error("Profile photo is required");
      if (!categorizedDocuments.license_front || categorizedDocuments.license_front.length === 0) throw new Error("License front photo is required");
      if (!categorizedDocuments.license_back || categorizedDocuments.license_back.length === 0) throw new Error("License back photo is required");
      if (!categorizedDocuments.cv || categorizedDocuments.cv.length === 0) throw new Error("CV/Resume is required");
      if (!categorizedDocuments.passport || categorizedDocuments.passport.length === 0) throw new Error("Passport photo is required");

      // Upload profile photo
      const profilePhotoUploads = await uploadFilesToApplicationsBucket(profilePhoto, `chauffeurs/${encodeURIComponent(email)}/profile`);
      const profile_photo = profilePhotoUploads[0]?.path || '';

      // Upload categorized documents
      const documentsCategorized: { [key: string]: string[] } = {};
      for (const [category, files] of Object.entries(categorizedDocuments)) {
        const uploads = await uploadFilesToApplicationsBucket(files, `chauffeurs/${encodeURIComponent(email)}/${category}`);
        documentsCategorized[category] = uploads.map(u => u.path);
      }

      // Keep document_paths for backward compatibility (flatten all categorized docs)
      const allDocPaths = Object.values(documentsCategorized).flat();

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
        document_paths: allDocPaths,
        documents_categorized: documentsCategorized,
        profile_photo,
        status: 'pending',
      });
      if (insertError) throw new Error(insertError.message);
      setSuccess("Application submitted successfully. We will contact qualified candidates within 3-5 business days.");
      record();
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setSubmitting(false);
    }
  }

  const steps: Step[] = [
    {
      id: "personal",
      title: "PERSONAL",
      content: (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-600">Enter your contact details</p>
      </div>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
                <input 
                  name="full_name" 
                  required 
                  placeholder="Enter your full name" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
              </div>
              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="Enter your email address" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
              </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
                <input 
                  name="phone" 
                  required 
                  placeholder="Enter your phone number" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload a professional headshot or passport photo of yourself
                </p>
                <FileUploadWithPreview
                  name="profile_photo"
                  id="profile_photo"
                  accept=".jpg,.jpeg,.png"
                  multiple={false}
                  maxSize={5 * 1024 * 1024}
                  onFilesChange={(files) => setProfilePhoto(files)}
                />
              </div>
          </div>
        </div>
      ),
    },
    {
      id: "professional",
      title: "PROFESSIONAL",
      content: (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Professional Information</h2>
              <p className="text-sm text-gray-600">Tell us about your driving experience and qualifications</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Years of Driving Experience</label>
                <input 
                  name="years_experience" 
                  type="number" 
                  min={0} 
                  placeholder="Enter years of experience" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Driving License Number</label>
                <input 
                  name="license_number" 
                  placeholder="Enter license number" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">License Category (e.g., BCE)</label>
                <input 
                  name="license_category" 
                  placeholder="Enter license category" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Languages Spoken</label>
              <input 
                name="languages" 
                placeholder="e.g. English, Swahili"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Availability</label>
              <textarea 
                name="availability" 
                placeholder="Describe your availability (days/hours)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                rows={3}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Why LuxeRide?</label>
              <textarea 
                name="why_luxeride" 
                placeholder="Tell us why you want to join LuxeRide" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                rows={4}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Salary Expectations</label>
              <textarea 
                name="salary_expectations" 
                placeholder="Describe your salary expectations" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                rows={3}
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
              <p className="text-sm text-gray-600">Upload required documents (license front/back, CV/resume, passport photo)</p>
            </div>
          </div>
          <div className="mt-6">
            <CategorizedFileUpload
              categories={[
                {
                  key: 'license_front',
                  label: 'License (Front)',
                  description: 'Upload a clear photo of the front side of your driving license',
                  accept: '.jpg,.jpeg,.png',
                  maxFiles: 1,
                  required: true,
                },
                {
                  key: 'license_back',
                  label: 'License (Back)',
                  description: 'Upload a clear photo of the back side of your driving license',
                  accept: '.jpg,.jpeg,.png',
                  maxFiles: 1,
                  required: true,
                },
                {
                  key: 'cv',
                  label: 'CV / Resume',
                  description: 'Upload your CV or resume in PDF or Word format',
                  accept: '.pdf,.doc,.docx',
                  maxFiles: 1,
                  required: true,
                },
                {
                  key: 'passport',
                  label: 'Passport Photo',
                  description: 'Upload a passport-size photo (can be the same as profile photo)',
                  accept: '.jpg,.jpeg,.png',
                  maxFiles: 1,
                  required: true,
                },
              ]}
              maxSize={10 * 1024 * 1024}
              onFilesChange={setCategorizedDocuments}
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
            Apply to <span className="text-yellow-400">Join Us</span>
          </h1>
          <p className="text-gray-600 text-lg">Complete the application below. Only qualified candidates will be contacted for interviews.</p>
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
