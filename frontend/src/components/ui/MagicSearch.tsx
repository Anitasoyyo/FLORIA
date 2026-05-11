import { useRef } from 'react'

interface MagicSearchProps {
  value: string
  onChange: (value: string) => void
  resultCount: number
  isSearching: boolean
}

export function MagicSearch({ value, onChange, resultCount, isSearching }: MagicSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-3">
      {/* Label */}
      <span className="font-fredoka font-medium text-xs tracking-[0.25em] uppercase text-floria-gold/70">
        ✦ Buscador Mágico
      </span>

      {/* Search input */}
      <div
        className="relative w-full group"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Glass container */}
        <div
          className="
            relative flex items-center gap-3
            px-5 py-3.5 rounded-2xl
            bg-white/[0.07] backdrop-blur-xl
            border border-white/[0.15]
            transition-all duration-300
            group-focus-within:border-floria-gold/50
          "
          style={{
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
          }}
          onFocus={() => {}}
        >
          {/* Glow layer — visible only on focus-within via JS */}
          <FocusGlow />

          {/* Decorative mark */}
          <span className="shrink-0 text-floria-gold/50 text-base leading-none transition-colors duration-300 group-focus-within:text-floria-gold select-none">
            ✦
          </span>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Busca tu especia... Canela, Curry, Cardamomo..."
            className="
              flex-1 bg-transparent outline-none
              font-fredoka font-light text-sm
              text-floria-cream placeholder:text-floria-cream/30
              caret-floria-gold
            "
            aria-label="Buscar especias por nombre"
            autoComplete="off"
            spellCheck={false}
          />

          {/* Spinner or clear button */}
          <div className="shrink-0 w-5 h-5 flex items-center justify-center">
            {isSearching && value.length > 0 ? (
              <span className="block w-3.5 h-3.5 border border-floria-gold/40 border-t-floria-gold rounded-full animate-spin" />
            ) : value.length > 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onChange('')
                  inputRef.current?.focus()
                }}
                className="text-floria-cream/30 hover:text-floria-cream/70 transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="1" y1="1" x2="13" y2="13" />
                  <line x1="13" y1="1" x2="1" y2="13" />
                </svg>
              </button>
            ) : (
              <span className="text-floria-cream/15 text-xs">⌘K</span>
            )}
          </div>
        </div>
      </div>

      {/* Result count — animates when changes */}
      <p
        key={`${resultCount}-${value}`}
        className="font-fredoka font-light text-xs text-floria-cream/40 tracking-wide"
        style={{ animation: 'fadeIn 0.3s ease both' }}
      >
        {value.trim()
          ? resultCount === 0
            ? 'Ninguna especia encontrada'
            : `${resultCount} ${resultCount === 1 ? 'especia encontrada' : 'especias encontradas'}`
          : `${resultCount} especias en el catálogo`}
      </p>
    </div>
  )
}

// Separate component so the glow can react to focus state via CSS
function FocusGlow() {
  return (
    <div
      className="
        absolute inset-0 rounded-2xl pointer-events-none
        opacity-0 group-focus-within:opacity-100
        transition-opacity duration-300
      "
      style={{
        boxShadow: '0 0 0 2px rgba(240, 229, 60, 0.3), 0 0 32px rgba(240, 229, 60, 0.08)',
      }}
    />
  )
}
