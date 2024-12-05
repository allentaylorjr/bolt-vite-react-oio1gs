-- Drop existing trigger and function
DROP TRIGGER IF EXISTS handle_church_creation ON auth.users;
DROP FUNCTION IF EXISTS handle_church_creation();

-- Drop existing policies
DROP POLICY IF EXISTS "allow_public_read" ON public.churches;
DROP POLICY IF EXISTS "allow_authenticated_update" ON public.churches;

-- Enable RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
CREATE POLICY "enable_insert_for_all"
  ON public.churches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "enable_select_for_all"
  ON public.churches FOR SELECT
  USING (true);

CREATE POLICY "enable_update_for_authenticated"
  ON public.churches FOR UPDATE
  USING (auth.role() = 'authenticated' AND id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid);

-- Ensure proper defaults and constraints
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

-- Update any existing NULL values
UPDATE public.churches SET
  primary_color = '#2563eb',
  button_text_color = '#FFFFFF',
  accent_color = '#FFFFFF',
  font_family = 'Inter'
WHERE
  primary_color IS NULL OR
  button_text_color IS NULL OR
  accent_color IS NULL OR
  font_family IS NULL;

-- Grant necessary permissions
GRANT ALL ON public.churches TO authenticated;
GRANT SELECT, INSERT ON public.churches TO anon;