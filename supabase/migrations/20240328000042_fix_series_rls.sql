-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read for users" ON public.series;
DROP POLICY IF EXISTS "Enable insert for users" ON public.series;
DROP POLICY IF EXISTS "Enable update for users" ON public.series;
DROP POLICY IF EXISTS "Enable delete for users" ON public.series;

-- Enable RLS on series table
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;

-- Create policies for series table
CREATE POLICY "Enable read for users"
ON public.series FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable insert for users"
ON public.series FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable update for users"
ON public.series FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable delete for users"
ON public.series FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

-- Grant necessary permissions
GRANT ALL ON public.series TO authenticated;
GRANT SELECT ON public.series TO anon;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_series_church_id ON public.series(church_id);
CREATE INDEX IF NOT EXISTS idx_series_name ON public.series(name);