import type { Catalog, Tips, UseCases } from '../../../shared/types'

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`${path} responded with ${res.status}`)
  return res.json() as Promise<T>
}

export interface AppData {
  catalog: Catalog
  useCases: UseCases
  tips: Tips
}

export async function fetchAppData(): Promise<AppData> {
  const [catalog, useCases, tips] = await Promise.all([
    fetchJson<Catalog>('/api/catalog'),
    fetchJson<UseCases>('/api/use-cases'),
    fetchJson<Tips>('/api/tips'),
  ])
  return { catalog, useCases, tips }
}
