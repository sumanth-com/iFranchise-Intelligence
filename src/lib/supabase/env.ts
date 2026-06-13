export {
  getPublicEnv,
  getServerEnv,
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isPlaceholderEnvValue,
  isSupabaseConfigured,
  normalizeSupabaseUrl,
  publicEnvSchema,
  serverEnvSchema,
} from "@/lib/env"

export type { PublicEnv, ServerEnv } from "@/lib/env"
