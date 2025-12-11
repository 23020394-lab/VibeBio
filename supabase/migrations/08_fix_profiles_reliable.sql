-- Ensure username length constraint doesn't block insert
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS username_length;
ALTER TABLE profiles ADD CONSTRAINT username_length CHECK (username IS NULL OR char_length(username) >= 3);

-- Insert missing profiles again, but safer
INSERT INTO public.profiles (id, full_name, avatar_url, username)
SELECT 
    id, 
    raw_user_meta_data->>'full_name', 
    raw_user_meta_data->>'avatar_url',
    CASE 
        WHEN raw_user_meta_data->>'user_name' IS NOT NULL THEN raw_user_meta_data->>'user_name'
        WHEN char_length(split_part(email, '@', 1)) < 3 THEN split_part(email, '@', 1) || '_vibe'
        ELSE split_part(email, '@', 1)
    END
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
