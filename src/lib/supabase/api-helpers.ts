import { NextResponse } from "next/server"

import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createServicesIfConfigured } from "@/lib/supabase/services"

export function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    {
      error: "Service temporarily unavailable. Please try again later.",
    },
    { status: 503 }
  )
}

export async function getSupabaseClientOrNull() {
  if (!isSupabaseConfigured()) return null

  const { createClient } = await import("@/lib/supabase/server")
  return createClient()
}

export async function getServicesOrNull() {
  return createServicesIfConfigured()
}
