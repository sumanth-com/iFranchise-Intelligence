-- iFranchise Intelligence Platform — initial schema

create extension if not exists "pgcrypto";

-- Competitors
create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  latest_topic text not null,
  publish_date timestamptz not null default now(),
  gap_score integer not null check (gap_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trends
create table if not exists public.trends (
  id uuid primary key default gen_random_uuid(),
  keyword text not null,
  industry text,
  growth_percent numeric(6,1) not null default 0,
  competition text not null check (competition in ('Low', 'Medium', 'High')),
  opportunity_score integer not null check (opportunity_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Opportunities
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  industry text not null,
  city text not null,
  score integer not null check (score between 0 and 100),
  priority text not null check (priority in ('Critical', 'High', 'Medium', 'Low')),
  status text not null check (status in ('Hot', 'Active', 'Review')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Generated content
create table if not exists public.generated_content (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('blog', 'linkedin', 'email')),
  topic text not null,
  content text not null default '',
  channel text not null,
  views integer not null default 0,
  engagement integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger competitors_updated_at
  before update on public.competitors
  for each row execute function public.set_updated_at();

create trigger trends_updated_at
  before update on public.trends
  for each row execute function public.set_updated_at();

create trigger opportunities_updated_at
  before update on public.opportunities
  for each row execute function public.set_updated_at();

create trigger generated_content_updated_at
  before update on public.generated_content
  for each row execute function public.set_updated_at();

-- Indexes
create index if not exists idx_competitors_publish_date on public.competitors (publish_date desc);
create index if not exists idx_trends_opportunity_score on public.trends (opportunity_score desc);
create index if not exists idx_opportunities_score on public.opportunities (score desc);
create index if not exists idx_generated_content_type on public.generated_content (type);
create index if not exists idx_generated_content_created_at on public.generated_content (created_at desc);

-- Row Level Security (permissive for dashboard demo; tighten for production auth)
alter table public.competitors enable row level security;
alter table public.trends enable row level security;
alter table public.opportunities enable row level security;
alter table public.generated_content enable row level security;

create policy "competitors_select" on public.competitors for select using (true);
create policy "competitors_insert" on public.competitors for insert with check (true);
create policy "competitors_update" on public.competitors for update using (true);
create policy "competitors_delete" on public.competitors for delete using (true);

create policy "trends_select" on public.trends for select using (true);
create policy "trends_insert" on public.trends for insert with check (true);
create policy "trends_update" on public.trends for update using (true);
create policy "trends_delete" on public.trends for delete using (true);

create policy "opportunities_select" on public.opportunities for select using (true);
create policy "opportunities_insert" on public.opportunities for insert with check (true);
create policy "opportunities_update" on public.opportunities for update using (true);
create policy "opportunities_delete" on public.opportunities for delete using (true);

create policy "generated_content_select" on public.generated_content for select using (true);
create policy "generated_content_insert" on public.generated_content for insert with check (true);
create policy "generated_content_update" on public.generated_content for update using (true);
create policy "generated_content_delete" on public.generated_content for delete using (true);
