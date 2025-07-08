import { Star, Quote } from "lucide-react"
import React from "react"

const testimonials = [
  {
    text: "LuxeRide transformed my business travel experience. The helicopter service to Mombasa was absolutely exceptional, and the attention to detail was remarkable.",
    name: "Sarah Kimani",
    title: "CEO, Kimani Industries",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    text: "The executive car service exceeded all expectations. Professional chauffeur, immaculate vehicle, and seamless booking process. This is luxury redefined.",
    name: "David Ochieng",
    title: "Managing Director, Ochieng Group",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    text: "Our family's speedboat transfer to Malindi was magical. The captain was knowledgeable, the boat was pristine, and the views were unforgettable.",
    name: "Grace Wanjiku",
    title: "Tourism Executive",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    text: "Booking with LuxeRide was seamless and the customer service was top-notch. Highly recommend for anyone seeking a premium experience.",
    name: "James Mwangi",
    title: "Entrepreneur",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    text: "The attention to detail and professionalism from LuxeRide is unmatched. Every ride feels special.",
    name: "Linda Achieng",
    title: "Event Planner",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    text: "I felt like a VIP from start to finish. The fleet is impressive and the drivers are true professionals.",
    name: "Peter Otieno",
    title: "Finance Executive",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    text: "LuxeRide is my go-to for all business travel. Reliable, luxurious, and always on time.",
    name: "Mary Njeri",
    title: "Business Consultant",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/65.jpg"
  }
]

const duplicatedTestimonials = [...testimonials, ...testimonials]

const TestimonialsSection = () => {
  return (
    <section className="py-luxe-xxl bg-luxe-dark-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-primary text-3xl md:text-4xl lg:text-5xl font-bold text-luxe-white-primary mb-6">
            What Our Clients Say
          </h2>
          <p className="font-secondary text-lg text-luxe-gray-secondary max-w-3xl mx-auto">
            Discover why discerning clients choose LuxeRide for their premium mobility needs
          </p>
        </div>
        {/* Infinite Scroll Marquee */}
        <div className="overflow-x-hidden">
          <div className="flex w-max animate-marquee gap-8">
            {duplicatedTestimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-luxe-dark-primary border border-luxe-dark-outline rounded-lg p-8 min-w-[340px] max-w-xs mx-2 hover:shadow-luxe-card transition-all duration-300 hover:scale-105 flex-shrink-0"
              >
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-luxe-gold-accent" />
                </div>
                {/* Testimonial Text */}
                <p className="font-secondary text-luxe-white-primary mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                {/* Star Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-luxe-gold-star fill-current" />
                  ))}
                </div>
                {/* Client Info */}
                <div className="flex items-center">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-primary font-semibold text-luxe-white-primary">
                      {testimonial.name}
                    </h4>
                    <p className="font-secondary text-sm text-luxe-gray-secondary">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
        `}</style>
      </div>
    </section>
  )
}

export default TestimonialsSection