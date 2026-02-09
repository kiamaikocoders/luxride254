import React from "react";

const ChauffeurProfilesSection = () => {
  const chauffeurs = [
    {
      name: "James Kariuki",
      experience: "8 years",
      image: "https://imagef2.promeai.pro/process/do/6038137dbd451914a5c25bd75903c212.webp?sourceUrl=/g/p/gallery/publish/2024/08/19/051646efd26648da8ef98dfcdf578673.jpg&x-oss-process=image/resize,w_500,h_500/format,webp&sign=de7e665eaa3342b0da0d19df4e868b44",
      specialty: "Executive Transport",
      bio: "Professional chauffeur with extensive experience in luxury transportation. Known for exceptional service and attention to detail.",
      rating: 5.0,
      trips: "2,500+"
    },
    {
      name: "Sarah Wanjiku",
      experience: "6 years",
      image: "https://img.freepik.com/premium-photo/african-american-business-woman-smiling-camera-generative-ai_741672-2310.jpg",
      specialty: "VIP Services",
      bio: "Dedicated to providing the highest level of service. Specializes in VIP and corporate client transportation.",
      rating: 5.0,
      trips: "1,800+"
    },
    {
      name: "David Ochieng",
      experience: "10 years",
      image: "https://static.vecteezy.com/system/resources/previews/039/633/047/non_2x/ai-generated-portrait-of-bearded-black-man-on-plan-background-photo.jpg",
      specialty: "Airport Transfers",
      bio: "Expert in navigating Nairobi's routes with precision. Ensures timely and comfortable airport transfers.",
      rating: 4.9,
      trips: "3,200+"
    },
    {
      name: "Grace Muthoni",
      experience: "7 years",
      image: "https://easy-peasy.ai/cdn-cgi/image/quality=70,format=auto,width=500/https://media.easy-peasy.ai/27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e/be9890c9-4c2a-4c85-83a7-0526a166c476.png",
      specialty: "Event Transportation",
      bio: "Specializes in weddings and special events. Known for making every journey memorable and stress-free.",
      rating: 5.0,
      trips: "2,100+"
    }
  ];

  return (
    <section className="py-20 section-gold-accent relative">
      {/* Top Border Separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
      {/* Bottom Border Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 scroll-fade-up">
          <h2 className="text-3xl md:text-4xl brand-heading mb-4">
            Meet Our Professional Chauffeurs
          </h2>
          <div className="h-1 w-20 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our team of experienced professionals is dedicated to providing you with exceptional service. 
            Each chauffeur is carefully selected, trained, and committed to your safety and comfort.
          </p>
        </div>

        {/* Chauffeur Grid - Better Spacing */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 scroll-stagger">
          {chauffeurs.map((chauffeur, index) => (
            <div
              key={index}
              className="card-enhanced p-6 text-center hover:shadow-card-hover active:shadow-card-hover active:scale-[0.98] transition-all touch-manipulation"
            >
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-yellow-400/20">
                  <img
                    src={chauffeur.image}
                    alt={chauffeur.name}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: '50% 25%' }}
                  />
                </div>
                {/* Rating Badge */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {chauffeur.rating}
                </div>
              </div>

              {/* Name & Experience */}
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{chauffeur.name}</h3>
              <p className="text-yellow-400 font-medium mb-2">{chauffeur.experience} Experience</p>
              <p className="text-sm text-gray-500 mb-4">{chauffeur.specialty}</p>

              {/* Bio */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{chauffeur.bio}</p>

              {/* Stats */}
              <div className="border-t border-gray-200 pt-4">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{chauffeur.trips}</div>
                <div className="text-xs text-gray-500">Completed Trips</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 scroll-fade-up">
          <p className="text-gray-600 mb-6">
            All our chauffeurs undergo rigorous background checks, professional training, and continuous evaluation.
          </p>
          <button
            onClick={() => {
              const contactSection = document.getElementById("contact");
              contactSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-gold-gradient text-gray-900 px-8 py-3 rounded-lg font-medium transition duration-200"
          >
            Join Our Team
          </button>
        </div>
      </div>

    </section>
  );
};

export default ChauffeurProfilesSection;
