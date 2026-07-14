import { useEffect, useRef } from 'react'
import type { Provider } from '../../../../shared/types'
import type { ModelEntry } from '../../lib/catalog'
import { resolvePicks } from '../../lib/picks'
import type { Selection } from '../search/SearchBox'
import { SectionHeading } from '../../components/SectionHeading'
import { PickCard } from './PickCard'

interface PicksPanelProps {
  selection: Selection
  /** when set, picks are ranked from this provider's lineup only */
  provider: Provider | null
  modelIndex: Map<string, ModelEntry>
}

export function PicksPanel({ selection, provider, modelIndex }: PicksPanelProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selection])

  const picks = resolvePicks(selection.subcase, provider, modelIndex)

  return (
    <section className="section" ref={ref} aria-live="polite">
      <div className="container">
        <SectionHeading title={`${selection.category.label} → ${selection.subcase.label}`} />
        <p className="section-sub">
          {provider
            ? `Limited to ${provider.name} — roles ranked from its lineup.`
            : 'Our picks, in plain terms — swap freely if taste disagrees.'}
        </p>
        <div className="picks__grid" key={`${selection.subcase.id}-${provider?.id ?? 'any'}`}>
          {picks.map((pick, index) => (
            <PickCard key={pick.entry.model.id} pick={pick} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
