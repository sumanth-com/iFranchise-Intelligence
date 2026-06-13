export { createAdminClient, type AdminSupabaseClient } from "@/lib/supabase/admin"
export {
  getServicesOrNull,
  getSupabaseClientOrNull,
  supabaseNotConfiguredResponse,
} from "@/lib/supabase/api-helpers"
export {
  createClient,
  createClientIfConfigured,
  type BrowserSupabaseClient,
} from "@/lib/supabase/client"
export {
  assertNoError,
  handleApiError,
  SupabaseQueryError,
} from "@/lib/supabase/errors"
export {
  getPublicEnv,
  getServerEnv,
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isPlaceholderEnvValue,
  isSupabaseConfigured,
  normalizeSupabaseUrl,
} from "@/lib/supabase/env"
export { updateSession } from "@/lib/supabase/middleware"
export {
  createClient as createServerClient,
  createClientIfConfigured as createServerClientIfConfigured,
  type ServerSupabaseClient,
} from "@/lib/supabase/server"
export {
  createServices,
  createServicesIfConfigured,
  type DatabaseServices,
} from "@/lib/supabase/services"
export type * from "@/lib/supabase/types"
