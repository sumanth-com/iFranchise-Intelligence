import type { Metadata } from "next"

import { ContentPerformanceChart } from "@/components/dashboard/content-performance-chart"
import { OpportunityScoreChart } from "@/components/dashboard/opportunity-score-chart"
import { PageHeader } from "@/components/shared/page-header"
import { ScoreBadge, StatusBadge } from "@/components/shared/status-badge"
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
  getContentPerformance,
  getDashboardStats,
  getOpportunityScoreTrend,
  getRecentOpportunities,
} from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Dashboard",
}

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const [stats, scoreTrend, contentPerformance, recentOpportunities] =
    await Promise.all([
      getDashboardStats(),
      getOpportunityScoreTrend(),
      getContentPerformance(),
      getRecentOpportunities(5),
    ])

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dashboard"
        description="Real-time overview of franchise intelligence across your markets."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <OpportunityScoreChart data={scoreTrend} />
        <ContentPerformanceChart data={contentPerformance} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Opportunities</CardTitle>
          <CardDescription>
            Latest high-scoring franchise opportunities detected by the radar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentOpportunities.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No opportunities to display at this time.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Opportunity</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOpportunities.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.industry}
                    </TableCell>
                    <TableCell className="text-right">
                      <ScoreBadge score={row.score} />
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={row.status} />
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
