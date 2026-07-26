alter table public.sunset_deck_episodes
  add column if not exists youtube_video_id text,
  add column if not exists publish_state text not null default 'not_ready'
    check (publish_state in ('not_ready', 'ready', 'scheduled', 'published', 'failed')),
  add column if not exists privacy_status text not null default 'private'
    check (privacy_status in ('private', 'unlisted', 'public')),
  add column if not exists scheduled_at timestamptz,
  add column if not exists published_at timestamptz,
  add column if not exists publish_error text;

create index if not exists sunset_deck_publish_queue_idx
on public.sunset_deck_episodes (owner_id, publish_state, scheduled_at);
