"use server"

import { revalidatePath } from "next/cache"

import { isSupabaseConfigured } from "@/lib/supabase/env"
import { SupabaseQueryError } from "@/lib/supabase/errors"
import { createServices } from "@/lib/supabase/services"
import { createClient } from "@/lib/supabase/server"
import { competitorFormSchema } from "@/lib/validations/schemas"

export type CompetitorActionState = {
  success: boolean
  message?: string
  fieldErrors?: Record<string, string[]>
}

const COMPETITORS_PATH = "/competitors"

function parseFormFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    website: String(formData.get("website") ?? ""),
    industry: String(formData.get("industry") ?? ""),
  }
}

async function getServicesOrThrow() {
  if (!isSupabaseConfigured()) {
    throw new SupabaseQueryError(
      "Database is not configured. Add Supabase credentials to .env.local."
    )
  }

  const client = await createClient()
  return createServices(client)
}

export async function createCompetitorAction(
  _prevState: CompetitorActionState,
  formData: FormData
): Promise<CompetitorActionState> {
  try {
    const parsed = competitorFormSchema.safeParse(parseFormFields(formData))

    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
      }
    }

    const services = await getServicesOrThrow()
    await services.competitors.create(parsed.data)

    revalidatePath(COMPETITORS_PATH)
    return { success: true, message: "Competitor added successfully." }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add competitor.",
    }
  }
}

export async function updateCompetitorAction(
  id: string,
  _prevState: CompetitorActionState,
  formData: FormData
): Promise<CompetitorActionState> {
  try {
    const parsed = competitorFormSchema.safeParse(parseFormFields(formData))

    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
      }
    }

    const services = await getServicesOrThrow()
    await services.competitors.update(id, parsed.data)

    revalidatePath(COMPETITORS_PATH)
    return { success: true, message: "Competitor updated successfully." }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update competitor.",
    }
  }
}

export async function deleteCompetitorAction(
  id: string
): Promise<CompetitorActionState> {
  try {
    const services = await getServicesOrThrow()
    await services.competitors.remove(id)

    revalidatePath(COMPETITORS_PATH)
    return { success: true, message: "Competitor deleted successfully." }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete competitor.",
    }
  }
}
