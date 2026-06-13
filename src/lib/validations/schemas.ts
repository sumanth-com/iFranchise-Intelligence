import { z } from "zod"

export const competitorSchema = z.object({
  name: z.string().min(1),
  website: z.string().url().nullable().optional(),
  industry: z.string().nullable().optional(),
})

export const competitorUpdateSchema = competitorSchema.partial()

export const competitorArticleSchema = z.object({
  competitor_id: z.string().uuid(),
  title: z.string().min(1),
  url: z.string().url().nullable().optional(),
  published_date: z.string().date(),
  summary: z.string().nullable().optional(),
})

export const competitorArticleUpdateSchema = competitorArticleSchema.partial()

export const contentGapSchema = z.object({
  topic: z.string().min(1),
  importance_score: z.number().int().min(0).max(100),
  competitor_count: z.number().int().min(0).optional(),
  status: z
    .enum(["open", "in_progress", "monitoring", "resolved", "dismissed"])
    .optional(),
})

export const contentGapUpdateSchema = contentGapSchema.partial()

export const trendSchema = z.object({
  keyword: z.string().min(1),
  industry: z.string().nullable().optional(),
  growth_percent: z.number().min(0),
  competition: z.enum(["Low", "Medium", "High"]),
  opportunity_score: z.number().int().min(0).max(100),
})

export const trendUpdateSchema = trendSchema.partial()

export const opportunitySchema = z.object({
  title: z.string().min(1),
  industry: z.string().min(1),
  city: z.string().min(1),
  score: z.number().int().min(0).max(100),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  status: z.enum(["Hot", "Active", "Review"]),
})

export const opportunityUpdateSchema = opportunitySchema.partial()

export const generatedContentSchema = z.object({
  type: z.enum(["blog", "linkedin", "email"]),
  topic: z.string().min(1),
  content: z.string(),
  channel: z.string().min(1),
  views: z.number().int().min(0).optional(),
  engagement: z.number().int().min(0).optional(),
})

export const generatedContentUpdateSchema = generatedContentSchema.partial()

export const generateContentSchema = z.object({
  type: z.enum(["blog", "linkedin", "email"]),
  topic: z.string().min(1),
  content: z.string().min(1),
})
