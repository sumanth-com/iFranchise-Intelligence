import { formatDistanceToNow } from "date-fns"

import type { SupabaseDbClient } from "@/lib/supabase/services/base"
import { countTableRows } from "@/lib/supabase/services/base"
import { createCompetitorsService } from "@/lib/supabase/services/competitors.service"
import { createContentGapsService } from "@/lib/supabase/services/content-gaps.service"
import { createGeneratedContentService } from "@/lib/supabase/services/generated-content.service"
import { createOpportunitiesService } from "@/lib/supabase/services/opportunities.service"
import { createTrendsService } from "@/lib/supabase/services/trends.service"
import type {
  ChartPoint,
  ContentGap,
  ContentPerformancePoint,
  GeneratedContent,
  NotificationItem,
  Opportunity,
  StatCardData,
  Trend,
} from "@/lib/supabase/types"

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

const THIRTY_DAYS_AGO = () =>
  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

function formatRecentChange(recent: number): string {
  if (recent === 0) return "No new records"
  return `+${recent} this month`
}

function formatStatusLabel(status: ContentGap["status"]): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function createDashboardService(client: SupabaseDbClient) {
  const competitors = createCompetitorsService(client)
  const contentGaps = createContentGapsService(client)
  const trends = createTrendsService(client)
  const opportunities = createOpportunitiesService(client)
  const generatedContent = createGeneratedContentService(client)

  return {
    getTrends: (): Promise<Trend[]> => trends.list(),

    getOpportunities: (): Promise<Opportunity[]> => opportunities.list(),

    async getRecentOpportunities(limit = 5): Promise<Opportunity[]> {
      const rows = await opportunities.list()
      return rows.slice(0, limit)
    },

    getGeneratedContent: (): Promise<GeneratedContent[]> => generatedContent.list(),

    async getDashboardStats(): Promise<StatCardData[]> {
      const since = THIRTY_DAYS_AGO()

      const [
        opportunitiesCount,
        competitorsCount,
        contentGapsCount,
        articlesCount,
        recentOpportunities,
        recentCompetitors,
        recentContentGaps,
        recentArticles,
      ] = await Promise.all([
        countTableRows(client, "opportunities"),
        countTableRows(client, "competitors"),
        countTableRows(client, "content_gaps"),
        countTableRows(client, "competitor_articles"),
        countTableRows(client, "opportunities", { since }),
        countTableRows(client, "competitors", { since }),
        countTableRows(client, "content_gaps", { since }),
        countTableRows(client, "competitor_articles", { since }),
      ])

      return [
        {
          title: "Opportunities Found",
          value: String(opportunitiesCount),
          change: formatRecentChange(recentOpportunities),
          icon: "target",
          trend: recentOpportunities > 0 ? "up" : undefined,
        },
        {
          title: "Competitors Tracked",
          value: String(competitorsCount),
          change: formatRecentChange(recentCompetitors),
          icon: "users",
          trend: recentCompetitors > 0 ? "up" : undefined,
        },
        {
          title: "Content Generated",
          value: String(contentGapsCount),
          change: formatRecentChange(recentContentGaps),
          icon: "file-text",
          trend: recentContentGaps > 0 ? "up" : undefined,
        },
        {
          title: "Trend Signals",
          value: String(articlesCount),
          change: formatRecentChange(recentArticles),
          icon: "trending-up",
          trend: recentArticles > 0 ? "up" : undefined,
        },
      ]
    },

    async getCompetitorStats(): Promise<StatCardData[]> {
      const [competitorRows, recentArticles, openGaps, highPriorityGaps] =
        await Promise.all([
          competitors.list(),
          competitors.countRecentArticles(7),
          competitors.countOpenContentGaps(),
          competitors.countHighPriorityGaps(),
        ])

      const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
      const newThisMonth = competitorRows.filter(
        (c) => new Date(c.created_at).getTime() > monthAgo
      ).length

      return [
        {
          title: "Total Competitors",
          value: String(competitorRows.length),
          change: `+${newThisMonth} this month`,
          icon: "building-2",
        },
        {
          title: "New Content Detected",
          value: String(recentArticles),
          change: `+${recentArticles} this week`,
          icon: "rss",
        },
        {
          title: "Content Gaps",
          value: String(openGaps),
          change: `${highPriorityGaps} high priority`,
          icon: "gap",
        },
      ]
    },

    async getTrendStats(): Promise<StatCardData[]> {
      const trendRows = await trends.list()
      const industries = new Set(trendRows.map((t) => t.industry).filter(Boolean))
      const avgScore =
        trendRows.length > 0
          ? trendRows.reduce((sum, t) => sum + t.opportunity_score, 0) /
            trendRows.length /
            10
          : 0

      return [
        {
          title: "Trending Keywords",
          value: String(trendRows.length),
          change: `+${Math.min(trendRows.length, 14)} new`,
          icon: "hash",
        },
        {
          title: "Rising Industries",
          value: String(industries.size),
          change: `+${Math.min(industries.size, 4)} this quarter`,
          icon: "bar-chart-3",
        },
        {
          title: "Opportunity Index",
          value: avgScore.toFixed(1),
          change: "+0.6 pts",
          icon: "gauge",
        },
      ]
    },

    async getOpportunityScoreTrend(): Promise<ChartPoint[]> {
      const opportunityRows = await opportunities.list()

      const byMonth = new Map<string, number[]>()
      for (const opp of opportunityRows) {
        const date = new Date(opp.created_at)
        const key = `${date.getFullYear()}-${date.getMonth()}`
        const existing = byMonth.get(key) ?? []
        existing.push(opp.score)
        byMonth.set(key, existing)
      }

      const now = new Date()
      const points: ChartPoint[] = []

      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${d.getMonth()}`
        const scores = byMonth.get(key)
        const avg = scores
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0

        points.push({ month: MONTHS[d.getMonth()], score: avg })
      }

      return points
    },

    async getContentGapsChartData(): Promise<ContentPerformancePoint[]> {
      const gaps = await contentGaps.list()

      const byStatus = new Map<
        ContentGap["status"],
        { count: number; totalImportance: number }
      >()

      for (const gap of gaps) {
        const existing = byStatus.get(gap.status) ?? {
          count: 0,
          totalImportance: 0,
        }
        byStatus.set(gap.status, {
          count: existing.count + 1,
          totalImportance: existing.totalImportance + gap.importance_score,
        })
      }

      return Array.from(byStatus.entries()).map(([status, stats]) => ({
        channel: formatStatusLabel(status),
        views: stats.count,
        engagement: stats.count
          ? Math.round(stats.totalImportance / stats.count)
          : 0,
      }))
    },

    async getContentPerformance(): Promise<ContentPerformancePoint[]> {
      return this.getContentGapsChartData()
    },

    async getNotifications(): Promise<NotificationItem[]> {
      const [opportunityRows, latestCompetitorArticle, trendRows, contentRows] =
        await Promise.all([
          opportunities.list(),
          competitors.getLatestArticle(),
          trends.list(),
          generatedContent.list(),
        ])

      const items: NotificationItem[] = []

      if (opportunityRows[0]) {
        const top = opportunityRows[0]
        items.push({
          id: `opp-${top.id}`,
          title: "New high-score opportunity detected",
          description: `${top.title} scored ${top.score}/100`,
          time: formatDistanceToNow(new Date(top.created_at), { addSuffix: true }),
          unread: true,
        })
      }

      if (latestCompetitorArticle) {
        const { article, competitorName } = latestCompetitorArticle
        items.push({
          id: `comp-${article.id}`,
          title: "Competitor published new content",
          description: `${competitorName} released: ${article.title}`,
          time: formatDistanceToNow(new Date(article.published_date), {
            addSuffix: true,
          }),
          unread: true,
        })
      }

      if (trendRows[0]) {
        const top = trendRows[0]
        items.push({
          id: `trend-${top.id}`,
          title: `Trend alert: ${top.keyword}`,
          description: `Keyword growth up ${top.growth_percent}% this month`,
          time: formatDistanceToNow(new Date(top.created_at), { addSuffix: true }),
          unread: false,
        })
      }

      if (contentRows[0]) {
        const latest = contentRows[0]
        items.push({
          id: `content-${latest.id}`,
          title: "Content generation complete",
          description: `${latest.channel} draft ready for review`,
          time: formatDistanceToNow(new Date(latest.created_at), {
            addSuffix: true,
          }),
          unread: false,
        })
      }

      return items
    },
  }
}

export type DashboardService = ReturnType<typeof createDashboardService>
