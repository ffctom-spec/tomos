create table if not exists public.sunset_deck_opportunities (
  id uuid primary key,
  studio_id text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('Trend','Business','People','Place','Investment','Content','Sponsor','Collaboration','Technology','Culture')),
  status text not null check (status in ('Act','Explore','Watch','Archive','Ignore')),
  place text not null default 'Global',
  why_now text not null default '',
  next_action text not null default '',
  brand_fit smallint not null default 0 check (brand_fit between 0 and 10),
  strategic_value smallint not null default 0 check (strategic_value between 0 and 10),
  content_potential smallint not null default 0 check (content_potential between 0 and 10),
  revenue_potential smallint not null default 0 check (revenue_potential between 0 and 10),
  timing smallint not null default 0 check (timing between 0 and 10),
  confidence smallint not null default 0 check (confidence between 0 and 10),
  effort smallint not null default 0 check (effort between 0 and 10),
  risk smallint not null default 0 check (risk between 0 and 10),
  long_term_asset_value smallint not null default 0 check (long_term_asset_value between 0 and 10),
  score smallint not null default 0 check (score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sunset_deck_opportunities_owner_score_idx on public.sunset_deck_opportunities(owner_id, studio_id, score desc);

create table if not exists public.sunset_deck_decisions (
  id uuid primary key,
  studio_id text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid references public.sunset_deck_opportunities(id) on delete set null,
  title text not null,
  context text not null default '',
  recommendation text not null default '',
  status text not null default 'draft' check (status in ('draft','approved','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.sunset_deck_knowledge_nodes (
  id uuid primary key default gen_random_uuid(),
  studio_id text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  node_type text not null,
  title text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sunset_deck_knowledge_edges (
  id uuid primary key default gen_random_uuid(),
  studio_id text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  source_node_id uuid not null references public.sunset_deck_knowledge_nodes(id) on delete cascade,
  target_node_id uuid not null references public.sunset_deck_knowledge_nodes(id) on delete cascade,
  relationship text not null,
  weight numeric(4,3) not null default 1,
  created_at timestamptz not null default now(),
  unique(owner_id, source_node_id, target_node_id, relationship)
);

alter table public.sunset_deck_opportunities enable row level security;
alter table public.sunset_deck_decisions enable row level security;
alter table public.sunset_deck_knowledge_nodes enable row level security;
alter table public.sunset_deck_knowledge_edges enable row level security;

create policy "owners manage opportunities" on public.sunset_deck_opportunities for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage decisions" on public.sunset_deck_decisions for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage knowledge nodes" on public.sunset_deck_knowledge_nodes for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage knowledge edges" on public.sunset_deck_knowledge_edges for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
