import { useState } from 'react'
import type { Catalog } from '../../../../shared/types'
import { SectionHeading } from '../../components/SectionHeading'
import { ModelCard } from './ModelCard'

export function CatalogSection({ catalog }: { catalog: Catalog }) {
  const [providerId, setProviderId] = useState(catalog.providers[0]?.id)
  const provider = catalog.providers.find((p) => p.id === providerId) ?? catalog.providers[0]

  if (!provider) return null

  return (
    <section className="section" id="browse">
      <div className="container">
        <SectionHeading title="Browse by provider" />
        <p className="section-sub">
          Every model in the notebook, grouped by who makes it. Meters are relative: smarts, speed,
          and value-for-money from 1 to 5.
        </p>
        <div className="chip-row" role="tablist" aria-label="Providers">
          {catalog.providers.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={p.id === provider.id}
              className={p.id === provider.id ? 'chip chip--active' : 'chip wobbly'}
              onClick={() => setProviderId(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="catalog__grid" key={provider.id}>
          {provider.models.map((model, index) => (
            <ModelCard key={model.id} model={model} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
