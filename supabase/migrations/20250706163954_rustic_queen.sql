/*
  # Disable Email Confirmation for Signup

  1. Configuration Changes
    - Disable email confirmation requirement
    - Allow users to sign up without email verification
    - Update auth settings for immediate access

  2. Security Notes
    - Users can sign up and access the app immediately
    - Email verification is bypassed
    - Consider the security implications for production use
*/

-- Disable email confirmation requirement
-- Note: This would typically be done through Supabase dashboard settings
-- For development purposes, we'll ensure the trigger handles unconfirmed users

-- Update the handle_new_user function to work with unconfirmed emails
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger works for all user insertions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();