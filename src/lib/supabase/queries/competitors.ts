import { createServicesIfConfigured } from "@/lib/supabase/services"

export async function getCompetitors() {
  const services = await createServicesIfConfigured()
  if (!services) return []
  return services.competitors.list()
}

export async function getCompetitorArticles() {
  const services = await createServicesIfConfigured()
  if (!services) return []
  return services.competitorArticles.list()
}

export async function getContentGaps() {
  const services = await createServicesIfConfigured()
  if (!services) return []
  return services.contentGaps.list()
}

export async function getLatestCompetitorArticle() {
  const services = await createServicesIfConfigured()
  if (!services) return null
  return services.competitors.getLatestArticle()
}

export async function getCompetitorTrackerRows() {
  const services = await createServicesIfConfigured()
  if (!services) return []
  return services.competitors.getTrackerRows()
}

export async function countRecentArticles(days = 7) {
  const services = await createServicesIfConfigured()
  if (!services) return 0
  return services.competitors.countRecentArticles(days)
}

export async function countOpenContentGaps() {
  const services = await createServicesIfConfigured()
  if (!services) return 0
  return services.competitors.countOpenContentGaps()
}

export async function countHighPriorityGaps() {
  const services = await createServicesIfConfigured()
  if (!services) return 0
  return services.competitors.countHighPriorityGaps()
}
