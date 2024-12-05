-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Ensure churches table has correct constraints
ALTER TABLE public.churches
ALTER COLUMN button_text_color SET DEFAULT '#FFFFFF',
ALTER COLUMN accent_color SET DEFAULT '#FFFFFF',
ALTER COLUMN font_family SET DEFAULT 'Inter';

-- Update policies to allow registration
CREATE POLICY "Enable public signup"
ON auth.users FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable church creation"
ON public.churches FOR INSERT
WITH CHECK (true);

-- Grant necessary permissions
GRANT INSERT ON public.churches TO anon;
GRANT INSERT ON auth.users TO anon;

-- Add RLS bypass for registration
ALTER TABLE public.churches SECURITY DEFINER;