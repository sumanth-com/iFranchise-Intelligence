import { NextResponse } from "next/server"

import { channelByType } from "@/lib/data/seed-data"
import { handleApiError } from "@/lib/supabase/errors"
import {
  getSupabaseClientOrNull,
  supabaseNotConfiguredResponse,
} from "@/lib/supabase/api-helpers"
import { generateContentSchema } from "@/lib/validations/schemas"

export async function GET() {
  try {
    const supabase = await getSupabaseClientOrNull()
    if (!supabase) return supabaseNotConfiguredResponse()

    const { data, error } = await supabase
      .from("generated_content")
      .select("*")
      .order("created_at", { ascending: false })

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
    const parsed = generateContentSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { type, topic, content } = parsed.data

    const { data, error } = await supabase
      .from("generated_content")
      .insert({
        type,
        topic,
        content,
        channel: channelByType[type],
        views: Math.floor(Math.random() * 5000) + 1000,
        engagement: Math.floor(Math.random() * 500) + 100,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
