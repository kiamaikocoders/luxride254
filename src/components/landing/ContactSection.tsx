import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const ContactSection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Navigate to existing contact page with form data
      navigate("/contact", { 
        state: { 
          formData,
          fromLanding: true 
        } 
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomPlan = () => {
    navigate("/contact", { 
      state: { 
        interest: "Custom VIP Plan",
        fromLanding: true 
      } 
    });
  };

  return (
    <section id="contact" className="py-20 bg-white relative">
      {/* Section Header - Centered */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center scroll-fade-up">
          <h2 className="text-3xl md:text-4xl brand-heading mb-4">GET IN TOUCH</h2>
          <div className="h-1 w-20 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Ready to experience premium transportation? Contact us today and let us elevate your journey with our world-class chauffeur services.
          </p>
        </div>
        </div>
        
      {/* Two Column Layout - Edge Aligned */}
      <div className="w-full">
        <div className="grid lg:grid-cols-2 gap-0 items-stretch min-h-[600px]">
          {/* Left Side - Contact Information & Message - Left Aligned */}
            <div className="bg-white flex flex-col justify-center p-12 pl-8 lg:pl-12 xl:pl-16 scroll-fade-left">
            <div className="w-full max-w-lg">
              <h3 className="text-3xl brand-heading mb-4">LET'S GET IN TOUCH!</h3>
              <p className="text-lg text-gray-600 mb-8">
                Whether you have a question about our fleet, need a custom quote, or want to modify a reservation, our team is here to help.
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

              {/* Social Media Icons */}
              <div className="mb-6">
                <p className="text-base brand-heading mb-3">FOLLOW US</p>
                <div className="flex items-center space-x-3">
                  <a 
                    href="https://facebook.com/luxeride" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-all group"
                  >
                    <Facebook className="w-5 h-5 text-gray-900" />
                  </a>
                  <a 
                    href="https://twitter.com/luxeride" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-all group"
                  >
                    <Twitter className="w-5 h-5 text-gray-900" />
                  </a>
                  <a 
                    href="https://instagram.com/luxeride" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-all group"
                  >
                    <Instagram className="w-5 h-5 text-gray-900" />
                  </a>
                  <a 
                    href="https://linkedin.com/company/luxeride" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-all group"
                  >
                    <Linkedin className="w-5 h-5 text-gray-900" />
                  </a>
                </div>
              </div>
              
              {/* Simple Message Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-base brand-heading mb-2">SERVICE INTEREST *</label>
                  <select 
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-gray-700"
                  >
                    <option value="">Select a service</option>
                    <option>Premium Ride-Hailing</option>
                    <option>Car Hire Aggregation</option>
                    <option>On-Spot Luxury Hire</option>
                    <option>Event Transportation</option>
                    <option>Vehicle Partnership</option>
                    <option>Corporate Services</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-base brand-heading mb-2">MESSAGE *</label>
                  <textarea 
                    name="message"
                    required
                    rows={4} 
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-gray-700"
                    placeholder="Tell us about your transportation needs..."
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-yellow-400 text-white px-8 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition duration-200 shadow-lg flex items-center justify-center disabled:opacity-50 uppercase"
                >
                  {isSubmitting ? 'Sending...' : 'GET IN TOUCH'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Right Side - Customer Support Image - Right Aligned */}
          <div className="scroll-fade-right pr-8 lg:pr-12 xl:pr-16">
            <div className="relative h-full w-full rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://solutions.trustradius.com/wp-content/uploads/happy-beautiful-technical-customer-support-specialist-is-talking-on-a-picture-id1327262826.jpg"
                  alt="LuxeRide Customer Support Team"
                className="w-full h-full object-cover"
                />
                
              {/* Floating content overlay - Bottom Left */}
              <div className="absolute bottom-8 left-8 max-w-sm">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Customer Support</h3>
                  <p className="text-gray-600 mb-4 text-sm">
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
  );
};

export default ContactSection;
