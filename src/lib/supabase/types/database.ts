import type {
  Competitor,
  CompetitorArticle,
  ContentGap,
  GeneratedContent,
  Opportunity,
  Trend,
} from "@/lib/supabase/types/entities"

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
          status?: ContentGap["status"]
          suggested_opportunity?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          topic?: string
          importance_score?: number
          competitor_count?: number
          status?: ContentGap["status"]
          suggested_opportunity?: string | null
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
          competition: Trend["competition"]
          opportunity_score: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          keyword?: string
          industry?: string | null
          growth_percent?: number
          competition?: Trend["competition"]
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
          priority: Opportunity["priority"]
          status: Opportunity["status"]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          industry?: string
          city?: string
          score?: number
          priority?: Opportunity["priority"]
          status?: Opportunity["status"]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      generated_content: {
        Row: GeneratedContent
        Insert: {
          id?: string
          type: GeneratedContent["type"]
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
          type?: GeneratedContent["type"]
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

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
