-- Create churches table
CREATE TABLE public.churches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  description text,
  website text,
  primary_color text DEFAULT '#2563eb' NOT NULL,
  button_text_color text DEFAULT '#FFFFFF' NOT NULL,
  accent_color text DEFAULT '#FFFFFF' NOT NULL,
  font_family text DEFAULT 'Inter' NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Update existing tables to reference churches instead of users
ALTER TABLE public.speakers
DROP CONSTRAINT speakers_church_id_fkey,
ADD CONSTRAINT speakers_church_id_fkey 
  FOREIGN KEY (church_id) 
  REFERENCES public.churches(id)
  ON DELETE CASCADE;

ALTER TABLE public.series
DROP CONSTRAINT series_church_id_fkey,
ADD CONSTRAINT series_church_id_fkey 
  FOREIGN KEY (church_id) 
  REFERENCES public.churches(id)
  ON DELETE CASCADE;

ALTER TABLE public.sermons
DROP CONSTRAINT sermons_church_id_fkey,
ADD CONSTRAINT sermons_church_id_fkey 
  FOREIGN KEY (church_id) 
  REFERENCES public.churches(id)
  ON DELETE CASCADE;

-- Create church_members table for user-church relationships
CREATE TABLE public.church_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id uuid REFERENCES public.churches(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(church_id, user_id)
);

-- Create indexes
CREATE INDEX idx_churches_slug ON public.churches(slug);
CREATE INDEX idx_church_members_church_id ON public.church_members(church_id);
CREATE INDEX idx_church_members_user_id ON public.church_members(user_id);

-- Enable RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_members ENABLE ROW LEVEL SECURITY;

-- Create policies for churches
CREATE POLICY "Enable read access for all users"
  ON public.churches FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON public.churches FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for church admins"
  ON public.churches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = churches.id
      AND church_members.user_id = auth.uid()
      AND church_members.role = 'admin'
    )
  );

-- Create policies for church_members
CREATE POLICY "Enable read access for church members"
  ON public.church_members FOR SELECT
  USING (
    church_id IN (
      SELECT church_id FROM public.church_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Enable insert for church admins"
  ON public.church_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = NEW.church_id
      AND church_members.user_id = auth.uid()
      AND church_members.role = 'admin'
    )
  );

-- Update policies for speakers, series, and sermons
DROP POLICY IF EXISTS "Enable read access for church members" ON public.speakers;
DROP POLICY IF EXISTS "Enable insert for church members" ON public.speakers;
DROP POLICY IF EXISTS "Enable update for church members" ON public.speakers;

DROP POLICY IF EXISTS "Enable read access for church members" ON public.series;
DROP POLICY IF EXISTS "Enable insert for church members" ON public.series;
DROP POLICY IF EXISTS "Enable update for church members" ON public.series;

DROP POLICY IF EXISTS "Enable read access for church members" ON public.sermons;
DROP POLICY IF EXISTS "Enable insert for church members" ON public.sermons;
DROP POLICY IF EXISTS "Enable update for church members" ON public.sermons;

-- Create new policies based on church membership
CREATE POLICY "Enable read access for church members"
  ON public.speakers FOR SELECT
  USING (
    church_id IN (
      SELECT church_id FROM public.church_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Enable insert for church editors"
  ON public.speakers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = NEW.church_id
      AND church_members.user_id = auth.uid()
      AND church_members.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Enable update for church editors"
  ON public.speakers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = speakers.church_id
      AND church_members.user_id = auth.uid()
      AND church_members.role IN ('admin', 'editor')
    )
  );

-- Grant necessary permissions
GRANT ALL ON public.churches TO authenticated;
GRANT SELECT ON public.churches TO anon;
GRANT ALL ON public.church_members TO authenticated;