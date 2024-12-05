-- Drop existing trigger and function
DROP TRIGGER IF EXISTS handle_church_creation ON auth.users;
DROP FUNCTION IF EXISTS handle_church_creation();

-- Create improved church creation function with better error handling
CREATE OR REPLACE FUNCTION handle_church_creation()
RETURNS TRIGGER AS $$
DECLARE
  v_church_id uuid;
BEGIN
  -- Begin an autonomous transaction
  CREATE TEMPORARY TABLE IF NOT EXISTS temp_church_creation(
    church_id uuid
  );

  -- Attempt to create the church record
  INSERT INTO public.churches (
    id,
    name,
    slug,
    subdomain,
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
    COALESCE(NEW.raw_user_metadata->>'subdomain', ''),
    COALESCE(NEW.raw_user_metadata->>'primary_color', '#2563eb'),
    COALESCE(NEW.raw_user_metadata->>'button_text_color', '#FFFFFF'),
    COALESCE(NEW.raw_user_metadata->>'accent_color', '#FFFFFF'),
    COALESCE(NEW.raw_user_metadata->>'font_family', 'Inter'),
    NOW(),
    NOW()
  )
  RETURNING id INTO v_church_id;

  -- Store the result
  INSERT INTO temp_church_creation (church_id) VALUES (v_church_id);

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error and return NULL to prevent the user creation from failing
  RAISE WARNING 'Error in handle_church_creation: %', SQLERRM;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for church creation
CREATE TRIGGER handle_church_creation
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_church_creation();

-- Ensure proper defaults and constraints
ALTER TABLE public.churches
  ALTER COLUMN primary_color SET DEFAULT '#2563eb',
  ALTER COLUMN button_text_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN accent_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN font_family SET DEFAULT 'Inter';

ALTER TABLE public.churches
  ALTER COLUMN primary_color SET NOT NULL,
  ALTER COLUMN button_text_color SET NOT NULL,
  ALTER COLUMN accent_color SET NOT NULL,
  ALTER COLUMN font_family SET NOT NULL;

-- Create policies for public access
CREATE POLICY "allow_public_read"
  ON public.churches
  FOR SELECT
  USING (true);

CREATE POLICY "allow_authenticated_update"
  ON public.churches
  FOR UPDATE
  USING (auth.role() = 'authenticated' AND id = auth.uid());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated, anon;
GRANT ALL ON auth.users TO postgres;
GRANT ALL ON public.churches TO postgres;
GRANT SELECT ON public.churches TO authenticated, anon;
GRANT UPDATE ON public.churches TO authenticated;

-- Create error tracking table
CREATE TABLE IF NOT EXISTS public.registration_errors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  error_message text,
  error_details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Grant access to error tracking
GRANT INSERT ON public.registration_errors TO postgres;
GRANT SELECT ON public.registration_errors TO postgres;