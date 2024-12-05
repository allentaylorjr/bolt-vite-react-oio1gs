-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS handle_church_creation ON auth.users;
DROP FUNCTION IF EXISTS handle_church_creation();

-- Ensure proper defaults and constraints on churches table
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

-- Enable RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create simple policies
CREATE POLICY "enable_insert_for_all"
  ON public.churches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "enable_select_for_all"
  ON public.churches FOR SELECT
  USING (true);

CREATE POLICY "enable_update_for_authenticated"
  ON public.churches FOR UPDATE
  USING (auth.role() = 'authenticated' AND id = auth.uid());

-- Grant necessary permissions
GRANT ALL ON public.churches TO authenticated;
GRANT SELECT, INSERT ON public.churches TO anon;