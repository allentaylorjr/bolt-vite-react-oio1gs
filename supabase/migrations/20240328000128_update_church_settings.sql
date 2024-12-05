-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.churches;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.churches;
DROP POLICY IF EXISTS "Enable update for church admins" ON public.churches;

-- Update churches table with proper constraints and defaults
ALTER TABLE public.churches
  ALTER COLUMN primary_color SET DEFAULT '#2563eb',
  ALTER COLUMN button_text_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN accent_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN font_family SET DEFAULT 'Inter';

-- Add NOT NULL constraints
ALTER TABLE public.churches
  ALTER COLUMN primary_color SET NOT NULL,
  ALTER COLUMN button_text_color SET NOT NULL,
  ALTER COLUMN accent_color SET NOT NULL,
  ALTER COLUMN font_family SET NOT NULL;

-- Add color format validation
ALTER TABLE public.churches
  ADD CONSTRAINT valid_primary_color CHECK (primary_color ~ '^#[A-Fa-f0-9]{6}$'),
  ADD CONSTRAINT valid_button_text_color CHECK (button_text_color ~ '^#[A-Fa-f0-9]{6}$'),
  ADD CONSTRAINT valid_accent_color CHECK (accent_color ~ '^#[A-Fa-f0-9]{6}$');

-- Add website URL validation
ALTER TABLE public.churches
  ADD CONSTRAINT valid_website CHECK (
    website IS NULL OR 
    website ~ '^https?://[^\s/$.?#].[^\s]*$'
  );

-- Create simplified RLS policies
CREATE POLICY "Enable public read"
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_churches_id ON public.churches(id);
CREATE INDEX IF NOT EXISTS idx_churches_updated_at ON public.churches(updated_at DESC);

-- Grant necessary permissions
GRANT ALL ON public.churches TO authenticated;
GRANT SELECT ON public.churches TO anon;