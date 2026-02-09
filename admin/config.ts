// Admin Dashboard Configuration
export const ADMIN_CONFIG = {
  // Refresh intervals (in milliseconds)
  refreshIntervals: {
    metrics: 30000, // 30 seconds
    serviceRequests: 10000, // 10 seconds
    escalations: 15000, // 15 seconds
    mapLocations: 5000, // 5 seconds
  },
  
  // SLA targets (in milliseconds)
  slaTargets: {
    dispatchAssignment: 3 * 60 * 1000, // 3 minutes
    escalationResponse: {
      critical: 15 * 60 * 1000, // 15 minutes
      high: 30 * 60 * 1000, // 30 minutes
      medium: 2 * 60 * 60 * 1000, // 2 hours
      low: 24 * 60 * 60 * 1000, // 24 hours
    },
    disputeResolution: 48 * 60 * 60 * 1000, // 48 hours
    paymentVerification: 60 * 60 * 1000, // 1 hour
    refundProcessing: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Cancellation policy
  cancellationPolicy: {
    beforeAssignment: { refundPercent: 100, fee: 0 },
    afterAssignment: { refundPercent: 80, fee: 0 },
    afterDriverArrived: { refundPercent: 50, fee: 500 },
    afterRideStarted: { refundPercent: 0, fee: 0 },
  },
  
  // Payment split (for reference, not used in subscription model)
  paymentSplit: {
    owner: 0.5,
    driver: 0.32,
    platform: 0.18,
  },
  
  // Priority colors
  priorityColors: {
    critical: '#ef4444', // red
    high: '#f59e0b', // yellow/amber
    medium: '#3b82f6', // blue
    low: '#6b7280', // gray
  },
  
  // Status colors
  statusColors: {
    pending: '#f59e0b',
    assigned: '#3b82f6',
    in_progress: '#10b981',
    completed: '#10b981',
    cancelled: '#ef4444',
    open: '#ef4444',
    in_progress_status: '#3b82f6',
    resolved: '#10b981',
    closed: '#6b7280',
    rejected: '#ef4444',
  },
};

