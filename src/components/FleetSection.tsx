import { Button } from "@/components/ui/luxe-button"

const FleetSection = () => {
  const vehicles = [
    {
      category: "Ultra Luxury",
      name: "Mercedes-Benz S-Class",
      price: "From KSH 8,000",
      period: "/hour",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "Premium Leather Interior",
        "Professional Chauffeur",
        "Wi-Fi & Entertainment",
        "Climate Control",
        "Refreshment Service"
      ]
    },
    {
      category: "Executive Sedan",
      name: "BMW 7 Series",
      price: "From KSH 6,500",
      period: "/hour",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "Luxury Appointments",
        "Experienced Driver",
        "Business Amenities",
        "Sound Insulation",
        "Mobile Charging"
      ]
    },
    {
      category: "Premium SUV",
      name: "Range Rover Vogue",
      price: "From KSH 7,200",
      period: "/hour",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "All-Terrain Capability",
        "Spacious Interior",
        "Advanced Safety",
        "Panoramic Sunroof",
        "Premium Audio System"
      ]
    }
  ]

  return (
    <section className="py-luxe-xxl bg-luxe-dark-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-primary text-3xl md:text-4xl lg:text-5xl font-bold text-luxe-white-primary mb-6">
            Premium Fleet
          </h2>
          <p className="font-secondary text-lg text-luxe-gray-secondary max-w-3xl mx-auto">
            Choose from our carefully curated selection of luxury vehicles, each maintained to the highest standards
          </p>
        </div>

        {/* Vehicle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => (
            <div 
              key={index}
              className="bg-luxe-dark-primary border border-luxe-dark-outline rounded-lg overflow-hidden hover:shadow-luxe-card transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxe-dark-primary/80 to-transparent"></div>
                
                {/* Category Tag */}
                <div className="absolute top-4 left-4 bg-luxe-gold-accent text-luxe-white-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {vehicle.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-primary text-xl font-bold text-luxe-white-primary mb-2">
                  {vehicle.name}
                </h3>
                
                <div className="font-primary text-lg font-semibold text-luxe-gold-accent mb-4">
                  {vehicle.price}
                  <span className="text-sm text-luxe-gray-secondary font-normal">{vehicle.period}</span>
                </div>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {vehicle.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="w-2 h-2 bg-luxe-gold-accent rounded-full mr-3"></div>
                      <span className="font-secondary text-sm text-luxe-gray-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                <Button variant="premium" className="w-full">
                  Select Vehicle
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FleetSection