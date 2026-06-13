import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { CompetitionBadge, ScoreBadge } from "@/components/shared/status-badge"
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
import { getTrendStats, getTrends } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Trend Intelligence",
}

export const dynamic = "force-dynamic"

export default async function TrendsPage() {
  const [stats, trends] = await Promise.all([getTrendStats(), getTrends()])

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Trend Intelligence"
        description="Monitor rising keywords, industries, and market momentum signals."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Trending Keywords</CardTitle>
          <CardDescription>
            Search growth, competition level, and opportunity scoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trends.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No trend signals to display at this time.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead className="text-right">Growth %</TableHead>
                  <TableHead>Competition</TableHead>
                  <TableHead className="text-right">Opportunity Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trends.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.keyword}</TableCell>
                    <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                      +{row.growth_percent}%
                    </TableCell>
                    <TableCell>
                      <CompetitionBadge level={row.competition} />
                    </TableCell>
                    <TableCell className="text-right">
                      <ScoreBadge score={row.opportunity_score} />
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
