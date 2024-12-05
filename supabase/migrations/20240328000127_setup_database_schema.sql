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

-- Create speakers table
CREATE TABLE public.speakers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id uuid REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  title text,
  bio text,
  profile_picture_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create series table
CREATE TABLE public.series (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id uuid REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  thumbnail_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create sermons table
CREATE TABLE public.sermons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id uuid REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  speaker_id uuid REFERENCES public.speakers(id),
  series_id uuid REFERENCES public.series(id),
  video_url text,
  thumbnail_url text,
  date date NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create church_members table for user-church relationships
CREATE TABLE public.church_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id uuid REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(church_id, user_id)
);

-- Create indexes
CREATE INDEX idx_churches_slug ON public.churches(slug);
CREATE INDEX idx_speakers_church_id ON public.speakers(church_id);
CREATE INDEX idx_series_church_id ON public.series(church_id);
CREATE INDEX idx_sermons_church_id ON public.sermons(church_id);
CREATE INDEX idx_sermons_speaker_id ON public.sermons(speaker_id);
CREATE INDEX idx_sermons_series_id ON public.sermons(series_id);
CREATE INDEX idx_sermons_date ON public.sermons(date DESC);
CREATE INDEX idx_church_members_church_id ON public.church_members(church_id);
CREATE INDEX idx_church_members_user_id ON public.church_members(user_id);

-- Enable RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
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

-- Create policies for speakers, series, and sermons
CREATE POLICY "Enable read access for church content"
  ON public.speakers FOR SELECT
  USING (true);

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

-- Apply similar policies to series and sermons
CREATE POLICY "Enable read access for church content"
  ON public.series FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for church editors"
  ON public.series FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = NEW.church_id
      AND church_members.user_id = auth.uid()
      AND church_members.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Enable update for church editors"
  ON public.series FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = series.church_id
      AND church_members.user_id = auth.uid()
      AND church_members.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Enable read access for church content"
  ON public.sermons FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for church editors"
  ON public.sermons FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = NEW.church_id
      AND church_members.user_id = auth.uid()
      AND church_members.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Enable update for church editors"
  ON public.sermons FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = sermons.church_id
      AND church_members.user_id = auth.uid()
      AND church_members.role IN ('admin', 'editor')
    )
  );

-- Grant necessary permissions
GRANT ALL ON public.churches TO authenticated;
GRANT SELECT ON public.churches TO anon;
GRANT ALL ON public.church_members TO authenticated;
GRANT ALL ON public.speakers TO authenticated;
GRANT SELECT ON public.speakers TO anon;
GRANT ALL ON public.series TO authenticated;
GRANT SELECT ON public.series TO anon;
GRANT ALL ON public.sermons TO authenticated;
GRANT SELECT ON public.sermons TO anon;