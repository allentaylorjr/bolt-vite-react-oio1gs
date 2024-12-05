-- Drop existing policies
DROP POLICY IF EXISTS "Enable sermon access" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon creation" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon updates" ON public.sermons;
DROP POLICY IF EXISTS "Enable storage read" ON storage.objects;
DROP POLICY IF EXISTS "Enable storage write" ON storage.objects;

-- Create simplified sermon policies
CREATE POLICY "Enable sermon access"
ON public.sermons FOR SELECT
USING (true);

CREATE POLICY "Enable sermon creation"
ON public.sermons FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable sermon updates"
ON public.sermons FOR UPDATE
USING (auth.role() = 'authenticated');

-- Create simplified storage policies
CREATE POLICY "Enable storage read"
ON storage.objects FOR SELECT
USING (true);

CREATE POLICY "Enable storage write"
ON storage.objects FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON public.sermons TO authenticated;
GRANT SELECT ON public.sermons TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

-- Ensure RLS is enabled
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;