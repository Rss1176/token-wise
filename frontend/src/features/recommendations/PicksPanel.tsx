import { useEffect, useRef } from 'react'
import type { PickRole } from '../../../../shared/types'
import type { ModelEntry } from '../../lib/catalog'
import type { Selection } from '../search/SearchBox'
import { SectionHeading } from '../../components/SectionHeading'
import { PickCard } from './PickCard'

const ROLE_ORDER: PickRole[] = ['best', 'budget', 'fastest']

interface PicksPanelProps {
  selection: Selection
  modelIndex: Map<string, ModelEntry>
}

export function PicksPanel({ selection, modelIndex }: PicksPanelProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selection])

  const picks = [...selection.subcase.picks].sort(
    (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role),
  )

  return (
    <section className="section" ref={ref} aria-live="polite">
      <div className="container">
        <SectionHeading
          title={`${selection.category.icon} ${selection.category.label} → ${selection.subcase.label}`}
        />
        <p className="section-sub">Our picks, in plain terms — swap freely if taste disagrees.</p>
        <div className="picks__grid" key={selection.subcase.id}>
          {picks.map((pick, index) => {
            const entry = modelIndex.get(pick.modelId)
            if (!entry) return null
            return <PickCard key={pick.role} pick={pick} entry={entry} index={index} />
          })}
        </div>
      </div>
    </section>
  )
}
