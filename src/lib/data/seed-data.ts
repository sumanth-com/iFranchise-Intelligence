import type {
  Competitor,
  ContentGap,
  ContentGapStatus,
  GeneratedContent,
  Opportunity,
  Trend,
} from "@/lib/supabase/types"

type SeedCompetitor = Omit<Competitor, "id" | "created_at">
type SeedArticle = {
  competitor_name: string
  title: string
  url: string | null
  published_date: string
  summary: string | null
}
type SeedContentGap = Omit<ContentGap, "id" | "created_at">

export const seedCompetitors: SeedCompetitor[] = [
  {
    name: "FranConnect",
    website: "https://www.franconnect.com",
    industry: "Technology",
  },
  {
    name: "FranchiseWire",
    website: "https://www.franchisewire.com",
    industry: "Media",
  },
  {
    name: "FranNet Insights",
    website: "https://www.frannet.com",
    industry: "Consulting",
  },
  {
    name: "Franchise Times",
    website: "https://www.franchisetimes.com",
    industry: "Media",
  },
  {
    name: "Franchise Direct",
    website: "https://www.franchisedirect.com",
    industry: "Marketplace",
  },
]

export const seedCompetitorArticles: SeedArticle[] = [
  {
    competitor_name: "FranConnect",
    title: "Multi-unit franchise growth strategies",
    url: null,
    published_date: "2026-06-10",
    summary: null,
  },
  {
    competitor_name: "FranchiseWire",
    title: "Emerging markets for QSR brands",
    url: null,
    published_date: "2026-06-09",
    summary: null,
  },
  {
    competitor_name: "FranNet Insights",
    title: "ROI benchmarks for fitness franchises",
    url: null,
    published_date: "2026-06-08",
    summary: null,
  },
  {
    competitor_name: "Franchise Times",
    title: "Technology adoption in franchise ops",
    url: null,
    published_date: "2026-06-07",
    summary: null,
  },
  {
    competitor_name: "Franchise Direct",
    title: "Low-cost franchise opportunities 2026",
    url: null,
    published_date: "2026-06-06",
    summary: null,
  },
]

export const seedContentGaps: SeedContentGap[] = [
  {
    topic: "Multi-unit franchise growth strategies",
    importance_score: 88,
    competitor_count: 1,
    status: "open" as ContentGapStatus,
  },
  {
    topic: "Emerging markets for QSR brands",
    importance_score: 82,
    competitor_count: 1,
    status: "open" as ContentGapStatus,
  },
  {
    topic: "ROI benchmarks for fitness franchises",
    importance_score: 79,
    competitor_count: 1,
    status: "monitoring" as ContentGapStatus,
  },
  {
    topic: "Technology adoption in franchise ops",
    importance_score: 74,
    competitor_count: 1,
    status: "in_progress" as ContentGapStatus,
  },
  {
    topic: "Low-cost franchise opportunities 2026",
    importance_score: 71,
    competitor_count: 1,
    status: "monitoring" as ContentGapStatus,
  },
]

export const seedTrends: Omit<Trend, "id" | "created_at" | "updated_at">[] = [
  {
    keyword: "ghost kitchen franchise",
    industry: "Food & Beverage",
    growth_percent: 142,
    competition: "Medium",
    opportunity_score: 91,
  },
  {
    keyword: "home services franchise",
    industry: "Home Services",
    growth_percent: 118,
    competition: "Low",
    opportunity_score: 88,
  },
  {
    keyword: "AI-powered franchise ops",
    industry: "Technology",
    growth_percent: 96,
    competition: "Low",
    opportunity_score: 85,
  },
  {
    keyword: "pet care franchise",
    industry: "Pet Services",
    growth_percent: 87,
    competition: "High",
    opportunity_score: 72,
  },
  {
    keyword: "sustainable franchise model",
    industry: "Retail",
    growth_percent: 79,
    competition: "Medium",
    opportunity_score: 80,
  },
]

export const seedOpportunities: Omit<
  Opportunity,
  "id" | "created_at" | "updated_at"
>[] = [
  {
    title: "Premium Coffee Kiosk — Downtown Austin",
    industry: "Food & Beverage",
    city: "Austin, TX",
    score: 94,
    priority: "Critical",
    status: "Hot",
  },
  {
    title: "Boutique Fitness Studio — Cherry Creek",
    industry: "Health & Wellness",
    city: "Denver, CO",
    score: 89,
    priority: "High",
    status: "Active",
  },
  {
    title: "Mobile Auto Detailing — Scottsdale",
    industry: "Automotive",
    city: "Phoenix, AZ",
    score: 86,
    priority: "High",
    status: "Active",
  },
  {
    title: "STEM Learning Center — Franklin",
    industry: "Education",
    city: "Nashville, TN",
    score: 83,
    priority: "Medium",
    status: "Review",
  },
  {
    title: "In-Home Senior Care — Buckhead",
    industry: "Healthcare",
    city: "Atlanta, GA",
    score: 81,
    priority: "Medium",
    status: "Review",
  },
  {
    title: "Eco-Cleaning Services — South Beach",
    industry: "Home Services",
    city: "Miami, FL",
    score: 78,
    priority: "Medium",
    status: "Review",
  },
  {
    title: "QSR Expansion in Austin Metro",
    industry: "Food & Beverage",
    city: "Austin, TX",
    score: 92,
    priority: "Critical",
    status: "Hot",
  },
  {
    title: "Fitness Franchise Gap — Denver",
    industry: "Health & Wellness",
    city: "Denver, CO",
    score: 87,
    priority: "High",
    status: "Active",
  },
  {
    title: "Senior Care Demand Spike",
    industry: "Healthcare",
    city: "Atlanta, GA",
    score: 85,
    priority: "High",
    status: "Active",
  },
  {
    title: "Auto Services — Phoenix Suburbs",
    industry: "Automotive",
    city: "Phoenix, AZ",
    score: 79,
    priority: "Medium",
    status: "Review",
  },
  {
    title: "Education Tutoring — Nashville",
    industry: "Education",
    city: "Nashville, TN",
    score: 76,
    priority: "Medium",
    status: "Review",
  },
]

export const seedGeneratedContent: Omit<
  GeneratedContent,
  "id" | "created_at" | "updated_at"
>[] = [
  {
    type: "blog",
    topic: "QSR expansion trends in Texas metros",
    content: "Sample blog content about QSR expansion...",
    channel: "Blog",
    views: 12400,
    engagement: 820,
  },
  {
    type: "linkedin",
    topic: "ghost kitchen franchise growth data",
    content: "Sample LinkedIn post about ghost kitchen growth...",
    channel: "LinkedIn",
    views: 8900,
    engagement: 1240,
  },
  {
    type: "email",
    topic: "weekly market intelligence digest",
    content: "Sample email campaign content...",
    channel: "Email",
    views: 5600,
    engagement: 980,
  },
  {
    type: "blog",
    topic: "Franchise technology adoption 2026",
    content: "Sample webinar recap content...",
    channel: "Webinar",
    views: 3200,
    engagement: 640,
  },
  {
    type: "blog",
    topic: "Multi-unit franchise success stories",
    content: "Sample case study content...",
    channel: "Case Study",
    views: 4100,
    engagement: 720,
  },
]

export const contentTemplates = {
  blog: `# The Future of Franchise Intelligence in 2026

The franchise landscape around {{topic}} is evolving rapidly. Data-driven decision making has become the competitive edge for franchisors and franchisees alike.

## Key Trends Shaping the Industry

1. **AI-Powered Market Analysis** — Real-time opportunity scoring across 500+ metro areas
2. **Competitive Content Intelligence** — Automated gap analysis against top competitors
3. **Predictive Trend Modeling** — Early detection of emerging franchise categories

## Why It Matters

Organizations leveraging intelligence platforms report 34% faster expansion decisions and 28% higher unit success rates in new markets.

*Ready to transform your franchise strategy? Let's explore the data together.*`,

  linkedin: `🚀 Franchise intelligence is no longer optional — it's your competitive moat.

We analyzed {{topic}} across 500+ markets and found 3 surprising patterns:

→ Ghost kitchen franchises are up 142% in search interest
→ Home services gaps exist in 27 underserved metros
→ AI adoption in franchise ops correlates with 2.3x faster scaling

The brands winning in 2026 aren't guessing — they're using data.

What's your biggest market intelligence challenge? 👇

#franchise #marketintelligence #growth`,

  email: `Subject: Your Weekly Franchise Intelligence Brief

Hi {{first_name}},

Here's what's moving around {{topic}} in your markets this week:

📊 TOP OPPORTUNITY
Premium Coffee Kiosk — Austin, TX (Score: 94/100)
High foot traffic, low competitor density, strong demographic fit.

📈 TRENDING KEYWORD
"ghost kitchen franchise" — +142% growth, medium competition

🎯 COMPETITOR ALERT
FranConnect published new multi-unit growth content. Gap score: 88/100

Ready to dive deeper? Log in to your dashboard for full analysis.

Best,
The iFranchise Intelligence Team`,
} as const

export const channelByType = {
  blog: "Blog",
  linkedin: "LinkedIn",
  email: "Email",
} as const
