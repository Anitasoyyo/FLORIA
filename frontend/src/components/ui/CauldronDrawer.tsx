import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const DRAWER_PERKS = [
  { icon: '🚚', title: 'Envío gratis',    subtitle: 'A partir de 40 €'    },
  { icon: '🎁', title: '15 € de regalo',  subtitle: 'En compras de 150 €' },
  { icon: '🎟️', title: '3% descuento',    subtitle: 'Repitiendo compra'   },
  { icon: '🚛', title: 'Envío express',   subtitle: '24–48 horas'         },
]

import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { CauldronIcon } from './CauldronIcon'

interface CauldronDrawerProps {
  isOpen: boolean
  onClose: () => void
}

type OrderState = 'idle' | 'loading' | 'success' | 'error'

export function CauldronDrawer({ isOpen, onClose }: CauldronDrawerProps) {
  const { items, updateQty, removeItem, clearCart, total, count } = useCart()
  const { token } = useAuth()
  const [orderState, setOrderState] = useState<OrderState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handlePlaceOrder = async () => {
    if (!token) return
    setOrderState('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map(({ spice, qty }) => ({ spice_id: spice.id, qty })),
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setErrorMsg(data.detail ?? 'Error al conjurar el pedido')
        setOrderState('error')
        return
      }
      setOrderState('success')
      setTimeout(() => {
        clearCart()
        onClose()
        setOrderState('idle')
      }, 1800)
    } catch {
      setErrorMsg('Error de conexión. Inténtalo de nuevo.')
      setOrderState('error')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-[min(420px,100vw)] flex flex-col bg-floria-deep border-l border-white/[0.08] shadow-[-12px_0_48px_rgba(0,0,0,0.6)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.07]">
              <CauldronIcon size={24} className="text-floria-gold shrink-0" />
              <h2 className="font-fredoka font-bold text-floria-cream text-lg tracking-wide flex-1">
                Tu Caldero
              </h2>
              {count > 0 && (
                <span className="font-fredoka text-[11px] font-bold bg-floria-gold text-floria-deep px-2.5 py-0.5 rounded-full">
                  {count}
                </span>
              )}
              <button
                onClick={onClose}
                className="text-floria-cream/30 hover:text-floria-cream/70 transition-colors ml-1"
                aria-label="Cerrar caldero"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="2" y1="2" x2="14" y2="14" />
                  <line x1="14" y1="2" x2="2" y2="14" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-20">
                  <CauldronIcon size={72} className="text-floria-cream opacity-10 mx-auto" />
                  <p className="font-fredoka font-semibold text-floria-cream/40 text-base">
                    Tu caldero está vacío
                  </p>
                  <p className="font-fredoka font-light text-xs text-floria-cream/25">
                    Añade especias desde el catálogo
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map(({ spice, qty }) => (
                    <motion.div
                      key={spice.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.05] border border-white/[0.07]"
                    >
                      <span className="text-2xl shrink-0">{spice.emoji}</span>

                      <div className="flex-1 min-w-0">
                        <p className="font-fredoka font-semibold text-floria-cream text-sm leading-snug truncate">
                          {spice.nombre}
                        </p>
                        <p className="font-fredoka text-xs text-floria-gold/80 mt-0.5">
                          {(spice.precio * qty).toFixed(2)} €
                        </p>
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateQty(spice.id, qty - 1)}
                          className="w-7 h-7 rounded-full border border-white/20 text-floria-cream/60 hover:border-floria-gold/60 hover:text-floria-gold flex items-center justify-center text-lg leading-none transition-colors"
                          aria-label="Quitar uno"
                        >
                          −
                        </button>
                        <span className="font-fredoka font-bold text-sm text-floria-cream w-5 text-center tabular-nums">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQty(spice.id, qty + 1)}
                          className="w-7 h-7 rounded-full border border-white/20 text-floria-cream/60 hover:border-floria-gold/60 hover:text-floria-gold flex items-center justify-center text-lg leading-none transition-colors"
                          aria-label="Añadir uno"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(spice.id)}
                        className="text-floria-cream/20 hover:text-red-400/70 transition-colors ml-1 shrink-0"
                        aria-label={`Eliminar ${spice.nombre}`}
                      >
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                          <line x1="1" y1="1" x2="12" y2="12" />
                          <line x1="12" y1="1" x2="1" y2="12" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/[0.07] flex flex-col gap-4">
                {orderState !== 'success' && (
                  <div className="flex items-center justify-between">
                    <span className="font-fredoka font-medium text-sm text-floria-cream/50">
                      Total ({count} {count === 1 ? 'especia' : 'especias'})
                    </span>
                    <span className="font-fredoka font-bold text-xl text-floria-gold">
                      {total.toFixed(2)} €
                    </span>
                  </div>
                )}

                {!token ? (
                  <p className="text-center font-fredoka text-xs text-floria-cream/40 py-1">
                    Inicia sesión para realizar tu pedido
                  </p>
                ) : orderState === 'success' ? (
                  <div className="text-center py-2">
                    <p className="font-fredoka font-bold text-emerald-400 text-base">¡Pedido conjurado! ✨</p>
                    <p className="font-fredoka text-xs text-floria-cream/40 mt-1">Te avisaremos cuando esté listo</p>
                  </div>
                ) : (
                  <>
                    {errorMsg && (
                      <p className="font-fredoka text-xs text-red-400/80 text-center">{errorMsg}</p>
                    )}
                    <button
                      onClick={handlePlaceOrder}
                      disabled={orderState === 'loading'}
                      className="w-full py-3.5 rounded-xl bg-floria-gold text-floria-deep font-fredoka font-bold text-sm tracking-wide hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {orderState === 'loading' ? 'Conjurando...' : 'Conjurar pedido ✨'}
                    </button>
                  </>
                )}
              </div>
            )}
            {/* Perks footer */}
            <div className="border-t border-white/[0.06] bg-white/[0.02]">
              <div className="grid grid-cols-2">
                {DRAWER_PERKS.map((perk, i) => (
                  <div
                    key={perk.title}
                    className={[
                      'flex flex-col items-center justify-center gap-1.5 py-4 px-4 text-center',
                      i % 2 === 0 ? 'border-r border-white/[0.06]' : '',
                      i < 2     ? 'border-b border-white/[0.06]' : '',
                    ].join(' ')}
                  >
                    <span className="text-xl leading-none" aria-hidden="true">{perk.icon}</span>
                    <span className="font-fredoka font-semibold text-xs text-floria-gold leading-tight">
                      {perk.title}
                    </span>
                    <span className="font-fredoka font-light text-[0.68rem] text-floria-cream/45 leading-tight">
                      {perk.subtitle}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
