import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { SupabaseClient } from "@supabase/supabase-js"

import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/env"
import type { Database } from "@/lib/supabase/types"

export type ServerSupabaseClient = SupabaseClient<Database>

/**
 * Server Supabase client for Server Components, Route Handlers, and Server Actions.
 * Reads/writes auth cookies via next/headers.
 */
export async function createClient(): Promise<ServerSupabaseClient> {
  if (!isSupabaseConfigured()) {
    throw new Error("SUPABASE_NOT_CONFIGURED")
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — cookie writes are ignored safely.
          }
        },
      },
    }
  )
}

export async function createClientIfConfigured(): Promise<ServerSupabaseClient | null> {
  if (!isSupabaseConfigured()) return null
  return createClient()
}
