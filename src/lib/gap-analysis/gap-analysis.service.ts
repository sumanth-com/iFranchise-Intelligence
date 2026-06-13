import {
  findMatchingTopicIndex,
  isTopicCovered,
  normalizeTopic,
  titleCaseTopic,
  topicSimilarity,
} from "@/lib/gap-analysis/topic-utils"
import type {
  CompetitorArticleWithCompetitor,
  DetectedContentGap,
  GapAnalysisResult,
} from "@/lib/supabase/types"

type TopicCluster = {
  topic: string
  competitorIds: Set<string>
  competitorNames: Set<string>
  articles: string[]
  latestPublishedAt: number
}

export type GapAnalysisInput = {
  articles: CompetitorArticleWithCompetitor[]
  existingTopics: string[]
}

function mergeIntoClusters(
  articles: CompetitorArticleWithCompetitor[]
): TopicCluster[] {
  const clusters: TopicCluster[] = []

  for (const article of articles) {
    const title = article.title.trim()
    if (!title) continue

    const existingIndex = findMatchingTopicIndex(
      title,
      clusters.map((cluster) => cluster.topic)
    )

    if (existingIndex >= 0) {
      const cluster = clusters[existingIndex]
      cluster.competitorIds.add(article.competitor_id)
      if (article.competitors?.name) {
        cluster.competitorNames.add(article.competitors.name)
      }
      cluster.articles.push(title)
      cluster.latestPublishedAt = Math.max(
        cluster.latestPublishedAt,
        new Date(article.published_date).getTime()
      )
      continue
    }

    clusters.push({
      topic: title,
      competitorIds: new Set([article.competitor_id]),
      competitorNames: new Set(
        article.competitors?.name ? [article.competitors.name] : []
      ),
      articles: [title],
      latestPublishedAt: new Date(article.published_date).getTime(),
    })
  }

  return clusters.sort((a, b) => b.latestPublishedAt - a.latestPublishedAt)
}

function computeImportanceScore(cluster: TopicCluster): number {
  const competitorWeight = Math.min(cluster.competitorIds.size * 14, 42)
  const articleWeight = Math.min(cluster.articles.length * 6, 24)
  const recencyDays =
    (Date.now() - cluster.latestPublishedAt) / (1000 * 60 * 60 * 24)
  const recencyBoost =
    recencyDays <= 7 ? 20 : recencyDays <= 30 ? 12 : recencyDays <= 90 ? 6 : 0
  const similarityBoost = Math.round(
    Math.min(
      14,
      cluster.articles.length > 1
        ? topicSimilarity(cluster.articles[0], cluster.articles[1]) * 14
        : 0
    )
  )

  return Math.min(
    100,
    Math.max(
      35,
      24 + competitorWeight + articleWeight + recencyBoost + similarityBoost
    )
  )
}

function buildSuggestedOpportunity(cluster: TopicCluster): string {
  const competitors = Array.from(cluster.competitorNames)
  const competitorLabel =
    competitors.length > 0
      ? competitors.slice(0, 3).join(", ")
      : `${cluster.competitorIds.size} competitors`

  if (cluster.competitorIds.size >= 3) {
    return `Publish a definitive franchise intelligence piece on "${cluster.topic}" — ${competitorLabel} already cover this topic and you have no matching content.`
  }

  if (cluster.articles.length >= 2) {
    return `Create a comparison or playbook around "${cluster.topic}" to counter recent competitor momentum from ${competitorLabel}.`
  }

  return `Draft an authoritative article on "${cluster.topic}" before ${competitorLabel} establishes category ownership.`
}

export function analyzeContentGaps(input: GapAnalysisInput): DetectedContentGap[] {
  const existingTopics = input.existingTopics.map(normalizeTopic)
  const clusters = mergeIntoClusters(input.articles)

  const detected: DetectedContentGap[] = []

  for (const cluster of clusters) {
    if (isTopicCovered(cluster.topic, existingTopics)) {
      continue
    }

    detected.push({
      topic: titleCaseTopic(cluster.topic),
      importance_score: computeImportanceScore(cluster),
      competitor_count: cluster.competitorIds.size,
      suggested_opportunity: buildSuggestedOpportunity(cluster),
      sample_articles: cluster.articles.slice(0, 3),
    })
  }

  return detected.sort((a, b) => b.importance_score - a.importance_score)
}

export function buildGapAnalysisResult(
  input: GapAnalysisInput,
  detected: DetectedContentGap[],
  persistence: { created: number; updated: number }
): GapAnalysisResult {
  return {
    analyzed_articles: input.articles.length,
    existing_topics: input.existingTopics.length,
    detected_gaps: detected,
    created: persistence.created,
    updated: persistence.updated,
  }
}
