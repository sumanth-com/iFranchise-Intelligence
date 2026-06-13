import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { CompetitorManagement } from "@/components/competitors/competitor-management"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  COMPETITOR_PAGE_SIZE,
  getCompetitorsPaginated,
} from "@/lib/supabase/queries/competitors-management"
import { getCompetitorStats } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Competitor Intelligence",
}

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string }>
}

async function CompetitorListSection({
  searchQuery,
  page,
}: {
  searchQuery: string
  page: number
}) {
  const data = await getCompetitorsPaginated({
    search: searchQuery,
    page,
    pageSize: COMPETITOR_PAGE_SIZE,
  })

  if (page > 1 && data.rows.length === 0 && data.total > 0) {
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    redirect(`/competitors${params.toString() ? `?${params}` : ""}`)
  }

  return <CompetitorManagement {...data} searchQuery={searchQuery} />
}

function CompetitorListFallback() {
  return (
    <div className="space-y-4 rounded-xl border p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default async function CompetitorsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const searchQuery = params.q?.trim() ?? ""
  const page = Math.max(1, Number(params.page) || 1)

  const stats = await getCompetitorStats()

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Competitor Intelligence"
        description="Manage competitors, track articles, and identify content gaps."
      />

      {stats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      )}

      <Suspense fallback={<CompetitorListFallback />}>
        <CompetitorListSection searchQuery={searchQuery} page={page} />
      </Suspense>
    </div>
  )
}
