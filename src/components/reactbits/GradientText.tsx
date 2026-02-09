import React from 'react';
import { cn } from '@/lib/utils';

export interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  gradient?: 'gold' | 'purple' | 'blue' | 'custom';
  customGradient?: string;
}

/**
 * GradientText Component
 * Enhanced text component with animated gradient effects
 * Compatible with ReactBits gradient text patterns
 */
export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className,
  animate = true,
  gradient = 'gold',
  customGradient,
}) => {
  const gradientClasses = {
    gold: 'bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#FFD700]',
    purple: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500',
    blue: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500',
    custom: '',
  };

  const gradientStyle = customGradient || gradientClasses[gradient];

  return (
    <span
      className={cn(
        'inline-block bg-clip-text text-transparent',
        animate && 'animate-gradient-text',
        !animate && gradientStyle,
        className
      )}
      style={
        customGradient && !animate
          ? {
              background: customGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }
          : undefined
      }
    >
      {children}
    </span>
  );
};

export default GradientText;
