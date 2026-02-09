import React from "react";
import { InfiniteCarousel } from "@/components/reactbits";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Michael Omondi",
      role: "CEO, Tech Solutions Kenya",
      image: "https://img.freepik.com/premium-psd/generative-ai-portrait-only-one-man-white-background-created-by-ai_1132122-8387.jpg?w=360",
      rating: 5,
      text: "LuxeRide has transformed how I travel in Nairobi. The professionalism of their chauffeurs and the quality of their vehicles is unmatched. I've been a Diamond member for over a year and couldn't be happier.",
      service: "VIP Diamond Membership",
      location: "Nairobi"
    },
    {
      name: "Patience Achieng",
      role: "Marketing Director",
      image: "https://easy-peasy.ai/cdn-cgi/image/quality=95,format=auto,width=800/https://media.easy-peasy.ai/27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e/12c67fa1-4b48-46e6-b513-fe75df1b20a7.png",
      rating: 5,
      text: "As a busy professional, time is everything. LuxeRide's Platinum membership gives me peace of mind knowing I have reliable transportation whenever I need it. The 24/7 concierge service is exceptional.",
      service: "VIP Platinum Membership",
      location: "Nairobi"
    },
    {
      name: "Robert Kamau",
      role: "Business Owner",
      image: "https://img.freepik.com/premium-photo/handsome-young-african-man-formalwear-looking-camera-smiling-while-standing-against-grey-wall_425904-1906.jpg",
      rating: 5,
      text: "I use LuxeRide for all my corporate events and client meetings. The service is consistently excellent, and my clients are always impressed. It's become an essential part of my business operations.",
      service: "Corporate Services",
      location: "Nairobi"
    },
    {
      name: "Winnie Njeri",
      role: "Event Planner",
      image: "https://img.freepik.com/premium-photo/african-american-business-woman-smiling-camera-generative-ai_741672-2310.jpg",
      rating: 5,
      text: "LuxeRide made our wedding day absolutely perfect. The bridal party transportation was seamless, and the vehicles were beautifully decorated. Our guests were impressed, and everything ran on time.",
      service: "Special Events",
      location: "Nairobi"
    },
    {
      name: "Daniel Mwangi",
      role: "Investment Banker",
      image: "https://imagef2.promeai.pro/process/do/6038137dbd451914a5c25bd75903c212.webp?sourceUrl=/g/p/gallery/publish/2024/08/19/051646efd26648da8ef98dfcdf578673.jpg&x-oss-process=image/resize,w_500,h_500/format,webp&sign=de7e665eaa3342b0da0d19df4e868b44",
      rating: 5,
      text: "The airport transfer service is outstanding. I travel frequently, and LuxeRide's reliability and professionalism make my trips stress-free. The chauffeurs are always punctual and courteous.",
      service: "Airport Transfers",
      location: "Nairobi"
    },
    {
      name: "Esther Wanjala",
      role: "Corporate Executive",
      image: "https://static.vecteezy.com/system/resources/previews/039/633/047/non_2x/ai-generated-portrait-of-bearded-black-man-on-plan-background-photo.jpg",
      rating: 5,
      text: "I've tried many transportation services, but LuxeRide stands out. The attention to detail, the comfort of the vehicles, and the professionalism of the team make it worth every shilling.",
      service: "Executive Cars",
      location: "Nairobi"
    }
  ];

  return (
    <section className="py-20 section-gold-tint relative">
      {/* Top Border Separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
      {/* Bottom Border Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 scroll-fade-up">
          <h2 className="text-3xl md:text-4xl brand-heading mb-4">
            What Our Clients Say
          </h2>
          <div className="h-1 w-20 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our satisfied clients have to say about their 
            experience with LuxeRide.
          </p>
        </div>

        {/* Testimonials Infinite Carousel */}
        <InfiniteCarousel
          autoplay={true}
          autoplayInterval={4000}
          loop={true}
          className="w-full"
          itemClassName="h-full"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-enhanced p-8 h-full animate-fade-in hover:shadow-card-hover active:shadow-card-hover active:scale-[0.98] transition-all touch-manipulation flex flex-col"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rating Stars */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed italic flex-grow">
                "{testimonial.text}"
              </p>

              {/* Service Badge */}
              <div className="inline-block bg-yellow-400/10 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium mb-6 w-fit">
                {testimonial.service}
              </div>

              {/* Customer Info */}
              <div className="flex items-center border-t border-gray-200 pt-6">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: '50% 25%' }}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-xs text-gray-400 mt-1">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </InfiniteCarousel>

        {/* Trust Indicators - Side by side on all screens */}
        <div className="mt-12 md:mt-16 grid grid-cols-3 gap-3 md:gap-8 text-center scroll-stagger">
          <div>
            <div className="text-2xl md:text-4xl font-bold text-yellow-400 mb-1 md:mb-2">4.9/5</div>
            <div className="text-xs md:text-base text-gray-600">Average Rating</div>
            <div className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Based on 2,500+ reviews</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-bold text-yellow-400 mb-1 md:mb-2">98%</div>
            <div className="text-xs md:text-base text-gray-600">Would Recommend</div>
            <div className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Customer satisfaction rate</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-bold text-yellow-400 mb-1 md:mb-2">10,000+</div>
            <div className="text-xs md:text-base text-gray-600">Happy Clients</div>
            <div className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">And growing every day</div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default TestimonialsSection;
