# Manual Database Migration Instructions

Since the Supabase MCP is experiencing connection timeouts, please apply the following migration manually:

## Step 1: Access Your Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your LuxeRide project
3. Navigate to the SQL Editor

## Step 2: Execute the Migration SQL
Copy and paste the following SQL into the SQL Editor and execute it:

```sql
-- Create contact_inquiries table for landing page contact forms
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_interest TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'contact_page' CHECK (source IN ('contact_page', 'landing_page', 'admin_portal')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'closed')),
  admin_notes TEXT,
  responded_by UUID REFERENCES auth.users(id),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_source ON contact_inquiries(source);

-- RLS Policies
-- Allow anyone to insert contact inquiries (public form)
CREATE POLICY "Anyone can create contact inquiries" ON contact_inquiries 
FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow admins to read all contact inquiries
CREATE POLICY "Admins can read all contact inquiries" ON contact_inquiries 
FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Allow admins to update contact inquiries (for status management)
CREATE POLICY "Admins can update contact inquiries" ON contact_inquiries 
FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Create trigger for updated_at
CREATE TRIGGER update_contact_inquiries_updated_at BEFORE UPDATE ON contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for contact inquiries
ALTER PUBLICATION supabase_realtime ADD TABLE contact_inquiries;
```

## Step 3: Verify the Migration
After executing the SQL, verify that:
1. The `contact_inquiries` table was created
2. RLS is enabled
3. The policies are in place
4. Indexes were created

## Step 4: Test the Contact Form
1. Go to your landing page
2. Fill out the contact form
3. Submit it
4. Check the `contact_inquiries` table in Supabase to see if the data was inserted

## Troubleshooting
If you encounter any errors:
1. Make sure you have admin privileges in Supabase
2. Check if the `profiles` table exists (referenced in the policies)
3. Verify that the `update_updated_at_column()` function exists
4. Check the Supabase logs for any detailed error messages

## Alternative: Use Supabase CLI
If you prefer using the CLI:

```bash
# Create a new migration file
supabase migration new contact_inquiries_table

# Add the SQL content to the migration file
# Then apply it
supabase db push
```

The migration is ready to be applied manually! 🚀
