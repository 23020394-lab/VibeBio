-- Create links table
create table links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  icon text, -- simplified for now (e.g. 'instagram', 'facebook')
  is_active boolean default true,
  position integer default 0
);

-- RLS Policies
alter table links enable row level security;

create policy "Public links are viewable by everyone."
  on links for select
  using ( is_active = true );

create policy "Users can manage their own links."
  on links for all
  using ( auth.uid() = user_id );

-- Create index for faster ordering
create index links_user_id_position_idx on links (user_id, position);
