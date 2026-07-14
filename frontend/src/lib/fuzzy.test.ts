import { describe, expect, it } from 'vitest'
import type { Category } from '../../../shared/types'
import { fuzzyScore, searchUseCases } from './fuzzy'

describe('fuzzyScore', () => {
  it('scores exact matches highest', () => {
    expect(fuzzyScore('coding', 'coding')).toBe(100)
  })

  it('ranks prefix above substring above subsequence', () => {
    const prefix = fuzzyScore('cod', 'coding')
    const substring = fuzzyScore('din', 'coding')
    const subsequence = fuzzyScore('cdg', 'coding')
    expect(prefix).toBeGreaterThan(substring)
    expect(substring).toBeGreaterThan(subsequence)
    expect(subsequence).toBeGreaterThan(0)
  })

  it('matches the start of any word', () => {
    expect(fuzzyScore('fix', 'bug fixing')).toBeGreaterThanOrEqual(70)
  })

  it('is case-insensitive', () => {
    expect(fuzzyScore('CODING', 'Coding')).toBe(100)
  })

  it('returns 0 for empty or unrelated input', () => {
    expect(fuzzyScore('', 'coding')).toBe(0)
    expect(fuzzyScore('zzz', 'coding')).toBe(0)
  })
})

const categories: Category[] = [
  {
    id: 'coding',
    label: 'Coding',
    icon: '⌨️',
    keywords: ['programming', 'software'],
    subcases: [
      { id: 'bug-fixing', label: 'Bug fixing', keywords: ['debugging', 'errors'], picks: [] },
      { id: 'code-review', label: 'Code review', keywords: ['pull request'], picks: [] },
    ],
  },
  {
    id: 'writing',
    label: 'Writing',
    icon: '✍️',
    keywords: ['content', 'copy'],
    subcases: [
      { id: 'emails', label: 'Emails & messages', keywords: ['email', 'reply'], picks: [] },
    ],
  },
]

describe('searchUseCases', () => {
  it('surfaces all subcases of a matched category', () => {
    const results = searchUseCases('coding', categories)
    const ids = results.map((r) => r.subcase.id)
    expect(ids).toContain('bug-fixing')
    expect(ids).toContain('code-review')
    expect(ids).not.toContain('emails')
  })

  it('ranks direct subcase hits above category-wide hits', () => {
    const results = searchUseCases('bug', categories)
    expect(results[0]?.subcase.id).toBe('bug-fixing')
  })

  it('matches on keywords and synonyms', () => {
    const results = searchUseCases('debugging', categories)
    expect(results[0]?.subcase.id).toBe('bug-fixing')
  })

  it('returns nothing for an empty query', () => {
    expect(searchUseCases('   ', categories)).toEqual([])
  })

  it('respects the result limit', () => {
    expect(searchUseCases('coding', categories, 1)).toHaveLength(1)
  })
})
