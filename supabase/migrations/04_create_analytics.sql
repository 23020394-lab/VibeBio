-- Create analytics table
create type event_type as enum ('page_view', 'link_click');

create table analytics (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) not null, -- The owner of the profile being viewed/clicked
  type event_type not null,
  
  -- Metadata
  meta jsonb default '{}'::jsonb, -- Store link_id, url, referrer, country, etc.
  
  -- Optional: Anonymous visitor tracking
  visitor_id text -- Fingerprint or session ID
);

-- Indexes for fast dashboard queries
create index analytics_user_id_idx on analytics(user_id);
create index analytics_created_at_idx on analytics(created_at);
create index analytics_type_idx on analytics(type);

-- RLS Policies
alter table analytics enable row level security;

-- 1. Insert: Anyone (public) can insert analytics (logging views/clicks)
create policy "Public can insert analytics"
  on analytics for insert
  with check (true);

-- 2. Select: Only the profile owner can see their own analytics
create policy "Users can view their own analytics"
  on analytics for select
  using (auth.uid() = user_id);
