-- Drop existing policies
DROP POLICY IF EXISTS "Profiles are viewable by users in the same church" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are insertable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Sermons are viewable by users in the same church" ON public.sermons;
DROP POLICY IF EXISTS "Sermons are insertable by church admins and editors" ON public.sermons;
DROP POLICY IF EXISTS "Series are viewable by users in the same church" ON public.series;
DROP POLICY IF EXISTS "Series are insertable by church admins and editors" ON public.series;
DROP POLICY IF EXISTS "Speakers are viewable by users in the same church" ON public.speakers;
DROP POLICY IF EXISTS "Speakers are insertable by church admins and editors" ON public.speakers;

-- Create new, optimized policies for profiles
CREATE POLICY "Enable read access for users in same church"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles AS p
    WHERE p.user_id = auth.uid()
    AND p.church_id = profiles.church_id
  )
);

CREATE POLICY "Enable insert for authenticated users"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policies for sermons
CREATE POLICY "Enable read access for users in same church"
ON public.sermons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles AS p
    WHERE p.user_id = auth.uid()
    AND p.church_id = sermons.church_id
  )
);

CREATE POLICY "Enable insert for admins and editors"
ON public.sermons FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles AS p
    WHERE p.user_id = auth.uid()
    AND p.church_id = sermons.church_id
    AND p.role IN ('admin', 'editor')
  )
);

-- Create policies for series
CREATE POLICY "Enable read access for users in same church"
ON public.series FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles AS p
    WHERE p.user_id = auth.uid()
    AND p.church_id = series.church_id
  )
);

CREATE POLICY "Enable insert for admins and editors"
ON public.series FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles AS p
    WHERE p.user_id = auth.uid()
    AND p.church_id = series.church_id
    AND p.role IN ('admin', 'editor')
  )
);

-- Create policies for speakers
CREATE POLICY "Enable read access for users in same church"
ON public.speakers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles AS p
    WHERE p.user_id = auth.uid()
    AND p.church_id = speakers.church_id
  )
);

CREATE POLICY "Enable insert for admins and editors"
ON public.speakers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles AS p
    WHERE p.user_id = auth.uid()
    AND p.church_id = speakers.church_id
    AND p.role IN ('admin', 'editor')
  )
);

-- Add bucket policies for sermon videos
INSERT INTO storage.buckets (id, name, public) VALUES ('sermon-videos', 'sermon-videos', true);

CREATE POLICY "Enable read access for all users"
ON storage.objects FOR SELECT
USING ( bucket_id = 'sermon-videos' );

CREATE POLICY "Enable upload for authenticated users"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sermon-videos' AND
  auth.role() = 'authenticated'
);