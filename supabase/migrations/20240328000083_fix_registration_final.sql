-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS handle_church_creation ON auth.users;
DROP FUNCTION IF EXISTS handle_church_creation();

-- Drop existing policies
DROP POLICY IF EXISTS "enable_insert_for_auth" ON public.churches;
DROP POLICY IF EXISTS "enable_select_for_all" ON public.churches;
DROP POLICY IF EXISTS "enable_update_for_owner" ON public.churches;

-- Enable RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create simple policies
CREATE POLICY "allow_insert_for_all"
  ON public.churches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "allow_select_for_all"
  ON public.churches FOR SELECT
  USING (true);

CREATE POLICY "allow_update_for_owner"
  ON public.churches FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND 
    id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

-- Ensure proper defaults and constraints
ALTER TABLE public.churches
  ALTER COLUMN primary_color SET DEFAULT '#2563eb',
  ALTER COLUMN button_text_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN accent_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN font_family SET DEFAULT 'Inter';

ALTER TABLE public.churches
  ALTER COLUMN primary_color SET NOT NULL,
  ALTER COLUMN button_text_color SET NOT NULL,
  ALTER COLUMN accent_color SET NOT NULL,
  ALTER COLUMN font_family SET NOT NULL;

-- Grant necessary permissions
GRANT ALL ON public.churches TO authenticated;
GRANT SELECT, INSERT ON public.churches TO anon;

-- Ensure error logging table exists
CREATE TABLE IF NOT EXISTS public.registration_errors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  message text NOT NULL,
  details jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS for error logging
ALTER TABLE public.registration_errors ENABLE ROW LEVEL SECURITY;

-- Create policies for error logging
CREATE POLICY "allow_insert_for_all"
  ON public.registration_errors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "allow_select_for_auth"
  ON public.registration_errors FOR SELECT
  USING (auth.role() = 'authenticated');

-- Grant permissions for error logging
GRANT INSERT ON public.registration_errors TO anon, authenticated;
GRANT SELECT ON public.registration_errors TO authenticated;