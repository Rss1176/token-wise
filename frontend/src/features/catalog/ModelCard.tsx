import type { CSSProperties } from 'react'
import type { Model } from '../../../../shared/types'
import { formatContext, formatPricing } from '../../lib/catalog'
import { MeterStack } from '../../components/Meter'

interface ModelCardProps {
  model: Model
  index: number
}

export function ModelCard({ model, index }: ModelCardProps) {
  const context = formatContext(model.context)

  return (
    <article
      className={index % 2 ? 'paper-card paper-card--alt stamp-in' : 'paper-card stamp-in'}
      style={
        {
          animationDelay: `${index * 90}ms`,
          '--tilt': index % 2 ? '0.15deg' : '-0.2deg',
        } as CSSProperties
      }
    >
      <div className="model-card__head">
        <h3 className="model-card__name">{model.name}</h3>
        <span className={`tag tag--${model.tier}`}>{model.tier}</span>
      </div>
      <p className="model-card__blurb">{model.blurb}</p>
      <ul className="model-card__best">
        {model.bestFor.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <MeterStack meters={model.meters} />
      <p className="model-card__price">
        {formatPricing(model.pricing)}
        {context ? ` · ${context}` : ''}
        {model.pricing?.note ? ` · ${model.pricing.note}` : ''}
      </p>
    </article>
  )
}
