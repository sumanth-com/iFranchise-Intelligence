import { NextResponse } from "next/server"

import { handleApiError } from "@/lib/supabase/errors"
import {
  getServicesOrNull,
  supabaseNotConfiguredResponse,
} from "@/lib/supabase/api-helpers"

export async function POST() {
  try {
    const services = await getServicesOrNull()
    if (!services) return supabaseNotConfiguredResponse()

    const result = await services.gapAnalysis.runAnalysis()
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET() {
  try {
    const services = await getServicesOrNull()
    if (!services) return supabaseNotConfiguredResponse()

    const [summary, topGaps] = await Promise.all([
      services.gapAnalysis.getDetectionSummary(),
      services.gapAnalysis.listTopDetectedGaps(10),
    ])

    return NextResponse.json({ summary, top_gaps: topGaps })
  } catch (error) {
    return handleApiError(error)
  }
}
