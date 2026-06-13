import type { Metadata } from "next"
import { MapPin } from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { ScoreBadge, StatusBadge } from "@/components/shared/status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getOpportunities } from "@/lib/supabase/queries"

export const metadata: Metadata = {
  title: "Opportunity Radar",
}

export const dynamic = "force-dynamic"

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities()

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Opportunity Radar"
        description="Discover and prioritize high-value franchise expansion opportunities."
      />

      {opportunities.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No opportunities match your current radar criteria.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {opportunities.map((opportunity, index) => (
            <Card
              key={opportunity.id}
              className="transition-shadow duration-200 hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base leading-snug">
                    {opportunity.title}
                  </CardTitle>
                  <StatusBadge status={opportunity.priority} />
                </div>
                <CardDescription>{opportunity.industry}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0" />
                  {opportunity.city}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Opportunity Score</span>
                    <ScoreBadge score={opportunity.score} />
                  </div>
                  <Progress value={opportunity.score} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
