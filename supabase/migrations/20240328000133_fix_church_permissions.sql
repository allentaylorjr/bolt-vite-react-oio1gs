-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.churches;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.churches;
DROP POLICY IF EXISTS "Enable update for church admins" ON public.churches;

-- Enable RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create policies for churches
CREATE POLICY "enable_church_read"
  ON public.churches FOR SELECT
  USING (true);

CREATE POLICY "enable_church_insert"
  ON public.churches FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    id = auth.uid()
  );

CREATE POLICY "enable_church_update"
  ON public.churches FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    id = auth.uid()
  );

-- Create policies for sermons
DROP POLICY IF EXISTS "Enable read access for all users" ON public.sermons;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.sermons;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.sermons;

CREATE POLICY "enable_sermon_read"
  ON public.sermons FOR SELECT
  USING (true);

CREATE POLICY "enable_sermon_insert"
  ON public.sermons FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    church_id = auth.uid()
  );

CREATE POLICY "enable_sermon_update"
  ON public.sermons FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    church_id = auth.uid()
  );

CREATE POLICY "enable_sermon_delete"
  ON public.sermons FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    church_id = auth.uid()
  );

-- Create policies for storage
DROP POLICY IF EXISTS "Enable storage read" ON storage.objects;
DROP POLICY IF EXISTS "Enable storage write" ON storage.objects;

CREATE POLICY "enable_storage_read"
  ON storage.objects FOR SELECT
  USING (bucket_id IN (
    'sermon-videos',
    'sermon-thumbnails',
    'speaker-profiles',
    'series-thumbnails',
    'church-logos'
  ));

CREATE POLICY "enable_storage_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    bucket_id IN (
      'sermon-videos',
      'sermon-thumbnails',
      'speaker-profiles',
      'series-thumbnails',
      'church-logos'
    ) AND
    (storage.foldername(name))[1]::uuid = auth.uid()
  );

-- Grant necessary permissions
GRANT ALL ON public.churches TO authenticated;
GRANT SELECT ON public.churches TO anon;
GRANT ALL ON public.sermons TO authenticated;
GRANT SELECT ON public.sermons TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

-- Create function to handle church creation on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.churches (
    id,
    name,
    slug,
    primary_color,
    button_text_color,
    accent_color,
    font_family,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_metadata->>'name', ''),
    COALESCE(NEW.raw_user_metadata->>'slug', ''),
    '#2563eb',
    '#FFFFFF',
    '#FFFFFF',
    'Inter',
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();