import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'tilt' | 'glow' | 'scale';
  glassmorphism?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

/**
 * AnimatedCard Component
 * Enhanced card with various hover effects and animations
 * Inspired by ReactBits animated card patterns
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  hoverEffect = 'lift',
  glassmorphism = false,
  gradient = false,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // 3D Tilt Effect
  useEffect(() => {
    if (hoverEffect !== 'tilt' || !cardRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      setTilt({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 });
    };

    const card = cardRef.current;
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hoverEffect]);

  const hoverClasses = {
    lift: 'hover:-translate-y-2 hover:shadow-xl',
    tilt: '',
    glow: 'hover:shadow-luxe-gold-glow',
    scale: 'hover:scale-105',
  };

  const glassmorphismStyle = glassmorphism
    ? {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }
    : {};

  const gradientStyle = gradient
    ? {
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(244, 208, 63, 0.05) 100%)',
      }
    : {};

  return (
    <div
      ref={cardRef}
      className={cn(
        'card-enhanced transition-all duration-300',
        hoverEffect !== 'tilt' && hoverClasses[hoverEffect],
        className
      )}
      style={{
        transform:
          hoverEffect === 'tilt'
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
            : undefined,
        ...glassmorphismStyle,
        ...gradientStyle,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
