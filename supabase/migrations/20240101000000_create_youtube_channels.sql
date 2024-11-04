create table if not exists youtube_channels (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  channel_id text not null,
  channel_title text not null,
  access_token text not null,
  refresh_token text not null,
  subscriber_count text not null,
  video_count integer not null,
  channel_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, channel_id)
);

-- Add RLS policies
alter table youtube_channels enable row level security;

create policy "Users can view their own channels"
  on youtube_channels for select
  using (auth.uid() = user_id);

create policy "Users can insert their own channels"
  on youtube_channels for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own channels"
  on youtube_channels for update
  using (auth.uid() = user_id);

create policy "Users can delete their own channels"
  on youtube_channels for delete
  using (auth.uid() = user_id);

-- Add updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_youtube_channels_updated_at
  before update on youtube_channels
  for each row
  execute function update_updated_at_column();
