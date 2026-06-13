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
      const pageSize = Math.min(50, Math.max(1, options.pageSize ?? 10))
      const search = options.search?.trim()

      let countQuery = client
        .from("competitors")
        .select("*", { count: "exact", head: true })

      if (search) {
        const term = `%${search}%`
        countQuery = countQuery.or(
          `name.ilike.${term},website.ilike.${term},industry.ilike.${term}`
        )
      }

      const { count: totalCount, error: countError } = await countQuery

      if (countError) {
        throw new SupabaseQueryError(
          `Failed to count competitors: ${countError.message}`,
          countError
        )
      }

      const total = totalCount ?? 0
      const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1)
      const page = Math.min(Math.max(1, options.page ?? 1), totalPages)

      if (total === 0) {
        return { rows: [], total: 0, page: 1, pageSize, totalPages: 1 }
      }

      const from = (page - 1) * pageSize
      const to = Math.min(from + pageSize - 1, total - 1)

      if (from >= total) {
        return { rows: [], total, page: totalPages, pageSize, totalPages }
      }

      let dataQuery = client.from("competitors").select("*")

      if (search) {
        const term = `%${search}%`
        dataQuery = dataQuery.or(
          `name.ilike.${term},website.ilike.${term},industry.ilike.${term}`
        )
      }

      const { data, error } = await dataQuery
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) {
        const isRangeError =
          error.code === "PGRST103" ||
          error.message.toLowerCase().includes("range not satisfiable")

        if (isRangeError) {
          return { rows: [], total, page: totalPages, pageSize, totalPages }
        }

        throw new SupabaseQueryError(
          `Failed to fetch competitors: ${error.message}`,
          error
        )
      }

      const competitors = (data ?? []) as Competitor[]
      const competitorIds = competitors.map((row) => row.id)

      const articleCounts = new Map<string, number>()

      if (competitorIds.length > 0) {
        const { data: articles, error: articlesError } = await client
          .from("competitor_articles")
          .select("competitor_id")
          .in("competitor_id", competitorIds)

        if (articlesError) {
          throw new SupabaseQueryError(
            `Failed to count competitor articles: ${articlesError.message}`,
            articlesError
          )
        }

        for (const article of articles ?? []) {
          articleCounts.set(
            article.competitor_id,
            (articleCounts.get(article.competitor_id) ?? 0) + 1
          )
        }
      }

      const rows = competitors.map((row) => ({
        ...row,
        articles_count: articleCounts.get(row.id) ?? 0,
      }))

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
