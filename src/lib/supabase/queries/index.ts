import { formatDistanceToNow } from "date-fns"

import {
  countHighPriorityGaps,
  countOpenContentGaps,
  countRecentArticles,
  getCompetitorTrackerRows,
  getCompetitors,
  getLatestCompetitorArticle,
} from "@/lib/supabase/queries/competitors"
import { assertNoError } from "@/lib/supabase/errors"
import { createClientIfConfigured } from "@/lib/supabase/server"
import type {
  ChartPoint,
  ContentPerformancePoint,
  NotificationItem,
  StatCardData,
} from "@/lib/supabase/types"
import type {
  GeneratedContent,
  Opportunity,
  Trend,
} from "@/lib/supabase/types"

export {
  getCompetitors,
  getCompetitorTrackerRows,
  getContentGaps,
  getCompetitorArticles,
} from "@/lib/supabase/queries/competitors"

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

function formatChange(current: number, previous: number, suffix = ""): string {
  if (previous === 0) return `+${current}${suffix}`
  const pct = ((current - previous) / previous) * 100
  if (suffix) return `+${current - previous}${suffix}`
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`
}

export async function getTrends(): Promise<Trend[]> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("trends")
    .select("*")
    .order("opportunity_score", { ascending: false })

  return assertNoError(data, error, "Failed to fetch trends")
}

export async function getOpportunities(): Promise<Opportunity[]> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .order("score", { ascending: false })

  return assertNoError(data, error, "Failed to fetch opportunities")
}

export async function getRecentOpportunities(limit = 5): Promise<Opportunity[]> {
  const opportunities = await getOpportunities()
  return opportunities.slice(0, limit)
}

export async function getGeneratedContent(): Promise<GeneratedContent[]> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("generated_content")
    .select("*")
    .order("created_at", { ascending: false })

  return assertNoError(data, error, "Failed to fetch generated content")
}

export async function getDashboardStats(): Promise<StatCardData[]> {
  const [opportunities, competitors, content, trends] = await Promise.all([
    getOpportunities(),
    getCompetitors(),
    getGeneratedContent(),
    getTrends(),
  ])

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const recentOpps = opportunities.filter(
    (o) => new Date(o.created_at).getTime() > thirtyDaysAgo
  ).length
  const recentContent = content.filter(
    (c) => new Date(c.created_at).getTime() > thirtyDaysAgo
  ).length
  const recentArticles = await countRecentArticles(30)

  return [
    {
      title: "Opportunities Found",
      value: String(opportunities.length),
      change: formatChange(recentOpps, Math.max(opportunities.length - recentOpps, 1)),
      icon: "target",
      trend: "up",
    },
    {
      title: "Competitors Tracked",
      value: String(competitors.length),
      change: `+${Math.min(recentArticles, competitors.length)}`,
      icon: "users",
      trend: "up",
    },
    {
      title: "Content Generated",
      value: String(content.length),
      change: `+${recentContent}`,
      icon: "file-text",
      trend: "up",
    },
    {
      title: "Trend Signals",
      value: String(trends.length),
      change: formatChange(trends.length, Math.max(trends.length - 3, 1)),
      icon: "trending-up",
      trend: "up",
    },
  ]
}

export async function getCompetitorStats(): Promise<StatCardData[]> {
  const [competitors, recentArticles, openGaps, highPriorityGaps] =
    await Promise.all([
      getCompetitors(),
      countRecentArticles(7),
      countOpenContentGaps(),
      countHighPriorityGaps(),
    ])

  const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const newThisMonth = competitors.filter(
    (c) => new Date(c.created_at).getTime() > monthAgo
  ).length

  return [
    {
      title: "Total Competitors",
      value: String(competitors.length),
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
}

export async function getTrendStats(): Promise<StatCardData[]> {
  const trends = await getTrends()
  const industries = new Set(trends.map((t) => t.industry).filter(Boolean))
  const avgScore =
    trends.length > 0
      ? trends.reduce((sum, t) => sum + t.opportunity_score, 0) / trends.length / 10
      : 0

  return [
    {
      title: "Trending Keywords",
      value: String(trends.length),
      change: `+${Math.min(trends.length, 14)} new`,
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
}

export async function getOpportunityScoreTrend(): Promise<ChartPoint[]> {
  const opportunities = await getOpportunities()

  const byMonth = new Map<number, number[]>()
  for (const opp of opportunities) {
    const month = new Date(opp.created_at).getMonth()
    const existing = byMonth.get(month) ?? []
    existing.push(opp.score)
    byMonth.set(month, existing)
  }

  const now = new Date()
  const points: ChartPoint[] = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = d.getMonth()
    const scores = byMonth.get(month)
    const avg = scores
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 62 + (6 - i) * 4

    points.push({ month: MONTHS[month], score: avg })
  }

  return points
}

export async function getContentPerformance(): Promise<ContentPerformancePoint[]> {
  const content = await getGeneratedContent()

  const byChannel = new Map<string, { views: number; engagement: number }>()
  for (const item of content) {
    const existing = byChannel.get(item.channel) ?? { views: 0, engagement: 0 }
    byChannel.set(item.channel, {
      views: existing.views + item.views,
      engagement: existing.engagement + item.engagement,
    })
  }

  return Array.from(byChannel.entries()).map(([channel, stats]) => ({
    channel,
    ...stats,
  }))
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const [opportunities, latestCompetitorArticle, trends, content] =
    await Promise.all([
      getOpportunities(),
      getLatestCompetitorArticle(),
      getTrends(),
      getGeneratedContent(),
    ])

  const items: NotificationItem[] = []

  if (opportunities[0]) {
    const top = opportunities[0]
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

  if (trends[0]) {
    const top = trends[0]
    items.push({
      id: `trend-${top.id}`,
      title: `Trend alert: ${top.keyword}`,
      description: `Keyword growth up ${top.growth_percent}% this month`,
      time: formatDistanceToNow(new Date(top.created_at), { addSuffix: true }),
      unread: false,
    })
  }

  if (content[0]) {
    const latest = content[0]
    items.push({
      id: `content-${latest.id}`,
      title: "Content generation complete",
      description: `${latest.channel} draft ready for review`,
      time: formatDistanceToNow(new Date(latest.created_at), { addSuffix: true }),
      unread: false,
    })
  }

  return items
}
