import {
  createTableService,
  type SupabaseDbClient,
} from "@/lib/supabase/services/base"
import type { CompetitorArticleWithCompetitor } from "@/lib/supabase/types"
import { assertNoError } from "@/lib/supabase/errors"

const table = createTableService("competitor_articles")

export function createCompetitorArticlesService(client: SupabaseDbClient) {
  return {
    list: async (): Promise<CompetitorArticleWithCompetitor[]> => {
      const { data, error } = await client
        .from("competitor_articles")
        .select("*, competitors(name)")
        .order("published_date", { ascending: false })

      return assertNoError(data, error, "Failed to fetch competitor articles")
    },

    getById: (id: string) => table.getById(client, id),

    create: (payload: Parameters<typeof table.create>[1]) =>
      table.create(client, payload),

    update: (id: string, payload: Parameters<typeof table.update>[2]) =>
      table.update(client, id, payload),

    remove: (id: string) => table.remove(client, id),
  }
}

export type CompetitorArticlesService = ReturnType<
  typeof createCompetitorArticlesService
>
