import type { PostgrestError } from "@supabase/supabase-js"

import { assertNoError, SupabaseQueryError } from "@/lib/supabase/errors"
import type { ServerSupabaseClient } from "@/lib/supabase/server"
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/supabase/types"

export type SupabaseDbClient = ServerSupabaseClient
export type DbTableName = keyof Database["public"]["Tables"]

export type ListOptions = {
  orderBy?: string
  ascending?: boolean
  limit?: number
}

export type CountOptions = {
  since?: Date
  dateColumn?: string
}

export async function countTableRows(
  client: SupabaseDbClient,
  table: DbTableName,
  options: CountOptions = {}
): Promise<number> {
  const { since, dateColumn = "created_at" } = options

  let query = client.from(table).select("*", { count: "exact", head: true })

  if (since) {
    query = query.gte(dateColumn, since.toISOString())
  }

  const { count, error } = await query

  if (error) {
    throw new SupabaseQueryError(
      `Failed to count ${String(table)} rows: ${error.message}`,
      error
    )
  }

  return count ?? 0
}

export function createTableService<T extends DbTableName>(table: T) {
  return {
    async list(
      client: SupabaseDbClient,
      options: ListOptions = {}
    ): Promise<Tables<T>[]> {
      const { orderBy = "created_at", ascending = false, limit } = options

      let query = client.from(table).select("*").order(orderBy, { ascending })

      if (limit !== undefined) {
        query = query.limit(limit)
      }

      const { data, error } = await query
      return assertNoError(
        data as Tables<T>[] | null,
        error,
        `Failed to list ${String(table)}`
      )
    },

    async getById(
      client: SupabaseDbClient,
      id: string
    ): Promise<Tables<T>> {
      const { data, error } = await client
        .from(table)
        .select("*")
        .match({ id })
        .single()

      return assertNoError(
        data as Tables<T> | null,
        error,
        `Failed to fetch ${String(table)} record`
      )
    },

    async create(
      client: SupabaseDbClient,
      payload: TablesInsert<T>
    ): Promise<Tables<T>> {
      const { data, error } = await client
        .from(table)
        .insert(payload as never)
        .select()
        .single()

      return assertNoError(
        data as Tables<T> | null,
        error,
        `Failed to create ${String(table)} record`
      )
    },

    async update(
      client: SupabaseDbClient,
      id: string,
      payload: TablesUpdate<T>
    ): Promise<Tables<T>> {
      const { data, error } = await client
        .from(table)
        .update(payload as never)
        .match({ id })
        .select()
        .single()

      return assertNoError(
        data as Tables<T> | null,
        error,
        `Failed to update ${String(table)} record`
      )
    },

    async remove(client: SupabaseDbClient, id: string): Promise<void> {
      const { error } = await client
        .from(table)
        .delete()
        .match({ id })

      if (error) {
        throw new SupabaseQueryError(
          `Failed to delete ${String(table)} record: ${error.message}`,
          error
        )
      }
    },
  }
}

export function isPostgrestNotFound(error: PostgrestError): boolean {
  return error.code === "PGRST116"
}
