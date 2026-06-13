export type CompetitionLevel = "Low" | "Medium" | "High"
export type OpportunityPriority = "Critical" | "High" | "Medium" | "Low"
export type OpportunityStatus = "Hot" | "Active" | "Review"
export type ContentType = "blog" | "linkedin" | "email"
export type ContentGapStatus =
  | "open"
  | "in_progress"
  | "monitoring"
  | "resolved"
  | "dismissed"

export type Competitor = {
  id: string
  name: string
  website: string | null
  industry: string | null
  created_at: string
}

export type CompetitorArticle = {
  id: string
  competitor_id: string
  title: string
  url: string | null
  published_date: string
  summary: string | null
  created_at: string
}

export type ContentGap = {
  id: string
  topic: string
  importance_score: number
  competitor_count: number
  status: ContentGapStatus
  suggested_opportunity: string | null
  created_at: string
}

export type CompetitorArticleWithCompetitor = CompetitorArticle & {
  competitors: Pick<Competitor, "name"> | null
}

export type CompetitorTrackerRow = {
  competitorId: string
  competitorName: string
  latestTopic: string
  publishDate: string
  gapScore: number
}

export type CompetitorListRow = Competitor & {
  articles_count: number
}

export type PaginatedCompetitors = {
  rows: CompetitorListRow[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type DetectedContentGap = {
  topic: string
  importance_score: number
  competitor_count: number
  suggested_opportunity: string
  sample_articles: string[]
}

export type GapAnalysisResult = {
  analyzed_articles: number
  existing_topics: number
  detected_gaps: DetectedContentGap[]
  created: number
  updated: number
}

export type GapDetectionSummary = {
  open_gaps: number
  high_priority_gaps: number
  avg_importance_score: number
  top_gaps: ContentGap[]
}

export type CompetitorActivityType =
  | "article_published"
  | "gap_identified"
  | "competitor_tracked"

export type CompetitorActivityItem = {
  id: string
  type: CompetitorActivityType
  title: string
  description: string
  timestamp: string
}

export type CompetitorDetail = {
  competitor: Competitor
  articles_count: number
  latest_articles: CompetitorArticle[]
  related_gaps: ContentGap[]
  opportunity_score: number
  recent_activity: CompetitorActivityItem[]
}

export type Trend = {
  id: string
  keyword: string
  industry: string | null
  growth_percent: number
  competition: CompetitionLevel
  opportunity_score: number
  created_at: string
  updated_at: string
}

export type Opportunity = {
  id: string
  title: string
  industry: string
  city: string
  score: number
  priority: OpportunityPriority
  status: OpportunityStatus
  created_at: string
  updated_at: string
}

export type GeneratedContent = {
  id: string
  type: ContentType
  topic: string
  content: string
  channel: string
  views: number
  engagement: number
  created_at: string
  updated_at: string
}

export type TableName =
  | "competitors"
  | "competitor_articles"
  | "content_gaps"
  | "trends"
  | "opportunities"
  | "generated_content"
