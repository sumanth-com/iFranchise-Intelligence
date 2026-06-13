import { cache } from "react"

import { isSupabaseConfigured } from "@/lib/supabase/env"
import { SupabaseQueryError } from "@/lib/supabase/errors"
import { createServices } from "@/lib/supabase/services"
import { createClient } from "@/lib/supabase/server"
import type { ContentGap, GapAnalysisResult, GapDetectionSummary } from "@/lib/supabase/types"

async function getServices() {
  if (!isSupabaseConfigured()) {
    throw new SupabaseQueryError(
      "Database is not configured. Add Supabase credentials to .env.local."
    )
  }

  const client = await createClient()
  return createServices(client)
}

export const getGapDetectionSummary = cache(async function getGapDetectionSummary() {
  const services = await getServices()
  return services.gapAnalysis.getDetectionSummary()
})

export const getTopDetectedGaps = cache(async function getTopDetectedGaps(
  limit = 6
): Promise<ContentGap[]> {
  const services = await getServices()
  return services.gapAnalysis.listTopDetectedGaps(limit)
})

export async function runGapAnalysis(): Promise<GapAnalysisResult> {
  const services = await getServices()
  return services.gapAnalysis.runAnalysis()
}

export type GapDetectionDashboardData = {
  summary: GapDetectionSummary
  topGaps: ContentGap[]
}

export const getGapDetectionDashboardData = cache(
  async function getGapDetectionDashboardData(): Promise<GapDetectionDashboardData> {
    const services = await getServices()
    const [summary, topGaps] = await Promise.all([
      services.gapAnalysis.getDetectionSummary(),
      services.gapAnalysis.listTopDetectedGaps(6),
    ])
    return { summary, topGaps }
  }
)
