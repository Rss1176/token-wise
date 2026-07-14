/**
 * Shared data types used by both the backend (data + handlers) and the
 * frontend (rendering). The JSON files in backend/data must conform to these.
 */

export type Tier = 'flagship' | 'balanced' | 'fast' | 'budget'

export interface Pricing {
  /** USD per 1M input tokens */
  input: number
  /** USD per 1M output tokens */
  output: number
  note?: string
}

export interface Meters {
  /** 1–5, higher = more capable */
  smarts: number
  /** 1–5, higher = faster */
  speed: number
  /** 1–5, higher = more capability per dollar */
  value: number
}

export interface Model {
  id: string
  name: string
  tier: Tier
  blurb: string
  bestFor: string[]
  meters: Meters
  /** null when pricing varies by host (e.g. open-weight models) */
  pricing: Pricing | null
  /** context window in tokens; null when unverified */
  context: number | null
}

export interface Provider {
  id: string
  name: string
  company: string
  /** accent colour used for badges, from the app palette */
  color: string
  models: Model[]
}

export interface Catalog {
  updated: string
  note: string
  providers: Provider[]
}

export type PickRole = 'best' | 'budget' | 'fastest'

export interface ModelPick {
  modelId: string
  role: PickRole
  why: string
}

export interface Subcase {
  id: string
  label: string
  keywords: string[]
  picks: ModelPick[]
}

export interface Category {
  id: string
  label: string
  keywords: string[]
  subcases: Subcase[]
}

export interface UseCases {
  categories: Category[]
}

export interface TipExample {
  before: string
  after: string
  savings?: string
}

export type TipCategory = 'model-choice' | 'prompting' | 'caching' | 'context' | 'output'

export interface Tip {
  id: string
  title: string
  body: string
  category: TipCategory
  example?: TipExample
}

export interface Tips {
  tips: Tip[]
}
