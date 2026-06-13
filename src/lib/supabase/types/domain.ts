export type NotificationItem = {
  id: string
  title: string
  description: string
  time: string
  unread: boolean
}

export type StatCardData = {
  title: string
  value: string
  change: string
  icon:
    | "target"
    | "users"
    | "file-text"
    | "trending-up"
    | "building-2"
    | "rss"
    | "gap"
    | "hash"
    | "bar-chart-3"
    | "gauge"
  trend?: "up" | "down"
}

export type ChartPoint = {
  month: string
  score: number
}

export type ContentPerformancePoint = {
  channel: string
  views: number
  engagement: number
}
