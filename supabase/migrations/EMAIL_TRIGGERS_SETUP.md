# Email Triggers Setup Guide

This document explains how to set up and use the automatic email triggers for LuxeRide.

## 📋 Overview

The email triggers migration (`20250122_email_triggers.sql`) automatically sends emails via Supabase Edge Functions when specific database events occur. This ensures users receive timely notifications without manual intervention.

## 🚀 Setup Instructions

### 1. Apply the Migration

Run the migration file to create all triggers:

```bash
# Using Supabase CLI
supabase db push

# Or manually via SQL Editor in Supabase Dashboard
# Copy and paste the contents of 20250122_email_triggers.sql
```

### 2. Configure Environment Variables

Set these settings in your Supabase project (Dashboard → Settings → Database → Custom Config):

```sql
-- Set Supabase URL (optional - defaults to your project URL)
ALTER DATABASE postgres SET app.settings.supabase_url = 'https://your-project.supabase.co';

-- Set Anon Key (optional - defaults to your project's anon key)
ALTER DATABASE postgres SET app.settings.supabase_anon_key = 'your-anon-key-here';
```

**Note:** The migration includes fallback values, but it's recommended to set these explicitly.

### 3. Verify Edge Functions Are Deployed

Ensure all email edge functions are deployed:

```bash
# Check deployed functions
supabase functions list

# Deploy all email functions if needed
cd supabase/functions
for dir in */; do
  if [ -f "$dir/index.ts" ]; then
    supabase functions deploy "${dir%/}"
  fi
done
```

## 📧 Email Triggers Overview

### Form Submission Triggers

These triggers fire when users submit application forms:

| Trigger | Table | Event | Email Function |
|---------|-------|-------|----------------|
| Driver Application Received | `driver_applications` | INSERT | `driver-application-received` |
| Car Owner Application Received | `partner_applications` | INSERT | `car-owner-application-received` |
| Corporate Application Received | `corporate_accounts` | INSERT | `corporate-application-received` |

**Example Flow:**
1. User submits driver application form
2. Row inserted into `driver_applications` table
3. Trigger automatically fires
4. Email sent: "Thank you for your application. We're reviewing it..."

### Application Status Change Triggers

These triggers fire when admin updates application status:

| Trigger | Table | Status Change | Email Function |
|---------|-------|---------------|----------------|
| Driver Application Approved | `driver_applications` | → `approved` | `driver-application-approved` |
| Driver Application Rejected | `driver_applications` | → `rejected` | `driver-application-rejected` |
| Car Owner Application Approved | `partner_applications` | → `approved` | `car-owner-application-approved` |
| Car Owner Application Rejected | `partner_applications` | → `rejected` | `car-owner-application-rejected` |
| Corporate Application Approved | `corporate_accounts` | → `active` | `corporate-application-approved` |
| Corporate Application Rejected | `corporate_accounts` | → `terminated` | `corporate-application-rejected` |

**Example Flow:**
1. Admin reviews driver application
2. Admin updates status to `approved` in database
3. Trigger automatically fires
4. Email sent: "Congratulations! Your application has been approved..."

### Trip/Booking Triggers

These triggers fire during the trip lifecycle:

| Trigger | Table | Event | Email Function |
|---------|-------|-------|----------------|
| Ride Request Confirmation | `bookings` | INSERT | `ride-request-confirmation` |
| Driver Assigned | `bookings` | UPDATE (driver_id assigned) | `driver-assigned` |
| Trip Completion Receipt | `bookings` | UPDATE (status → `completed`) | `trip-completion-receipt` |

**Example Flow:**
1. User requests a ride
2. Row inserted into `bookings` table
3. Trigger sends confirmation email
4. Admin assigns driver
5. Trigger sends driver assignment email
6. Trip completes
7. Trigger sends completion receipt email

### Payment & Subscription Triggers

These triggers fire for payment events:

| Trigger | Table | Event | Email Function |
|---------|-------|-------|----------------|
| Subscription Payment Confirmation | `payments` | UPDATE (status → `completed`) | `subscription-payment-confirmation` |
| Subscription Payment Failed | `payments` | UPDATE (status → `failed`) | `subscription-payment-failed` |

**Note:** These triggers only activate if the `payments` table exists.

### Feedback & Support Triggers

| Trigger | Table | Event | Email Function |
|---------|-------|-------|----------------|
| Feedback Received | `feedback` | INSERT | `feedback-received-confirmation` |
| Support Ticket Created | `support_tickets` | INSERT | `support-ticket-created` |

**Note:** Support ticket trigger only activates if `support_tickets` table exists.

### Vehicle Maintenance Triggers

| Trigger | Table | Event | Email Function |
|---------|-------|-------|----------------|
| Vehicle Maintenance Scheduled | `vehicle_maintenance` | INSERT | `vehicle-maintenance-scheduled` |

**Note:** Only activates if `vehicle_maintenance` table exists.

## 🔧 How It Works

### 1. Database Event Occurs
- User submits form → INSERT into table
- Admin updates status → UPDATE table
- Trip completes → UPDATE status

### 2. Trigger Function Executes
- Trigger function collects relevant data
- Builds JSON payload with email variables
- Calls `call_email_edge_function()` helper

### 3. Edge Function Called
- Helper function makes HTTP POST request to edge function
- Uses `pg_net` extension (non-blocking)
- Includes authentication headers

### 4. Email Sent
- Edge function receives payload
- Renders email template with variables
- Sends email via Resend API
- Returns success/failure status

## 🧪 Testing Triggers

### Test Form Submission Trigger

```sql
-- Insert a test driver application
INSERT INTO driver_applications (
  applicant_name,
  email,
  phone,
  license_number,
  years_experience
) VALUES (
  'John Doe',
  'test@example.com',
  '+254712345678',
  'DL123456',
  5
);

-- Check email was sent (check Resend dashboard or email inbox)
```

### Test Status Change Trigger

```sql
-- Update application status
UPDATE driver_applications
SET status = 'approved',
    reviewed_by = (SELECT id FROM auth.users WHERE role = 'admin' LIMIT 1),
    reviewed_at = NOW()
WHERE email = 'test@example.com';

-- Check approval email was sent
```

### Test Trip Completion Trigger

```sql
-- Complete a trip
UPDATE bookings
SET status = 'completed',
    dropoff_time = NOW(),
    distance = 15.5,
    duration = 30
WHERE id = 'your-trip-id';

-- Check completion receipt email was sent
```

## 🐛 Troubleshooting

### Emails Not Sending

1. **Check Edge Functions Are Deployed**
   ```bash
   supabase functions list
   ```

2. **Check Environment Variables**
   ```sql
   -- Verify Resend API key is set
   SELECT * FROM vault.secrets WHERE name = 'RESEND_API_KEY';
   ```

3. **Check Function Logs**
   ```bash
   supabase functions logs <function-name>
   ```

4. **Check Database Logs**
   ```sql
   -- View recent warnings/errors
   SELECT * FROM pg_stat_statements 
   WHERE query LIKE '%call_email_edge_function%'
   ORDER BY calls DESC;
   ```

### Trigger Not Firing

1. **Verify Trigger Exists**
   ```sql
   SELECT * FROM pg_trigger WHERE tgname LIKE '%email%';
   ```

2. **Check Trigger Function**
   ```sql
   SELECT proname, prosrc 
   FROM pg_proc 
   WHERE proname LIKE '%email%';
   ```

3. **Test Trigger Manually**
   ```sql
   -- Manually call the trigger function
   SELECT send_driver_application_received_email();
   ```

### Common Issues

**Issue:** `pg_net extension not found`
- **Solution:** Enable extension: `CREATE EXTENSION IF NOT EXISTS pg_net;`

**Issue:** `Edge function returned status 401`
- **Solution:** Check that `SUPABASE_ANON_KEY` is correctly set

**Issue:** `Edge function returned status 404`
- **Solution:** Verify edge function is deployed and name matches exactly

**Issue:** `Email not received`
- **Solution:** Check Resend dashboard for delivery status, check spam folder

## 📝 Customization

### Adding New Triggers

To add a new email trigger:

1. **Create Trigger Function**
   ```sql
   CREATE OR REPLACE FUNCTION send_your_custom_email()
   RETURNS TRIGGER AS $$
   DECLARE
     payload JSONB;
   BEGIN
     payload := jsonb_build_object(
       'userEmail', NEW.email,
       'customField', NEW.custom_value
     );
     PERFORM call_email_edge_function('your-edge-function-name', payload);
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;
   ```

2. **Create Trigger**
   ```sql
   CREATE TRIGGER trigger_your_custom_email
     AFTER INSERT ON your_table
     FOR EACH ROW
     EXECUTE FUNCTION send_your_custom_email();
   ```

### Modifying Existing Triggers

To modify an existing trigger:

1. **Drop Existing Trigger**
   ```sql
   DROP TRIGGER IF EXISTS trigger_name ON table_name;
   ```

2. **Update Function**
   ```sql
   CREATE OR REPLACE FUNCTION function_name()
   -- ... updated function code ...
   ```

3. **Recreate Trigger**
   ```sql
   CREATE TRIGGER trigger_name
     -- ... trigger definition ...
   ```

## 🔒 Security Considerations

1. **SECURITY DEFINER**: Trigger functions use `SECURITY DEFINER` to allow HTTP calls
2. **Error Handling**: Errors are logged but don't fail transactions
3. **Rate Limiting**: Consider adding rate limiting for high-volume triggers
4. **Input Validation**: Edge functions validate input before sending emails

## 📊 Monitoring

### Check Trigger Execution Count

```sql
SELECT 
  schemaname,
  tablename,
  tgname AS trigger_name,
  tgenabled AS enabled
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
WHERE tgname LIKE '%email%'
ORDER BY tablename;
```

### Monitor Email Function Calls

Check Supabase Edge Function logs:
```bash
supabase functions logs --tail
```

## ✅ Checklist

- [ ] Migration file applied successfully
- [ ] Environment variables configured
- [ ] All edge functions deployed
- [ ] Test form submission trigger
- [ ] Test status change trigger
- [ ] Test trip completion trigger
- [ ] Verify emails are received
- [ ] Check spam folder
- [ ] Monitor function logs for errors

## 📚 Related Documentation

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/triggers.html)
- [pg_net Extension](https://github.com/supabase/pg_net)
- [Email Edge Functions README](../functions/send-email/README.md)

