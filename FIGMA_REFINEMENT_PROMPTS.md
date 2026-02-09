# Figma Design Refinement Prompts for LuxeRide VIP App

Use these prompts in Figma to refine your design and make it smoother. Apply them to specific screens or the entire design.

## 🎨 **GLOBAL DESIGN REFINEMENTS**

### **1. Color System Refinement**
```
Update all colors to match the exact LuxeRide brand:
- Primary Gold: #FFD700 (replace any yellow/gold variations)
- Background: #0a0a0a (pure black, not dark gray)
- Card Background: #1a1a1a (slightly lighter than background)
- Text Primary: #ffffff (pure white)
- Text Secondary: #71717a (medium gray)
- Borders: #27272a (subtle dark gray)
- Success: #10b981 (green)
- Error: #ef4444 (red)

Ensure all gold accents use #FFD700 consistently throughout all screens.
```

### **2. Typography Refinement**
```
Improve typography hierarchy:
- Headings: Use bold weight, increase letter spacing to 0.5px for luxury feel
- Body text: Ensure line height is 1.5x for readability
- Secondary text: Use #71717a color, slightly smaller size
- Button text: Bold, uppercase with letter spacing 1px
- Add consistent font sizes: 32px (h1), 24px (h2), 18px (h3), 16px (body), 14px (small)
```

### **3. Spacing & Layout Refinement**
```
Improve spacing consistency:
- Use 8px base unit: 8px, 16px, 24px, 32px, 48px spacing
- Add consistent padding: 16px for cards, 24px for screens
- Increase breathing room between sections (minimum 24px)
- Ensure all elements align to 8px grid
- Add consistent margins: 16px horizontal, 24px vertical between major sections
```

### **4. Component Polish**
```
Refine all components for premium feel:
- Increase border radius to 12px for buttons, 16px for cards
- Add subtle shadows: 0 2px 8px rgba(0,0,0,0.3) for cards
- Add hover states with slight scale (1.02x) and brighter gold
- Ensure all interactive elements have 48px minimum touch target
- Add smooth transitions: 200ms ease-in-out for all interactions
```

---

## 📱 **SCREEN-SPECIFIC REFINEMENTS**

### **Splash Screen**
```
Refine splash screen:
- Center LuxeRide logo with subtle fade-in animation
- Add elegant tagline below logo: "Premium Concierge Service" in gold (#FFD700)
- Use pure black background (#0a0a0a)
- Add subtle gradient overlay from center (gold glow effect)
- Ensure logo is large but not overwhelming (max 200px width)
```

### **Login & Sign Up Screens**
```
Refine authentication screens:
- Increase input field height to 56px for better touch targets
- Add gold border (2px) on input focus state
- Improve button styling: full-width gold button (#FFD700) with white bold text
- Add subtle background pattern or gradient for depth
- Ensure "Forgot Password" link is clearly visible in gold
- Add proper spacing between form fields (24px)
- Include password strength indicator for sign up
```

### **Package Selection Screen**
```
Refine package selection:
- Make package cards larger with more breathing room (32px spacing)
- Add premium card design: subtle gold border (1px), dark background (#1a1a1a)
- Highlight selected package with thicker gold border (3px) and subtle glow
- Improve typography: larger package names, clearer pricing
- Add feature icons for each package tier
- Include "Most Popular" badge on Platinum card
- Add smooth hover/selection animations
- Ensure cards are scrollable horizontally on mobile
```

### **Dashboard Screen**
```
Refine dashboard for premium feel:
- Add welcome message with user's name in gold
- Create circular progress ring for rides used (15/20) with gold fill
- Make "Request Ride" button more prominent: larger size, gold gradient, shadow
- Improve package badge: add icon, better typography, gold accent
- Add subtle card shadows and rounded corners (16px)
- Improve recent trips cards: add vehicle icons, better spacing
- Add quick action buttons for Airport Transfer and Security (if Diamond)
- Ensure all stats are clearly visible with proper hierarchy
- Add notification bell icon in header (if applicable)
```

### **Request Ride Screen**
```
Refine request ride screen:
- Make map full-screen with dark theme
- Add floating search bar at top with glassmorphism effect (semi-transparent)
- Create elegant bottom sheet (slides up) with rounded top corners (24px)
- Add service type selector: horizontal scrollable row with icons
  - Car icon for Ride
  - Plane icon for Airport Transfer
  - Boat icon for Speedboat
  - Helicopter icon for Helicopter
  - Shield icon for Security
- Improve input fields: larger, better spacing, gold focus state
- Add "Current Location" button with icon
- Include "Favorites" section for saved locations
- Add "Schedule for later" toggle with calendar icon
- Make "Request Ride" button sticky at bottom, full-width, gold
```

### **Ride Tracking Screen**
```
Refine ride tracking for real-time feel:
- Add pulsing animation to driver location marker (gold ring expanding)
- Create elegant route line with gold color (#FFD700)
- Add route progress indicator at top showing percentage complete
- Design expandable driver info card:
  - Driver photo (circular, 64px)
  - Name and rating (stars in gold)
  - Vehicle details with icon
  - Expand/collapse animation
- Add real-time ETA countdown with large, bold numbers
- Include trip status timeline at top:
  - Requested → Assigned → En Route → Picked Up → In Progress → Completed
  - Current step highlighted in gold
- Add "Call Driver" button with phone icon (gold background)
- Include cancel button (red) with confirmation dialog
- Add bottom sheet that slides up smoothly
- Ensure map is always visible, controls overlay on top
```

### **My Trips Screen**
```
Refine trips list:
- Add filter tabs at top: All, Active, Completed, Cancelled
- Improve trip cards:
  - Larger cards with better spacing (16px between cards)
  - Add map preview thumbnail
  - Include status badge with appropriate color
  - Add vehicle type icon
  - Show date/time prominently
  - Add "View Details" button (gold outline)
- Create empty state: elegant illustration with "No trips yet" message
- Add pull-to-refresh indicator
- Ensure smooth scrolling
- Add loading skeleton states
```

### **Trip Details Screen**
```
Refine trip details:
- Create elegant information hierarchy
- Add map preview at top (larger, rounded corners)
- Design timeline component showing trip stages
- Improve driver card: larger photo, better layout
- Add vehicle details section with icons
- Include receipt section with download button
- Add rating section (if completed) with star selector
- Ensure all information is clearly organized with proper spacing
```

### **Family Screen**
```
Refine family management:
- Add elegant header with "Add Member" button (gold, prominent)
- Improve family member cards:
  - Larger profile photos (circular, 64px)
  - Better layout with name, relationship, status
  - Add rides used indicator (progress bar)
  - Include edit/remove buttons (subtle, icon-only)
- Create empty state: illustration with "Add your first family member" CTA
- For Gold users: add upgrade prompt card with gold border
- Ensure smooth card animations
```

### **Profile Screen**
```
Refine profile screen:
- Create elegant profile header:
  - Large circular photo (120px) with gold border (3px)
  - Name and email clearly visible
  - Package badge prominently displayed
- Improve menu items:
  - Larger touch targets (56px height)
  - Add icons for each item (left side)
  - Add chevron icons (right side)
  - Gold accent on active/hover state
  - Proper spacing (16px between items)
- Make "Sign Out" clearly distinct (red color, separated)
- Add settings icon in header
```

### **Subscription Management Screen**
```
Refine subscription screen:
- Create prominent current subscription card:
  - Large package badge
  - Clear pricing and renewal date
  - Rides remaining with progress indicator
  - Gold border and subtle shadow
- Improve action buttons:
  - "Upgrade Package" (gold, prominent)
  - "Renew Subscription" (gold outline)
  - "Cancel Subscription" (red, subtle, at bottom)
- Add payment history section with elegant list
- Include billing information section
- Ensure all information is clearly organized
```

### **Payment Screen**
```
Refine payment screen:
- Add package summary card at top (what they're paying for)
- Improve payment method selector:
  - Larger cards with icons
  - Clear selection state (gold border)
  - M-Pesa: phone icon, phone input field
  - Card: card icon, card form fields
  - Bank Transfer: bank icon, account details
- Make total amount display prominent (large, bold, gold)
- Add "Pay Now" button (full-width, gold, large)
- Include security badges (SSL, secure payment icons)
- Add loading state for payment processing
```

---

## 🚗 **DRIVER APP REFINEMENTS**

### **Driver Map Screen**
```
Refine driver map:
- Make "Go Online/Offline" toggle more prominent:
  - Large circular button (80px)
  - Green when online, gray when offline
  - Add status text below
  - Smooth animation on toggle
- Improve trip assignment bottom sheet:
  - Customer name and photo prominently displayed
  - Clear pickup and destination addresses
  - Large "Accept Trip" button (gold)
  - ETA to pickup clearly visible
- Add navigation controls overlay
- Show earnings counter in header (if applicable)
- Ensure map is always full-screen, controls overlay
```

### **Active Trip Screen**
```
Refine active trip:
- Add clear trip status indicator at top (large, bold)
- Show route clearly with gold line
- Create prominent action buttons:
  - "Confirm Pickup" (green, large)
  - "Start Ride" (gold, large)
  - "Complete Ride" (gold, large)
- Add customer info card (expandable)
- Include distance and ETA display
- Add emergency contact button (red, always visible)
- Ensure navigation is always accessible
```

---

## 🎯 **INTERACTION & ANIMATION REFINEMENTS**

### **Smooth Transitions**
```
Add smooth animations throughout:
- Screen transitions: slide from right (200ms ease-in-out)
- Button presses: scale to 0.98x (100ms)
- Card hovers: scale to 1.02x, add shadow (200ms)
- Bottom sheet: slide up from bottom with spring animation
- Loading states: subtle pulse animation
- Status changes: fade in/out (300ms)
- Progress indicators: smooth fill animation
```

### **Micro-interactions**
```
Add micro-interactions for premium feel:
- Input focus: gold border expands smoothly
- Button hover: slight brightness increase
- Card selection: subtle scale and shadow increase
- Swipe gestures: smooth momentum scrolling
- Pull to refresh: elegant loading spinner
- Empty states: subtle fade-in animation
```

---

## 📐 **LAYOUT & STRUCTURE REFINEMENTS**

### **Bottom Navigation**
```
Refine bottom tab bar:
- Ensure height is 64px (not too small)
- Add subtle top border (1px, #27272a)
- Make active tab icon larger (28px vs 24px)
- Add gold underline or background for active tab
- Ensure icons are properly centered
- Add subtle shadow above tab bar
- Ensure safe area padding for notched devices
```

### **Headers**
```
Refine all screen headers:
- Consistent height: 56px
- Add back button with proper spacing
- Center titles properly
- Add action buttons (right side) with proper spacing
- Ensure header background matches app theme (#18181b)
- Add subtle bottom border (1px, #27272a)
```

### **Cards & Containers**
```
Refine all cards:
- Consistent border radius: 16px
- Subtle shadow: 0 2px 8px rgba(0,0,0,0.3)
- Proper padding: 16px minimum
- Gold border on selection (2px)
- Smooth hover/selection states
- Ensure proper spacing between cards (16px)
```

---

## 🎨 **VISUAL POLISH**

### **Icons**
```
Refine all icons:
- Use consistent icon style (Ionicons/outline style)
- Ensure proper sizing: 24px for tab bar, 20px for inline
- Active state: gold (#FFD700)
- Inactive state: gray (#71717a)
- Add proper spacing around icons (8px minimum)
```

### **Shadows & Depth**
```
Add depth to design:
- Cards: 0 2px 8px rgba(0,0,0,0.3)
- Buttons: 0 4px 12px rgba(255,215,0,0.2) for gold buttons
- Bottom sheets: 0 -4px 16px rgba(0,0,0,0.4)
- Floating elements: 0 8px 24px rgba(0,0,0,0.4)
- Ensure shadows are subtle, not overwhelming
```

### **Gradients & Effects**
```
Add subtle premium effects:
- Gold gradient on primary buttons (from #FFD700 to #FFC700)
- Subtle radial gradient on splash screen (gold glow)
- Glassmorphism on search bars (semi-transparent with blur)
- Subtle overlay on map screens (darken non-interactive areas)
```

---

## ✅ **FINAL CHECKLIST**

After applying refinements, ensure:
- [ ] All colors match brand guidelines exactly
- [ ] Consistent spacing throughout (8px grid)
- [ ] All text is readable (proper contrast)
- [ ] All touch targets are at least 48px
- [ ] Smooth animations on all interactions
- [ ] Proper hierarchy (what's important is prominent)
- [ ] Consistent component styling
- [ ] Mobile-first responsive design
- [ ] Dark theme throughout
- [ ] Gold accents used consistently
- [ ] Premium, luxury aesthetic maintained

---

## 🚀 **QUICK FIX PROMPTS**

If you need quick improvements, use these:

**"Make the design more premium and luxurious"**
**"Increase spacing and breathing room throughout"**
**"Make all gold accents consistent (#FFD700)"**
**"Improve button sizes and touch targets"**
**"Add smooth animations to all interactions"**
**"Refine typography for better hierarchy"**
**"Make the dark theme darker and more consistent"**
**"Add subtle shadows and depth to cards"**
**"Improve the bottom navigation bar design"**
**"Make all icons consistent in style and size"**

---

Use these prompts one at a time in Figma, focusing on specific screens or components. The key is consistency, proper spacing, and maintaining that premium luxury feel throughout the entire app.











