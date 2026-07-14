import type { Model, PickRole, Provider, Subcase } from '../../../shared/types'
import type { ModelEntry } from './catalog'

export interface ResolvedPick {
  /** a model can win several roles when a provider's lineup is small */
  roles: PickRole[]
  entry: ModelEntry
  why: string
}

function bestOf(models: Model[], score: (m: Model) => number[]): Model | undefined {
  return [...models].sort((a, b) => {
    const sa = score(a)
    const sb = score(b)
    for (let i = 0; i < sa.length; i++) {
      if (sa[i] !== sb[i]) return sb[i] - sa[i]
    }
    return 0
  })[0]
}

// cheaper = better for tie-breaks; unknown pricing sorts last
const cheapness = (m: Model) => -(m.pricing?.input ?? Number.POSITIVE_INFINITY)

const RANKERS: Record<PickRole, (m: Model) => number[]> = {
  best: (m) => [m.meters.smarts, m.meters.value, m.meters.speed],
  budget: (m) => [m.meters.value, cheapness(m), m.meters.smarts],
  fastest: (m) => [m.meters.speed, m.meters.value, cheapness(m)],
}

const GENERIC_WHY: Record<PickRole, (provider: Provider) => string> = {
  best: (p) => `The most capable model in the ${p.name} lineup.`,
  budget: (p) => `The best value for money ${p.name} offers.`,
  fastest: (p) => `The quickest ${p.name} option that can still handle it.`,
}

const ROLE_ORDER: PickRole[] = ['best', 'budget', 'fastest']

/**
 * Resolves the picks to show for a task. With no provider filter, the curated
 * picks are used as-is. With a filter (people locked into one vendor), the
 * three roles are ranked from that provider's own lineup using the meters and
 * pricing — reusing the curated "why" when the winner happens to be a curated
 * pick, and merging roles when one model wins several.
 */
export function resolvePicks(
  subcase: Subcase,
  provider: Provider | null,
  modelIndex: Map<string, ModelEntry>,
): ResolvedPick[] {
  if (!provider) {
    return subcase.picks
      .slice()
      .sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role))
      .flatMap((pick) => {
        const entry = modelIndex.get(pick.modelId)
        return entry ? [{ roles: [pick.role], entry, why: pick.why }] : []
      })
  }

  const merged = new Map<string, ResolvedPick>()
  for (const role of ROLE_ORDER) {
    const model = bestOf(provider.models, RANKERS[role])
    if (!model) continue
    const existing = merged.get(model.id)
    if (existing) {
      existing.roles.push(role)
      continue
    }
    const curated = subcase.picks.find((pick) => pick.modelId === model.id)
    merged.set(model.id, {
      roles: [role],
      entry: { model, provider },
      why: curated?.why ?? GENERIC_WHY[role](provider),
    })
  }
  return [...merged.values()]
}
