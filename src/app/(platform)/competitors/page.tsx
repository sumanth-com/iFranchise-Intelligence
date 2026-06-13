import type { Metadata } from "next"
import { format, parseISO } from "date-fns"

import { PageHeader } from "@/components/shared/page-header"
import { ScoreBadge } from "@/components/shared/status-badge"
import { StatCard } from "@/components/shared/stat-card"
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
import {
  getCompetitorStats,
  getCompetitorTrackerRows,
} from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Competitor Intelligence",
}

export const dynamic = "force-dynamic"

export default async function CompetitorsPage() {
  const [stats, trackerRows] = await Promise.all([
    getCompetitorStats(),
    getCompetitorTrackerRows(),
  ])

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Competitor Intelligence"
        description="Track competitor content, identify gaps, and stay ahead of market narratives."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Competitor Content Tracker</CardTitle>
          <CardDescription>
            Latest published topics and content gap scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trackerRows.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No competitor activity to display at this time.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competitor</TableHead>
                  <TableHead>Latest Topic</TableHead>
                  <TableHead>Publish Date</TableHead>
                  <TableHead className="text-right">Gap Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trackerRows.map((row) => (
                  <TableRow key={row.competitorId}>
                    <TableCell className="font-medium">
                      {row.competitorName}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {row.latestTopic}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(parseISO(row.publishDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <ScoreBadge score={row.gapScore} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
