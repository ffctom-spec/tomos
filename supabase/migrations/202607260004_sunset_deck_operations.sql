create table if not exists public.sunset_deck_people_places (
  id uuid primary key default gen_random_uuid(),
  studio_id text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null check (entity_type in ('Person','Place','Organization')),
  name text not null,
  role text not null default '',
  location text not null default '',
  story_value text not null default '',
  relationship_status text not null default 'discovered' check (relationship_status in ('discovered','active','trusted','archive')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sunset_deck_production_tasks (
  id uuid primary key default gen_random_uuid(),
  studio_id text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  episode_id integer,
  opportunity_id uuid references public.sunset_deck_opportunities(id) on delete set null,
  title text not null,
  task_type text not null default 'production',
  status text not null default 'backlog' check (status in ('backlog','ready','doing','review','done','blocked')),
  priority smallint not null default 3 check (priority between 1 and 5),
  assigned_agent text not null default 'Executive Orchestrator',
  due_at timestamptz,
  output_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sunset_deck_sound_assets (
  id uuid primary key default gen_random_uuid(),
  studio_id text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  artist text not null default '',
  mood text not null default '',
  bpm integer,
  usage_type text not null default 'background',
  license_status text not null default 'research' check (license_status in ('research','cleared','owned','restricted')),
  source_url text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sunset_deck_agent_runs (
  id uuid primary key default gen_random_uuid(),
  studio_id text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  agent_name text not null,
  run_type text not null,
  status text not null default 'queued' check (status in ('queued','running','needs_approval','completed','failed')),
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  related_entity_type text,
  related_entity_id text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.sunset_deck_people_places enable row level security;
alter table public.sunset_deck_production_tasks enable row level security;
alter table public.sunset_deck_sound_assets enable row level security;
alter table public.sunset_deck_agent_runs enable row level security;

create policy "owners manage people places" on public.sunset_deck_people_places for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage production tasks" on public.sunset_deck_production_tasks for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage sound assets" on public.sunset_deck_sound_assets for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage agent runs" on public.sunset_deck_agent_runs for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index if not exists sunset_deck_tasks_status_idx on public.sunset_deck_production_tasks(owner_id, studio_id, status, priority);
create index if not exists sunset_deck_people_places_type_idx on public.sunset_deck_people_places(owner_id, studio_id, entity_type);
create index if not exists sunset_deck_agent_runs_status_idx on public.sunset_deck_agent_runs(owner_id, studio_id, status, created_at desc);