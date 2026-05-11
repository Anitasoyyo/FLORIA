import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SpiceCard } from '@/components/ui/SpiceCard'
import { MagicSearch } from '@/components/ui/MagicSearch'
import { SPICES, FILTER_TYPES } from '@/data/spices'
import { useDebounce } from '@/hooks/useDebounce'
import type { FilterType } from '@/data/spices'
import type { Spice } from '@/types'

export function ExplorarPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todas')
  const [isSearching, setIsSearching] = useState(() => !!searchParams.get('q')?.trim())

  // API results — start empty when there's a query (avoids flash of all spices), full list otherwise
  const [apiResults, setApiResults] = useState<Spice[]>(() =>
    searchParams.get('q')?.trim() ? [] : SPICES
  )

  // Debounced query: waits 320ms after the user stops typing before calling the API
  const debouncedQuery = useDebounce(query, 320)

  // Call backend when debounced query changes
  useEffect(() => {
    setIsSearching(true)
    const endpoint = debouncedQuery.trim()
      ? `/api/v1/spices/search?q=${encodeURIComponent(debouncedQuery.trim())}`
      : '/api/v1/spices'

    fetch(endpoint)
      .then((res) => res.json())
      .then((data: Spice[]) => {
        if (Array.isArray(data)) {
          const enriched = data.map((s) => ({
            ...s,
            imagen: SPICES.find((local) => local.id === s.id)?.imagen,
          }))
          setApiResults(enriched)
        }
      })
      .catch(() => {
        // API unavailable — fall back to client-side filtering
        const q = debouncedQuery.toLowerCase().trim()
        setApiResults(
          q ? SPICES.filter((s) => s.nombre.toLowerCase().includes(q)) : SPICES
        )
      })
      .finally(() => setIsSearching(false))
  }, [debouncedQuery])

  // Apply the tipo filter on top of API results — instant, no extra fetch needed
  const filtered = useMemo(() => {
    if (activeFilter === 'Todas') return apiResults
    return apiResults.filter((s) => s.tipo === activeFilter)
  }, [apiResults, activeFilter])

  // Sync URL param changes (e.g., spice links from wizard chat while already on this page)
  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    setQuery(q)
    if (!q) setActiveFilter('Todas')
  }, [searchParams])

  // Reset tipo filter when a new search is entered
  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (value.trim()) setActiveFilter('Todas')
  }

  return (
    <main className="min-h-screen bg-floria-deep">
      {/* Banner */}
      <section className="relative w-full overflow-hidden" style={{ height: '52vh', minHeight: '360px' }}>
        <img
          src="/images/explorar.png"
          alt="Laboratorio botánico de Floria"
          className="w-full h-full object-cover select-none"
          style={{ objectPosition: '50% 40%' }}
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = '/images/fondo.png'
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,31,13,0.72) 0%, rgba(10,31,13,0.18) 40%, rgba(10,31,13,0.92) 100%)',
          }}
        />

        {/* Banner content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-16 gap-6">
          {/* Badge */}
          <span className="font-fredoka font-medium text-xs tracking-[0.3em] uppercase text-floria-gold/80">
            Catálogo Botánico
          </span>

          {/* Title */}
          <h1
            className="font-fredoka font-bold text-floria-cream"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)', lineHeight: 1 }}
          >
            Nuestras{' '}
            <span className="text-floria-gold">Especias</span>
          </h1>

          {/* ✦ Magic Search — el puente entre frontend y backend ✦ */}
          <MagicSearch
            value={query}
            onChange={handleQueryChange}
            resultCount={filtered.length}
            isSearching={isSearching}
          />
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-40 bg-floria-deep/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="overflow-x-auto py-3.5 px-6">
          <div className="flex gap-2 w-max mx-auto">
            {FILTER_TYPES.map((tipo) => (
              <button
                key={tipo}
                onClick={() => setActiveFilter(tipo)}
                className={`
                  font-fredoka font-medium text-xs tracking-wider px-4 py-1.5 rounded-full
                  border transition-all duration-200 whitespace-nowrap
                  ${
                    activeFilter === tipo
                      ? 'bg-floria-gold text-floria-deep border-floria-gold'
                      : 'border-white/15 text-floria-cream/50 hover:border-white/30 hover:text-floria-cream/80'
                  }
                `}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <section className="px-6 md:px-12 lg:px-20 py-10 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((spice) => (
            <SpiceCard key={spice.id} spice={spice} />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && !isSearching && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <span className="text-5xl mb-4 opacity-40">🔍</span>
            <p className="font-fredoka font-semibold text-floria-cream/50 text-lg mb-1">
              Sin resultados
            </p>
            <p className="font-fredoka font-light text-xs text-floria-cream/30">
              Probá con otro nombre o cambiá el filtro
            </p>
          </div>
        )}
      </section>
    </main>
  )
}
