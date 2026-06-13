import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { CompetitorDetailContent } from "@/components/competitors/competitor-detail-content"
import { Skeleton } from "@/components/ui/skeleton"
import { getCompetitorDetail } from "@/lib/supabase/queries/competitor-detail"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const data = await getCompetitorDetail(id)

  return {
    title: data ? data.competitor.name : "Competitor Not Found",
  }
}

async function CompetitorDetailSection({ id }: { id: string }) {
  const data = await getCompetitorDetail(id)

  if (!data) {
    notFound()
  }

  return <CompetitorDetailContent data={data} />
}

function CompetitorDetailFallback() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-72" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-56 rounded-xl lg:col-span-2" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-xl lg:col-span-2" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}

export default async function CompetitorDetailPage({ params }: PageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<CompetitorDetailFallback />}>
      <CompetitorDetailSection id={id} />
    </Suspense>
  )
}
