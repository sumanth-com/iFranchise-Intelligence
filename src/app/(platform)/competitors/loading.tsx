import { StatCardsSkeleton, TableSkeleton } from "@/components/shared/page-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function CompetitorsLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <StatCardsSkeleton count={3} />
      <TableSkeleton />
    </div>
  )
}
