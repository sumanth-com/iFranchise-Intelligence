import { isSupabaseConfigured } from "@/lib/supabase/env"
import { SupabaseQueryError } from "@/lib/supabase/errors"
import { createServices } from "@/lib/supabase/services"
import { createClient } from "@/lib/supabase/server"
import type {
  ChartPoint,
  ContentPerformancePoint,
  Opportunity,
  StatCardData,
} from "@/lib/supabase/types"
import {
  getGapDetectionDashboardData,
  type GapDetectionDashboardData,
} from "@/lib/supabase/queries/gap-analysis"

export type DashboardPageData = {
  stats: StatCardData[]
  scoreTrend: ChartPoint[]
  contentGapsChart: ContentPerformancePoint[]
  recentOpportunities: Opportunity[]
  gapDetection: GapDetectionDashboardData
}

async function getDashboardServices() {
  if (!isSupabaseConfigured()) {
    throw new SupabaseQueryError(
      "Database is not configured. Add Supabase credentials to .env.local."
    )
  }

  const client = await createClient()
  return createServices(client)
}

export async function getDashboardPageData(): Promise<DashboardPageData> {
  const services = await getDashboardServices()

  const [stats, scoreTrend, contentGapsChart, recentOpportunities, gapDetection] =
    await Promise.all([
      services.dashboard.getDashboardStats(),
      services.dashboard.getOpportunityScoreTrend(),
      services.dashboard.getContentGapsChartData(),
      services.dashboard.getRecentOpportunities(5),
      getGapDetectionDashboardData(),
    ])

  return { stats, scoreTrend, contentGapsChart, recentOpportunities, gapDetection }
}

export async function getDashboardStats(): Promise<StatCardData[]> {
  const services = await getDashboardServices()
  return services.dashboard.getDashboardStats()
}

export async function getOpportunityScoreTrend(): Promise<ChartPoint[]> {
  const services = await getDashboardServices()
  return services.dashboard.getOpportunityScoreTrend()
}

export async function getContentGapsChartData(): Promise<ContentPerformancePoint[]> {
  const services = await getDashboardServices()
  return services.dashboard.getContentGapsChartData()
}

export async function getRecentOpportunities(limit = 5): Promise<Opportunity[]> {
  const services = await getDashboardServices()
  return services.dashboard.getRecentOpportunities(limit)
}
