import { Button } from "@/components/ui/luxe-button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import executiveImage from "@/assets/executive-cars.jpg"

const ServicesSection = () => {
  const services = [
    {
      title: "Executive Cars",
      image: executiveImage,
      description: "Premium chauffeur-driven luxury vehicles for discerning clients who demand nothing but the best.",
      features: [
        "Mercedes S-Class & BMW 7 Series",
        "Professional Chauffeurs",
        "Wi-Fi & Refreshments",
        "Airport Transfers",
        "Corporate Accounts"
      ],
      link: "/executive-cars"
    },
  ]

  return (
    <section className="py-luxe-xxl bg-luxe-dark-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-primary text-3xl md:text-4xl lg:text-5xl font-bold text-luxe-white-primary mb-6">
            Our Services
          </h2>
          <p className="font-secondary text-lg text-luxe-gray-secondary max-w-3xl mx-auto">
            Choose from our exclusive range of premium mobility solutions designed to exceed your expectations
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-luxe-dark-primary border border-luxe-dark-outline rounded-lg overflow-hidden hover:shadow-luxe-card transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxe-dark-primary/80 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-primary text-xl font-bold text-luxe-white-primary mb-3">
                  {service.title}
                </h3>
                <p className="font-secondary text-luxe-gray-secondary mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="w-2 h-2 bg-luxe-gold-accent rounded-full mr-3"></div>
                      <span className="font-secondary text-sm text-luxe-gray-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <Link to={service.link}>
                  <Button variant="link" className="p-0 h-auto text-luxe-gold-accent font-medium">
                    Learn More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection