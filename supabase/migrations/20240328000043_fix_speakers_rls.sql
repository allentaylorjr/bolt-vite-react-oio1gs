-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read for users" ON public.speakers;
DROP POLICY IF EXISTS "Enable insert for users" ON public.speakers;
DROP POLICY IF EXISTS "Enable update for users" ON public.speakers;
DROP POLICY IF EXISTS "Enable delete for users" ON public.speakers;

-- Enable RLS on speakers table
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;

-- Create simplified policies for speakers
CREATE POLICY "Enable read for users"
ON public.speakers FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for users"
ON public.speakers FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users"
ON public.speakers FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for users"
ON public.speakers FOR DELETE
USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON public.speakers TO authenticated;
GRANT SELECT ON public.speakers TO anon;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_speakers_church_id ON public.speakers(church_id);
CREATE INDEX IF NOT EXISTS idx_speakers_name ON public.speakers(name);