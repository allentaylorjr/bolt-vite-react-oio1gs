-- Drop existing policies
DROP POLICY IF EXISTS "Allow sermon access" ON public.sermons;
DROP POLICY IF EXISTS "Allow sermon creation" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon updates" ON public.sermons;

-- Create new policies for sermons
CREATE POLICY "Enable read access for church members"
ON public.sermons FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  church_id::text = (auth.jwt() ->> 'church_id')
);

CREATE POLICY "Enable insert for church members"
ON public.sermons FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  church_id::text = (auth.jwt() ->> 'church_id')
);

CREATE POLICY "Enable update for church members"
ON public.sermons FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND
  church_id::text = (auth.jwt() ->> 'church_id')
)
WITH CHECK (
  auth.uid() IS NOT NULL AND
  church_id::text = (auth.jwt() ->> 'church_id')
);

-- Update storage policies
DROP POLICY IF EXISTS "Allow storage access" ON storage.objects;
DROP POLICY IF EXISTS "Allow storage upload" ON storage.objects;

CREATE POLICY "Enable read access for church members"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'sermon-videos' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Enable upload for church members"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sermon-videos' AND
  auth.uid() IS NOT NULL
);

-- Ensure the sermon-videos bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('sermon-videos', 'sermon-videos', true)
ON CONFLICT (id) DO NOTHING;