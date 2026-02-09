-- ============================================
-- AUTH TRIGGER SETUP
-- ============================================
-- This migration creates a trigger that automatically creates user records
-- when a new user signs up through Supabase Auth.

-- Helper function to generate nanoid-like IDs in SQL
CREATE OR REPLACE FUNCTION public.generate_nanoid(size int DEFAULT 12)
RETURNS text AS $$
DECLARE
  alphabet text := '2346789abcdefghijkmnpqrtwxyzABCDEFGHJKLMNPQRTUVWXYZ';
  result text := '';
  i int;
BEGIN
  FOR i IN 1..size LOOP
    result := result || substr(alphabet, floor(random() * length(alphabet) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into public.users table
  INSERT INTO public.users (id, email, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.created_at
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert into public.profiles table if user-profiles feature is enabled
  INSERT INTO public.profiles (id, user_id, display_name, avatar)
  VALUES (
    public.generate_nanoid(),
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing auth.users into public.users (only if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'users'
  ) THEN
    INSERT INTO public.users (id, email, created_at)
    SELECT id, email, created_at
    FROM auth.users
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Backfill existing users into public.profiles (only if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'profiles'
  ) THEN
    INSERT INTO public.profiles (id, user_id, display_name, avatar)
    SELECT
      public.generate_nanoid(),
      id,
      COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'),
      raw_user_meta_data->>'avatar_url'
    FROM auth.users
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
END $$;

-- ============================================
-- NOTES
-- ============================================
-- Multi-tenant architecture:
--   - Users can join organizations via invites (tenant_id is nullable)
--   - Organizations are created separately in the application code
--   - tenant_memberships table tracks user-organization relationships
--
-- User profiles:
--   - Profiles are created automatically when a user signs up
--   - Profile data is pulled from raw_user_meta_data (useful for OAuth)
--   - Magic link auth won't have much metadata, but OAuth will
