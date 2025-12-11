-- Add theme_config to profiles
alter table profiles 
add column if not exists theme_config jsonb default '{"id": "minimal", "variant": "light", "primaryColor": "#000000", "backgroundColor": "#ffffff"}'::jsonb;

-- Create valid_themes table if we want to store presets in DB, but for MVP constants are fine.
-- Let's stick to adding the column for now.
