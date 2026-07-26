create table if not exists public.sunset_deck_episodes (
  studio_id text not null,
  episode_id bigint not null,
  title text not null,
  subtitle text not null default '',
  series text not null default '',
  status text not null check (status in ('idea', 'script', 'production', 'review', 'approved')),
  duration text not null default '',
  progress integer not null default 0 check (progress between 0 and 100),
  updated_label text not null default '',
  hook text not null default '',
  note text not null default '',
  preview_url text,
  updated_at timestamptz not null default now(),
  primary key (studio_id, episode_id)
);

alter table public.sunset_deck_episodes enable row level security;

-- Temporary MVP policy. Replace with authenticated user policies when login is enabled.
create policy "sunset deck anon read"
on public.sunset_deck_episodes for select
to anon
using (studio_id = 'sunset-deck');

create policy "sunset deck anon insert"
on public.sunset_deck_episodes for insert
to anon
with check (studio_id = 'sunset-deck');

create policy "sunset deck anon update"
on public.sunset_deck_episodes for update
to anon
using (studio_id = 'sunset-deck')
with check (studio_id = 'sunset-deck');

create index if not exists sunset_deck_episodes_updated_at_idx
on public.sunset_deck_episodes (studio_id, updated_at desc);
