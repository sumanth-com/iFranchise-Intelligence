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

export type Database = {
  public: {
    Tables: {
      competitors: {
        Row: Competitor
        Insert: {
          id?: string
          name: string
          website?: string | null
          industry?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          website?: string | null
          industry?: string | null
          created_at?: string
        }
        Relationships: []
      }
      competitor_articles: {
        Row: CompetitorArticle
        Insert: {
          id?: string
          competitor_id: string
          title: string
          url?: string | null
          published_date: string
          summary?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          competitor_id?: string
          title?: string
          url?: string | null
          published_date?: string
          summary?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitor_articles_competitor_id_fkey"
            columns: ["competitor_id"]
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      content_gaps: {
        Row: ContentGap
        Insert: {
          id?: string
          topic: string
          importance_score: number
          competitor_count?: number
          status?: ContentGapStatus
          created_at?: string
        }
        Update: {
          id?: string
          topic?: string
          importance_score?: number
          competitor_count?: number
          status?: ContentGapStatus
          created_at?: string
        }
        Relationships: []
      }
      trends: {
        Row: Trend
        Insert: {
          id?: string
          keyword: string
          industry?: string | null
          growth_percent?: number
          competition: CompetitionLevel
          opportunity_score: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          keyword?: string
          industry?: string | null
          growth_percent?: number
          competition?: CompetitionLevel
          opportunity_score?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: Opportunity
        Insert: {
          id?: string
          title: string
          industry: string
          city: string
          score: number
          priority: OpportunityPriority
          status: OpportunityStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          industry?: string
          city?: string
          score?: number
          priority?: OpportunityPriority
          status?: OpportunityStatus
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      generated_content: {
        Row: GeneratedContent
        Insert: {
          id?: string
          type: ContentType
          topic: string
          content?: string
          channel: string
          views?: number
          engagement?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: ContentType
          topic?: string
          content?: string
          channel?: string
          views?: number
          engagement?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

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
