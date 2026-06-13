import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/env"
import type { Database } from "@/lib/supabase/types"

export type BrowserSupabaseClient = SupabaseClient<Database>

let browserClient: BrowserSupabaseClient | undefined

/**
 * Browser Supabase client for Client Components.
 * Uses a module singleton to avoid recreating clients on re-renders.
 */
export function createClient(): BrowserSupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("SUPABASE_NOT_CONFIGURED")
  }

  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      getSupabaseUrl(),
      getSupabaseAnonKey()
    )
  }

  return browserClient
}

/** Safe variant for optional client-side Supabase usage. */
export function createClientIfConfigured(): BrowserSupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  return createClient()
}
