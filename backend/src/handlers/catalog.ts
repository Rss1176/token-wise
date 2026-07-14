import { createRequire } from 'node:module'
import type { Catalog } from '../../../shared/types'

// createRequire instead of a JSON import: the Vercel runtime executes these
// files as native Node ESM, where `import x from './x.json'` throws
// ERR_IMPORT_ATTRIBUTE_MISSING. require() works everywhere and Vercel's
// file tracing bundles the JSON automatically.
const require = createRequire(import.meta.url)

export function getCatalog(): Catalog {
  return require('../../data/models.json') as Catalog
}
