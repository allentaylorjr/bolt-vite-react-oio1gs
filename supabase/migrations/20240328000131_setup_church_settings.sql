-- Create churches table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.churches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  description text,
  website text,
  primary_color text DEFAULT '#2563eb' NOT NULL,
  button_text_color text DEFAULT '#FFFFFF' NOT NULL,
  accent_color text DEFAULT '#FFFFFF' NOT NULL,
  font_family text DEFAULT 'Inter' NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT valid_primary_color CHECK (primary_color ~ '^#[A-Fa-f0-9]{6}$'),
  CONSTRAINT valid_button_text_color CHECK (button_text_color ~ '^#[A-Fa-f0-9]{6}$'),
  CONSTRAINT valid_accent_color CHECK (accent_color ~ '^#[A-Fa-f0-9]{6}$'),
  CONSTRAINT valid_website CHECK (website IS NULL OR website ~ '^https?://[^\s/$.?#].[^\s]*$')
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_churches_slug ON public.churches(slug);
CREATE INDEX IF NOT EXISTS idx_churches_created_at ON public.churches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_churches_updated_at ON public.churches(updated_at DESC);

-- Enable RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable public read access"
  ON public.churches FOR SELECT
  USING (true);

CREATE POLICY "Enable authenticated insert"
  ON public.churches FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable authenticated update"
  ON public.churches FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

-- Create storage bucket for church logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'church-logos',
  'church-logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create storage policies
CREATE POLICY "Enable logo read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'church-logos');

CREATE POLICY "Enable logo upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'church-logos' AND
    auth.role() = 'authenticated'
  );

-- Grant necessary permissions
GRANT ALL ON public.churches TO authenticated;
GRANT SELECT ON public.churches TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;