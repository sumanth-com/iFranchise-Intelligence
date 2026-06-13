"use client"

import { useState } from "react"
import { Loader2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ContentType } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"

type GenerationCardProps = {
  title: string
  description: string
  placeholder: string
  template: string
  contentType: ContentType
  className?: string
}

export function GenerationCard({
  title,
  description,
  placeholder,
  template,
  contentType,
  className,
}: GenerationCardProps) {
  const [topic, setTopic] = useState("")
  const [output, setOutput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    setOutput("")
    setError(null)

    const personalized = template.replace(/\{\{topic\}\}/g, topic.trim())

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const response = await fetch("/api/generated-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: contentType,
          topic: topic.trim(),
          content: personalized,
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error ?? "Failed to save generated content")
      }

      setOutput(personalized)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor={`topic-${contentType}`}>Topic</Label>
          <Input
            id={`topic-${contentType}`}
            placeholder={placeholder}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <Button
          onClick={handleGenerate}
          disabled={!topic.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Generate
            </>
          )}
        </Button>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <div className="space-y-2">
          <Label>Output Preview</Label>
          <Textarea
            readOnly
            placeholder="Generated content will appear here..."
            value={output}
            className="min-h-[200px] resize-none bg-muted/30 font-mono text-xs leading-relaxed"
          />
        </div>
      </CardContent>
      <CardFooter className="text-caption">
        AI-generated content — review before publishing
      </CardFooter>
    </Card>
  )
}
