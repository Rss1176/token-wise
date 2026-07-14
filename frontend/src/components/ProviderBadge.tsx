import type { CSSProperties } from 'react'
import type { Provider } from '../../../shared/types'

export function ProviderBadge({ provider }: { provider: Provider }) {
  return (
    <span className="badge">
      <span
        className="badge__dot"
        style={{ '--badge-color': provider.color } as CSSProperties}
        aria-hidden="true"
      />
      {provider.name} · {provider.company}
    </span>
  )
}
