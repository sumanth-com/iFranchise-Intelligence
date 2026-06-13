import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase/env"
import type { Database } from "@/lib/supabase/types"

export type AdminSupabaseClient = SupabaseClient<Database>

let adminClient: AdminSupabaseClient | undefined

/**
 * Admin client with service role privileges.
 * Server/scripts only — never import in Client Components.
 */
export function createAdminClient(): AdminSupabaseClient {
  if (!adminClient) {
    adminClient = createClient<Database>(
      getSupabaseUrl(),
      getSupabaseServiceRoleKey(),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  }

  return adminClient
}
