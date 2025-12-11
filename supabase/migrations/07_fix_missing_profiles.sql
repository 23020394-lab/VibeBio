-- Insert missing profiles for existing auth users
INSERT INTO public.profiles (id, full_name, avatar_url, username)
SELECT 
    id, 
    raw_user_meta_data->>'full_name', 
    raw_user_meta_data->>'avatar_url',
    COALESCE(raw_user_meta_data->>'user_name', split_part(email, '@', 1)) -- Fallback username from email
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- Verify policies exists (just to be safe)
-- (Policies are already in 01_create_profiles.sql, assuming they are active)
