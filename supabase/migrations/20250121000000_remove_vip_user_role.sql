-- Migration: Remove vip_user role and align to subscription-based architecture
-- Date: 2025-01-21

-- Step 1: Convert all existing vip_user records to user (if profiles table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    UPDATE public.profiles 
    SET role = 'user' 
    WHERE role = 'vip_user';
  END IF;
END $$;

-- Step 2: Update users table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    UPDATE public.users 
    SET role = 'user' 
    WHERE role = 'vip_user';
    
    -- Remove vip_user from role enum constraint
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
    ALTER TABLE public.users ADD CONSTRAINT users_role_check 
      CHECK (role IN ('user', 'driver', 'admin', 'security'));
  END IF;
END $$;

