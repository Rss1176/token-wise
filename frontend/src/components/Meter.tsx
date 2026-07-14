import type { CSSProperties } from 'react'
import type { Meters } from '../../../shared/types'

interface MeterProps {
  label: string
  value: number
  color: string
}

const BLOCKS = [1, 2, 3, 4, 5]

export function Meter({ label, value, color }: MeterProps) {
  return (
    <div className="meter" role="img" aria-label={`${label}: ${value} out of 5`}>
      <span className="meter__label">{label}</span>
      <span className="meter__blocks">
        {BLOCKS.map((block) => (
          <span
            key={block}
            className={block <= value ? 'meter__block meter__block--filled' : 'meter__block'}
            style={{ '--meter-color': color } as CSSProperties}
          />
        ))}
      </span>
    </div>
  )
}

export function MeterStack({ meters }: { meters: Meters }) {
  return (
    <div className="meters">
      <Meter label="smarts" value={meters.smarts} color="var(--ink-soft)" />
      <Meter label="speed" value={meters.speed} color="var(--mustard)" />
      <Meter label="value" value={meters.value} color="var(--orange)" />
    </div>
  )
}
