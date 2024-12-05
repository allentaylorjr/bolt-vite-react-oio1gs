-- Drop existing policies
DROP POLICY IF EXISTS "allow_select" ON public.churches;
DROP POLICY IF EXISTS "allow_insert" ON public.churches;
DROP POLICY IF EXISTS "allow_update" ON public.churches;

-- Enable RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
CREATE POLICY "enable_public_read"
  ON public.churches FOR SELECT
  USING (true);

CREATE POLICY "enable_public_insert"
  ON public.churches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "enable_auth_update"
  ON public.churches FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

-- Grant necessary permissions
GRANT ALL ON public.churches TO authenticated;
GRANT SELECT, INSERT ON public.churches TO anon;

-- Add required indexes
CREATE INDEX IF NOT EXISTS idx_churches_slug ON public.churches(slug);
CREATE INDEX IF NOT EXISTS idx_churches_id ON public.churches(id);