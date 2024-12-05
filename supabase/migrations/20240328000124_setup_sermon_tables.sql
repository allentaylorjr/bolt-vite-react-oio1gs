-- Create speakers table
CREATE TABLE public.speakers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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
  name text NOT NULL,
  description text,
  thumbnail_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create sermons table with foreign key relationships
CREATE TABLE public.sermons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Create indexes for better performance
CREATE INDEX idx_sermons_speaker_id ON public.sermons(speaker_id);
CREATE INDEX idx_sermons_series_id ON public.sermons(series_id);
CREATE INDEX idx_sermons_date ON public.sermons(date DESC);

-- Enable RLS
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;

-- Create policies for speakers
CREATE POLICY "Enable read access for all users"
  ON public.speakers FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON public.speakers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
  ON public.speakers FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policies for series
CREATE POLICY "Enable read access for all users"
  ON public.series FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON public.series FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
  ON public.series FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policies for sermons
CREATE POLICY "Enable read access for all users"
  ON public.sermons FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON public.sermons FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
  ON public.sermons FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON public.speakers TO authenticated;
GRANT ALL ON public.series TO authenticated;
GRANT ALL ON public.sermons TO authenticated;
GRANT SELECT ON public.speakers TO anon;
GRANT SELECT ON public.series TO anon;
GRANT SELECT ON public.sermons TO anon;