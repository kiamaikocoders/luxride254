# LuxeRide Brand Guide - Color Palette, Typography & Design System

## 🎨 Color Palette

### Primary Brand Colors

#### **Luxe Gold (Primary Accent)**
- **Hex**: `#D4AF37`
- **HSL**: `43 69% 52%`
- **Usage**: Primary brand color, CTAs, accents, highlights
- **Represents**: Luxury, premium, warmth
- **Tailwind Class**: `text-luxe-gold-accent`, `bg-luxe-gold-accent`

#### **Gold Variations**
- **Gold Primary**: `#D4AF37` (Main gold)
- **Gold Deep**: `#B8941F` (Darker shade)
- **Gold Light**: `#F4D03F` (Lighter shade)
- **Gold Pale**: `#F9E79F` (Very light/pastel)
- **Gold Star**: `#FFC107` (For ratings/stars)

### Background Colors

#### **Pure White** (Primary Background)
- **Hex**: `#FFFFFF`
- **HSL**: `0 0% 100%`
- **Usage**: Main background, cards, clean modern feel
- **Tailwind Class**: `bg-white`, `bg-luxe-white-primary`

#### **Light Mode Colors** (Current Default)
- **Background**: `#FFFFFF` (Pure White)
- **Text Primary**: `#1A1A1A` (Dark text - 10% black)
- **Text Secondary**: `#999999` (Medium gray - 60% gray)
- **Borders/Outlines**: `#E6E6E6` (Light gray - 90% gray)
- **Footer Background**: `#FAFAFA` (Very light gray - 98% gray)
- **Social Icons Background**: `#F2F2F2` (Light gray - 95% gray)

### Text Colors

- **Primary Text**: `#1A1A1A` (Dark, high contrast)
- **Secondary Text**: `#999999` (Medium gray)
- **Brand Heading Color**: `#2D2D2D` (Dark grey for headings)
- **Brand Text Secondary**: `#4A4A4A` (Medium grey for secondary text)

### Semantic Colors

- **Success**: Green (for positive actions)
- **Warning**: Yellow/Orange (for cautions)
- **Error/Destructive**: Red `hsl(0 84.2% 60.2%)`
- **Info**: Blue (for informational messages)

---

## 📝 Typography

### Font Families

#### **Primary Font - Montserrat**
- **Usage**: Headings, Display text
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extra Bold), 900 (Black)
- **Style**: Modern, elegant, professional
- **Tailwind Class**: `font-primary`

#### **Secondary Font - Open Sans**
- **Usage**: Body text, paragraphs, descriptions
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Style**: Clean, readable, friendly
- **Tailwind Class**: `font-secondary`

#### **Heading Font - Oswald**
- **Usage**: Brand headings, section titles (uppercase)
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Style**: Bold, impactful, uppercase styling
- **Tailwind Class**: `brand-heading` (includes uppercase, letter-spacing, color)

#### **Calligraphic Font - Playfair Display**
- **Usage**: LuxeRide brand logo text, calligraphic elements
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extra Bold), 900 (Black)
- **Style**: Elegant, serif, calligraphic
- **Tailwind Class**: `luxe-brand-text`

### Typography Hierarchy

#### **Brand Headings** (`.brand-heading`)
- Font: Oswald
- Color: `#2D2D2D`
- Weight: 600 (Semibold)
- Letter Spacing: `0.02em`
- Transform: Uppercase
- Usage: Section titles, major headings

#### **Calligraphic Brand Text** (`.luxe-brand-text`)
- Font: Playfair Display
- Weight: 900 (Black)
- Responsive Sizes:
  - Mobile: `4rem` (64px)
  - Tablet (640px+): `5rem` (80px)
  - Desktop (1024px+): `6rem` (96px)
  - Large (1280px+): `7rem` (112px)
- Line Height: 1
- Letter Spacing: `-0.02em`

#### **LUXE Part** (`.luxe-part`)
- Gold gradient text effect
- Gradient: `#D4AF37 → #F4D03F → #FFD700`
- Drop shadow for depth

#### **RIDE Part** (`.ride-part`)
- Color: `#1A1A1A` (Dark gray)
- Drop shadow for depth

---

## 🎯 Brand Identity

### Brand Promise
**"From Transactional to Relational"** - LuxeRide is not just transportation, it's a human experience.

### Core Values
- **Client Equity**: Premium service for all
- **Competence**: Professional excellence
- **Care**: Attention to detail and comfort
- **Solution-Oriented**: Innovative approaches

### Visual Identity
- **Style**: Clean, modern, premium luxury
- **Aesthetic**: Bright white backgrounds, generous whitespace
- **Feel**: Personal, not pretentious; warm, not cold

---

## 🎨 Design System

### Spacing System
- **XS**: `8px`
- **SM**: `16px`
- **MD**: `24px`
- **LG**: `48px`
- **XL**: `80px`
- **XXL**: `120px`

### Border Radius
- **Small**: `4px`
- **Medium**: `8px`
- **Large**: `12px` (default: `0.5rem`)
- **Circle**: `50%`

### Shadows

#### **Card Shadows**
- **Default**: Multi-layer shadow system
  - `0 2px 8px rgba(0, 0, 0, 0.04)`
  - `0 8px 24px rgba(0, 0, 0, 0.06)`
  - `0 16px 48px rgba(0, 0, 0, 0.04)`
- **Hover**: Enhanced with gold glow
  - `0 8px 32px rgba(212, 175, 55, 0.12)`
  - `0 16px 64px rgba(0, 0, 0, 0.08)`

#### **Button Shadows**
- **Hover**: Gold glow effect
  - `0 2px 8px rgba(212, 175, 55, 0.18)`
  - `0 4px 16px rgba(212, 175, 55, 0.12)`

#### **Gold Glow**
- **Standard**: `0 0 20px rgba(212, 175, 55, 0.2)`
- **Large**: `0 0 40px rgba(212, 175, 55, 0.3)`

### Gradients

#### **Gold Gradient** (Buttons, CTAs)
- `linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)`
- **Hover**: `linear-gradient(135deg, #C5A028 0%, #E6C84A 100%)`

#### **Section Backgrounds**
- **Gold Tint**: `linear-gradient(to bottom, #FFF9E6 0%, #FFFFFF 100%)`
- **Gold Accent**: `linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(255, 255, 255, 1) 100%)`

### Section Background Variations

- **`.section-alternate`**: `#FAFAFA` (Very light gray)
- **`.section-gold-tint`**: Gold-tinted gradient
- **`.section-dark`**: `#1A1A1A` (Dark background)
- **`.section-gold-accent`**: Subtle gold gradient
- **`.section-separator`**: Gold border separators

---

## 💻 Usage in Code

### Tailwind CSS Classes

#### **Colors**
```tsx
// Gold
text-luxe-gold-accent
bg-luxe-gold-accent
border-luxe-gold-accent

// Text
text-luxe-black-text
text-luxe-gray-secondary

// Backgrounds
bg-luxe-white-primary
bg-luxe-gray-footer
```

#### **Typography**
```tsx
// Font families
font-primary      // Montserrat
font-secondary   // Open Sans

// Brand headings
brand-heading    // Oswald, uppercase, #2D2D2D
brand-heading-light  // Lighter weight variant

// Brand text
luxe-brand-text  // Playfair Display, calligraphic
luxe-part        // Gold gradient text
ride-part        // Dark gray text
```

#### **Components**
```tsx
// Buttons
btn-gold-gradient  // Gold gradient button

// Cards
card-enhanced      // Enhanced card with shadows

// Shadows
shadow-luxe-card
shadow-luxe-gold-glow
```

---

## 📊 Color Usage Guidelines

### When to Use Gold (`#D4AF37`)
- ✅ Primary CTAs and buttons
- ✅ Accent highlights
- ✅ Icon colors for emphasis
- ✅ Hover states
- ✅ Brand elements (logo, headings)
- ✅ Progress indicators
- ✅ Star ratings

### When to Use White (`#FFFFFF`)
- ✅ Primary backgrounds
- ✅ Card backgrounds
- ✅ Clean, modern aesthetic
- ✅ Maximum contrast for readability

### When to Use Dark Text (`#1A1A1A`)
- ✅ Primary body text
- ✅ Headings (with brand-heading class)
- ✅ High contrast requirements

### When to Use Gray (`#999999`)
- ✅ Secondary text
- ✅ Muted information
- ✅ Supporting content
- ✅ Placeholder text

---

## 🎨 Current Implementation Notes

- **Default Theme**: Light mode (white backgrounds)
- **Gold Standard**: `#D4AF37` is the primary gold color
- **Yellow-400/500**: Used as Tailwind equivalents (`yellow-400` ≈ `#FACC15`, `yellow-500` ≈ `#EAB308`)
- **Recommendation**: Use `luxe-gold-accent` CSS variables or `yellow-400`/`yellow-500` for consistency with Tailwind utilities

---

## 📱 Responsive Typography

Brand text scales responsively:
- Mobile: 4rem (64px)
- Tablet: 5rem (80px)
- Desktop: 6rem (96px)
- Large Desktop: 7rem (112px)

---

This guide represents the complete LuxeRide brand system as defined in the codebase.
