import {
  analyzeContentGaps,
  buildGapAnalysisResult,
} from "@/lib/gap-analysis/gap-analysis.service"
import { topicsMatch } from "@/lib/gap-analysis/topic-utils"
import { assertNoError } from "@/lib/supabase/errors"
import type { SupabaseDbClient } from "@/lib/supabase/services/base"
import { createCompetitorsService } from "@/lib/supabase/services/competitors.service"
import { createContentGapsService } from "@/lib/supabase/services/content-gaps.service"
import { createGeneratedContentService } from "@/lib/supabase/services/generated-content.service"
import type {
  ContentGap,
  DetectedContentGap,
  GapAnalysisResult,
  GapDetectionSummary,
} from "@/lib/supabase/types"

export function createGapAnalysisService(client: SupabaseDbClient) {
  const competitors = createCompetitorsService(client)
  const contentGaps = createContentGapsService(client)
  const generatedContent = createGeneratedContentService(client)

  return {
    async collectExistingTopics(): Promise<string[]> {
      const [gaps, content] = await Promise.all([
        contentGaps.list(),
        generatedContent.list(),
      ])

      const topics = new Set<string>()
      for (const gap of gaps) topics.add(gap.topic)
      for (const item of content) topics.add(item.topic)

      return Array.from(topics)
    },

    async detectMissingGaps(): Promise<DetectedContentGap[]> {
      const [articles, existingTopics] = await Promise.all([
        competitors.listArticles(),
        this.collectExistingTopics(),
      ])

      return analyzeContentGaps({ articles, existingTopics })
    },

    async persistDetectedGaps(
      detected: DetectedContentGap[]
    ): Promise<{ created: number; updated: number }> {
      const existing = await contentGaps.list()
      let created = 0
      let updated = 0

      for (const gap of detected) {
        const match = existing.find((row) => topicsMatch(row.topic, gap.topic))

        if (match) {
          const shouldUpdate =
            gap.importance_score > match.importance_score ||
            gap.competitor_count > match.competitor_count ||
            gap.suggested_opportunity !== match.suggested_opportunity

          if (shouldUpdate) {
            await contentGaps.update(match.id, {
              importance_score: Math.max(match.importance_score, gap.importance_score),
              competitor_count: Math.max(
                match.competitor_count,
                gap.competitor_count
              ),
              suggested_opportunity: gap.suggested_opportunity,
              status: match.status === "resolved" ? "monitoring" : match.status,
            })
            updated += 1
          }
          continue
        }

        await contentGaps.create({
          topic: gap.topic,
          importance_score: gap.importance_score,
          competitor_count: gap.competitor_count,
          suggested_opportunity: gap.suggested_opportunity,
          status: gap.importance_score >= 80 ? "open" : "monitoring",
        })
        created += 1
      }

      return { created, updated }
    },

    async runAnalysis(): Promise<GapAnalysisResult> {
      const [articles, existingTopics] = await Promise.all([
        competitors.listArticles(),
        this.collectExistingTopics(),
      ])

      const input = { articles, existingTopics }
      const detected = analyzeContentGaps(input)
      const persistence = await this.persistDetectedGaps(detected)

      return buildGapAnalysisResult(input, detected, persistence)
    },

    async getDetectionSummary(limit = 5): Promise<GapDetectionSummary> {
      const gaps = await contentGaps.list()
      const openGaps = gaps.filter(
        (gap) => gap.status === "open" || gap.status === "monitoring"
      )
      const highPriority = openGaps.filter((gap) => gap.importance_score >= 80)
      const avgImportance =
        openGaps.length > 0
          ? Math.round(
              openGaps.reduce((sum, gap) => sum + gap.importance_score, 0) /
                openGaps.length
            )
          : 0

      return {
        open_gaps: openGaps.length,
        high_priority_gaps: highPriority.length,
        avg_importance_score: avgImportance,
        top_gaps: gaps.slice(0, limit),
      }
    },

    async listTopDetectedGaps(limit = 6): Promise<ContentGap[]> {
      const { data, error } = await client
        .from("content_gaps")
        .select("*")
        .in("status", ["open", "monitoring"])
        .order("importance_score", { ascending: false })
        .limit(limit)

      return assertNoError(
        data as ContentGap[] | null,
        error,
        "Failed to fetch detected content gaps"
      )
    },
  }
}

export type GapAnalysisSupabaseService = ReturnType<
  typeof createGapAnalysisService
>
