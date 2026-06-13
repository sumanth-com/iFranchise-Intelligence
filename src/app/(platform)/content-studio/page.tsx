import type { Metadata } from "next"

import { GenerationCard } from "@/components/content-studio/generation-card"
import { PageHeader } from "@/components/shared/page-header"
import { contentTemplates } from "@/lib/data/seed-data"

export const metadata: Metadata = {
  title: "Content Studio",
}

export default function ContentStudioPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Content Studio"
        description="Generate AI-powered franchise intelligence content for every channel."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <GenerationCard
          title="Generate Blog"
          description="Long-form thought leadership and market analysis articles."
          placeholder="e.g. QSR expansion trends in Texas metros"
          template={contentTemplates.blog}
          contentType="blog"
        />
        <GenerationCard
          title="Generate LinkedIn Post"
          description="Engaging social posts optimized for franchise professionals."
          placeholder="e.g. ghost kitchen franchise growth data"
          template={contentTemplates.linkedin}
          contentType="linkedin"
        />
        <GenerationCard
          title="Generate Email Campaign"
          description="Personalized email briefs for your franchise network."
          placeholder="e.g. weekly market intelligence digest"
          template={contentTemplates.email}
          contentType="email"
        />
      </div>
    </div>
  )
}
