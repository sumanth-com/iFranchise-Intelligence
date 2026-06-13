import {
  BarChart3,
  Building2,
  FileText,
  Gauge,
  Hash,
  Rss,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const iconMap = {
  target: Target,
  users: Users,
  "file-text": FileText,
  "trending-up": TrendingUp,
  "building-2": Building2,
  rss: Rss,
  gap: Sparkles,
  hash: Hash,
  "bar-chart-3": BarChart3,
  gauge: Gauge,
} as const

type StatCardProps = {
  title: string
  value: string
  change: string
  icon: keyof typeof iconMap
  trend?: "up" | "down"
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  icon,
  trend,
  className,
}: StatCardProps) {
  const Icon: LucideIcon = iconMap[icon]

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-sans text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="font-metric text-3xl font-semibold">{value}</div>
        <div className="mt-2 flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn(
              "font-normal",
              trend === "up" && "text-emerald-600 dark:text-emerald-400",
              trend === "down" && "text-red-600 dark:text-red-400"
            )}
          >
            {change}
          </Badge>
          <span className="text-xs text-muted-foreground">last 30 days</span>
        </div>
      </CardContent>
    </Card>
  )
}
