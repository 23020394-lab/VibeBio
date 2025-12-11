-- Add admin flag
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Add banned flag  
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON profiles(is_banned);

-- Update RLS policies to allow admins to view all profiles
-- (Note: 09_fix_rls_final.sql might need adjustment or we add specific admin policies here)

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING ( is_admin = true );

-- Policy for banning users (updating is_banned)
DROP POLICY IF EXISTS "Admins can ban users" ON profiles;

CREATE POLICY "Admins can ban users"
  ON profiles FOR UPDATE
  USING ( is_admin = true );
