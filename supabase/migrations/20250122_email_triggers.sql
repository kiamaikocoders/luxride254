-- ============================================================================
-- Email Trigger Functions and Triggers
-- ============================================================================
-- This migration creates database triggers that automatically send emails
-- via Supabase Edge Functions when specific events occur in the database.
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================================================
-- Helper Function: Call Edge Function via HTTP
-- ============================================================================
CREATE OR REPLACE FUNCTION call_email_edge_function(
  function_name TEXT,
  payload JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  supabase_url TEXT;
  supabase_anon_key TEXT;
BEGIN
  -- Get Supabase URL and anon key from environment
  supabase_url := current_setting('app.settings.supabase_url', true);
  supabase_anon_key := current_setting('app.settings.supabase_anon_key', true);
  
  -- Fallback to default if not set (you should set these via Supabase dashboard)
  IF supabase_url IS NULL THEN
    supabase_url := 'https://eepcddbdvfhmeouzkpsb.supabase.co';
  END IF;
  
  IF supabase_anon_key IS NULL THEN
    supabase_anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlcGNkZGJkdmZobWVvdXprcHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzUwOTEsImV4cCI6MjA2NTk1MTA5MX0.BWINVlYppSOvs0EVyimhYgoday3Dv1UoqA5Z5gqwZGc';
  END IF;
  
  -- Call edge function via pg_net (non-blocking HTTP request)
  PERFORM
    net.http_post(
      url := supabase_url || '/functions/v1/' || function_name,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || supabase_anon_key
      ),
      body := payload
    );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE WARNING 'Error calling edge function %: %', function_name, SQLERRM;
END;
$$;

-- ============================================================================
-- APPLICATION FORM SUBMISSION TRIGGERS
-- ============================================================================

-- Trigger: Driver Application Submitted
CREATE OR REPLACE FUNCTION send_driver_application_received_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
BEGIN
  -- Only send email on INSERT (new application)
  IF TG_OP = 'INSERT' THEN
    payload := jsonb_build_object(
      'userEmail', NEW.email,
      'userName', NEW.applicant_name,
      'applicationId', NEW.id::text,
      'applicationDate', NEW.created_at::text,
      'phone', NEW.phone,
      'licenseNumber', NEW.license_number
    );
    
    PERFORM call_email_edge_function('driver-application-received', payload);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_driver_application_received
  AFTER INSERT ON driver_applications
  FOR EACH ROW
  EXECUTE FUNCTION send_driver_application_received_email();

-- Trigger: Car Owner Application Submitted
CREATE OR REPLACE FUNCTION send_car_owner_application_received_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    payload := jsonb_build_object(
      'userEmail', NEW.email,
      'userName', NEW.applicant_name,
      'applicationId', NEW.id::text,
      'applicationDate', NEW.created_at::text,
      'phone', NEW.phone,
      'applicationType', NEW.type,
      'vehicleCount', NEW.vehicle_count
    );
    
    PERFORM call_email_edge_function('car-owner-application-received', payload);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_car_owner_application_received
  AFTER INSERT ON partner_applications
  FOR EACH ROW
  EXECUTE FUNCTION send_car_owner_application_received_email();

-- Trigger: Corporate Application Submitted
CREATE OR REPLACE FUNCTION send_corporate_application_received_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    payload := jsonb_build_object(
      'userEmail', NEW.email,
      'userName', NEW.contact_person,
      'companyName', NEW.company_name,
      'applicationId', NEW.id::text,
      'applicationDate', NEW.created_at::text,
      'phone', NEW.phone,
      'employeeCount', NEW.employee_count
    );
    
    PERFORM call_email_edge_function('corporate-application-received', payload);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_corporate_application_received
  AFTER INSERT ON corporate_accounts
  FOR EACH ROW
  EXECUTE FUNCTION send_corporate_application_received_email();

-- ============================================================================
-- APPLICATION STATUS CHANGE TRIGGERS
-- ============================================================================

-- Trigger: Driver Application Status Changed
CREATE OR REPLACE FUNCTION send_driver_application_status_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
BEGIN
  -- Only send email when status changes to approved or rejected
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status IN ('approved', 'rejected') THEN
    payload := jsonb_build_object(
      'driverEmail', NEW.email,
      'driverName', NEW.applicant_name,
      'applicationId', NEW.id::text,
      'status', NEW.status,
      'onboardingUrl', CASE WHEN NEW.status = 'approved' THEN 'https://luxeride.org/onboarding' ELSE NULL END,
      'rejectionReason', CASE WHEN NEW.status = 'rejected' THEN COALESCE(NEW.review_notes, 'Application did not meet our requirements') ELSE NULL END
    );
    
    PERFORM call_email_edge_function('driver-application-status', payload);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_driver_application_status
  AFTER UPDATE ON driver_applications
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION send_driver_application_status_email();

-- Trigger: Car Owner Application Status Changed
CREATE OR REPLACE FUNCTION send_car_owner_application_status_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    IF NEW.status = 'approved' THEN
      payload := jsonb_build_object(
        'userEmail', NEW.email,
        'userName', NEW.applicant_name,
        'applicationId', NEW.id::text,
        'onboardingUrl', 'https://luxeride.org/partner-onboarding'
      );
      
      PERFORM call_email_edge_function('car-owner-partnership-approved', payload);
      
    ELSIF NEW.status = 'rejected' THEN
      payload := jsonb_build_object(
        'userEmail', NEW.email,
        'userName', NEW.applicant_name,
        'applicationId', NEW.id::text,
        'rejectionReason', COALESCE(NEW.review_notes, 'Application did not meet our requirements')
      );
      
      PERFORM call_email_edge_function('car-owner-partnership-rejected', payload);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_car_owner_application_status
  AFTER UPDATE ON partner_applications
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION send_car_owner_application_status_email();

-- Trigger: Corporate Application Status Changed
CREATE OR REPLACE FUNCTION send_corporate_application_status_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    IF NEW.status = 'active' THEN
      payload := jsonb_build_object(
        'userEmail', NEW.email,
        'userName', NEW.contact_person,
        'companyName', NEW.company_name,
        'applicationId', NEW.id::text,
        'onboardingUrl', 'https://luxeride.org/corporate-onboarding'
      );
      
      PERFORM call_email_edge_function('corporate-account-approved', payload);
      
    ELSIF NEW.status = 'terminated' THEN
      payload := jsonb_build_object(
        'userEmail', NEW.email,
        'userName', NEW.contact_person,
        'companyName', NEW.company_name,
        'applicationId', NEW.id::text,
        'terminationReason', COALESCE(NEW.review_notes, 'Account terminated')
      );
      
      PERFORM call_email_edge_function('corporate-account-rejected', payload);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_corporate_application_status
  AFTER UPDATE ON corporate_accounts
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION send_corporate_application_status_email();

-- ============================================================================
-- TRIP/BOOKING STATUS CHANGE TRIGGERS
-- ============================================================================

-- Trigger: Ride Request Confirmation (when booking is created)
CREATE OR REPLACE FUNCTION send_ride_request_confirmation_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
  user_email TEXT;
  user_name TEXT;
  driver_name TEXT;
  driver_phone TEXT;
  vehicle_make TEXT;
  vehicle_model TEXT;
  vehicle_plate TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Get user email and name
    SELECT email, full_name INTO user_email, user_name
    FROM auth.users
    WHERE id = NEW.user_id;
    
    -- Get driver info if assigned
    IF NEW.driver_id IS NOT NULL THEN
      SELECT d.full_name, d.phone INTO driver_name, driver_phone
      FROM drivers d
      WHERE d.id = NEW.driver_id;
    END IF;
    
    -- Get vehicle info if assigned
    IF NEW.vehicle_id IS NOT NULL THEN
      SELECT v.make, v.model, v.license_plate INTO vehicle_make, vehicle_model, vehicle_plate
      FROM vehicles v
      WHERE v.id = NEW.vehicle_id;
    END IF;
    
    payload := jsonb_build_object(
      'userEmail', COALESCE(user_email, ''),
      'userName', COALESCE(user_name, 'User'),
      'tripId', NEW.id::text,
      'pickupLocation', NEW.pickup_location,
      'dropoffLocation', NEW.dropoff_location,
      'pickupTime', NEW.pickup_time::text,
      'vehicleType', COALESCE(vehicle_make || ' ' || vehicle_model, 'Premium'),
      'driverName', driver_name,
      'driverPhone', driver_phone
    );
    
    PERFORM call_email_edge_function('ride-request-confirmation', payload);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_ride_request_confirmation
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION send_ride_request_confirmation_email();

-- Trigger: Driver Assigned Notification
CREATE OR REPLACE FUNCTION send_driver_assigned_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
  user_email TEXT;
  user_name TEXT;
  driver_name TEXT;
  driver_phone TEXT;
  vehicle_make TEXT;
  vehicle_model TEXT;
  vehicle_plate TEXT;
BEGIN
  -- Only trigger when driver is assigned (was NULL, now has value)
  IF TG_OP = 'UPDATE' AND OLD.driver_id IS NULL AND NEW.driver_id IS NOT NULL THEN
    -- Get user email and name
    SELECT email, full_name INTO user_email, user_name
    FROM auth.users
    WHERE id = NEW.user_id;
    
    -- Get driver info
    SELECT d.full_name, d.phone INTO driver_name, driver_phone
    FROM drivers d
    WHERE d.id = NEW.driver_id;
    
    -- Get vehicle info
    IF NEW.vehicle_id IS NOT NULL THEN
      SELECT v.make, v.model, v.license_plate INTO vehicle_make, vehicle_model, vehicle_plate
      FROM vehicles v
      WHERE v.id = NEW.vehicle_id;
    END IF;
    
    payload := jsonb_build_object(
      'userEmail', COALESCE(user_email, ''),
      'userName', COALESCE(user_name, 'User'),
      'tripId', NEW.id::text,
      'driverName', driver_name,
      'driverPhone', driver_phone,
      'vehicleMake', vehicle_make,
      'vehicleModel', vehicle_model,
      'vehiclePlate', vehicle_plate,
      'pickupLocation', NEW.pickup_location,
      'estimatedArrival', (NEW.pickup_time - INTERVAL '5 minutes')::text
    );
    
    PERFORM call_email_edge_function('driver-assigned', payload);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_driver_assigned
  AFTER UPDATE ON bookings
  FOR EACH ROW
  WHEN (OLD.driver_id IS NULL AND NEW.driver_id IS NOT NULL)
  EXECUTE FUNCTION send_driver_assigned_email();

-- Trigger: Trip Completion Receipt
CREATE OR REPLACE FUNCTION send_trip_completion_receipt_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
  user_email TEXT;
  user_name TEXT;
  driver_name TEXT;
BEGIN
  -- Only trigger when status changes to completed
  IF TG_OP = 'UPDATE' AND OLD.status != 'completed' AND NEW.status = 'completed' THEN
    -- Get user email and name
    SELECT email, full_name INTO user_email, user_name
    FROM auth.users
    WHERE id = NEW.user_id;
    
    -- Get driver name
    IF NEW.driver_id IS NOT NULL THEN
      SELECT full_name INTO driver_name
      FROM drivers
      WHERE id = NEW.driver_id;
    END IF;
    
    payload := jsonb_build_object(
      'userEmail', COALESCE(user_email, ''),
      'userName', COALESCE(user_name, 'User'),
      'tripId', NEW.id::text,
      'tripDate', NEW.dropoff_time::text,
      'pickupLocation', NEW.pickup_location,
      'dropoffLocation', NEW.dropoff_location,
      'driverName', driver_name,
      'distance', NEW.distance,
      'duration', NEW.duration,
      'rating', NEW.rating
    );
    
    PERFORM call_email_edge_function('trip-completion-receipt', payload);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_trip_completion_receipt
  AFTER UPDATE ON bookings
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'completed')
  EXECUTE FUNCTION send_trip_completion_receipt_email();

-- ============================================================================
-- PAYMENT & SUBSCRIPTION TRIGGERS
-- ============================================================================

-- Trigger: Subscription Payment Confirmation
-- Note: This assumes you have a payments table that tracks subscription payments
CREATE OR REPLACE FUNCTION send_subscription_payment_confirmation_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
  user_email TEXT;
  user_name TEXT;
BEGIN
  -- Only trigger when payment status changes to completed
  IF TG_OP = 'UPDATE' AND OLD.status != 'completed' AND NEW.status = 'completed' THEN
    -- Get user email and name
    SELECT email, full_name INTO user_email, user_name
    FROM auth.users
    WHERE id = NEW.user_id;
    
    payload := jsonb_build_object(
      'userEmail', COALESCE(user_email, ''),
      'userName', COALESCE(user_name, 'User'),
      'paymentId', NEW.id::text,
      'amount', NEW.amount,
      'paymentMethod', NEW.payment_method,
      'transactionId', NEW.transaction_id,
      'paymentDate', NEW.updated_at::text
    );
    
    PERFORM call_email_edge_function('subscription-payment-confirmation', payload);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Only create trigger if payments table exists and has the right structure
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'payments'
  ) THEN
    CREATE TRIGGER trigger_subscription_payment_confirmation
      AFTER UPDATE ON payments
      FOR EACH ROW
      WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'completed')
      EXECUTE FUNCTION send_subscription_payment_confirmation_email();
  END IF;
END $$;

-- Trigger: Subscription Payment Failed
CREATE OR REPLACE FUNCTION send_subscription_payment_failed_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
  user_email TEXT;
  user_name TEXT;
BEGIN
  -- Only trigger when payment status changes to failed
  IF TG_OP = 'UPDATE' AND OLD.status != 'failed' AND NEW.status = 'failed' THEN
    SELECT email, full_name INTO user_email, user_name
    FROM auth.users
    WHERE id = NEW.user_id;
    
    payload := jsonb_build_object(
      'userEmail', COALESCE(user_email, ''),
      'userName', COALESCE(user_name, 'User'),
      'paymentId', NEW.id::text,
      'amount', NEW.amount,
      'paymentMethod', NEW.payment_method,
      'failureReason', COALESCE((NEW.metadata->>'failure_reason')::text, 'Payment processing failed'),
      'retryUrl', 'https://luxeride.org/payment/retry'
    );
    
    PERFORM call_email_edge_function('subscription-payment-failed', payload);
  END IF;
  
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'payments'
  ) THEN
    CREATE TRIGGER trigger_subscription_payment_failed
      AFTER UPDATE ON payments
      FOR EACH ROW
      WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'failed')
      EXECUTE FUNCTION send_subscription_payment_failed_email();
  END IF;
END $$;

-- ============================================================================
-- FEEDBACK TRIGGERS
-- ============================================================================

-- Trigger: Feedback Received Confirmation
CREATE OR REPLACE FUNCTION send_feedback_received_confirmation_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
  user_email TEXT;
  user_name TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT email, full_name INTO user_email, user_name
    FROM auth.users
    WHERE id = NEW.user_id;
    
    payload := jsonb_build_object(
      'userEmail', COALESCE(user_email, ''),
      'userName', COALESCE(user_name, 'User'),
      'feedbackId', NEW.id::text,
      'tripId', NEW.booking_id::text,
      'rating', NEW.rating
    );
    
    PERFORM call_email_edge_function('feedback-received-confirmation', payload);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_feedback_received_confirmation
  AFTER INSERT ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION send_feedback_received_confirmation_email();

-- ============================================================================
-- SUPPORT TICKET TRIGGERS (if support_tickets table exists)
-- ============================================================================

-- Trigger: Support Ticket Created
CREATE OR REPLACE FUNCTION send_support_ticket_created_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
  user_email TEXT;
  user_name TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT email, full_name INTO user_email, user_name
    FROM auth.users
    WHERE id = NEW.user_id;
    
    payload := jsonb_build_object(
      'userEmail', COALESCE(user_email, ''),
      'userName', COALESCE(user_name, 'User'),
      'ticketNumber', NEW.id::text,
      'ticketSubject', COALESCE((NEW.metadata->>'subject')::text, 'Support Request')
    );
    
    PERFORM call_email_edge_function('support-ticket-created', payload);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Only create trigger if support_tickets table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'support_tickets'
  ) THEN
    CREATE TRIGGER trigger_support_ticket_created
      AFTER INSERT ON support_tickets
      FOR EACH ROW
      EXECUTE FUNCTION send_support_ticket_created_email();
  END IF;
END $$;

-- ============================================================================
-- VEHICLE MAINTENANCE TRIGGERS (if maintenance table exists)
-- ============================================================================

-- Trigger: Vehicle Maintenance Scheduled
CREATE OR REPLACE FUNCTION send_vehicle_maintenance_scheduled_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload JSONB;
  owner_email TEXT;
  owner_name TEXT;
  vehicle_plate TEXT;
  vehicle_make TEXT;
  vehicle_model TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Get vehicle and owner info
    SELECT v.license_plate, v.make, v.model, u.email, u.full_name
    INTO vehicle_plate, vehicle_make, vehicle_model, owner_email, owner_name
    FROM vehicles v
    JOIN drivers d ON d.id = v.driver_id
    JOIN auth.users u ON u.id = d.user_id
    WHERE v.id = NEW.vehicle_id;
    
    payload := jsonb_build_object(
      'ownerEmail', COALESCE(owner_email, ''),
      'ownerName', COALESCE(owner_name, 'Owner'),
      'vehiclePlate', vehicle_plate,
      'vehicleMake', vehicle_make,
      'vehicleModel', vehicle_model,
      'maintenanceType', COALESCE((NEW.metadata->>'type')::text, 'Routine Service'),
      'scheduledDate', COALESCE((NEW.metadata->>'scheduled_date')::text, NEW.created_at::text)
    );
    
    PERFORM call_email_edge_function('vehicle-maintenance-scheduled', payload);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Only create trigger if maintenance table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'vehicle_maintenance'
  ) THEN
    CREATE TRIGGER trigger_vehicle_maintenance_scheduled
      AFTER INSERT ON vehicle_maintenance
      FOR EACH ROW
      EXECUTE FUNCTION send_vehicle_maintenance_scheduled_email();
  END IF;
END $$;

-- ============================================================================
-- COMMENTS & NOTES
-- ============================================================================

COMMENT ON FUNCTION call_email_edge_function IS 
'Helper function to call Supabase Edge Functions via HTTP. Set app.settings.supabase_url and app.settings.supabase_anon_key via Supabase dashboard for custom configuration.';

COMMENT ON FUNCTION send_driver_application_received_email IS 
'Sends confirmation email when a driver submits an application form.';

COMMENT ON FUNCTION send_car_owner_application_received_email IS 
'Sends confirmation email when a car owner submits a partnership application.';

COMMENT ON FUNCTION send_corporate_application_received_email IS 
'Sends confirmation email when a corporate account application is submitted.';

COMMENT ON FUNCTION send_driver_application_status_email IS 
'Sends approval or rejection email when driver application status changes.';

COMMENT ON FUNCTION send_car_owner_application_status_email IS 
'Sends approval or rejection email when car owner application status changes.';

COMMENT ON FUNCTION send_corporate_application_status_email IS 
'Sends approval or rejection email when corporate application status changes.';

COMMENT ON FUNCTION send_ride_request_confirmation_email IS 
'Sends confirmation email when a user requests a ride (booking created).';

COMMENT ON FUNCTION send_driver_assigned_email IS 
'Sends notification email when a driver is assigned to a trip.';

COMMENT ON FUNCTION send_trip_completion_receipt_email IS 
'Sends trip completion receipt email when a trip is marked as completed.';

COMMENT ON FUNCTION send_subscription_payment_confirmation_email IS 
'Sends confirmation email when subscription payment is completed.';

COMMENT ON FUNCTION send_subscription_payment_failed_email IS 
'Sends failure notification email when subscription payment fails.';

COMMENT ON FUNCTION send_feedback_received_confirmation_email IS 
'Sends confirmation email when user submits feedback.';

COMMENT ON FUNCTION send_support_ticket_created_email IS 
'Sends confirmation email when user creates a support ticket.';

COMMENT ON FUNCTION send_vehicle_maintenance_scheduled_email IS 
'Sends notification email when vehicle maintenance is scheduled.';

