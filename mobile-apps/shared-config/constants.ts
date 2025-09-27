// LuxeRide Brand Colors
export const LuxeRideColors = {
  primary: '#FFD700',        // Luxe Gold
  darkPrimary: '#18181b',    // Dark background
  white: '#ffffff',          // Primary text
  graySecondary: '#71717a',  // Secondary text
  darkOutline: '#27272a',    // Borders
  success: '#10b981',        // Success states
  warning: '#f59e0b',        // Warning states
  error: '#ef4444',          // Error states
  background: '#0a0a0a',     // App background
  card: '#1a1a1a',           // Card background
  muted: '#262626',          // Muted elements
};

// Package Types
export const PackageTypes = {
  GOLD: 'gold',
  PLATINUM: 'platinum', 
  DIAMOND: 'diamond',
} as const;

// Service Request Status
export const ServiceRequestStatus = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Trip Status
export const TripStatus = {
  REQUESTED: 'requested',
  ASSIGNED: 'assigned',
  PICKUP: 'pickup',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// User Roles
export const UserRoles = {
  USER: 'user',
  VIP_USER: 'vip_user',
  DRIVER: 'driver',
  ADMIN: 'admin',
  SECURITY: 'security',
} as const;

// Request Types
export const RequestTypes = {
  RIDE: 'ride',
  AIRPORT_TRANSFER: 'airport_transfer',
  SPEEDBOAT: 'speedboat',
  HELICOPTER: 'helicopter',
  SECURITY: 'security',
} as const;



