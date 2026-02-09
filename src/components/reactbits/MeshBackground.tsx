import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface MeshBackgroundProps {
  className?: string;
  colors?: string[];
  intensity?: number;
}

/**
 * MeshBackground Component
 * Animated mesh gradient background for hero sections
 * Inspired by ReactBits background patterns
 */
export const MeshBackground: React.FC<MeshBackgroundProps> = ({
  className,
  colors = ['#1a1a1a', '#2d2d2d', '#1a1a1a', '#3d3d3d'],
  intensity = 0.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create animated mesh gradient
    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      
      // Create gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2 + Math.sin(time) * 100,
        canvas.height / 2 + Math.cos(time) * 100,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height)
      );

      colors.forEach((color, index) => {
        gradient.addColorStop(index / (colors.length - 1), color);
      });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, [colors, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full', className)}
      style={{ opacity: intensity }}
    />
  );
};

export default MeshBackground;
