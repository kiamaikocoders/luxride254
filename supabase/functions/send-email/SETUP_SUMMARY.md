# Email Functions Setup Summary

## ✅ What Was Created

### 1. Shared Utilities (`_shared/`)
- **`email-client.ts`**: Resend API integration for sending emails
- **`templates.ts`**: Shared email template wrapper with LuxeRide branding

### 2. Email Edge Functions (7 functions)

1. **`ride-request-confirmation/`** - Confirms ride request with subscription details
2. **`driver-assigned/`** - Notifies user when driver is assigned
3. **`trip-completion-receipt/`** - Sends trip completion receipt with subscription usage
4. **`subscription-payment-confirmation/`** - Confirms subscription payment
5. **`subscription-payment-failed/`** - Alerts user of payment failure
6. **`driver-application-status/`** - Sends driver application approval/rejection
7. **`package-purchase-confirmation/`** - Confirms VIP package purchase

## 🚀 Quick Start

### Step 1: Set Environment Variables

In Supabase Dashboard → Settings → Edge Functions → Secrets:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=LuxeRide <noreply@yourdomain.com>
```

**Important**: Replace `yourdomain.com` with your verified domain in Resend.

### Step 2: Deploy Functions

From project root:

```bash
# Option 1: Use deployment script
./supabase/functions/send-email/deploy.sh

# Option 2: Deploy individually
supabase functions deploy send-email/ride-request-confirmation --no-verify-jwt
supabase functions deploy send-email/driver-assigned --no-verify-jwt
# ... etc
```

### Step 3: Test a Function

```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/send-email/ride-request-confirmation \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "userName": "Test User",
    "tripId": "test-123",
    "pickupLocation": "Nairobi CBD"
  }'
```

## 📋 Function Endpoints

All functions are available at:
```
https://your-project.supabase.co/functions/v1/send-email/{function-name}
```

Function names:
- `ride-request-confirmation`
- `driver-assigned`
- `trip-completion-receipt`
- `subscription-payment-confirmation`
- `subscription-payment-failed`
- `driver-application-status`
- `package-purchase-confirmation`

## 🔗 Integration Examples

### From Database Trigger

```sql
CREATE OR REPLACE FUNCTION notify_trip_completion()
RETURNS TRIGGER AS $$
BEGIN
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
          'pickupLocation', NEW.pickup_location,
          'dropoffLocation', NEW.dropoff_location
        )
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### From Application Code

```typescript
// Example: Send ride request confirmation
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/send-email/ride-request-confirmation`,
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userEmail: user.email,
      userName: user.name,
      tripId: trip.id,
      pickupLocation: trip.pickup_location,
      dropoffLocation: trip.dropoff_location,
      packageType: subscription.package_type,
      ridesRemaining: subscription.rides_remaining,
    }),
  }
);
```

## 📝 Next Steps

1. ✅ Set up Resend account and verify domain
2. ✅ Configure environment variables in Supabase
3. ✅ Deploy all functions
4. ✅ Test each function with sample data
5. ✅ Set up database triggers for automatic emails
6. ✅ Integrate function calls in your application code

## 🐛 Troubleshooting

**Functions not deploying?**
- Make sure you're logged into Supabase CLI: `supabase login`
- Check you're in the project root directory
- Verify function paths are correct

**Emails not sending?**
- Verify `RESEND_API_KEY` is set correctly
- Check `FROM_EMAIL` domain is verified in Resend
- Review function logs in Supabase dashboard
- Test Resend API key directly

**Import errors?**
- Ensure `_shared` directory is deployed with functions
- Check import paths use `../_shared/` (relative to function directory)

## 📚 Documentation

See `README.md` for detailed documentation on each function, including:
- Request/response formats
- Required fields
- Example payloads
- Database trigger setup

