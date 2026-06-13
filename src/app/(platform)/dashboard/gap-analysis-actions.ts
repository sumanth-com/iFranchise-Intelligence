"use server"

import { revalidatePath } from "next/cache"

import { isSupabaseConfigured } from "@/lib/supabase/env"
import { runGapAnalysis } from "@/lib/supabase/queries/gap-analysis"
import type { GapAnalysisResult } from "@/lib/supabase/types"

export type RunGapAnalysisState = {
  success: boolean
  message?: string
  result?: GapAnalysisResult
}

export async function runGapAnalysisAction(): Promise<RunGapAnalysisState> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: "Database is not configured.",
      }
    }

    const result = await runGapAnalysis()

    revalidatePath("/dashboard")
    revalidatePath("/competitors")

    return {
      success: true,
      message: `Detected ${result.detected_gaps.length} gaps · ${result.created} created · ${result.updated} updated`,
      result,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gap analysis failed.",
    }
  }
}
