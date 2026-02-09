import React from 'react';
import { Quote, MapPin, Star } from 'lucide-react';

interface TeamCardProps {
    name: string;
    role: string;
    image: string;
    experience: string;
    favoriteRoute?: string;
    quote: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ name, role, image, experience, favoriteRoute, quote }) => {
    return (
        <div className="group relative bg-white rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2">
            {/* Card Shadow & Glow Effect */}
            <div className="absolute inset-0 rounded-xl shadow-luxe-card transition-shadow duration-500 group-hover:shadow-luxe-gold-glow opacity-50 group-hover:opacity-100 pointer-events-none" />

            {/* Image Container */}
            <div className="relative h-80 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover object-[center_top] transition-transform duration-700 group-hover:scale-110"
                    style={{ objectPosition: '50% 20%' }}
                />

                {/* Floating Info (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-luxe-gold-accent/90 text-white text-xs font-bold uppercase tracking-wider rounded-sm backdrop-blur-sm">
                            {role}
                        </span>
                        <span className="flex items-center text-white/90 text-xs font-medium">
                            <Star className="w-3 h-3 text-luxe-gold-accent fill-current mr-1" />
                            {experience}
                        </span>
                    </div>
                    <h3 className="text-2xl font-primary font-bold text-white mb-1">{name}</h3>
                </div>
            </div>

            {/* Expanded Content (Slide Up on Hover) */}
            <div className="relative bg-white p-6 border-t border-luxe-dark-outline/10">
                {/* Quote */}
                <div className="mb-4 relative">
                    <Quote className="absolute -top-2 -left-2 w-6 h-6 text-luxe-gold-accent/20 rotate-180" />
                    <p className="text-gray-700 text-sm italic leading-relaxed pl-4">
                        "{quote}"
                    </p>
                </div>

                {/* Favorite Route */}
                {favoriteRoute && (
                    <div className="flex items-start gap-3 pt-4 border-t border-luxe-dark-outline/10">
                        <div className="p-2 bg-luxe-gold-accent/10 rounded-full shrink-0">
                            <MapPin className="w-4 h-4 text-luxe-gold-accent" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Favorite Route</p>
                            <p className="text-sm text-gray-900 font-medium">{favoriteRoute}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamCard;
