-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to clean up potential mess
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles; -- Cleanup from Epic 5 attempt

-- Re-create standard policies
CREATE POLICY "Public profiles are viewable by everyone." 
ON profiles FOR SELECT 
USING ( true );

CREATE POLICY "Users can insert their own profile." 
ON profiles FOR INSERT 
WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile." 
ON profiles FOR UPDATE 
USING ( auth.uid() = id );
