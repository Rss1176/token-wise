import { useEffect, useMemo, useState } from 'react'
import type { AppData } from './lib/api'
import { fetchAppData } from './lib/api'
import { buildModelIndex } from './lib/catalog'
import { PaperPlane } from './components/PaperPlane'
import { Skyline } from './components/Skyline'
import { ANY_PROVIDER, SearchBox } from './features/search/SearchBox'
import type { Selection } from './features/search/SearchBox'
import { PicksPanel } from './features/recommendations/PicksPanel'
import { CatalogSection } from './features/catalog/CatalogSection'
import { TipsWall } from './features/tips/TipsWall'

const REPO_URL = 'https://github.com/Rss1176/token-wise'

export default function App() {
  const [data, setData] = useState<AppData | null>(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [providerFilter, setProviderFilter] = useState(ANY_PROVIDER)

  useEffect(() => {
    let cancelled = false
    fetchAppData()
      .then((loaded) => {
        if (!cancelled) setData(loaded)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = () => {
    setFailed(false)
    setAttempt((n) => n + 1)
  }

  const modelIndex = useMemo(() => (data ? buildModelIndex(data.catalog) : null), [data])

  if (failed) {
    return (
      <div className="status-note paper-card">
        <p>Couldn’t load the model data.</p>
        <p style={{ marginTop: '1rem' }}>
          <button type="button" className="chip" onClick={retry}>
            try again
          </button>
        </p>
      </div>
    )
  }

  if (!data || !modelIndex) {
    return <div className="status-note">loading…</div>
  }

  const filteredProvider =
    providerFilter === ANY_PROVIDER
      ? null
      : (data.catalog.providers.find((p) => p.id === providerFilter) ?? null)

  return (
    <>
      <header className="hero">
        <PaperPlane />
        <div className="cloud" style={{ top: '18%', left: '12%' }} />
        <div className="cloud cloud--slow" style={{ top: '9%', right: '14%' }} />
        <div className="cloud cloud--slow" style={{ top: '46%', left: '4%', scale: '0.7' }} />
        <div className="cloud" style={{ top: '38%', right: '5%', scale: '0.8' }} />

        <div className="container" style={{ position: 'relative' }}>
          <h1 className="hero__title">
            Token<span className="accent">Wise</span>
          </h1>
          <p className="hero__tagline">the right model for the job — before you spend the tokens</p>
          <SearchBox
            categories={data.useCases.categories}
            providers={data.catalog.providers}
            selection={selection}
            providerFilter={providerFilter}
            onProviderChange={setProviderFilter}
            onSelect={setSelection}
          />
        </div>
        <Skyline />
      </header>

      {selection && (
        <PicksPanel selection={selection} provider={filteredProvider} modelIndex={modelIndex} />
      )}

      <CatalogSection catalog={data.catalog} />
      <TipsWall tips={data.tips} />

      <footer className="footer container">
        <p>
          TokenWise is <a href={REPO_URL}>open source</a>. Picks are curated opinions, not
          benchmarks — <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}>PRs welcome</a>.
        </p>
        <p>Model data last updated {data.catalog.updated}.</p>
      </footer>
    </>
  )
}
