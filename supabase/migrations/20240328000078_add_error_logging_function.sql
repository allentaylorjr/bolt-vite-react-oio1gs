-- Create function to log registration errors from triggers
CREATE OR REPLACE FUNCTION log_registration_error()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND TG_TABLE_NAME = 'users' THEN
    -- Log any errors that occur during user creation
    IF NEW.raw_user_metadata->>'error' IS NOT NULL THEN
      INSERT INTO public.registration_errors (
        user_id,
        email,
        error_code,
        error_message,
        error_details,
        metadata,
        created_at
      ) VALUES (
        NEW.id,
        NEW.email,
        'USER_CREATION_ERROR',
        NEW.raw_user_metadata->>'error',
        jsonb_build_object('metadata', NEW.raw_user_metadata),
        jsonb_build_object(
          'trigger_name', TG_NAME,
          'table_name', TG_TABLE_NAME,
          'operation', TG_OP
        ),
        NOW()
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to log registration errors
CREATE TRIGGER log_registration_error
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION log_registration_error();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION log_registration_error() TO postgres;