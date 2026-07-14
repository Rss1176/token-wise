import { useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Category, Subcase } from '../../../../shared/types'
import { searchUseCases } from '../../lib/fuzzy'

export interface Selection {
  category: Category
  subcase: Subcase
}

interface SearchBoxProps {
  categories: Category[]
  selection: Selection | null
  onSelect: (selection: Selection) => void
}

export function SearchBox({ categories, selection, onSelect }: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const [browseCategory, setBrowseCategory] = useState<Category | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const matches = useMemo(() => searchUseCases(query, categories), [query, categories])

  const choose = (category: Category, subcase: Subcase) => {
    onSelect({ category, subcase })
    setQuery('')
    setBrowseCategory(category)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!query.trim()) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, matches.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && matches[activeIndex]) {
      event.preventDefault()
      const match = matches[activeIndex]
      choose(match.category, match.subcase)
    } else if (event.key === 'Escape') {
      setQuery('')
    }
  }

  return (
    <div className="search">
      <input
        className="search__input"
        type="text"
        placeholder="What are you trying to do?"
        aria-label="Search for a task, e.g. coding or translation"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(0)
        }}
        onKeyDown={handleKeyDown}
      />

      {query.trim() ? (
        <ul className="search__suggestions">
          {matches.length === 0 && (
            <li className="search__empty">nothing yet — try “coding”, “write” or “translate”</li>
          )}
          {matches.map((match, index) => (
            <li key={`${match.category.id}-${match.subcase.id}`}>
              <button
                type="button"
                className={
                  index === activeIndex
                    ? 'search__suggestion search__suggestion--active'
                    : 'search__suggestion'
                }
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(match.category, match.subcase)}
              >
                <span>{match.subcase.label}</span>
                <span className="crumb">
                  {match.category.icon} {match.category.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : browseCategory ? (
        <>
          <p className="search__hint">
            {browseCategory.icon} {browseCategory.label} — pick a task:
          </p>
          <div className="chip-row">
            <button
              type="button"
              className="chip chip--ghost"
              onClick={() => setBrowseCategory(null)}
            >
              ← back
            </button>
            {browseCategory.subcases.map((subcase) => (
              <button
                key={subcase.id}
                type="button"
                className={
                  selection?.subcase.id === subcase.id ? 'chip chip--active' : 'chip wobbly'
                }
                onClick={() => choose(browseCategory, subcase)}
              >
                {subcase.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="search__hint">…or browse by what you’re doing:</p>
          <div className="chip-row">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className="chip wobbly"
                onClick={() => setBrowseCategory(category)}
              >
                {category.icon} {category.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
