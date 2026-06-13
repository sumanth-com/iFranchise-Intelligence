import { NextResponse } from "next/server"

import { handleApiError } from "@/lib/supabase/errors"
import {
  getSupabaseClientOrNull,
  supabaseNotConfiguredResponse,
} from "@/lib/supabase/api-helpers"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const supabase = await getSupabaseClientOrNull()
    if (!supabase) return supabaseNotConfiguredResponse()

    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const supabase = await getSupabaseClientOrNull()
    if (!supabase) return supabaseNotConfiguredResponse()

    const { data, error } = await supabase
      .from("opportunities")
      .update(body)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const supabase = await getSupabaseClientOrNull()
    if (!supabase) return supabaseNotConfiguredResponse()

    const { error } = await supabase.from("opportunities").delete().eq("id", id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
