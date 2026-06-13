import { NextResponse } from "next/server"

import { handleApiError } from "@/lib/supabase/errors"
import {
  getSupabaseClientOrNull,
  supabaseNotConfiguredResponse,
} from "@/lib/supabase/api-helpers"

export async function GET() {
  try {
    const supabase = await getSupabaseClientOrNull()
    if (!supabase) return supabaseNotConfiguredResponse()

    const { data, error } = await supabase
      .from("trends")
      .select("*")
      .order("opportunity_score", { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await getSupabaseClientOrNull()
    if (!supabase) return supabaseNotConfiguredResponse()

    const { data, error } = await supabase
      .from("trends")
      .insert(body)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
