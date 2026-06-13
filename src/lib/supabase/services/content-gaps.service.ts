import {
  createTableService,
  type SupabaseDbClient,
} from "@/lib/supabase/services/base"

const table = createTableService("content_gaps")

export function createContentGapsService(client: SupabaseDbClient) {
  return {
    list: () =>
      table.list(client, { orderBy: "importance_score", ascending: false }),

    getById: (id: string) => table.getById(client, id),

    create: (payload: Parameters<typeof table.create>[1]) =>
      table.create(client, payload),

    update: (id: string, payload: Parameters<typeof table.update>[2]) =>
      table.update(client, id, payload),

    remove: (id: string) => table.remove(client, id),
  }
}

export type ContentGapsService = ReturnType<typeof createContentGapsService>
