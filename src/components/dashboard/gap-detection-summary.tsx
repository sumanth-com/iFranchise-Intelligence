import { Sparkles, Target, TrendingUp } from "lucide-react"

import { StatCard } from "@/components/shared/stat-card"
import type { GapDetectionSummary } from "@/lib/supabase/types"

type GapDetectionSummaryCardsProps = {
  summary: GapDetectionSummary
}

export function GapDetectionSummaryCards({
  summary,
}: GapDetectionSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        title="Open Content Gaps"
        value={String(summary.open_gaps)}
        change={`${summary.high_priority_gaps} high priority`}
        icon="gap"
        trend={summary.high_priority_gaps > 0 ? "up" : undefined}
      />
      <StatCard
        title="High Priority Gaps"
        value={String(summary.high_priority_gaps)}
        change="Score ≥ 80"
        icon="target"
        trend={summary.high_priority_gaps > 0 ? "up" : undefined}
      />
      <StatCard
        title="Avg Gap Importance"
        value={String(summary.avg_importance_score)}
        change="Across open gaps"
        icon="gauge"
      />
    </div>
  )
}

export function GapDetectionSummaryInline({
  summary,
}: GapDetectionSummaryCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 text-center">
      <div className="rounded-lg border bg-muted/30 p-3">
        <Sparkles className="mx-auto mb-1 size-4 text-primary" />
        <p className="font-metric text-xl font-semibold">{summary.open_gaps}</p>
        <p className="text-xs text-muted-foreground">Open gaps</p>
      </div>
      <div className="rounded-lg border bg-muted/30 p-3">
        <Target className="mx-auto mb-1 size-4 text-primary" />
        <p className="font-metric text-xl font-semibold">
          {summary.high_priority_gaps}
        </p>
        <p className="text-xs text-muted-foreground">High priority</p>
      </div>
      <div className="rounded-lg border bg-muted/30 p-3">
        <TrendingUp className="mx-auto mb-1 size-4 text-primary" />
        <p className="font-metric text-xl font-semibold">
          {summary.avg_importance_score}
        </p>
        <p className="text-xs text-muted-foreground">Avg score</p>
      </div>
    </div>
  )
}
