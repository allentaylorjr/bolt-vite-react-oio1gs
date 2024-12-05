-- Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Profiles viewable by same church" ON public.profiles;
DROP POLICY IF EXISTS "Profiles insertable by user" ON public.profiles;
DROP POLICY IF EXISTS "Sermons viewable by church members" ON public.sermons;
DROP POLICY IF EXISTS "Sermons insertable by admins and editors" ON public.sermons;
DROP POLICY IF EXISTS "Series viewable by church members" ON public.series;
DROP POLICY IF EXISTS "Series insertable by admins and editors" ON public.series;
DROP POLICY IF EXISTS "Speakers viewable by church members" ON public.speakers;
DROP POLICY IF EXISTS "Speakers insertable by admins and editors" ON public.speakers;

-- Create materialized view for user church memberships to optimize lookups
CREATE MATERIALIZED VIEW user_church_memberships AS
SELECT DISTINCT user_id, church_id
FROM public.profiles;

CREATE UNIQUE INDEX idx_user_church_memberships ON user_church_memberships (user_id, church_id);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_user_church_memberships()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_church_memberships;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh materialized view
CREATE TRIGGER refresh_user_church_memberships_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.profiles
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_user_church_memberships();

-- Simplified and optimized policies using materialized view
CREATE POLICY "Enable profile access"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_church_memberships
    WHERE user_id = auth.uid()
    AND church_id = profiles.church_id
  )
);

CREATE POLICY "Enable profile creation"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable sermon access"
ON public.sermons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_church_memberships
    WHERE user_id = auth.uid()
    AND church_id = sermons.church_id
  )
);

CREATE POLICY "Enable sermon creation"
ON public.sermons FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND church_id = sermons.church_id
    AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "Enable series access"
ON public.series FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_church_memberships
    WHERE user_id = auth.uid()
    AND church_id = series.church_id
  )
);

CREATE POLICY "Enable series creation"
ON public.series FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND church_id = series.church_id
    AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "Enable speaker access"
ON public.speakers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_church_memberships
    WHERE user_id = auth.uid()
    AND church_id = speakers.church_id
  )
);

CREATE POLICY "Enable speaker creation"
ON public.speakers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND church_id = speakers.church_id
    AND role IN ('admin', 'editor')
  )
);

-- Refresh the materialized view initially
REFRESH MATERIALIZED VIEW user_church_memberships;