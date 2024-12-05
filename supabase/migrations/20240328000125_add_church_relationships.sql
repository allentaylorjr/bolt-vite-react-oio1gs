-- Add church_id column to speakers table
ALTER TABLE public.speakers
ADD COLUMN church_id uuid REFERENCES auth.users(id),
ALTER COLUMN church_id SET NOT NULL;

-- Add church_id column to series table
ALTER TABLE public.series
ADD COLUMN church_id uuid REFERENCES auth.users(id),
ALTER COLUMN church_id SET NOT NULL;

-- Add church_id column to sermons table
ALTER TABLE public.sermons
ADD COLUMN church_id uuid REFERENCES auth.users(id),
ALTER COLUMN church_id SET NOT NULL;

-- Create indexes for church_id columns
CREATE INDEX idx_speakers_church_id ON public.speakers(church_id);
CREATE INDEX idx_series_church_id ON public.series(church_id);
CREATE INDEX idx_sermons_church_id ON public.sermons(church_id);

-- Update RLS policies to include church_id checks
DROP POLICY IF EXISTS "Enable read access for all users" ON public.speakers;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.speakers;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.speakers;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.series;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.series;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.series;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.sermons;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.sermons;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.sermons;

-- Create new policies for speakers
CREATE POLICY "Enable read access for church members"
  ON public.speakers FOR SELECT
  USING (church_id = auth.uid());

CREATE POLICY "Enable insert for church members"
  ON public.speakers FOR INSERT
  WITH CHECK (church_id = auth.uid());

CREATE POLICY "Enable update for church members"
  ON public.speakers FOR UPDATE
  USING (church_id = auth.uid());

-- Create new policies for series
CREATE POLICY "Enable read access for church members"
  ON public.series FOR SELECT
  USING (church_id = auth.uid());

CREATE POLICY "Enable insert for church members"
  ON public.series FOR INSERT
  WITH CHECK (church_id = auth.uid());

CREATE POLICY "Enable update for church members"
  ON public.series FOR UPDATE
  USING (church_id = auth.uid());

-- Create new policies for sermons
CREATE POLICY "Enable read access for church members"
  ON public.sermons FOR SELECT
  USING (church_id = auth.uid());

CREATE POLICY "Enable insert for church members"
  ON public.sermons FOR INSERT
  WITH CHECK (church_id = auth.uid());

CREATE POLICY "Enable update for church members"
  ON public.sermons FOR UPDATE
  USING (church_id = auth.uid());