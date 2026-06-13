import { createServicesIfConfigured } from "@/lib/supabase/services"

export {
  countHighPriorityGaps,
  countOpenContentGaps,
  countRecentArticles,
  getCompetitorArticles,
  getCompetitors,
  getCompetitorTrackerRows,
  getContentGaps,
  getLatestCompetitorArticle,
} from "@/lib/supabase/queries/competitors"

export {
  getContentGapsChartData,
  getDashboardPageData,
  getDashboardStats,
  getOpportunityScoreTrend,
  getRecentOpportunities,
  type DashboardPageData,
} from "@/lib/supabase/queries/dashboard"

export async function getTrends() {
  const services = await createServicesIfConfigured()
  if (!services) return []
  return services.dashboard.getTrends()
}

export async function getOpportunities() {
  const services = await createServicesIfConfigured()
  if (!services) return []
  return services.dashboard.getOpportunities()
}

export async function getGeneratedContent() {
  const services = await createServicesIfConfigured()
  if (!services) return []
  return services.dashboard.getGeneratedContent()
}

export async function getCompetitorStats() {
  const services = await createServicesIfConfigured()
  if (!services) return []
  return services.dashboard.getCompetitorStats()
}

export async function getTrendStats() {
  const services = await createServicesIfConfigured()
  if (!services) return []
  return services.dashboard.getTrendStats()
}

export async function getContentPerformance() {
  const services = await createServicesIfConfigured()
  if (!services) return []
  return services.dashboard.getContentGapsChartData()
}

export async function getNotifications() {
  const services = await createServicesIfConfigured()
  if (!services) return []
  return services.dashboard.getNotifications()
}
