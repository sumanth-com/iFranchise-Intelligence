"use client"

import Link from "next/link"

import { DataError } from "@/components/shared/data-error"
import { Button } from "@/components/ui/button"

export default function CompetitorDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isConfigError = error.message.includes("not configured")

  return (
    <div className="space-y-4">
      <DataError
        title={isConfigError ? "Database not connected" : "Unable to load competitor"}
        message={
          isConfigError
            ? "Add your Supabase credentials to .env.local and restart the dev server."
            : "We couldn't load this competitor profile. Please try again."
        }
        reset={reset}
      />
      <Button variant="outline" asChild>
        <Link href="/competitors">Back to competitors</Link>
      </Button>
    </div>
  )
}
