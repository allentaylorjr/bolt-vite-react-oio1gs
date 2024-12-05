-- Drop existing sermon policies
DROP POLICY IF EXISTS "Enable sermon access" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon creation" ON public.sermons;

-- Create new, simplified sermon policies
CREATE POLICY "Sermons viewable by church members"
ON public.sermons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND church_id = sermons.church_id
  )
);

CREATE POLICY "Sermons insertable by church members"
ON public.sermons FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND church_id = sermons.church_id
  )
);

-- Ensure storage bucket exists and has correct policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('sermon-videos', 'sermon-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Update storage policies
CREATE POLICY "Videos accessible by church members"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'sermon-videos'
  AND (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND church_id = (storage.foldername(name))[1]::uuid
    )
  )
);

CREATE POLICY "Videos uploadable by church members"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sermon-videos'
  AND auth.role() = 'authenticated'
  AND (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND church_id = (storage.foldername(name))[1]::uuid
    )
  )
);