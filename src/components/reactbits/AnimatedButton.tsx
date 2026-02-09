import React from 'react';
import { cn } from '@/lib/utils';

export interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  children: React.ReactNode;
}

/**
 * AnimatedButton Component
 * Enhanced button with smooth animations and hover effects
 * Compatible with ReactBits button patterns
 */
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'gold',
  size = 'md',
  animate = true,
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    gold: 'btn-gold-gradient text-gray-900',
    outline: 'border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900',
    ghost: 'text-yellow-400 hover:bg-yellow-400/10',
    dark: 'bg-gray-900 text-white hover:bg-gray-800',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-all duration-300',
        animate && 'hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;
