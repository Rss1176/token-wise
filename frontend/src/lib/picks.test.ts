import { describe, expect, it } from 'vitest'
import type { Model, Provider, Subcase } from '../../../shared/types'
import { buildModelIndex } from './catalog'
import { resolvePicks } from './picks'

function model(overrides: Partial<Model> & { id: string }): Model {
  return {
    name: overrides.id,
    tier: 'balanced',
    blurb: '',
    bestFor: ['x'],
    meters: { smarts: 3, speed: 3, value: 3 },
    pricing: { input: 1, output: 5 },
    context: null,
    ...overrides,
  }
}

const alpha: Provider = {
  id: 'alpha',
  name: 'Alpha',
  company: 'Alpha AI',
  color: '#000000',
  models: [
    model({ id: 'alpha-big', meters: { smarts: 5, speed: 2, value: 2 }, pricing: { input: 10, output: 50 } }),
    model({ id: 'alpha-mid', meters: { smarts: 4, speed: 4, value: 5 }, pricing: { input: 3, output: 15 } }),
    model({ id: 'alpha-small', meters: { smarts: 3, speed: 5, value: 5 }, pricing: { input: 1, output: 5 } }),
  ],
}

const solo: Provider = {
  id: 'solo',
  name: 'Solo',
  company: 'Solo Labs',
  color: '#000000',
  models: [model({ id: 'solo-only' })],
}

const catalog = { updated: '2026-01-01', note: '', providers: [alpha, solo] }
const modelIndex = buildModelIndex(catalog)

const subcase: Subcase = {
  id: 'task',
  label: 'Task',
  keywords: [],
  picks: [
    { modelId: 'alpha-big', role: 'best', why: 'curated best reason' },
    { modelId: 'solo-only', role: 'budget', why: 'curated budget reason' },
    { modelId: 'alpha-small', role: 'fastest', why: 'curated fastest reason' },
  ],
}

describe('resolvePicks', () => {
  it('returns curated picks in role order when no provider filter is set', () => {
    const picks = resolvePicks(subcase, null, modelIndex)
    expect(picks.map((p) => p.entry.model.id)).toEqual(['alpha-big', 'solo-only', 'alpha-small'])
    expect(picks.map((p) => p.roles)).toEqual([['best'], ['budget'], ['fastest']])
    expect(picks[0].why).toBe('curated best reason')
  })

  it('ranks roles from the provider lineup when filtered', () => {
    const picks = resolvePicks(subcase, alpha, modelIndex)
    const byRole = new Map(picks.flatMap((p) => p.roles.map((role) => [role, p.entry.model.id])))
    expect(byRole.get('best')).toBe('alpha-big') // highest smarts
    expect(byRole.get('budget')).toBe('alpha-small') // top value, cheapest
    expect(byRole.get('fastest')).toBe('alpha-small') // highest speed
  })

  it('merges roles when one model wins several', () => {
    const picks = resolvePicks(subcase, alpha, modelIndex)
    const small = picks.find((p) => p.entry.model.id === 'alpha-small')
    expect(small?.roles).toEqual(['budget', 'fastest'])
  })

  it('reuses the curated why when the filtered winner is a curated pick', () => {
    const picks = resolvePicks(subcase, alpha, modelIndex)
    const big = picks.find((p) => p.entry.model.id === 'alpha-big')
    expect(big?.why).toBe('curated best reason')
  })

  it('falls back to a generic why for non-curated winners', () => {
    const picks = resolvePicks(subcase, solo, modelIndex)
    expect(picks).toHaveLength(1)
    expect(picks[0].roles).toEqual(['best', 'budget', 'fastest'])
    // solo-only IS curated (budget), so its curated why is reused
    expect(picks[0].why).toBe('curated budget reason')

    const uncurated: Subcase = { ...subcase, picks: [] }
    const generic = resolvePicks(uncurated, solo, modelIndex)
    expect(generic[0].why).toContain('Solo')
  })

  it('skips curated picks whose model id is missing from the catalog', () => {
    const broken: Subcase = {
      ...subcase,
      picks: [{ modelId: 'ghost', role: 'best', why: 'x' }, ...subcase.picks.slice(1)],
    }
    const picks = resolvePicks(broken, null, modelIndex)
    expect(picks.map((p) => p.entry.model.id)).toEqual(['solo-only', 'alpha-small'])
  })
})
