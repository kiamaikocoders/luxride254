# LuxeRide Email Templates

This directory contains professional HTML email templates for LuxeRide authentication and account management flows. All templates are designed with the LuxeRide brand colors and styling.

## Brand Colors Used

- **Primary Gold**: `#D4AF37` (Luxe Gold)
- **Gold Gradient**: `#D4AF37` to `#F4D03F`
- **Dark Text**: `#1A1A1A`
- **White Background**: `#FFFFFF`
- **Gray Secondary**: `#999999`
- **Light Gray Outline**: `#E6E6E6`
- **Very Light Gray**: `#FAFAFA`

## Available Templates

### 1. Confirm Sign Up (`confirm-signup.html`)
**Purpose**: Ask users to confirm their email address after signing up

**Variables**:
- `{{ .ConfirmationURL }}` - The confirmation link URL

**Usage**: Sent when a new user registers for a LuxeRide account.

---

### 2. Invite User (`invite-user.html`)
**Purpose**: Invite users who don't yet have an account to sign up

**Variables**:
- `{{ .InviteURL }}` - The invitation link URL

**Usage**: Sent when an admin or existing user invites someone to join LuxeRide.

---

### 3. Magic Link (`magic-link.html`)
**Purpose**: Allow users to sign in via a one-time link sent to their email

**Variables**:
- `{{ .MagicLink }}` - The magic link URL for sign-in

**Usage**: Sent when a user requests passwordless sign-in via magic link.

---

### 4. Change Email Address (`change-email.html`)
**Purpose**: Ask users to verify their new email address after changing it

**Variables**:
- `{{ .NewEmail }}` - The new email address being verified
- `{{ .VerificationURL }}` - The verification link URL

**Usage**: Sent when a user requests to change their account email address.

---

### 5. Reset Password (`reset-password.html`)
**Purpose**: Allow users to reset their password if they forget it

**Variables**:
- `{{ .ResetURL }}` - The password reset link URL

**Usage**: Sent when a user requests a password reset.

---

### 6. Reauthentication (`reauthentication.html`)
**Purpose**: Ask users to re-authenticate before performing a sensitive action

**Variables**:
- `{{ .ActionDescription }}` - Description of the action requiring re-authentication
- `{{ .ReauthURL }}` - The re-authentication link URL

**Usage**: Sent when a user attempts a sensitive action (e.g., changing password, updating payment info) and needs to verify their identity.

---

## Integration with Supabase Auth

These templates can be integrated with Supabase Auth email templates. To use them:

1. **Supabase Dashboard**:
   - Go to Authentication → Email Templates
   - Copy the HTML content from the appropriate template
   - Replace template variables with Supabase's template variables:
     - `{{ .ConfirmationURL }}` → `{{ .ConfirmationURL }}`
     - `{{ .MagicLink }}` → `{{ .MagicLink }}`
     - `{{ .ResetURL }}` → `{{ .RedirectTo }}`
     - etc.

2. **Custom Email Service**:
   - Use a template engine (e.g., Go templates, Handlebars, Mustache)
   - Replace variables with actual values before sending
   - Send via your email service provider (SendGrid, AWS SES, etc.)

## Template Variables Reference

| Variable | Description | Used In |
|----------|-------------|---------|
| `{{ .ConfirmationURL }}` | Email confirmation link | confirm-signup.html |
| `{{ .InviteURL }}` | User invitation link | invite-user.html |
| `{{ .MagicLink }}` | Passwordless sign-in link | magic-link.html |
| `{{ .NewEmail }}` | New email address | change-email.html |
| `{{ .VerificationURL }}` | Email verification link | change-email.html |
| `{{ .ResetURL }}` | Password reset link | reset-password.html |
| `{{ .ActionDescription }}` | Description of sensitive action | reauthentication.html |
| `{{ .ReauthURL }}` | Re-authentication link | reauthentication.html |

## Design Features

- **Responsive Design**: Works on desktop and mobile email clients
- **Brand Consistency**: Uses LuxeRide brand colors and fonts (Montserrat for headings, Open Sans for body)
- **Accessibility**: High contrast text, clear call-to-action buttons
- **Security**: Clear security notices and expiration warnings
- **Professional**: Clean, modern design that reflects the premium LuxeRide brand

## Customization

To customize these templates:

1. **Colors**: Update the hex color values in the `<style>` section
2. **Content**: Modify the text content in the email body
3. **Logo**: Replace the text logo with an image logo if needed
4. **Footer**: Update contact information and links

## Testing

Before deploying, test these templates:

1. **Email Client Testing**: Send test emails to various clients (Gmail, Outlook, Apple Mail, etc.)
2. **Mobile Testing**: Check rendering on mobile devices
3. **Link Testing**: Verify all links work correctly
4. **Variable Testing**: Ensure all template variables are replaced correctly

## Support

For questions or issues with these email templates, contact the LuxeRide development team.

