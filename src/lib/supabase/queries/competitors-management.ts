import { isSupabaseConfigured } from "@/lib/supabase/env"
import { SupabaseQueryError } from "@/lib/supabase/errors"
import { createServices } from "@/lib/supabase/services"
import { createClient } from "@/lib/supabase/server"
import type { PaginatedCompetitors } from "@/lib/supabase/types"

const DEFAULT_PAGE_SIZE = 10

async function getServices() {
  if (!isSupabaseConfigured()) {
    throw new SupabaseQueryError(
      "Database is not configured. Add Supabase credentials to .env.local."
    )
  }

  const client = await createClient()
  return createServices(client)
}

export type CompetitorListParams = {
  search?: string
  page?: number
  pageSize?: number
}

export async function getCompetitorsPaginated(
  params: CompetitorListParams = {}
): Promise<PaginatedCompetitors> {
  const services = await getServices()

  return services.competitors.listPaginated({
    search: params.search,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
  })
}

export { DEFAULT_PAGE_SIZE as COMPETITOR_PAGE_SIZE }
