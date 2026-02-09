// Admin Dashboard Types
export interface ServiceRequest {
  id: string;
  user_id: string;
  subscription_id?: string;
  request_type: 'ride' | 'airport_transfer' | 'speedboat' | 'charter' | 'helicopter';
  pickup_location?: any;
  pickup_address?: string;
  destination?: any;
  destination_address?: string;
  requested_at: string;
  scheduled_for?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assigned_driver_id?: string;
  assigned_vehicle_id?: string;
  assigned_security_id?: string;
  special_requests?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: User;
  driver?: Driver;
  vehicle?: Vehicle;
  security?: SecurityPersonnel;
  subscription?: PackageSubscription;
}

export interface Escalation {
  id: string;
  service_request_id: string;
  type: 'dispatch_timeout' | 'payment_failure' | 'driver_timeout' | 'ride_timeout' | 'verification_failure' | 'user_complaint' | 'driver_issue' | 'technical_problem';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  description?: string;
  resolved_by?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  service_request?: ServiceRequest;
}

export interface Dispute {
  id: string;
  service_request_id: string;
  user_id: string;
  type: 'fare_discrepancy' | 'service_quality' | 'route_issue' | 'driver_behavior' | 'vehicle_issue' | 'cancellation' | 'other';
  description: string;
  requested_refund_amount?: number;
  status: 'open' | 'under_review' | 'resolved' | 'rejected';
  assigned_to?: string;
  resolution_type?: 'full_refund' | 'partial_refund' | 'no_refund' | 'credit';
  refund_amount?: number;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  service_request?: ServiceRequest;
  user?: User;
}

export interface Cancellation {
  id: string;
  service_request_id: string;
  cancelled_by: 'user' | 'driver' | 'admin' | 'system';
  cancelled_by_user_id?: string;
  cancellation_stage: 'before_assignment' | 'after_assignment' | 'after_driver_arrived' | 'after_ride_started';
  cancellation_reason?: string;
  original_fare?: number;
  cancellation_fee: number;
  refund_amount?: number;
  refund_status: 'pending' | 'processed' | 'not_applicable';
  refund_processed_at?: string;
  created_at: string;
  service_request?: ServiceRequest;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  subscription_id?: string;
  service_request_id?: string;
  transaction_type: 'ride_used' | 'ride_refunded' | 'subscription_payment' | 'refund' | 'adjustment' | 'promotional_credit';
  amount?: number;
  balance_before?: number;
  balance_after?: number;
  description?: string;
  metadata?: any;
  created_at: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'user' | 'driver' | 'admin' | 'security';
  profile_photo?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  user_id: string;
  license_number?: string;
  experience_years?: number;
  certifications?: any;
  languages?: string[];
  status?: string;
  rating?: number;
  background_check_status?: string;
  training_status?: string;
  vehicle_id?: string;
  current_location?: any;
  is_online: boolean;
  last_updated: string;
  user?: User;
  vehicle?: Vehicle;
}

export interface Vehicle {
  id: string;
  owner_id?: string;
  driver_id?: string;
  make?: string;
  model?: string;
  year?: number;
  license_plate?: string;
  category?: string;
  status?: string;
  amenities?: any;
  last_maintenance?: string;
  tracking_device_id?: string;
  owner?: User;
  driver?: Driver;
}

export interface SecurityPersonnel {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  years_experience?: number;
  certifications?: string[];
  specializations?: string[];
  status: 'active' | 'inactive';
  rating?: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface PackageSubscription {
  id: string;
  user_id: string;
  package_type: 'gold' | 'platinum' | 'diamond' | 'corporate_gold' | 'corporate_platinum' | 'corporate_diamond';
  monthly_fee: number;
  rides_included: number;
  rides_used: number;
  security_included: boolean;
  family_members_allowed: number;
  family_members_added: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'suspended' | 'cancelled';
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface ActivityLog {
  id: string;
  icon?: string;
  color?: string;
  username?: string;
  action?: string;
  time: string;
}

export interface DashboardStats {
  pending_requests: number;
  active_rides: number;
  escalations_count: number;
  open_disputes: number;
  online_drivers: number;
  available_vehicles: number;
  total_users: number;
  total_drivers: number;
  total_vehicles: number;
  total_trips: number;
}

