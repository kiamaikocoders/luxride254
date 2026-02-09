-- Create storage bucket for application documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'applications',
  'applications',
  false, -- Private bucket for application documents
  10485760, -- 10MB limit
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE
SET 
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Allow anyone (including anonymous) to upload to applications bucket
-- This is needed for public-facing application forms
-- Drop policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Anyone can upload application documents" ON storage.objects;

CREATE POLICY "Anyone can upload application documents"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'applications');

-- Allow admins to view all application documents
-- Drop policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all application documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view application documents" ON storage.objects;

CREATE POLICY "Admins can view all application documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'applications' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Allow admins to delete application documents
-- Drop policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Admins can delete application documents" ON storage.objects;

CREATE POLICY "Admins can delete application documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'applications' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
