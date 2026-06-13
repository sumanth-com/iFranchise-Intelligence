import {
  isPlaceholderEnvValue,
  publicEnvSchema,
  serverEnvSchema,
  type PublicEnv,
  type ServerEnv,
} from "@/lib/env/schema"

export {
  isPlaceholderEnvValue,
  normalizeSupabaseUrl,
  publicEnvSchema,
  serverEnvSchema,
} from "@/lib/env/schema"
export type { PublicEnv, ServerEnv } from "@/lib/env/schema"

let cachedPublicEnv: PublicEnv | null = null
let cachedServerEnv: ServerEnv | null = null

function readPublicEnvRecord() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  }
}

function readServerEnvRecord() {
  return {
    ...readPublicEnvRecord(),
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  }
}

/** Parse and cache public env. Returns null when vars are missing or placeholders. */
export function getPublicEnv(): PublicEnv | null {
  if (cachedPublicEnv) return cachedPublicEnv

  const parsed = publicEnvSchema.safeParse(readPublicEnvRecord())
  if (!parsed.success) return null

  cachedPublicEnv = parsed.data
  return cachedPublicEnv
}

/** Parse and cache server env. Throws when required server vars are invalid. */
export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv

  const parsed = serverEnvSchema.safeParse(readServerEnvRecord())
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => issue.message)
      .join("; ")
    throw new Error(`Invalid environment configuration: ${message}`)
  }

  cachedServerEnv = parsed.data
  return cachedServerEnv
}

/** True when Supabase public credentials are present and not placeholders. */
export function isSupabaseConfigured(): boolean {
  return getPublicEnv() !== null
}

/** Public Supabase URL — throws when not configured. */
export function getSupabaseUrl(): string {
  const env = getPublicEnv()
  if (!env) {
    throw new Error(
      "Missing Supabase configuration. Copy .env.local.example to .env.local and add your project credentials."
    )
  }
  return env.NEXT_PUBLIC_SUPABASE_URL
}

/** Public Supabase anon key — throws when not configured. */
export function getSupabaseAnonKey(): string {
  const env = getPublicEnv()
  if (!env) {
    throw new Error(
      "Missing Supabase configuration. Copy .env.local.example to .env.local and add your project credentials."
    )
  }
  return env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

/** Service role key — server/scripts only. */
export function getSupabaseServiceRoleKey(): string {
  return getServerEnv().SUPABASE_SERVICE_ROLE_KEY
}
