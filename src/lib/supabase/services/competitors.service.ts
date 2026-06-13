import type { PostgrestError } from "@supabase/supabase-js"

import { assertNoError, SupabaseQueryError } from "@/lib/supabase/errors"
import {
  createTableService,
  isPostgrestNotFound,
  type SupabaseDbClient,
} from "@/lib/supabase/services/base"
import type {
  Competitor,
  CompetitorActivityItem,
  CompetitorArticle,
  CompetitorArticleWithCompetitor,
  CompetitorDetail,
  CompetitorTrackerRow,
  ContentGap,
  PaginatedCompetitors,
} from "@/lib/supabase/types"

const table = createTableService("competitors")

function isGapRelatedToArticles(gap: ContentGap, articles: CompetitorArticle[]): boolean {
  const topic = gap.topic.toLowerCase()

  return articles.some((article) => {
    const title = article.title.toLowerCase()
    return title === topic || title.includes(topic) || topic.includes(title)
  })
}

function computeOpportunityScore(
  relatedGaps: ContentGap[],
  articles: CompetitorArticle[]
): number {
  if (relatedGaps.length > 0) {
    return Math.round(
      relatedGaps.reduce((sum, gap) => sum + gap.importance_score, 0) /
        relatedGaps.length
    )
  }

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const recentArticles = articles.filter(
    (article) => new Date(article.published_date).getTime() > thirtyDaysAgo
  ).length

  return Math.min(100, articles.length * 12 + recentArticles * 8)
}

function buildRecentActivity(
  competitor: Competitor,
  articles: CompetitorArticle[],
  relatedGaps: ContentGap[]
): CompetitorActivityItem[] {
  const items: CompetitorActivityItem[] = [
    {
      id: `competitor-${competitor.id}`,
      type: "competitor_tracked",
      title: "Competitor added to tracker",
      description: `${competitor.name} is now being monitored.`,
      timestamp: competitor.created_at,
    },
    ...articles.map((article) => ({
      id: `article-${article.id}`,
      type: "article_published" as const,
      title: "New article detected",
      description: article.title,
      timestamp: article.published_date,
    })),
    ...relatedGaps.map((gap) => ({
      id: `gap-${gap.id}`,
      type: "gap_identified" as const,
      title: "Content gap identified",
      description: `${gap.topic} · ${gap.importance_score}/100 importance`,
      timestamp: gap.created_at,
    })),
  ]

  return items
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 12)
}

export function createCompetitorsService(client: SupabaseDbClient) {
  return {
    list: () => table.list(client, { orderBy: "created_at", ascending: false }),

    getById: (id: string) => table.getById(client, id),

    create: (payload: Parameters<typeof table.create>[1]) =>
      table.create(client, payload),

    update: (id: string, payload: Parameters<typeof table.update>[2]) =>
      table.update(client, id, payload),

    remove: (id: string) => table.remove(client, id),

    async listArticles(): Promise<CompetitorArticleWithCompetitor[]> {
      const { data, error } = await client
        .from("competitor_articles")
        .select("*, competitors(name)")
        .order("published_date", { ascending: false })

      return assertNoError(data, error, "Failed to fetch competitor articles")
    },

    async listContentGaps(): Promise<ContentGap[]> {
      const { data, error } = await client
        .from("content_gaps")
        .select("*")
        .order("importance_score", { ascending: false })

      return assertNoError(data, error, "Failed to fetch content gaps")
    },

    async getLatestArticle(): Promise<{
      article: CompetitorArticle
      competitorName: string
    } | null> {
      const articles = await this.listArticles()
      const latest = articles[0]
      if (!latest) return null

      return {
        article: latest,
        competitorName: latest.competitors?.name ?? "Unknown competitor",
      }
    },

    async getTrackerRows(): Promise<CompetitorTrackerRow[]> {
      const [articles, gaps] = await Promise.all([
        this.listArticles(),
        this.listContentGaps(),
      ])

      const gapByTopic = new Map(
        gaps.map((gap) => [gap.topic.toLowerCase(), gap.importance_score])
      )

      const latestByCompetitor = new Map<string, CompetitorArticleWithCompetitor>()
      for (const article of articles) {
        if (!latestByCompetitor.has(article.competitor_id)) {
          latestByCompetitor.set(article.competitor_id, article)
        }
      }

      return Array.from(latestByCompetitor.values())
        .map((article) => ({
          competitorId: article.competitor_id,
          competitorName: article.competitors?.name ?? "Unknown",
          latestTopic: article.title,
          publishDate: article.published_date,
          gapScore: gapByTopic.get(article.title.toLowerCase()) ?? 0,
        }))
        .sort(
          (a, b) =>
            new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        )
    },

    async countRecentArticles(days = 7): Promise<number> {
      const articles = await this.listArticles()
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

      return articles.filter(
        (article) => new Date(article.published_date).getTime() > cutoff
      ).length
    },

    async countOpenContentGaps(): Promise<number> {
      const gaps = await this.listContentGaps()
      return gaps.filter(
        (gap) => gap.status === "open" || gap.status === "monitoring"
      ).length
    },

    async countHighPriorityGaps(): Promise<number> {
      const gaps = await this.listContentGaps()
      return gaps.filter((gap) => gap.importance_score >= 80).length
    },

    async listPaginated(options: {
      search?: string
      page?: number
      pageSize?: number
    }): Promise<PaginatedCompetitors> {
      const page = Math.max(1, options.page ?? 1)
      const pageSize = Math.min(50, Math.max(1, options.pageSize ?? 10))
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      let query = client
        .from("competitors")
        .select("*, competitor_articles(count)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to)

      const search = options.search?.trim()
      if (search) {
        const term = `%${search}%`
        query = query.or(
          `name.ilike.${term},website.ilike.${term},industry.ilike.${term}`
        )
      }

      const { data, error, count } = await query

      if (error) {
        throw new SupabaseQueryError(
          `Failed to fetch competitors: ${error.message}`,
          error
        )
      }

      type RowWithCount = Competitor & {
        competitor_articles: { count: number }[]
      }

      const rows = ((data ?? []) as RowWithCount[]).map((row) => ({
        id: row.id,
        name: row.name,
        website: row.website,
        industry: row.industry,
        created_at: row.created_at,
        articles_count: row.competitor_articles?.[0]?.count ?? 0,
      }))

      const total = count ?? 0
      const totalPages = Math.max(1, Math.ceil(total / pageSize))

      return { rows, total, page, pageSize, totalPages }
    },

    async getDetail(id: string): Promise<CompetitorDetail | null> {
      let competitor: Competitor

      try {
        competitor = await table.getById(client, id)
      } catch (error) {
        if (
          error instanceof SupabaseQueryError &&
          error.cause &&
          isPostgrestNotFound(error.cause as PostgrestError)
        ) {
          return null
        }
        throw error
      }

      const [articlesResult, gapsResult, countResult] = await Promise.all([
        client
          .from("competitor_articles")
          .select("*")
          .eq("competitor_id", id)
          .order("published_date", { ascending: false })
          .limit(10),
        client
          .from("content_gaps")
          .select("*")
          .order("importance_score", { ascending: false }),
        client
          .from("competitor_articles")
          .select("*", { count: "exact", head: true })
          .eq("competitor_id", id),
      ])

      const latestArticles = assertNoError(
        articlesResult.data as CompetitorArticle[] | null,
        articlesResult.error,
        "Failed to fetch competitor articles"
      )

      const allGaps = assertNoError(
        gapsResult.data as ContentGap[] | null,
        gapsResult.error,
        "Failed to fetch content gaps"
      )

      if (countResult.error) {
        throw new SupabaseQueryError(
          `Failed to count competitor articles: ${countResult.error.message}`,
          countResult.error
        )
      }

      const relatedGaps = allGaps
        .filter((gap) => isGapRelatedToArticles(gap, latestArticles))
        .slice(0, 8)

      const opportunityScore = computeOpportunityScore(relatedGaps, latestArticles)
      const recentActivity = buildRecentActivity(
        competitor,
        latestArticles,
        relatedGaps
      )

      return {
        competitor,
        articles_count: countResult.count ?? latestArticles.length,
        latest_articles: latestArticles,
        related_gaps: relatedGaps,
        opportunity_score: opportunityScore,
        recent_activity: recentActivity,
      }
    },
  }
}

export type CompetitorsService = ReturnType<typeof createCompetitorsService>

export async function getCompetitors(client: SupabaseDbClient): Promise<Competitor[]> {
  return createCompetitorsService(client).list()
}
