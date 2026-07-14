import type { CSSProperties } from 'react'
import type { PickRole } from '../../../../shared/types'
import type { ResolvedPick } from '../../lib/picks'
import { formatContext, formatPricing } from '../../lib/catalog'
import { MeterStack } from '../../components/Meter'
import { ProviderBadge } from '../../components/ProviderBadge'

const ROLE_LABEL: Record<PickRole, string> = {
  best: 'Best overall',
  budget: 'Budget pick',
  fastest: 'Fastest',
}

interface PickCardProps {
  pick: ResolvedPick
  index: number
}

export function PickCard({ pick, index }: PickCardProps) {
  const { model, provider } = pick.entry
  const context = formatContext(model.context)

  return (
    <article
      className={index % 2 ? 'paper-card paper-card--alt stamp-in' : 'paper-card stamp-in'}
      style={
        {
          animationDelay: `${index * 120}ms`,
          '--tilt': index % 2 ? '0.2deg' : '-0.25deg',
        } as CSSProperties
      }
    >
      <p className="pick-card__role">{pick.roles.map((role) => ROLE_LABEL[role]).join(' · ')}</p>
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
