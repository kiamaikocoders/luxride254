# Shared Email Utilities

This directory contains shared utilities used by all email-sending edge functions.

## Files

- **`email-client.ts`**: Resend API client for sending emails
- **`templates.ts`**: Shared email template wrapper with LuxeRide branding

## Usage

Import in your edge functions:

```typescript
import { sendEmail } from "./_shared/email-client.ts";
import { getEmailTemplate } from "./_shared/templates.ts";

// Use in your function
const html = getEmailTemplate(`
  <div class="greeting">Hello!</div>
  <div class="message">Your content here</div>
`);

const result = await sendEmail({
  to: "user@example.com",
  subject: "Your Subject",
  html,
});
```

## Environment Variables

Required environment variables (set in Supabase dashboard):
- `RESEND_API_KEY`: Your Resend API key
- `FROM_EMAIL`: Verified sender email (e.g., "LuxeRide <noreply@luxeride.com>")

