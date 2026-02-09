import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { validateEmail, validatePhoneKe, isNonEmpty } from "@/lib/validation";
import { useRateLimit } from "@/hooks/useRateLimit";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const Contact = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { canSubmit } = useRateLimit(3, 60_000);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pre-fill form if coming from landing page
  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    }
    if (location.state?.interest) {
      setFormData(prev => ({
        ...prev,
        service: location.state.interest,
        message: `I'm interested in ${location.state.interest}. Please provide more information.`
      }));
    }
  }, [location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit()) {
      setError("Too many attempts. Please wait a minute and try again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form data
      if (!isNonEmpty(formData.name)) throw new Error("Full name is required");
      if (!validateEmail(formData.email)) throw new Error("Valid email is required");
      if (formData.phone && !validatePhoneKe(formData.phone)) throw new Error("Valid Kenyan phone is required");
      if (!isNonEmpty(formData.service)) throw new Error("Please select a service interest");
      if (!isNonEmpty(formData.message)) throw new Error("Message is required");

      // Insert into contact_inquiries table (assuming this exists)
      const { error: insertError } = await supabase
        .from("contact_inquiries")
        .insert({
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          service_interest: formData.service,
          message: formData.message,
          created_at: new Date().toISOString(),
          source: location.state?.fromLanding ? 'landing_page' : 'contact_page'
        });

      if (insertError) throw insertError;

      // Show success message
      setSuccess("Thank you for your message! We'll get back to you within 24 hours.");
      toast({
        title: "Message Sent Successfully",
        description: "We'll contact you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });

      // If coming from landing page, offer to redirect back
      if (location.state?.fromLanding) {
        setTimeout(() => {
          if (window.confirm("Would you like to return to our homepage?")) {
            navigate("/");
          }
        }, 2000);
      }

    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setError(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('https://www.shutterstock.com/image-photo/limo-driver-standing-next-opened-600nw-1349671115.jpg')` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-6">
            <span className="text-white">Contact</span> <span className="text-yellow-400">LuxeRide</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Ready to experience premium transportation? Get in touch with our team today.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-0 items-stretch min-h-[600px]">
            {/* Left Side - Contact Information & Message */}
            <div className="bg-white flex flex-col justify-center p-12 border-r border-gray-200">
              <div className="max-w-md">
                <h2 className="text-3xl brand-heading mb-4">Let's Get In Touch!</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Ready to experience premium transportation? Contact us today and let us elevate your journey.
                </p>
                
                {/* Contact Information - Enhanced Iconography */}
                <div className="space-y-5 mb-6">
                  {/* Email */}
                  <div className="flex items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4 shadow-md group-hover:shadow-lg transition-all">
                      <Mail className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <a href="mailto:info@luxeride.org" className="text-gray-900 hover:text-yellow-500 transition font-medium">
                        info@luxeride.org
                      </a>
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div className="flex items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4 shadow-md group-hover:shadow-lg transition-all">
                      <Phone className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <a href="tel:+254700000000" className="text-gray-900 hover:text-yellow-500 transition font-medium">
                        +254 (0) 700 000 000
                      </a>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4 shadow-md group-hover:shadow-lg transition-all">
                      <MapPin className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="text-gray-900 font-medium">Nairobi, Kenya</p>
                    </div>
                  </div>
                </div>

                {/* Social Media Icons - Weego Style */}
                <div className="mb-6">
                  <p className="text-base brand-heading mb-3">Follow Us</p>
                  <div className="flex items-center space-x-3">
                    <a 
                      href="https://facebook.com/luxeride" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all group"
                    >
                      <Facebook className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                    </a>
                    <a 
                      href="https://twitter.com/luxeride" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all group"
                    >
                      <Twitter className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                    </a>
                    <a 
                      href="https://instagram.com/luxeride" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all group"
                    >
                      <Instagram className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                    </a>
                    <a 
                      href="https://linkedin.com/company/luxeride" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all group"
                    >
                      <Linkedin className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                    </a>
                  </div>
                </div>
                
                {/* Error/Success Messages */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <i className="fas fa-exclamation-circle text-red-400"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <i className="fas fa-check-circle text-green-400"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-800">{success}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-base brand-heading mb-2">Service Interest *</label>
                    <select 
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                    >
                      <option value="">Select a service</option>
                      <option>Premium Ride-Hailing</option>
                      <option>Car Hire Aggregation</option>
                      <option>On-Spot Luxury Hire</option>
                      <option>Event Transportation</option>
                      <option>Vehicle Partnership</option>
                      <option>Corporate Services</option>
                      <option>Membership Packages</option>
                      <option>Custom VIP Plan</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-base brand-heading mb-2">Message *</label>
                    <textarea 
                      name="message"
                      required
                      rows={4} 
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                      placeholder="Tell us about your transportation needs..."
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:from-yellow-300 hover:to-yellow-400 transition duration-200 shadow-lg flex items-center justify-center disabled:opacity-50"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
                    {isSubmitting ? 'Sending...' : 'GET IN TOUCH'}
                  </button>
                </form>
              </div>
            </div>
            
            {/* Right Side - Customer Support Image */}
            <div>
              <div className="relative h-full">
                <img 
                  src="https://solutions.trustradius.com/wp-content/uploads/happy-beautiful-technical-customer-support-specialist-is-talking-on-a-picture-id1327262826.jpg"
                  alt="LuxeRide Customer Support Team"
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-gray-900/40"></div>
                
                {/* Floating content overlay */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Customer Support</h3>
                    <p className="text-gray-600 mb-4">
                      Our dedicated support team is always ready to assist you with any questions or special requests.
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Available Now</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-sm text-gray-600">5.0 Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact;
