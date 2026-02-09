# ReactBits Integration Guide

## Overview

This document outlines the centralized animation system and ReactBits component integration for the LuxeRide application.

## Architecture

### 1. Centralized Animation System

**Location:** `/src/utils/animations.ts` and `/src/styles/animations.css`

The animation system provides:
- Reusable animation classes
- Scroll-triggered animations via IntersectionObserver
- Animation presets for common use cases
- Performance optimizations (will-change, reduced motion support)

#### Usage Example:

```typescript
import { animationPresets, animationClasses } from '@/utils/animations';

// Use presets
<div className={animationPresets.hero.title}>Title</div>

// Use individual classes
<div className={animationClasses.fadeInDelay1}>Content</div>
```

### 2. ReactBits Component Library

**Location:** `/src/components/reactbits/`

Enhanced UI components inspired by ReactBits patterns, integrated with the LuxeRide design system.

#### Available Components:

1. **GradientText** - Animated gradient text effects
   ```tsx
   <GradientText animate={true} gradient="gold">
     Our Commitment
   </GradientText>
   ```

2. **AnimatedCard** - Cards with various hover effects
   ```tsx
   <AnimatedCard hoverEffect="tilt" glassmorphism={true}>
     Card content
   </AnimatedCard>
   ```

3. **AnimatedButton** - Enhanced buttons with smooth animations
   ```tsx
   <AnimatedButton variant="gold" size="lg" animate={true}>
     Click Me
   </AnimatedButton>
   ```

4. **MeshBackground** - Animated mesh gradient backgrounds
   ```tsx
   <MeshBackground 
     colors={['#1a1a1a', '#2d2d2d']}
     intensity={0.5}
   />
   ```

## Implementation Status

### ✅ Completed

1. **Centralized Animation System**
   - Created `/src/utils/animations.ts` with utilities
   - Created `/src/styles/animations.css` with all keyframes
   - Integrated into `index.css`

2. **ReactBits Components**
   - GradientText component
   - AnimatedCard component
   - AnimatedButton component
   - MeshBackground component

3. **Hero Section Enhancement**
   - Integrated GradientText for headline
   - Integrated AnimatedButton for CTAs
   - Added MeshBackground overlay
   - Removed duplicate animation styles

### 🚧 In Progress

- Testing and verification
- Performance optimization
- Mobile responsiveness checks

### 📋 Next Steps

1. **Package Cards Enhancement**
   - Add 3D tilt effect to package cards
   - Implement glassmorphism for premium feel
   - Add animated pricing reveals

2. **Trust Section Enhancement**
   - Animated icons on scroll
   - Counter animations for statistics
   - Progressive reveal animations

3. **Testimonials Enhancement**
   - Carousel with smooth transitions
   - Card flip animations
   - Staggered entrance animations

4. **Fleet Section Enhancement**
   - Image hover effects
   - Parallax scrolling
   - Interactive image galleries

## Migration Guide

### Replacing Inline Animations

**Before:**
```tsx
<style jsx>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
`}</style>
```

**After:**
```tsx
import { animationClasses } from '@/utils/animations';

<div className={animationClasses.fadeIn}>Content</div>
```

### Using Animation Presets

**Before:**
```tsx
<h1 className="animate-fade-in-delay-1">Title</h1>
<p className="animate-fade-in-delay-2">Subtitle</p>
```

**After:**
```tsx
import { animationPresets } from '@/utils/animations';

<h1 className={animationPresets.hero.title}>Title</h1>
<p className={animationPresets.hero.subtitle}>Subtitle</p>
```

## Best Practices

1. **Always use centralized animations** - Don't create inline animation styles
2. **Use presets when available** - They're optimized and consistent
3. **Respect reduced motion** - All animations support `prefers-reduced-motion`
4. **Test performance** - Use browser DevTools to monitor animation performance
5. **Mobile optimization** - Test animations on mobile devices

## Performance Considerations

- All animations use `will-change` for GPU acceleration
- Animations respect `prefers-reduced-motion` for accessibility
- Scroll animations use IntersectionObserver for efficiency
- MeshBackground uses requestAnimationFrame for smooth animations

## Troubleshooting

### Animations not working?
- Check that `animations.css` is imported in `index.css`
- Verify animation classes are applied correctly
- Check browser console for errors

### Components not importing?
- Verify path aliases are configured (`@/` should resolve to `src/`)
- Check that components are exported from `index.ts`

### Performance issues?
- Reduce animation intensity
- Use `will-change` sparingly
- Consider disabling animations on low-end devices

## Resources

- [ReactBits Documentation](https://reactbits.dev)
- [Tailwind CSS Animations](https://tailwindcss.com/docs/animation)
- [CSS Animations Best Practices](https://web.dev/animations/)
