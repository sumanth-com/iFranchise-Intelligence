import { assertNoError } from "@/lib/supabase/errors"
import { createClientIfConfigured } from "@/lib/supabase/server"
import type {
  Competitor,
  CompetitorArticle,
  CompetitorArticleWithCompetitor,
  CompetitorTrackerRow,
  ContentGap,
} from "@/lib/supabase/types"

export async function getCompetitors(): Promise<Competitor[]> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("competitors")
    .select("*")
    .order("created_at", { ascending: false })

  return assertNoError(data, error, "Failed to fetch competitors")
}

export async function getCompetitorArticles(): Promise<CompetitorArticleWithCompetitor[]> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("competitor_articles")
    .select("*, competitors(name)")
    .order("published_date", { ascending: false })

  return assertNoError(data, error, "Failed to fetch competitor articles")
}

export async function getContentGaps(): Promise<ContentGap[]> {
  const supabase = await createClientIfConfigured()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("content_gaps")
    .select("*")
    .order("importance_score", { ascending: false })

  return assertNoError(data, error, "Failed to fetch content gaps")
}

export async function getLatestCompetitorArticle(): Promise<{
  article: CompetitorArticle
  competitorName: string
} | null> {
  const articles = await getCompetitorArticles()
  const latest = articles[0]
  if (!latest) return null

  return {
    article: latest,
    competitorName: latest.competitors?.name ?? "Unknown competitor",
  }
}

export async function getCompetitorTrackerRows(): Promise<CompetitorTrackerRow[]> {
  const [articles, gaps] = await Promise.all([
    getCompetitorArticles(),
    getContentGaps(),
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
}

export async function countRecentArticles(days = 7): Promise<number> {
  const articles = await getCompetitorArticles()
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

  return articles.filter(
    (article) => new Date(article.published_date).getTime() > cutoff
  ).length
}

export async function countOpenContentGaps(): Promise<number> {
  const gaps = await getContentGaps()
  return gaps.filter(
    (gap) => gap.status === "open" || gap.status === "monitoring"
  ).length
}

export async function countHighPriorityGaps(): Promise<number> {
  const gaps = await getContentGaps()
  return gaps.filter((gap) => gap.importance_score >= 80).length
}
