create table if not exists youtube_comments (
  id uuid default uuid_generate_v4() primary key,
  channel_id text references youtube_channels(channel_id) on delete cascade not null,
  video_id text not null,
  comment_id text not null,
  author_name text not null,
  author_profile_image_url text,
  text text not null,
  video_title text not null,
  published_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(comment_id)
);

-- Add RLS policies
alter table youtube_comments enable row level security;

create policy "Users can view comments for their channels"
  on youtube_comments for select
  using (
    exists (
      select 1 from youtube_channels
      where youtube_channels.channel_id = youtube_comments.channel_id
      and youtube_channels.user_id = auth.uid()
    )
  );

create policy "Users can insert comments for their channels"
  on youtube_comments for insert
  with check (
    exists (
      select 1 from youtube_channels
      where youtube_channels.channel_id = youtube_comments.channel_id
      and youtube_channels.user_id = auth.uid()
    )
  );

create policy "Users can update comments for their channels"
  on youtube_comments for update
  using (
    exists (
      select 1 from youtube_channels
      where youtube_channels.channel_id = youtube_comments.channel_id
      and youtube_channels.user_id = auth.uid()
    )
  );

create policy "Users can delete comments for their channels"
  on youtube_comments for delete
  using (
    exists (
      select 1 from youtube_channels
      where youtube_channels.channel_id = youtube_comments.channel_id
      and youtube_channels.user_id = auth.uid()
    )
  );

-- Add updated_at trigger
create trigger update_youtube_comments_updated_at
  before update on youtube_comments
  for each row
  execute function update_updated_at_column();

-- Create index for faster queries
create index youtube_comments_channel_id_idx on youtube_comments(channel_id);
create index youtube_comments_published_at_idx on youtube_comments(published_at desc);
