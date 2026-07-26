create table if not exists public.sunset_deck_episodes (
  studio_id text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
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
  primary key (studio_id, owner_id, episode_id)
);

alter table public.sunset_deck_episodes enable row level security;

create policy "sunset deck owner read"
on public.sunset_deck_episodes for select
to authenticated
using (auth.uid() = owner_id);

create policy "sunset deck owner insert"
on public.sunset_deck_episodes for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "sunset deck owner update"
on public.sunset_deck_episodes for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "sunset deck owner delete"
on public.sunset_deck_episodes for delete
to authenticated
using (auth.uid() = owner_id);

create index if not exists sunset_deck_episodes_updated_at_idx
on public.sunset_deck_episodes (studio_id, owner_id, updated_at desc);
