import type { Metadata } from "next"
import { Suspense } from "react"

import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { PageHeader } from "@/components/shared/page-header"
import { StatCardsSkeleton } from "@/components/shared/page-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { getDashboardPageData } from "@/lib/supabase/queries/dashboard"

export const metadata: Metadata = {
  title: "Dashboard",
}

export const dynamic = "force-dynamic"

async function DashboardData() {
  const data = await getDashboardPageData()
  return <DashboardContent {...data} />
}

function DashboardFallback() {
  return (
    <>
      <StatCardsSkeleton />
      <StatCardsSkeleton count={3} />
      <Skeleton className="h-96 rounded-xl" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[360px] rounded-xl" />
        <Skeleton className="h-[360px] rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dashboard"
        description="Real-time overview of franchise intelligence across your markets."
      />

      <Suspense fallback={<DashboardFallback />}>
        <DashboardData />
      </Suspense>
    </div>
  )
}
