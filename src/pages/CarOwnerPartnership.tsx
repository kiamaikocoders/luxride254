import React, { useState } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import MultiStepForm, { Step } from "@/components/MultiStepForm";
import { FileUploadWithPreview } from "@/components/FileUploadWithPreview";
import { supabase } from "@/lib/supabaseClient";
import { uploadFilesToApplicationsBucket } from "@/lib/storage";
import { validateEmail, validatePhoneKe, isNonEmpty } from "@/lib/validation";
import { useRateLimit } from "@/hooks/useRateLimit";
import { User, Car, FileText, MapPin } from "lucide-react";

export default function CarOwnerPartnership() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [vehicleImages, setVehicleImages] = useState<File[]>([]);
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
      if (vehicleImages.length < 3) throw new Error("Please upload at least 3 vehicle photos");

      const [documentUploads, vehicleImageUploads] = await Promise.all([
        uploadFilesToApplicationsBucket(docs, `car-owners/${encodeURIComponent(email)}/documents`),
        uploadFilesToApplicationsBucket(vehicleImages, `car-owners/${encodeURIComponent(email)}/vehicle-images`),
      ]);

      const document_paths = documentUploads.map(u => u.path);
      const vehicle_images = vehicleImageUploads.map(u => u.path);

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
        vehicle_images,
        status: 'pending',
      });
      if (insertError) throw new Error(insertError.message);
      setSuccess("Application submitted successfully. Our team will contact you within 24 hours.");
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
          </div>
        </div>
      ),
    },
    {
      id: "vehicle",
      title: "VEHICLE",
      content: (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Vehicle Information</h2>
              <p className="text-sm text-gray-600">Enter the details of the vehicle you wish to register</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Make <span className="text-red-500">*</span>
              </label>
              <select
                  name="vehicle_make" 
                  required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
              >
                <option value="">Select vehicle make</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="BMW">BMW</option>
                <option value="Audi">Audi</option>
                <option value="Toyota">Toyota</option>
                <option value="Lexus">Lexus</option>
                <option value="Range Rover">Range Rover</option>
                <option value="Other">Other</option>
              </select>
              </div>
              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Model <span className="text-red-500">*</span>
              </label>
                <input 
                  name="vehicle_model" 
                  required 
                placeholder="e.g. E-Class, X5, Land Cruiser"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
              </div>
              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Year of Manufacture <span className="text-red-500">*</span>
              </label>
              <select
                  name="vehicle_year" 
                  required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
              >
                <option value="">Select year</option>
                {Array.from({ length: 35 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mileage (KM)</label>
              <div className="relative">
                <input 
                  name="mileage_km" 
                  type="number" 
                  placeholder="e.g. 50000"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">KM</span>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  name="location" 
                  required 
                  placeholder="Enter your city or area"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Condition <span className="text-red-500">*</span>
              </label>
              <textarea 
                name="vehicle_condition" 
                required 
                placeholder="Describe the current condition of your vehicle (e.g. Like new, minor scratches, excellent interior)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                rows={4}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Availability</label>
              <textarea 
                name="availability" 
                placeholder="When is the vehicle available? (e.g. Weekends only, Full-time, On-demand)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                rows={3}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Expectations & Questions</label>
              <textarea 
                name="expectations" 
                placeholder="Share your expectations and any questions" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors bg-white"
                rows={3}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Photos <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Upload clear photos of your vehicle (front, back, sides, interior). Minimum 3 photos required.
              </p>
              <FileUploadWithPreview
                name="vehicle_images"
                id="vehicle_images"
                accept=".jpg,.jpeg,.png"
                multiple={true}
                maxSize={10 * 1024 * 1024}
                onFilesChange={setVehicleImages}
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
              <p className="text-sm text-gray-600">Upload required documents (registration, insurance, photos, service history)</p>
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
            Partner With <span className="text-yellow-400">LuxeRide</span>
          </h1>
          <p className="text-gray-600 text-lg">Transform your luxury vehicle into a premium income source.</p>
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


