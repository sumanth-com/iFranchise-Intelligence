# Migration Compatibility Report

**Date:** 2026-06-13  
**Migration:** `002_competitor_intelligence_schema.sql`  
**Scope:** Application-layer refactor (no new tables)

---

## Legacy Schema (001)

```sql
competitors (
  id, name, latest_topic, publish_date, gap_score, created_at, updated_at
)
```

## Target Schema (002)

```sql
competitors (id, name, website, industry, created_at)
competitor_articles (id, competitor_id → competitors, title, url, published_date, summary, created_at)
content_gaps (id, topic, importance_score, competitor_count, status, created_at)
```

---

## Deprecated Fields → Replacement Mapping

| Legacy field | Was used for | New source |
|---|---|---|
| `latest_topic` | Table column, notifications | `competitor_articles.title` |
| `publish_date` | Table column, stats, notifications | `competitor_articles.published_date` |
| `gap_score` | Table column, stat cards | `content_gaps.importance_score` (matched by topic/title) |
| `updated_at` | TypeScript type only | Removed (not in new schema) |

---

## Files Requiring Changes

| File | Legacy usage | Action |
|---|---|---|
| `src/lib/supabase/types.ts` | `Competitor` with 4 deprecated fields | Replace with `Competitor`, `CompetitorArticle`, `ContentGap`; update `Database` |
| `src/lib/supabase/queries/index.ts` | Queries `publish_date`, `gap_score`, `latest_topic` | Refactor to 3-table queries |
| `src/app/(platform)/competitors/page.tsx` | Renders legacy row fields | Use `CompetitorTrackerRow` view model |
| `src/app/api/competitors/route.ts` | Orders by `publish_date` | Order by `created_at`; new insert shape |
| `src/app/api/competitors/[id]/route.ts` | PATCH legacy fields | PATCH `name`, `website`, `industry` |
| `src/lib/validations/schemas.ts` | `competitorSchema` with legacy fields | Split into 3 schemas |
| `src/lib/data/seed-data.ts` | `seedCompetitors` with legacy shape | Split into competitors, articles, gaps |
| `scripts/seed.ts` | Inserts legacy competitors | Seed 3 tables in FK order |

## Files With No Changes Required

| File | Reason |
|---|---|
| `src/app/(platform)/dashboard/page.tsx` | Uses `getDashboardStats()` only (competitor count) |
| `src/lib/navigation.ts` | Route label only |
| `src/app/(platform)/settings/page.tsx` | UI label only |
| `supabase/migrations/*.sql` | Already define target schema |

---

## Query Refactor Plan

| Function | Before | After |
|---|---|---|
| `getCompetitors()` | Flat legacy rows | `competitors` ordered by `created_at` |
| `getCompetitorStats()` | Derived from `gap_score`, `publish_date` on competitors | Articles count (7d) + `content_gaps` count |
| `getNotifications()` | `competitors[0].latest_topic` | Latest `competitor_articles` joined with `competitors` |
| `getDashboardStats()` | `getCompetitors().length` | Unchanged (still counts competitors) |
| **New** `getCompetitorArticles()` | — | Full article list with join |
| **New** `getContentGaps()` | — | Gap list ordered by importance |
| **New** `getCompetitorTrackerRows()` | — | Latest article per competitor + gap score |

---

## API Routes Plan

| Route | Change |
|---|---|
| `GET/POST /api/competitors` | New column shape |
| `GET/PATCH/DELETE /api/competitors/[id]` | New column shape |
| **New** `/api/competitor-articles` | CRUD for articles |
| **New** `/api/competitor-articles/[id]` | CRUD for articles |
| **New** `/api/content-gaps` | CRUD for gaps |
| **New** `/api/content-gaps/[id]` | CRUD for gaps |

---

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Empty table after migration without re-seed | Update seed script for 3-table insert |
| Gap score mismatch when topic ≠ title | Match on exact topic string (migration seeds this way) |
| Supabase join typing | Use explicit select with nested `competitors(name)` |

---

## Verification Checklist

- [x] `grep latest_topic` → 0 app matches (migration files excluded)
- [x] `grep gap_score` → 0 app matches
- [x] `grep publish_date` → 0 app matches (use `published_date`)
- [x] `npm run build` passes
- [x] Competitor Intelligence page renders tracker rows
- [x] Dashboard stat "Competitors Tracked" shows correct count
