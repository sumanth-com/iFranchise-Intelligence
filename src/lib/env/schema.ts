import { z } from "zod"

const PLACEHOLDER_PATTERNS = [
  "your-project-id",
  "your-anon-key",
  "your-service-role-key",
] as const

/** Strip accidental REST suffixes — Supabase client adds API paths itself. */
export function normalizeSupabaseUrl(url: string): string {
  return url.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "")
}

export function isPlaceholderEnvValue(value: string): boolean {
  const normalized = value.trim().toLowerCase()
  return PLACEHOLDER_PATTERNS.some((pattern) =>
    normalized.includes(pattern)
  )
}

const supabaseUrlSchema = z
  .string()
  .min(1, "NEXT_PUBLIC_SUPABASE_URL is required")
  .transform(normalizeSupabaseUrl)
  .pipe(
    z
      .string()
      .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
      .refine(
        (url) => /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url),
        "Use your project URL (https://<project-ref>.supabase.co)"
      )
  )

const supabaseAnonKeySchema = z
  .string()
  .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required")
  .refine(
    (key) => !isPlaceholderEnvValue(key),
    "Replace placeholder anon key in .env.local"
  )

const supabaseServiceRoleKeySchema = z
  .string()
  .min(1, "SUPABASE_SERVICE_ROLE_KEY is required")
  .refine(
    (key) => !isPlaceholderEnvValue(key),
    "Replace placeholder service role key in .env.local"
  )

/** Variables available on both client and server (NEXT_PUBLIC_*). */
export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: supabaseUrlSchema,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKeySchema,
})

/** Server-only variables (includes public vars). */
export const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKeySchema,
})

export type PublicEnv = z.infer<typeof publicEnvSchema>
export type ServerEnv = z.infer<typeof serverEnvSchema>
