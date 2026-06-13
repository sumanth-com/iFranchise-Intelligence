const STOP_WORDS = new Set([
  "about",
  "after",
  "also",
  "and",
  "are",
  "for",
  "from",
  "guide",
  "how",
  "into",
  "that",
  "the",
  "their",
  "this",
  "with",
  "your",
  "2024",
  "2025",
  "2026",
])

export function normalizeTopic(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ")
}

export function tokenizeTopic(text: string): Set<string> {
  return new Set(
    normalizeTopic(text)
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3 && !STOP_WORDS.has(word))
  )
}

export function topicSimilarity(a: string, b: string): number {
  const tokensA = tokenizeTopic(a)
  const tokensB = tokenizeTopic(b)

  if (tokensA.size === 0 || tokensB.size === 0) return 0

  const intersection = [...tokensA].filter((token) => tokensB.has(token)).length
  const union = new Set([...tokensA, ...tokensB]).size

  return intersection / union
}

export function topicsMatch(a: string, b: string, threshold = 0.45): boolean {
  const normalizedA = normalizeTopic(a)
  const normalizedB = normalizeTopic(b)

  if (normalizedA === normalizedB) return true
  if (normalizedA.includes(normalizedB) || normalizedB.includes(normalizedA)) {
    return true
  }

  return topicSimilarity(a, b) >= threshold
}

export function isTopicCovered(
  candidate: string,
  existingTopics: string[],
  threshold = 0.45
): boolean {
  return existingTopics.some((existing) =>
    topicsMatch(candidate, existing, threshold)
  )
}

export function findMatchingTopicIndex(
  candidate: string,
  topics: string[],
  threshold = 0.45
): number {
  return topics.findIndex((topic) => topicsMatch(candidate, topic, threshold))
}

export function titleCaseTopic(text: string): string {
  return text
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
