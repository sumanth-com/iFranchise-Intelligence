import { NextResponse } from "next/server"

import { handleApiError } from "@/lib/supabase/errors"
import {
  getSupabaseClientOrNull,
  supabaseNotConfiguredResponse,
} from "@/lib/supabase/api-helpers"
import { competitorArticleSchema } from "@/lib/validations/schemas"

export async function GET() {
  try {
    const supabase = await getSupabaseClientOrNull()
    if (!supabase) return supabaseNotConfiguredResponse()

    const { data, error } = await supabase
      .from("competitor_articles")
      .select("*, competitors(name)")
      .order("published_date", { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseClientOrNull()
    if (!supabase) return supabaseNotConfiguredResponse()

    const json = await request.json()
    const parsed = competitorArticleSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("competitor_articles")
      .insert(parsed.data)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
