import type { Category, Subcase } from '../../../shared/types'

/**
 * Tiny in-house fuzzy matcher — no dependencies.
 *
 * Scores how well `query` matches `text` (0 = no match, 100 = exact):
 * exact > prefix > word-prefix > substring > in-order subsequence.
 */
export function fuzzyScore(query: string, text: string): number {
  const q = query.trim().toLowerCase()
  const t = text.trim().toLowerCase()
  if (!q || !t) return 0

  if (t === q) return 100
  if (t.startsWith(q)) return 80
  if (t.split(/\s+/).some((word) => word.startsWith(q))) return 70
  if (t.includes(q)) return 55

  // subsequence: every character of q appears in t, in order
  let from = 0
  for (const ch of q) {
    from = t.indexOf(ch, from)
    if (from === -1) return 0
    from += 1
  }
  // reward tighter matches; floor so any subsequence still surfaces
  return Math.max(10, 40 - (t.length - q.length))
}

function bestScore(query: string, label: string, keywords: string[]): number {
  let best = fuzzyScore(query, label)
  for (const keyword of keywords) {
    const s = fuzzyScore(query, keyword)
    if (s > best) best = s
  }
  return best
}

export interface SubcaseMatch {
  category: Category
  subcase: Subcase
  score: number
}

/**
 * Matches a query against every subcase. A hit on the parent category
 * (e.g. "coding") surfaces all of its subcases, slightly discounted so
 * direct subcase hits rank first.
 */
export function searchUseCases(query: string, categories: Category[], limit = 8): SubcaseMatch[] {
  if (!query.trim()) return []

  const matches: SubcaseMatch[] = []
  for (const category of categories) {
    const categoryScore = bestScore(query, category.label, category.keywords) * 0.9
    for (const subcase of category.subcases) {
      const score = Math.max(bestScore(query, subcase.label, subcase.keywords), categoryScore)
      if (score > 0) matches.push({ category, subcase, score })
    }
  }

  return matches.sort((a, b) => b.score - a.score).slice(0, limit)
}
