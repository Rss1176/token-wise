import { getCatalog } from './handlers/catalog'
import { getUseCases } from './handlers/useCases'
import { getTips } from './handlers/tips'

/**
 * Route table shared by the local dev server and the Vercel function entries
 * in /api. Data is static JSON, so responses cache aggressively at the edge.
 */
export const routes: Record<string, () => unknown> = {
  '/api/catalog': getCatalog,
  '/api/use-cases': getUseCases,
  '/api/tips': getTips,
}

export const CACHE_HEADER = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400'
