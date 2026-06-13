import { cache } from "react"

import { isSupabaseConfigured } from "@/lib/supabase/env"
import { SupabaseQueryError } from "@/lib/supabase/errors"
import { createServices } from "@/lib/supabase/services"
import { createClient } from "@/lib/supabase/server"
import type { CompetitorDetail } from "@/lib/supabase/types"

async function getServices() {
  if (!isSupabaseConfigured()) {
    throw new SupabaseQueryError(
      "Database is not configured. Add Supabase credentials to .env.local."
    )
  }

  const client = await createClient()
  return createServices(client)
}

export const getCompetitorDetail = cache(async function getCompetitorDetail(
  id: string
): Promise<CompetitorDetail | null> {
  const services = await getServices()
  return services.competitors.getDetail(id)
})
