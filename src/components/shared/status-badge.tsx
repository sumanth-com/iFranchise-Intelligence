import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusBadgeProps = {
  status: string
  className?: string
}

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Hot: "destructive",
  Critical: "destructive",
  Active: "default",
  High: "default",
  Review: "secondary",
  Medium: "secondary",
  Low: "outline",
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant={statusVariants[status] ?? "outline"}
      className={cn("font-medium", className)}
    >
      {status}
    </Badge>
  )
}

export function CompetitionBadge({
  level,
}: {
  level: "Low" | "Medium" | "High"
}) {
  const colors = {
    Low: "text-emerald-600 dark:text-emerald-400",
    Medium: "text-amber-600 dark:text-amber-400",
    High: "text-red-600 dark:text-red-400",
  }

  return (
    <Badge variant="outline" className={cn("font-medium", colors[level])}>
      {level}
    </Badge>
  )
}

export function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? "text-emerald-600 dark:text-emerald-400"
      : score >= 80
        ? "text-primary"
        : score >= 70
          ? "text-amber-600 dark:text-amber-400"
          : "text-muted-foreground"

  return (
    <span className={cn("font-semibold tabular-nums", color)}>{score}</span>
  )
}
