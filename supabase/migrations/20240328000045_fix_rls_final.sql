-- Drop existing policies
DROP POLICY IF EXISTS "Enable read for users" ON public.speakers;
DROP POLICY IF EXISTS "Enable insert for users" ON public.speakers;
DROP POLICY IF EXISTS "Enable update for users" ON public.speakers;
DROP POLICY IF EXISTS "Enable delete for users" ON public.speakers;

-- Enable RLS on speakers table
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;

-- Create policies for speakers
CREATE POLICY "Enable read for users"
ON public.speakers FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable insert for users"
ON public.speakers FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable update for users"
ON public.speakers FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable delete for users"
ON public.speakers FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

-- Grant necessary permissions
GRANT ALL ON public.speakers TO authenticated;
GRANT SELECT ON public.speakers TO anon;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_speakers_church_id ON public.speakers(church_id);
CREATE INDEX IF NOT EXISTS idx_speakers_name ON public.speakers(name);

-- Update churches RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for church members"
ON public.churches FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable update for church members"
ON public.churches FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

-- Grant necessary permissions
GRANT ALL ON public.churches TO authenticated;
GRANT SELECT ON public.churches TO anon;