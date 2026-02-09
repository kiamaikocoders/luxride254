-- Admin User Setup Script
-- Run this SQL script in your Supabase SQL editor to create an admin user

-- Step 1: Create the user in auth.users (you'll need to do this via Supabase Auth UI or API)
-- Go to Supabase Dashboard > Authentication > Users > Add User
-- Email: admin@luxeride.com
-- Password: (set your password)
-- Auto Confirm: Yes

-- Step 2: After creating the user in auth, get their UUID and run this:
-- Replace 'YOUR_ADMIN_USER_UUID' with the actual UUID from auth.users

-- Example:
-- INSERT INTO public.users (id, email, full_name, role)
-- VALUES ('YOUR_ADMIN_USER_UUID', 'admin@luxeride.com', 'Admin User', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Or if you want to update an existing user to admin:
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@luxeride.com';

-- Quick setup: Update existing user to admin role
-- Replace 'your-email@example.com' with your actual email
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

