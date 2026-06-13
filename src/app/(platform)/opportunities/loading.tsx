import { CardsGridSkeleton } from "@/components/shared/page-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function OpportunitiesLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <CardsGridSkeleton />
    </div>
  )
}
