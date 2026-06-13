import { format, formatDistanceToNow, parseISO } from "date-fns"
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  FileText,
  Globe,
  Radar,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

import { ScoreBadge, StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  CompetitorActivityItem,
  CompetitorDetail,
  ContentGap,
} from "@/lib/supabase/types"

function formatGapStatus(status: ContentGap["status"]): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function activityIcon(type: CompetitorActivityItem["type"]) {
  switch (type) {
    case "article_published":
      return FileText
    case "gap_identified":
      return Sparkles
    default:
      return Building2
  }
}

function activityLabel(type: CompetitorActivityItem["type"]): string {
  switch (type) {
    case "article_published":
      return "Article"
    case "gap_identified":
      return "Content Gap"
    default:
      return "Tracking"
  }
}

type CompetitorDetailContentProps = {
  data: CompetitorDetail
}

export function CompetitorDetailContent({ data }: CompetitorDetailContentProps) {
  const { competitor } = data

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="sm" className="w-fit" asChild>
          <Link href="/competitors">
            <ArrowLeft className="size-4" />
            Back to competitors
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {competitor.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Competitor intelligence profile and activity timeline
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Competitor Information</CardTitle>
            <CardDescription>Core profile and tracking metadata</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Name
              </p>
              <p className="font-medium">{competitor.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Industry
              </p>
              <p className="font-medium">{competitor.industry ?? "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Website
              </p>
              {competitor.website ? (
                <a
                  href={competitor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <Globe className="size-3.5" />
                  {competitor.website.replace(/^https?:\/\//, "")}
                  <ExternalLink className="size-3" />
                </a>
              ) : (
                <p className="font-medium">—</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Tracked Since
              </p>
              <p className="font-medium">
                {format(parseISO(competitor.created_at), "MMM d, yyyy")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Articles
              </p>
              <p className="font-medium">{data.articles_count}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Related Gaps
              </p>
              <p className="font-medium">{data.related_gaps.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Radar className="size-4" />
              </div>
              <div>
                <CardTitle>Opportunity Score</CardTitle>
                <CardDescription>
                  Derived from related content gaps and publishing activity
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="font-metric text-5xl font-semibold">
                <ScoreBadge score={data.opportunity_score} />
              </span>
              <span className="pb-1 text-sm text-muted-foreground">/ 100</span>
            </div>
            <Progress value={data.opportunity_score} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {data.related_gaps.length > 0
                ? `Based on ${data.related_gaps.length} matched content gap${data.related_gaps.length === 1 ? "" : "s"} linked to this competitor's articles.`
                : `Based on ${data.articles_count} tracked article${data.articles_count === 1 ? "" : "s"} and recent publishing velocity.`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Latest Articles</CardTitle>
            <CardDescription>
              Most recent content published by {competitor.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.latest_articles.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No articles recorded for this competitor yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.latest_articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <div className="max-w-md space-y-1">
                          <p className="font-medium">{article.title}</p>
                          {article.summary && (
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {article.summary}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(parseISO(article.published_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {article.url ? (
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                              <ExternalLink className="size-3.5" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Timeline of intelligence events</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recent_activity.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No recent activity to display.
              </p>
            ) : (
              <div className="space-y-4">
                {data.recent_activity.map((item, index) => {
                  const Icon = activityIcon(item.type)

                  return (
                    <div key={item.id}>
                      <div className="flex gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <Icon className="size-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{item.title}</p>
                            <Badge variant="outline" className="text-[10px]">
                              {activityLabel(item.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(parseISO(item.timestamp), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                      {index < data.recent_activity.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Gaps</CardTitle>
          <CardDescription>
            Intelligence topics linked to this competitor&apos;s published content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.related_gaps.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No content gaps matched to this competitor&apos;s articles yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Competitors</TableHead>
                  <TableHead className="text-right">Importance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.related_gaps.map((gap) => (
                  <TableRow key={gap.id}>
                    <TableCell className="max-w-md font-medium">
                      {gap.topic}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={formatGapStatus(gap.status)} />
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {gap.competitor_count}
                    </TableCell>
                    <TableCell className="text-right">
                      <ScoreBadge score={gap.importance_score} />
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
