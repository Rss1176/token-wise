import type { CSSProperties } from 'react'
import type { ModelPick, PickRole } from '../../../../shared/types'
import type { ModelEntry } from '../../lib/catalog'
import { formatContext, formatPricing } from '../../lib/catalog'
import { MeterStack } from '../../components/Meter'
import { ProviderBadge } from '../../components/ProviderBadge'

const ROLE_META: Record<PickRole, { title: string; emoji: string }> = {
  best: { title: 'Best overall', emoji: '🏆' },
  budget: { title: 'Budget pick', emoji: '🪙' },
  fastest: { title: 'Fastest', emoji: '⚡' },
}

interface PickCardProps {
  pick: ModelPick
  entry: ModelEntry
  index: number
}

export function PickCard({ pick, entry, index }: PickCardProps) {
  const { model, provider } = entry
  const meta = ROLE_META[pick.role]
  const context = formatContext(model.context)

  return (
    <article
      className={index % 2 ? 'paper-card paper-card--alt stamp-in' : 'paper-card stamp-in'}
      style={
        {
          animationDelay: `${index * 120}ms`,
          '--tilt': index % 2 ? '0.5deg' : '-0.6deg',
        } as CSSProperties
      }
    >
      <p className="pick-card__role">
        {meta.emoji} {meta.title}
      </p>
      <h3 className="pick-card__model">{model.name}</h3>
      <ProviderBadge provider={provider} />
      <p className="pick-card__why">{pick.why}</p>
      <MeterStack meters={model.meters} />
      <p className="pick-card__price">
        {formatPricing(model.pricing)}
        {context ? ` · ${context}` : ''}
      </p>
    </article>
  )
}
