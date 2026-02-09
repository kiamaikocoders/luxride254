/**
 * Centralized Animation Utilities
 * Provides reusable animation classes and utilities for consistent animations across the app
 */

export const animationClasses = {
  // Fade in animations with delays
  fadeIn: 'animate-fade-in',
  fadeInDelay1: 'animate-fade-in-delay-1',
  fadeInDelay2: 'animate-fade-in-delay-2',
  fadeInDelay3: 'animate-fade-in-delay-3',
  fadeInDelay4: 'animate-fade-in-delay-4',
  
  // Slide animations
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  
  // Scale animations
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  
  // Rotate animations
  rotateIn: 'animate-rotate-in',
  
  // Stagger animations for lists
  stagger: 'animate-stagger',
} as const;

/**
 * Animation delay utilities
 */
export const getStaggerDelay = (index: number, baseDelay: number = 0.1): string => {
  return `animation-delay: ${index * baseDelay}s;`;
};

/**
 * Intersection Observer setup for scroll animations
 */
export const setupScrollAnimations = (
  selector: string = '.animate-on-scroll',
  options: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
) => {
  if (typeof window === 'undefined') return () => {};

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add visible class for scroll-triggered animations
        entry.target.classList.add('animate-visible');
        entry.target.classList.add('visible');
        
        // For fade-in animations, also add the visible class
        if (entry.target.classList.contains('animate-fade-in') || 
            entry.target.classList.contains('animate-fade-in-delay-1') ||
            entry.target.classList.contains('animate-fade-in-delay-2') ||
            entry.target.classList.contains('animate-fade-in-delay-3')) {
          entry.target.classList.add('animate-fade-in-visible');
        }
      }
    });
  }, options);

  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
};

/**
 * Enhanced scroll animation hook with custom configuration
 */
export const useScrollAnimation = (options?: IntersectionObserverInit) => {
  if (typeof window === 'undefined') return;

  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px',
    ...options
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, defaultOptions);

  // Select all elements with scroll animation classes
  const animatedElements = document.querySelectorAll(
    '.scroll-fade-up, .scroll-fade-down, .scroll-fade-left, .scroll-fade-right, .scroll-fade-in, .scroll-stagger, .animate-on-scroll'
  );

  animatedElements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
};

/**
 * Animation presets for common use cases
 */
export const animationPresets = {
  hero: {
    container: animationClasses.fadeIn,
    title: animationClasses.fadeInDelay1,
    subtitle: animationClasses.fadeInDelay2,
    cta: animationClasses.fadeInDelay4,
  },
  card: {
    container: animationClasses.fadeIn,
    image: animationClasses.fadeInDelay1,
    content: animationClasses.fadeInDelay2,
  },
  grid: {
    item: (index: number) => `animate-fade-in-delay-${Math.min(index + 1, 4)}`,
  },
} as const;
