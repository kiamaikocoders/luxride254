# LuxeRide Email Edge Functions

This directory contains Supabase Edge Functions for sending transactional emails using Resend.

## 📋 Prerequisites

1. **Resend Account**: Sign up at [resend.com](https://resend.com)
2. **Resend API Key**: Get your API key from Resend dashboard
3. **Supabase Project**: Configure environment variables

## 🔧 Setup

### 1. Configure Environment Variables

In your Supabase dashboard, go to **Settings → Edge Functions → Secrets** and add:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=LuxeRide <noreply@luxeride.com>
```

**Note**: Replace `noreply@luxeride.com` with your verified domain email in Resend.

### 2. Deploy Functions

Deploy all functions to Supabase (run from project root):

```bash
# Use the deployment script
./supabase/functions/send-email/deploy.sh

# Or deploy individually
supabase functions deploy send-email/ride-request-confirmation --no-verify-jwt
supabase functions deploy send-email/driver-assigned --no-verify-jwt
supabase functions deploy send-email/trip-completion-receipt --no-verify-jwt
supabase functions deploy send-email/subscription-payment-confirmation --no-verify-jwt
supabase functions deploy send-email/subscription-payment-failed --no-verify-jwt
supabase functions deploy send-email/driver-application-status --no-verify-jwt
supabase functions deploy send-email/package-purchase-confirmation --no-verify-jwt
```

**Note**: Functions are organized in the `send-email` directory but deployed with the full path.

## 📧 Available Email Functions

### 1. **Ride Request Confirmation**
**Function**: `ride-request-confirmation`  
**Trigger**: When a user successfully requests a ride

**Request Body**:
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "tripId": "uuid-here",
  "pickupLocation": "Nairobi CBD",
  "dropoffLocation": "JKIA Airport",
  "pickupTime": "2024-01-15T10:00:00Z",
  "vehicleType": "Premium",
  "packageType": "gold",
  "ridesRemaining": 15,
  "driverName": "James Smith",
  "driverPhone": "+254712345678"
}
```

**Call Example**:
```typescript
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/send-email/ride-request-confirmation`,
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({...}),
  }
);
```

---

### 2. **Driver Assigned Notification**
**Function**: `driver-assigned`  
**Trigger**: When a driver is assigned to a trip

**Request Body**:
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "tripId": "uuid-here",
  "driverName": "James Smith",
  "driverPhone": "+254712345678",
  "vehicleMake": "Mercedes-Benz",
  "vehicleModel": "S-Class",
  "vehiclePlate": "KCA 123X",
  "estimatedArrival": "5 minutes",
  "trackingUrl": "https://app.luxeride.com/track/trip-id"
}
```

---

### 3. **Trip Completion Receipt**
**Function**: `trip-completion-receipt`  
**Trigger**: When a trip is marked as completed

**Request Body**:
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "tripId": "uuid-here",
  "tripDate": "2024-01-15T10:30:00Z",
  "pickupLocation": "Nairobi CBD",
  "dropoffLocation": "JKIA Airport",
  "distance": 18.5,
  "duration": 45,
  "driverName": "James Smith",
  "vehicleDetails": "Mercedes-Benz S-Class",
  "ridesUsed": 5,
  "ridesRemaining": 15,
  "packageType": "gold",
  "feedbackUrl": "https://app.luxeride.com/feedback/trip-id"
}
```

---

### 4. **Subscription Payment Confirmation**
**Function**: `subscription-payment-confirmation`  
**Trigger**: When subscription payment is successfully processed

**Request Body**:
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "transactionId": "txn_123456",
  "packageType": "gold",
  "monthlyFee": 150000,
  "paymentMethod": "M-Pesa",
  "paymentDate": "2024-01-15T10:00:00Z",
  "subscriptionStartDate": "2024-01-15",
  "subscriptionEndDate": "2024-02-15",
  "ridesIncluded": 20,
  "receiptUrl": "https://app.luxeride.com/receipt/txn-id"
}
```

---

### 5. **Subscription Payment Failed**
**Function**: `subscription-payment-failed`  
**Trigger**: When subscription payment fails or is declined

**Request Body**:
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "transactionId": "txn_123456",
  "packageType": "gold",
  "monthlyFee": 150000,
  "paymentMethod": "M-Pesa",
  "failureReason": "Insufficient funds",
  "retryUrl": "https://app.luxeride.com/payment/retry",
  "subscriptionStatus": "suspended"
}
```

---

### 6. **Driver Application Status**
**Function**: `driver-application-status`  
**Trigger**: When driver application is approved or rejected

**Request Body (Approved)**:
```json
{
  "driverEmail": "driver@example.com",
  "driverName": "James Smith",
  "applicationId": "app_123456",
  "status": "approved",
  "onboardingUrl": "https://app.luxeride.com/driver/onboarding",
  "requiredDocuments": "Driver's license\nVehicle registration\nInsurance certificate",
  "nextSteps": "Complete profile\nUpload documents\nComplete training"
}
```

**Request Body (Rejected)**:
```json
{
  "driverEmail": "driver@example.com",
  "driverName": "James Smith",
  "applicationId": "app_123456",
  "status": "rejected",
  "rejectionReason": "Incomplete documentation"
}
```

---

### 7. **Package Purchase Confirmation**
**Function**: `package-purchase-confirmation`  
**Trigger**: When VIP user purchases/activates a package

**Request Body**:
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "packageType": "gold",
  "monthlyFee": 150000,
  "ridesIncluded": 20,
  "subscriptionStartDate": "2024-01-15",
  "subscriptionEndDate": "2024-02-15",
  "paymentMethod": "M-Pesa",
  "transactionId": "txn_123456",
  "receiptUrl": "https://app.luxeride.com/receipt/txn-id"
}
```

## 🔗 Database Triggers Setup

To automatically trigger emails on database events, create triggers:

### Example: Trip Completion Trigger

```sql
-- Create function to call edge function
CREATE OR REPLACE FUNCTION notify_trip_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Call edge function when trip status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    PERFORM
      net.http_post(
        url := 'https://your-project.supabase.co/functions/v1/send-email/trip-completion-receipt',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        ),
        body := jsonb_build_object(
          'userEmail', (SELECT email FROM auth.users WHERE id = NEW.user_id),
          'tripId', NEW.id::text,
          'tripDate', NEW.completed_at::text,
          'pickupLocation', NEW.pickup_location,
          'dropoffLocation', NEW.dropoff_location
          -- Add other fields as needed
        )
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trip_completion_email
  AFTER UPDATE ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_trip_completion();
```

## 🧪 Testing

Test functions locally using Supabase CLI:

```bash
# Start local Supabase
supabase start

# Test a function
curl -X POST http://localhost:54321/functions/v1/send-email/ride-request-confirmation \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "userName": "Test User",
    "tripId": "test-trip-123",
    "pickupLocation": "Test Location"
  }'
```

## 📝 Notes

- All functions use the shared email client (`_shared/email-client.ts`)
- All emails use the LuxeRide brand template (`_shared/templates.ts`)
- Functions return JSON with `success` and `messageId` or `error`
- Email sending is logged for debugging
- Make sure your Resend domain is verified before sending emails

## 🐛 Troubleshooting

**Email not sending?**
1. Check `RESEND_API_KEY` is set correctly
2. Verify your `FROM_EMAIL` domain is verified in Resend
3. Check Supabase function logs for errors
4. Verify request body matches expected format

**Function errors?**
1. Check function logs in Supabase dashboard
2. Verify all required fields are provided
3. Ensure Resend API key has correct permissions

## 🔐 Security

- Functions should be called server-side or with service role key
- Never expose Resend API key in client-side code
- Use Supabase RLS policies to control access
- Validate all input data before sending emails

