import { NextResponse } from "next/server"

export class SupabaseQueryError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = "SupabaseQueryError"
  }
}

export function handleApiError(error: unknown) {
  console.error(error)

  if (error instanceof SupabaseQueryError) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}

export function assertNoError<T>(
  data: T | null,
  error: { message: string } | null,
  context: string
): T {
  if (error) {
    throw new SupabaseQueryError(`${context}: ${error.message}`, error)
  }
  return data as T
}
