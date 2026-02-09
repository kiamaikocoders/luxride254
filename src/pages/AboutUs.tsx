import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import TeamCard from '@/components/TeamCard';
import { ArrowLeft, Heart, Users, Award, Target, Lightbulb, Play } from 'lucide-react';
import { GradientText, AnimatedButton, MeshBackground } from '@/components/reactbits';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white font-secondary">
      <Header />

      {/* Cinematic Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-bg.jpg"
            alt="Luxury Travel Experience"
            className="w-full h-full object-cover"
            style={{ filter: 'contrast(1.1) brightness(0.9)' }}
            onError={(e) => {
              // Fallback if image doesn't exist
              e.currentTarget.src = 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop';
            }}
          />
          {/* Enhanced Darkening Overlay for Better Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 z-10" />
          {/* Subtle Gold Accent Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-20" />
        </div>

        <div className="relative z-30 text-center px-4 max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center text-white/90 hover:text-luxe-gold-accent transition mb-8 backdrop-blur-md bg-black/40 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-primary font-bold mb-6 tracking-tight">
            <span className="text-white drop-shadow-2xl [text-shadow:_0_4px_12px_rgba(0,0,0,0.8)]">We Don't Just Drive.</span>
            <br />
            <span className="text-luxe-gold-accent drop-shadow-2xl [text-shadow:_0_4px_12px_rgba(0,0,0,0.6)]">We Care.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed font-light [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]">
            LuxeRide was born from a simple belief: that transportation should be
            more than a transaction. It should be a <span className="italic font-medium text-luxe-gold-accent">relationship</span>.
          </p>
        </div>
      </section>

      {/* Founder Story - "The Why" */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-luxe-gold-accent/5 -skew-x-12 transform translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Founder Image Composition */}
            <div className="relative">
              <div className="absolute -inset-4 bg-luxe-gold-accent/20 rounded-2xl transform -rotate-2" />
              <img
                src="/assets/ceo-samson-muga.png"
                alt="Samson Muga - Founder & CEO of LuxeRide"
                className="relative rounded-xl shadow-2xl w-full object-cover h-[600px]"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop';
                }}
              />
              <div className="absolute bottom-10 -right-10 bg-white p-8 rounded-lg shadow-xl max-w-xs hidden md:block">
                <p className="font-primary text-4xl text-luxe-gold-accent font-bold mb-2">10+</p>
                <p className="text-luxe-gray-secondary text-sm uppercase tracking-wider">Years of Excellence in Kenyan Transport</p>
              </div>
            </div>

            {/* Story Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-luxe-gold-accent font-bold tracking-widest uppercase text-sm mb-4">The Origin Story</h2>
                <h3 className="text-4xl md:text-5xl font-primary font-bold text-luxe-black-text mb-6 leading-tight">
                  "I was tired of seeing people treated like <span className="text-luxe-gold-accent underline decoration-luxe-gold-accent/30 underline-offset-8">cargo</span>."
                </h3>
              </div>

              <div className="space-y-6 text-lg text-luxe-gray-secondary leading-relaxed">
                <p>
                  It started on a rainy Tuesday in Nairobi. I watched a business executive, dressed for success,
                  standing in the mud, pleading with a driver who simply didn't care. That moment stuck with me.
                </p>
                <p>
                  I realized that while there were many cars in Kenya, there was very little
                  <span className="font-semibold text-luxe-black-text"> care</span>.
                </p>
                <p>
                  LuxeRide isn't about the leather seats (though ours are Italian). It's about the feeling
                  you get when the door is opened for you, when the temperature is exactly how you like it,
                  and when your driver knows the shortcut that saves you 20 minutes before you even ask.
                </p>
              </div>

              <div className="pt-6 border-t border-luxe-dark-outline/20">
                <p className="font-primary text-xl font-bold text-luxe-black-text">Samson Muga</p>
                <p className="text-luxe-gold-accent font-medium">Founder & CEO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values - "The Promise" */}
      <section className="py-24 bg-luxe-gray-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-primary font-bold text-luxe-black-text mb-6">
              Our Promise to You
            </h2>
            <div className="w-24 h-1 bg-luxe-gold-accent mx-auto" />
          </div>

          <div className="grid md:grid-cols-4 gap-10">
            {[
              { icon: Heart, title: "Care", desc: "We treat you like family, not a fare." },
              { icon: Award, title: "Excellence", desc: "Good enough is never enough for us." },
              { icon: Users, title: "Community", desc: "Building trust, one ride at a time." },
              { icon: Lightbulb, title: "Innovation", desc: "Always finding better ways to serve." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-luxe-card hover:-translate-y-2 transition-transform duration-300 group">
                <div className="w-14 h-14 bg-yellow-400/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-400 transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-yellow-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-luxe-black-text mb-3">{item.title}</h3>
                <p className="text-luxe-gray-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - "The People" */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-luxe-gold-accent font-bold tracking-widest uppercase text-sm mb-4">The Team</h2>
              <h3 className="text-4xl font-primary font-bold text-luxe-black-text mb-4">
                Meet the People Who Move You
              </h3>
              <p className="text-lg text-luxe-gray-secondary">
                Our chauffeurs are selected not just for their driving skills, but for their character.
              </p>
            </div>
            <Link to="/contact" className="hidden md:inline-flex items-center text-luxe-black-text font-bold hover:text-luxe-gold-accent transition">
              Join our team <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TeamCard
              name="David K."
              role="Senior Chauffeur"
              experience="8 Years"
              image="https://img.freepik.com/premium-photo/handsome-young-african-man-formalwear-looking-camera-smiling-while-standing-against-grey-wall_425904-1906.jpg"
              favoriteRoute="Westlands to Karen (The Scenic Way)"
              quote="I don't just drive cars; I curate peace of mind for my passengers."
            />
            <TeamCard
              name="Sarah M."
              role="Concierge Lead"
              experience="5 Years"
              image="https://easy-peasy.ai/cdn-cgi/image/quality=95,format=auto,width=800/https://media.easy-peasy.ai/27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e/12c67fa1-4b48-46e6-b513-fe75df1b20a7.png"
              favoriteRoute="Nairobi National Park Tour"
              quote="My job is to make sure you never have to worry about the details."
            />
            <TeamCard
              name="Michael O."
              role="Fleet Manager"
              experience="12 Years"
              image="https://img.freepik.com/premium-psd/generative-ai-portrait-only-one-man-white-background-created-by-ai_1132122-8387.jpg?w=360"
              favoriteRoute="Airport Express"
              quote="Safety isn't a checklist. It's a promise we keep every single day."
            />
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/contact" className="inline-flex items-center text-luxe-black-text font-bold hover:text-luxe-gold-accent transition">
              Join our team <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section with ReactBits Components */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Animated Mesh Background with Gold Accents */}
        <MeshBackground 
          className="opacity-30"
          colors={['#1a1a1a', '#2d2d2d', '#D4AF37', '#1a1a1a', '#B8941F']}
          intensity={0.3}
        />
        
        {/* Enhanced Gold Glow Effects */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-yellow-400/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-primary font-bold mb-8">
            <span className="text-white [text-shadow:_0_2px_12px_rgba(0,0,0,0.5)]">Ready to experience the </span>
            <GradientText 
              animate={true}
              gradient="gold"
              className="font-bold [text-shadow:_0_2px_12px_rgba(212,175,55,0.4)]"
            >
              difference?
            </GradientText>
          </h2>
          <p className="text-xl text-white mb-12 max-w-2xl mx-auto leading-relaxed [text-shadow:_0_2px_8px_rgba(0,0,0,0.5)]">
            Join the thousands of Nairobi professionals who have chosen to travel with dignity.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/vip-membership" className="inline-block">
              <AnimatedButton
                variant="gold"
                size="lg"
                className="shadow-xl hover:shadow-2xl hover:shadow-yellow-400/40"
            >
              Explore Memberships
              </AnimatedButton>
            </Link>
            <Link to="/contact" className="inline-block">
              <AnimatedButton
                variant="outline"
                size="lg"
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 shadow-lg"
            >
              Talk to Concierge
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
