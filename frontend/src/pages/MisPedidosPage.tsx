import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface OrderItem {
  spice_id: number
  spice_nombre: string
  spice_emoji: string
  qty: number
  precio_unitario: number
}

interface Order {
  id: number
  status: 'pendiente' | 'confirmado' | 'enviado' | 'entregado'
  total: number
  created_at: string
  items: OrderItem[]
}

const STATUS_STYLES: Record<Order['status'], string> = {
  pendiente:   'bg-amber-900/40 text-amber-300 border-amber-600/30',
  confirmado:  'bg-blue-900/40 text-blue-300 border-blue-600/30',
  enviado:     'bg-violet-900/40 text-violet-300 border-violet-600/30',
  entregado:   'bg-emerald-900/40 text-emerald-300 border-emerald-600/30',
}

const STATUS_LABEL: Record<Order['status'], string> = {
  pendiente:  'Pendiente',
  confirmado: 'Confirmado',
  enviado:    'Enviado',
  entregado:  'Entregado',
}

export function MisPedidosPage() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    fetch('/api/v1/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Order[]) => setOrders(data))
      .catch(() => setError('No se pudieron cargar los pedidos'))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <main className="min-h-screen bg-floria-deep pt-24 pb-20 px-6 md:px-16">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <Link
            to="/"
            className="font-fredoka text-xs text-floria-cream/30 hover:text-floria-cream/60 transition-colors tracking-wider uppercase mb-6 inline-block"
          >
            ← Volver
          </Link>
          <h1 className="font-fredoka font-bold text-floria-cream" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
            Mis <span className="text-floria-gold">Pedidos</span>
          </h1>
          <div className="w-12 h-px bg-floria-gold/40 mt-3" />
        </div>

        {/* States */}
        {loading && (
          <p className="font-fredoka text-sm text-floria-cream/30 text-center py-20">Cargando pedidos...</p>
        )}
        {error && (
          <p className="font-fredoka text-sm text-red-400/70 text-center py-20">{error}</p>
        )}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-24">
            <span className="text-5xl mb-5 block opacity-20">📦</span>
            <p className="font-fredoka font-semibold text-floria-cream/40 text-base mb-1">
              Aún no hay pedidos conjurados
            </p>
            <p className="font-fredoka font-light text-xs text-floria-cream/25 mb-8">
              Explora el catálogo y añade especias al caldero
            </p>
            <Link
              to="/explorar"
              className="font-fredoka font-semibold text-sm text-floria-gold border border-floria-gold/40 px-6 py-2.5 rounded-xl hover:bg-floria-gold hover:text-floria-deep transition-all duration-300"
            >
              Ver catálogo
            </Link>
          </div>
        )}

        {/* Order list */}
        {!loading && orders.length > 0 && (
          <ul className="flex flex-col gap-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm p-5 flex flex-col gap-3"
              >
                {/* Order header */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-fredoka font-semibold text-floria-cream text-sm">
                      Pedido #{order.id}
                    </p>
                    <p className="font-fredoka font-light text-xs text-floria-cream/35 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`font-fredoka font-medium text-[0.65rem] tracking-widest uppercase px-2.5 py-1 rounded-full border ${STATUS_STYLES[order.status]}`}>
                    {STATUS_LABEL[order.status]}
                  </span>
                </div>

                {/* Items summary */}
                <div className="border-t border-white/[0.06] pt-3 flex flex-col gap-1.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <span className="font-fredoka font-light text-xs text-floria-cream/55 flex items-center gap-1.5 min-w-0">
                        <span>{item.spice_emoji}</span>
                        <span className="truncate">{item.spice_nombre}</span>
                        <span className="text-floria-cream/30 shrink-0">× {item.qty}</span>
                      </span>
                      <span className="font-fredoka text-xs text-floria-gold/70 shrink-0">
                        {(item.precio_unitario * item.qty).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between">
                  <span className="font-fredoka font-medium text-xs text-floria-cream/40">Total</span>
                  <span className="font-fredoka font-bold text-base text-floria-gold">
                    {order.total.toFixed(2)} €
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

      </div>
    </main>
  )
}
