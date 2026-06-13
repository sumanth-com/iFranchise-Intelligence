import { config } from "dotenv"

config({ path: ".env.local" })

import { createAdminClient } from "../src/lib/supabase/admin"
import {
  seedCompetitorArticles,
  seedCompetitors,
  seedContentGaps,
  seedGeneratedContent,
  seedOpportunities,
  seedTrends,
} from "../src/lib/data/seed-data"

async function seed() {
  console.log("🌱 Seeding iFranchise Intelligence database...\n")

  const supabase = createAdminClient()

  const tables = [
    "content_gaps",
    "competitor_articles",
    "competitors",
    "generated_content",
    "opportunities",
    "trends",
  ] as const

  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")
    if (error) {
      console.warn(`  ⚠ Could not clear ${table}: ${error.message}`)
    }
  }

  const { error: compError, data: competitors } = await supabase
    .from("competitors")
    .insert(seedCompetitors)
    .select()

  if (compError) throw new Error(`Competitors: ${compError.message}`)
  console.log(`  ✓ ${competitors?.length} competitors`)

  const competitorIdByName = new Map(
    (competitors ?? []).map((c) => [c.name, c.id])
  )

  const articlesToInsert = seedCompetitorArticles.map((article) => {
    const competitorId = competitorIdByName.get(article.competitor_name)
    if (!competitorId) {
      throw new Error(`Unknown competitor: ${article.competitor_name}`)
    }
    return {
      competitor_id: competitorId,
      title: article.title,
      url: article.url,
      published_date: article.published_date,
      summary: article.summary,
    }
  })

  const { error: articleError, data: articles } = await supabase
    .from("competitor_articles")
    .insert(articlesToInsert)
    .select()

  if (articleError) throw new Error(`Competitor articles: ${articleError.message}`)
  console.log(`  ✓ ${articles?.length} competitor articles`)

  const { error: gapError, data: gaps } = await supabase
    .from("content_gaps")
    .insert(seedContentGaps)
    .select()

  if (gapError) throw new Error(`Content gaps: ${gapError.message}`)
  console.log(`  ✓ ${gaps?.length} content gaps`)

  const { error: trendError, data: trends } = await supabase
    .from("trends")
    .insert(seedTrends)
    .select()

  if (trendError) throw new Error(`Trends: ${trendError.message}`)
  console.log(`  ✓ ${trends?.length} trends`)

  const { error: oppError, data: opportunities } = await supabase
    .from("opportunities")
    .insert(seedOpportunities)
    .select()

  if (oppError) throw new Error(`Opportunities: ${oppError.message}`)
  console.log(`  ✓ ${opportunities?.length} opportunities`)

  const { error: contentError, data: content } = await supabase
    .from("generated_content")
    .insert(seedGeneratedContent)
    .select()

  if (contentError) throw new Error(`Generated content: ${contentError.message}`)
  console.log(`  ✓ ${content?.length} generated content records`)

  console.log("\n✅ Seed complete!")
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err.message)
  process.exit(1)
})
