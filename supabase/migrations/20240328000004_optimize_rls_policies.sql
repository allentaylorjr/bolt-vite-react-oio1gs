-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Enable read access for users in same church" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for users in same church" ON public.sermons;
DROP POLICY IF EXISTS "Enable insert for admins and editors" ON public.sermons;
DROP POLICY IF EXISTS "Enable read access for users in same church" ON public.series;
DROP POLICY IF EXISTS "Enable insert for admins and editors" ON public.series;
DROP POLICY IF EXISTS "Enable read access for users in same church" ON public.speakers;
DROP POLICY IF EXISTS "Enable insert for admins and editors" ON public.speakers;

-- Simplified profile policies
CREATE POLICY "Profiles viewable by same church"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND church_id = profiles.church_id
  )
);

CREATE POLICY "Profiles insertable by user"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Simplified sermon policies
CREATE POLICY "Sermons viewable by church members"
ON public.sermons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND church_id = sermons.church_id
  )
);

CREATE POLICY "Sermons insertable by admins and editors"
ON public.sermons FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND church_id = sermons.church_id
    AND role IN ('admin', 'editor')
  )
);

-- Simplified series policies
CREATE POLICY "Series viewable by church members"
ON public.series FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND church_id = series.church_id
  )
);

CREATE POLICY "Series insertable by admins and editors"
ON public.series FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND church_id = series.church_id
    AND role IN ('admin', 'editor')
  )
);

-- Simplified speaker policies
CREATE POLICY "Speakers viewable by church members"
ON public.speakers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND church_id = speakers.church_id
  )
);

CREATE POLICY "Speakers insertable by admins and editors"
ON public.speakers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND church_id = speakers.church_id
    AND role IN ('admin', 'editor')
  )
);

-- Create storage bucket for sermon videos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('sermon-videos', 'sermon-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Videos readable by anyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'sermon-videos');

CREATE POLICY "Videos uploadable by authenticated users"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sermon-videos' 
  AND auth.role() = 'authenticated'
);