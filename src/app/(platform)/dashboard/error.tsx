"use client"

import { DataError } from "@/components/shared/data-error"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isConfigError = error.message.includes("not configured")

  return (
    <DataError
      title={isConfigError ? "Database not connected" : "Unable to load dashboard"}
      message={
        isConfigError
          ? "Add your Supabase credentials to .env.local and restart the dev server."
          : "We couldn't load dashboard metrics. Please try again."
      }
      reset={reset}
    />
  )
}
