import { createRequire } from 'node:module'
import type { Tips } from '../../../shared/types'

// See catalog.ts for why this is require() and not a JSON import.
const require = createRequire(import.meta.url)

export function getTips(): Tips {
  return require('../../data/tips.json') as Tips
}
