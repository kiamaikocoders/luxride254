# Admin User Setup Guide

## How to Create an Admin User

Since the admin dashboard uses Supabase Auth, you need to create an admin user through Supabase. Here are two methods:

## Method 1: Create New Admin User (Recommended)

### Step 1: Create User in Supabase Auth

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Users**
3. Click **"Add User"** or **"Create User"**
4. Fill in:
   - **Email**: `admin@luxeride.com` (or your preferred admin email)
   - **Password**: Choose a strong password (save this!)
   - **Auto Confirm User**: ✅ Check this box
5. Click **"Create User"**

### Step 2: Update User Role in Database

After creating the user, you need to set their role to `admin` in the `users` table:

**Option A: Via Supabase SQL Editor**

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this SQL (replace the email with your admin email):

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@luxeride.com';
```

**Option B: Via Supabase Table Editor**

1. Go to **Table Editor** > `users` table
2. Find your admin user by email
3. Edit the `role` field and change it to `admin`
4. Save

### Step 3: Verify Admin User

Check that the user has admin role:

```sql
SELECT id, email, full_name, role 
FROM public.users 
WHERE email = 'admin@luxeride.com';
```

The `role` should be `admin`.

## Method 2: Convert Existing User to Admin

If you already have a user account you want to use as admin:

1. Log in to your application with that account
2. Go to Supabase Dashboard > **Table Editor** > `users` table
3. Find your user by email
4. Change the `role` field from `user` to `admin`
5. Save

## Default Admin Credentials

**There is no default password.** You must create an admin user following the steps above.

### Recommended Admin Setup:

- **Email**: `admin@luxeride.com` (or your domain)
- **Password**: Create a strong password (minimum 8 characters, mix of letters, numbers, symbols)
- **Role**: `admin` (must be set in the `users` table)

## Troubleshooting

### "Access denied. Not an admin account"

This means the user's role in the `users` table is not set to `admin`.

**Fix:**
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### "User not found" or Login fails

1. Make sure the user exists in Supabase Auth (Authentication > Users)
2. Make sure the user exists in the `users` table
3. Check that email matches exactly (case-sensitive)

### User exists in auth but not in users table

This can happen if the user was created directly in Supabase Auth. You need to create a corresponding record in the `users` table:

```sql
-- Get the user ID from auth.users first
-- Then insert into public.users
INSERT INTO public.users (id, email, full_name, role)
VALUES (
  'user-id-from-auth-users', 
  'admin@luxeride.com', 
  'Admin User', 
  'admin'
);
```

## Security Best Practices

1. **Use a strong password** - minimum 12 characters, mix of uppercase, lowercase, numbers, and symbols
2. **Don't share admin credentials** - each admin should have their own account
3. **Use email verification** - enable email verification in Supabase Auth settings
4. **Enable MFA** - Consider enabling multi-factor authentication for admin accounts
5. **Regular password rotation** - Change admin passwords periodically

## Creating Multiple Admin Users

To create additional admin users, repeat Method 1 for each user, or update existing users:

```sql
-- Update multiple users to admin
UPDATE public.users 
SET role = 'admin' 
WHERE email IN (
  'admin1@luxeride.com',
  'admin2@luxeride.com',
  'admin3@luxeride.com'
);
```

## Quick Setup Script

If you want to automate the setup, you can create a SQL function (run in Supabase SQL Editor):

```sql
-- Function to set user as admin by email
CREATE OR REPLACE FUNCTION set_user_as_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.users 
  SET role = 'admin' 
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Usage:
-- SELECT set_user_as_admin('admin@luxeride.com');
```

## Testing the Admin Login

1. Navigate to: `http://localhost:8080/admin/login`
2. Enter your admin email and password
3. You should be redirected to `/admin/dashboard`
4. If you see "Access denied", check the user's role in the database

## Need Help?

If you're having issues:
1. Check the browser console for errors
2. Verify the user exists in both `auth.users` and `public.users`
3. Confirm the role is set to `admin` (not `user` or `driver`)
4. Check Supabase logs for authentication errors

