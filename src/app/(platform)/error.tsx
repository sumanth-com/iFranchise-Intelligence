"use client"

import { DataError } from "@/components/shared/data-error"

export default function PlatformError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <DataError
      title="Unable to load page"
      message="Something went wrong while loading this page. Please try again."
      reset={reset}
    />
  )
}
