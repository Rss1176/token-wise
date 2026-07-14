import { createRequire } from 'node:module'
import type { UseCases } from '../../../shared/types'

// See catalog.ts for why this is require() and not a JSON import.
const require = createRequire(import.meta.url)

export function getUseCases(): UseCases {
  return require('../../data/use-cases.json') as UseCases
}
