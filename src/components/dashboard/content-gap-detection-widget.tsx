"use client"

import { useTransition } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { runGapAnalysisAction } from "@/app/(platform)/dashboard/gap-analysis-actions"
import { GapDetectionSummaryInline } from "@/components/dashboard/gap-detection-summary"
import { ScoreBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ContentGap, GapDetectionSummary } from "@/lib/supabase/types"

type ContentGapDetectionWidgetProps = {
  summary: GapDetectionSummary
  topGaps: ContentGap[]
}

export function ContentGapDetectionWidget({
  summary,
  topGaps,
}: ContentGapDetectionWidgetProps) {
  const [isPending, startTransition] = useTransition()

  function handleRunAnalysis() {
    startTransition(async () => {
      const result = await runGapAnalysisAction()

      if (result.success) {
        toast.success(result.message ?? "Gap analysis complete")
      } else {
        toast.error(result.message ?? "Gap analysis failed")
      }
    })
  }

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </div>
            <CardTitle>AI Content Gap Detection</CardTitle>
          </div>
          <CardDescription>
            Compare competitor articles against your content topics to find
            missing opportunities
          </CardDescription>
        </div>
        <Button onClick={handleRunAnalysis} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Run Gap Analysis
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-5">
        <GapDetectionSummaryInline summary={summary} />

        {topGaps.length === 0 ? (
          <div className="rounded-lg border border-dashed py-10 text-center">
            <p className="text-sm font-medium">No content gaps detected yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Run gap analysis to scan competitor articles and identify missing
              topics.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Missing Topic</TableHead>
                <TableHead className="text-right">Importance</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Suggested Opportunity
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topGaps.map((gap) => (
                <TableRow key={gap.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{gap.topic}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {gap.competitor_count} competitor
                        {gap.competitor_count === 1 ? "" : "s"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <ScoreBadge score={gap.importance_score} />
                  </TableCell>
                  <TableCell className="hidden max-w-xl text-sm text-muted-foreground lg:table-cell">
                    {gap.suggested_opportunity ??
                      "Create differentiated content to close this competitive gap."}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
