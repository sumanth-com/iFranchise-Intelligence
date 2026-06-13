-- Add suggested_opportunity to content_gaps for AI gap detection output

alter table public.content_gaps
  add column if not exists suggested_opportunity text;

comment on column public.content_gaps.suggested_opportunity is
  'AI-generated content opportunity recommendation for this gap topic';
