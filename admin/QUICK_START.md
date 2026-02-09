# Quick Start: Admin Password Setup

## ⚡ Quick Answer: There is NO default password

You need to create an admin user. Here's the fastest way:

## Fastest Method (2 minutes)

### Step 1: Create User in Supabase Auth

1. Go to: https://supabase.com/dashboard/project/eepcddbdvfhmeouzkpsb/auth/users
2. Click **"Add User"** (or **"Create User"**)
3. Enter:
   - **Email**: `admin@luxeride.com`
   - **Password**: `Admin123!@#` (or choose your own strong password)
   - ✅ Check **"Auto Confirm User"**
4. Click **"Create User"**

### Step 2: Set Admin Role

1. Go to: https://supabase.com/dashboard/project/eepcddbdvfhmeouzkpsb/editor
2. Click on the `users` table
3. Find the user you just created (by email)
4. Click on the `role` field
5. Change from `user` to `admin`
6. Press Enter to save

### Step 3: Login

1. Go to: http://localhost:8080/admin/login
2. Enter:
   - **Email**: `admin@luxeride.com`
   - **Password**: `Admin123!@#` (or the password you chose)
3. Click "Sign In"

Done! 🎉

---

## Alternative: Use SQL (Faster)

If you prefer SQL, run this in Supabase SQL Editor:

```sql
-- Step 1: Create user in Auth first (via UI), then run this:
-- Replace 'admin@luxeride.com' with your email

UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@luxeride.com';

-- Verify it worked:
SELECT email, role FROM public.users WHERE email = 'admin@luxeride.com';
-- Should show: role = 'admin'
```

---

## Recommended Admin Credentials

For initial setup, you can use:

- **Email**: `admin@luxeride.com`
- **Password**: Choose a strong password (min 8 characters)
  - Example: `LuxeRide2024!`
  - Example: `Admin@LuxRide123`

**Important**: Change this password after first login for security!

---

## Troubleshooting

### "Access denied. Not an admin account"
→ The user's role is not set to `admin` in the database
→ Fix: Update the `role` field in the `users` table to `admin`

### "Invalid login credentials"
→ User doesn't exist in Supabase Auth
→ Fix: Create the user in Authentication > Users first

### User exists but can't login
→ Check that:
1. User exists in `auth.users` (Supabase Auth)
2. User exists in `public.users` (database table)
3. Role is set to `admin` (not `user`)
4. Email matches exactly (case-sensitive)

---

## Security Note

After initial setup, change the password to something secure:
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Don't use common passwords
- Consider enabling MFA for admin accounts

