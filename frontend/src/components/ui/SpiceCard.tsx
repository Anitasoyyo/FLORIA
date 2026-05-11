import { useState } from 'react'
import type { Spice, SpiceTipo } from '@/types'
import { StarRating } from './StarRating'
import { useCart } from '@/context/CartContext'
import { CauldronIcon } from './CauldronIcon'

interface SpiceCardProps {
  spice: Spice
}

// Gradient background for the visual placeholder area
const TYPE_GRADIENT: Record<SpiceTipo, string> = {
  'Herbácea':  'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
  'Floral':    'linear-gradient(135deg, #500724 0%, #9f1239 100%)',
  'Cítrica':   'linear-gradient(135deg, #3b3300 0%, #854d0e 100%)',
  'Aromática': 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)',
  'Terrosa':   'linear-gradient(135deg, #1c1917 0%, #78350f 100%)',
  'Leñosa':    'linear-gradient(135deg, #1c1410 0%, #44280a 100%)',
  'Picante':   'linear-gradient(135deg, #450a0a 0%, #991b1b 100%)',
  'Especiada': 'linear-gradient(135deg, #431407 0%, #9a3412 100%)',
  'Dulce':     'linear-gradient(135deg, #78350f 0%, #b45309 100%)',
  'Mezcla':    'linear-gradient(135deg, #1e1b4b 0%, #4a1d96 50%, #701a75 100%)',
}

// Badge classes — all hardcoded so Tailwind doesn't purge them
const TYPE_BADGE: Record<SpiceTipo, string> = {
  'Herbácea':  'bg-emerald-900/60 text-emerald-300 border-emerald-600/40',
  'Floral':    'bg-rose-900/60 text-rose-300 border-rose-600/40',
  'Cítrica':   'bg-yellow-900/60 text-yellow-300 border-yellow-600/40',
  'Aromática': 'bg-violet-900/60 text-violet-300 border-violet-600/40',
  'Terrosa':   'bg-stone-800/60 text-stone-300 border-stone-500/40',
  'Leñosa':    'bg-amber-950/60 text-amber-400 border-amber-700/40',
  'Picante':   'bg-red-900/60 text-red-300 border-red-600/40',
  'Especiada': 'bg-orange-900/60 text-orange-300 border-orange-600/40',
  'Dulce':     'bg-amber-900/60 text-amber-300 border-amber-600/40',
  'Mezcla':    'bg-indigo-900/60 text-indigo-300 border-indigo-600/40',
}

export function SpiceCard({ spice }: SpiceCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const isOutOfStock = spice.stock === 0

  const handleAdd = () => {
    if (isOutOfStock) return
    addItem(spice)
    setAdded(true)
    setTimeout(() => setAdded(false), 1100)
  }

  return (
    <article
      className="
        flex flex-col rounded-2xl overflow-hidden
        bg-white/[0.05] backdrop-blur-xl
        border border-white/[0.1]
        shadow-[0_4px_32px_rgba(0,0,0,0.4)]
        transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]
        group
      "
    >
      {/* Image area */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={spice.imagen ?? '/images/especias.jpg'}
          alt={spice.nombre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Color tint overlay per type — keeps visual identity without per-photo */}
        <div
          className="absolute inset-0 opacity-50 mix-blend-multiply"
          style={{ background: TYPE_GRADIENT[spice.tipo] }}
        />
        {/* Bottom fade into card body */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Emoji badge — bottom left over the image */}
        <span
          className="absolute bottom-3 left-4 text-2xl drop-shadow-lg"
          role="img"
          aria-hidden="true"
        >
          {spice.emoji}
        </span>
        {/* Agotado overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="font-fredoka font-bold text-sm text-floria-cream/70 uppercase tracking-widest bg-black/60 px-3 py-1.5 rounded-full border border-white/20">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Rareza */}
        <StarRating rating={spice.rareza} />

        {/* Nombre */}
        <h3 className="font-fredoka font-semibold text-base leading-snug text-floria-cream">
          {spice.nombre}
        </h3>

        {/* Descripción */}
        <p className="font-fredoka font-light text-xs text-floria-cream/55 leading-relaxed flex-1">
          {spice.descripcion}
        </p>

        {/* Footer: tipo + precio */}
        <div className="flex items-center justify-between mt-1">
          <span
            className={`
              font-fredoka font-medium text-[0.65rem] tracking-widest uppercase
              px-2.5 py-1 rounded-full border
              ${TYPE_BADGE[spice.tipo]}
            `}
          >
            {spice.tipo}
          </span>
          <span className="font-fredoka font-semibold text-base text-floria-gold">
            {spice.precio.toFixed(2)} €
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`
            w-full mt-1 py-2.5 rounded-xl
            font-fredoka font-semibold text-sm
            border transition-all duration-300
            ${isOutOfStock
              ? 'border-white/10 text-floria-cream/25 cursor-not-allowed'
              : added
                ? 'bg-floria-gold text-floria-deep border-floria-gold scale-[0.98]'
                : 'border-floria-gold/35 text-floria-gold hover:bg-floria-gold hover:text-floria-deep'
            }
          `}
        >
          {isOutOfStock
            ? 'Agotado'
            : added
              ? (
                <span className="flex items-center justify-center gap-1.5">
                  ¡Al caldero! <CauldronIcon size={14} className="inline" />
                </span>
              )
              : 'Añadir al caldero'
          }
        </button>
      </div>
    </article>
  )
}
