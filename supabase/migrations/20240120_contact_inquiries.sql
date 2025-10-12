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
