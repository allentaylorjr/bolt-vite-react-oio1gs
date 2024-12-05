-- Create transaction functions
CREATE OR REPLACE FUNCTION begin_transaction()
RETURNS void AS $$
BEGIN
  -- Start transaction
  BEGIN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION commit_transaction()
RETURNS void AS $$
BEGIN
  -- Commit transaction
  COMMIT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION rollback_transaction()
RETURNS void AS $$
BEGIN
  -- Rollback transaction
  ROLLBACK;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION begin_transaction() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION commit_transaction() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION rollback_transaction() TO authenticated, anon;

-- Update RLS policies
ALTER TABLE auth.users SECURITY DEFINER;
ALTER TABLE public.churches SECURITY DEFINER;

-- Ensure proper defaults
ALTER TABLE public.churches
ALTER COLUMN button_text_color SET DEFAULT '#FFFFFF',
ALTER COLUMN accent_color SET DEFAULT '#FFFFFF',
ALTER COLUMN font_family SET DEFAULT 'Inter',
ALTER COLUMN primary_color SET DEFAULT '#2563eb';

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;