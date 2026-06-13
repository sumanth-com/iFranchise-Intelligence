import { createClientIfConfigured } from "@/lib/supabase/server"
import { createCompetitorArticlesService } from "@/lib/supabase/services/competitor-articles.service"
import { createCompetitorsService } from "@/lib/supabase/services/competitors.service"
import { createContentGapsService } from "@/lib/supabase/services/content-gaps.service"
import { createDashboardService } from "@/lib/supabase/services/dashboard.service"
import { createGapAnalysisService } from "@/lib/supabase/services/gap-analysis.service"
import { createGeneratedContentService } from "@/lib/supabase/services/generated-content.service"
import { createOpportunitiesService } from "@/lib/supabase/services/opportunities.service"
import { createTrendsService } from "@/lib/supabase/services/trends.service"
import type { SupabaseDbClient } from "@/lib/supabase/services/base"

export type DatabaseServices = {
  client: SupabaseDbClient
  competitors: ReturnType<typeof createCompetitorsService>
  competitorArticles: ReturnType<typeof createCompetitorArticlesService>
  contentGaps: ReturnType<typeof createContentGapsService>
  trends: ReturnType<typeof createTrendsService>
  opportunities: ReturnType<typeof createOpportunitiesService>
  generatedContent: ReturnType<typeof createGeneratedContentService>
  dashboard: ReturnType<typeof createDashboardService>
  gapAnalysis: ReturnType<typeof createGapAnalysisService>
}

export function createServices(client: SupabaseDbClient): DatabaseServices {
  return {
    client,
    competitors: createCompetitorsService(client),
    competitorArticles: createCompetitorArticlesService(client),
    contentGaps: createContentGapsService(client),
    trends: createTrendsService(client),
    opportunities: createOpportunitiesService(client),
    generatedContent: createGeneratedContentService(client),
    dashboard: createDashboardService(client),
    gapAnalysis: createGapAnalysisService(client),
  }
}

export async function createServicesIfConfigured(): Promise<DatabaseServices | null> {
  const client = await createClientIfConfigured()
  if (!client) return null
  return createServices(client)
}

export { createCompetitorArticlesService } from "@/lib/supabase/services/competitor-articles.service"
export { createCompetitorsService } from "@/lib/supabase/services/competitors.service"
export { createContentGapsService } from "@/lib/supabase/services/content-gaps.service"
export { createDashboardService } from "@/lib/supabase/services/dashboard.service"
export { createGapAnalysisService } from "@/lib/supabase/services/gap-analysis.service"
export { createGeneratedContentService } from "@/lib/supabase/services/generated-content.service"
export { createOpportunitiesService } from "@/lib/supabase/services/opportunities.service"
export { createTrendsService } from "@/lib/supabase/services/trends.service"
export {
  createTableService,
  isPostgrestNotFound,
  type DbTableName,
  type ListOptions,
  type SupabaseDbClient,
} from "@/lib/supabase/services/base"
