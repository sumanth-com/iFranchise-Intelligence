-- Migration: Competitor Intelligence Schema
-- Replaces the legacy flat competitors table (001) with a normalized model:
--   competitors → competitor_articles (1:N)
--   content_gaps (standalone intelligence topics)
--
-- Safe to run after 001_initial_schema.sql.
-- Preserves existing competitor IDs and migrates latest_topic/publish_date into articles.

begin;

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------

create extension if not exists pg_trgm with schema extensions;

-- ---------------------------------------------------------------------------
-- 1. Tear down legacy competitors objects
-- ---------------------------------------------------------------------------

drop trigger if exists competitors_updated_at on public.competitors;

drop policy if exists "competitors_select" on public.competitors;
drop policy if exists "competitors_insert" on public.competitors;
drop policy if exists "competitors_update" on public.competitors;
drop policy if exists "competitors_delete" on public.competitors;

drop index if exists public.idx_competitors_publish_date;

alter table if exists public.competitors rename to competitors_legacy;

-- ---------------------------------------------------------------------------
-- 2. competitors
-- ---------------------------------------------------------------------------

create table public.competitors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  industry text,
  created_at timestamptz not null default now(),

  constraint competitors_name_not_blank check (char_length(trim(name)) > 0),
  constraint competitors_website_format check (
    website is null
    or website ~* '^https?://[^\s/$.?#].[^\s]*$'
  )
);

comment on table public.competitors is 'Tracked franchise intelligence competitors';
comment on column public.competitors.website is 'Canonical competitor website URL (https preferred)';

create index idx_competitors_industry
  on public.competitors (industry)
  where industry is not null;

create index idx_competitors_created_at
  on public.competitors (created_at desc);

create unique index idx_competitors_website_unique
  on public.competitors (lower(website))
  where website is not null;

create index idx_competitors_name_trgm
  on public.competitors using gin (name gin_trgm_ops);

-- Migrate legacy rows (preserves UUID primary keys)
insert into public.competitors (id, name, website, industry, created_at)
select
  id,
  name,
  null::text,
  null::text,
  created_at
from public.competitors_legacy;

-- ---------------------------------------------------------------------------
-- 3. competitor_articles
-- ---------------------------------------------------------------------------

create table public.competitor_articles (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references public.competitors (id) on delete cascade,
  title text not null,
  url text,
  published_date date not null,
  summary text,
  created_at timestamptz not null default now(),

  constraint competitor_articles_title_not_blank check (char_length(trim(title)) > 0),
  constraint competitor_articles_url_format check (
    url is null
    or url ~* '^https?://[^\s/$.?#].[^\s]*$'
  )
);

comment on table public.competitor_articles is 'Published content detected from tracked competitors';
comment on column public.competitor_articles.competitor_id is 'FK → competitors.id';

create index idx_competitor_articles_competitor_id
  on public.competitor_articles (competitor_id);

create index idx_competitor_articles_published_date
  on public.competitor_articles (published_date desc);

create index idx_competitor_articles_created_at
  on public.competitor_articles (created_at desc);

create index idx_competitor_articles_competitor_published
  on public.competitor_articles (competitor_id, published_date desc);

create unique index idx_competitor_articles_url_unique
  on public.competitor_articles (lower(url))
  where url is not null;

-- Migrate legacy latest_topic + publish_date into articles
insert into public.competitor_articles (
  competitor_id,
  title,
  url,
  published_date,
  summary,
  created_at
)
select
  id as competitor_id,
  latest_topic as title,
  null::text as url,
  publish_date::date as published_date,
  null::text as summary,
  created_at
from public.competitors_legacy;

-- ---------------------------------------------------------------------------
-- 4. content_gaps
-- ---------------------------------------------------------------------------

create table public.content_gaps (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  importance_score integer not null,
  competitor_count integer not null default 0,
  status text not null default 'open',
  created_at timestamptz not null default now(),

  constraint content_gaps_topic_not_blank check (char_length(trim(topic)) > 0),
  constraint content_gaps_importance_score_range check (
    importance_score between 0 and 100
  ),
  constraint content_gaps_competitor_count_non_negative check (
    competitor_count >= 0
  ),
  constraint content_gaps_status_valid check (
    status in ('open', 'in_progress', 'monitoring', 'resolved', 'dismissed')
  )
);

comment on table public.content_gaps is 'Identified content topics where competitors have coverage gaps';
comment on column public.content_gaps.importance_score is 'Priority score 0–100';
comment on column public.content_gaps.competitor_count is 'Number of competitors covering this topic';
comment on column public.content_gaps.status is 'Workflow status: open | in_progress | monitoring | resolved | dismissed';

create index idx_content_gaps_status
  on public.content_gaps (status);

create index idx_content_gaps_importance_score
  on public.content_gaps (importance_score desc);

create index idx_content_gaps_created_at
  on public.content_gaps (created_at desc);

create index idx_content_gaps_status_importance
  on public.content_gaps (status, importance_score desc);

create index idx_content_gaps_topic_trgm
  on public.content_gaps using gin (topic gin_trgm_ops);

-- Seed content gaps from legacy gap_score data
insert into public.content_gaps (topic, importance_score, competitor_count, status, created_at)
select
  latest_topic as topic,
  gap_score as importance_score,
  1 as competitor_count,
  case
    when gap_score >= 80 then 'open'
    when gap_score >= 60 then 'monitoring'
    else 'in_progress'
  end as status,
  created_at
from public.competitors_legacy;

-- ---------------------------------------------------------------------------
-- 5. Row Level Security
-- ---------------------------------------------------------------------------

alter table public.competitors enable row level security;
alter table public.competitor_articles enable row level security;
alter table public.content_gaps enable row level security;

create policy "competitors_select" on public.competitors
  for select using (true);

create policy "competitors_insert" on public.competitors
  for insert with check (true);

create policy "competitors_update" on public.competitors
  for update using (true);

create policy "competitors_delete" on public.competitors
  for delete using (true);

create policy "competitor_articles_select" on public.competitor_articles
  for select using (true);

create policy "competitor_articles_insert" on public.competitor_articles
  for insert with check (true);

create policy "competitor_articles_update" on public.competitor_articles
  for update using (true);

create policy "competitor_articles_delete" on public.competitor_articles
  for delete using (true);

create policy "content_gaps_select" on public.content_gaps
  for select using (true);

create policy "content_gaps_insert" on public.content_gaps
  for insert with check (true);

create policy "content_gaps_update" on public.content_gaps
  for update using (true);

create policy "content_gaps_delete" on public.content_gaps
  for delete using (true);

-- ---------------------------------------------------------------------------
-- 6. Cleanup legacy table
-- ---------------------------------------------------------------------------

drop table public.competitors_legacy;

commit;
