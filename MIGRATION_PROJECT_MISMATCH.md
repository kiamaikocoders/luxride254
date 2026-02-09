# ⚠️ Migration Project Mismatch Issue

## Problem Identified

The migration was run on the **WRONG Supabase project**!

### Projects Involved:

1. **MCP Connected Project** (where migration was applied):
   - URL: `https://nnlxxbuekqlaqamczwyi.supabase.co`
   - Project ID: `nnlxxbuekqlaqamczwyi`
   - Status: ✅ Migration applied here

2. **Codebase Project** (where application actually runs):
   - URL: `https://eepcddbdvfhmeouzkpsb.supabase.co`
   - Project ID: `eepcddbdvfhmeouzkpsb`
   - Status: ❌ Migration NOT applied here

---

## Impact

### ✅ What Happened:
- Migration `remove_vip_user_role` was successfully applied to `nnlxxbuekqlaqamczwyi` project
- The `users` table was created/updated on that project
- Role constraint was updated correctly

### ❌ What Didn't Happen:
- Migration was **NOT** applied to `eepcddbdvfhmeouzkpsb` project
- Application code connects to `eepcddbdvfhmeouzkpsb` project
- **The application is still using the old database schema!**

---

## Files Showing Codebase Project:

All these files reference `eepcddbdvfhmeouzkpsb`:

- `src/lib/supabaseClient.ts` → `https://eepcddbdvfhmeouzkpsb.supabase.co`
- `vip-luxeride-com/src/integrations/supabase/client.ts` → `https://eepcddbdvfhmeouzkpsb.supabase.co`
- `mobile-apps/shared-config/supabase.ts` → `https://eepcddbdvfhmeouzkpsb.supabase.co`
- `vip-luxeride-com/supabase/config.toml` → `project_id = "eepcddbdvfhmeouzkpsb"`
- `supabase/.temp/project-ref` → `eepcddbdvfhmeouzkpsb`

---

## Solution Options

### Option 1: Reconnect MCP to Correct Project ✅ **RECOMMENDED**

1. Update MCP Supabase connection to point to `eepcddbdvfhmeouzkpsb`
2. Re-run the migration on the correct project
3. Verify migration was applied

### Option 2: Use Supabase CLI Instead

Run migration directly on the correct project:

```bash
# Navigate to project directory
cd vip-luxeride-com

# Link to correct project (if not already linked)
supabase link --project-ref eepcddbdvfhmeouzkpsb

# Run migration
supabase db push
# OR
supabase migration up
```

### Option 3: Manual Migration via Supabase Dashboard

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/eepcddbdvfhmeouzkpsb
2. Navigate to SQL Editor
3. Run the migration SQL manually:
   ```sql
   -- Migration: Remove vip_user role and align to subscription-based architecture
   -- Date: 2025-01-21
   
   -- Step 1: Convert all existing vip_user records to user
   UPDATE public.users 
   SET role = 'user' 
   WHERE role = 'vip_user';
   
   -- Step 2: Remove vip_user from role enum constraint
   ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
   
   -- Step 3: Add new constraint without vip_user
   ALTER TABLE public.users ADD CONSTRAINT users_role_check 
     CHECK (role IN ('user', 'driver', 'admin', 'security'));
   
   -- Step 4: Add comment explaining the architecture
   COMMENT ON COLUMN public.users.role IS 'User roles: user (all regular users), driver, admin, security. Access is determined by package_subscriptions, not role.';
   ```

---

## Verification Steps

After applying migration to correct project:

1. **Check users table exists:**
   ```sql
   SELECT EXISTS (
     SELECT FROM information_schema.tables 
     WHERE table_schema = 'public' 
     AND table_name = 'users'
   );
   ```

2. **Check role constraint:**
   ```sql
   SELECT constraint_name, check_clause 
   FROM information_schema.check_constraints 
   WHERE constraint_name = 'users_role_check';
   ```
   
   Should show: `role IN ('user', 'driver', 'admin', 'security')`

3. **Check for any vip_user records:**
   ```sql
   SELECT COUNT(*) FROM public.users WHERE role = 'vip_user';
   ```
   
   Should return: `0`

---

## Next Steps

1. ✅ **Identify correct project** → `eepcddbdvfhmeouzkpsb`
2. ⚠️ **Reconnect MCP** OR use Supabase CLI/Dashboard
3. 🔄 **Re-run migration** on correct project
4. ✅ **Verify migration** was applied correctly
5. 🧪 **Test application** to ensure it works with new schema

---

## Migration File Location

The migration SQL is saved at:
- `vip-luxeride-com/supabase/migrations/20250121000000_remove_vip_user_role.sql`

This file can be used to apply the migration to the correct project.

