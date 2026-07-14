import type { CSSProperties } from 'react'
import type { Tip } from '../../../../shared/types'

const TINTS = ['', 'sticky--mustard', 'sticky--sky', '', 'sticky--orange', 'sticky--sky']

interface TipCardProps {
  tip: Tip
  index: number
}

export function TipCard({ tip, index }: TipCardProps) {
  const tint = TINTS[index % TINTS.length]

  return (
    <article
      className={tint ? `sticky ${tint}` : 'sticky'}
      style={{ '--tilt': `${index % 2 ? 0.35 : -0.4}deg` } as CSSProperties}
    >
      <p className="tip__tag">
        <span className="tag">{tip.category}</span>
      </p>
      <h3 className="tip__title">{tip.title}</h3>
      <p className="tip__body">{tip.body}</p>
      {tip.example && (
        <div className="before-after">
          <p className="before">✗ “{tip.example.before}”</p>
          <p className="after">✓ “{tip.example.after}”</p>
          {tip.example.savings && <p className="savings">→ {tip.example.savings}</p>}
        </div>
      )}
    </article>
  )
}
