import { NextResponse } from "next/server"

import { handleApiError } from "@/lib/supabase/errors"
import {
  getSupabaseClientOrNull,
  supabaseNotConfiguredResponse,
} from "@/lib/supabase/api-helpers"
import { contentGapUpdateSchema } from "@/lib/validations/schemas"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const supabase = await getSupabaseClientOrNull()
    if (!supabase) return supabaseNotConfiguredResponse()

    const { data, error } = await supabase
      .from("content_gaps")
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
    const supabase = await getSupabaseClientOrNull()
    if (!supabase) return supabaseNotConfiguredResponse()

    const json = await request.json()
    const parsed = contentGapUpdateSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("content_gaps")
      .update(parsed.data)
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

    const { error } = await supabase.from("content_gaps").delete().eq("id", id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
