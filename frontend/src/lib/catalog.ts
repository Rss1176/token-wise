import type { Catalog, Model, Pricing, Provider } from '../../../shared/types'

export interface ModelEntry {
  model: Model
  provider: Provider
}

export function buildModelIndex(catalog: Catalog): Map<string, ModelEntry> {
  const index = new Map<string, ModelEntry>()
  for (const provider of catalog.providers) {
    for (const model of provider.models) {
      index.set(model.id, { model, provider })
    }
  }
  return index
}

export function formatPricing(pricing: Pricing | null): string {
  if (!pricing) return 'pricing varies by host'
  return `$${pricing.input} in / $${pricing.output} out per 1M tokens`
}

export function formatContext(context: number | null): string | null {
  if (!context) return null
  if (context >= 1_000_000) return `${context / 1_000_000}M-token context`
  return `${Math.round(context / 1000)}K-token context`
}
