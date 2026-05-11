import { createContext, useContext, useState, useEffect, useRef } from 'react'
import type { Spice } from '@/types'
import { useAuth } from './AuthContext'

export interface CartItem {
  spice: Spice
  qty: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (spice: Spice) => void
  removeItem: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

function storageKey(email: string) {
  return `floria_cart_${email}`
}

function loadCart(email: string): CartItem[] {
  try {
    const raw = localStorage.getItem(storageKey(email))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(email: string, items: CartItem[]) {
  try {
    localStorage.setItem(storageKey(email), JSON.stringify(items))
  } catch {}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])

  // undefined = first mount (never ran yet), null = logged out, string = email
  const prevEmailRef = useRef<string | null | undefined>(undefined)

  // On user change: save previous user's cart, load new user's cart
  useEffect(() => {
    const prev = prevEmailRef.current
    const curr = user?.email ?? null
    prevEmailRef.current = curr

    // Save previous user's cart before transitioning (skip on first mount)
    if (prev !== undefined && prev !== null) {
      saveCart(prev, items)
    }

    // Load cart for current user, or clear if logged out
    if (curr) {
      setItems(loadCart(curr))
    } else {
      setItems([])
    }
  }, [user?.email]) // eslint-disable-line react-hooks/exhaustive-deps

  // Persist cart on every change while logged in
  useEffect(() => {
    if (user?.email) {
      saveCart(user.email, items)
    }
  }, [items, user?.email])

  const addItem = (spice: Spice) =>
    setItems((prev) => {
      const existing = prev.find((i) => i.spice.id === spice.id)
      if (existing) return prev.map((i) => i.spice.id === spice.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { spice, qty: 1 }]
    })

  const removeItem = (id: number) =>
    setItems((prev) => prev.filter((i) => i.spice.id !== id))

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) { removeItem(id); return }
    setItems((prev) => prev.map((i) => i.spice.id === id ? { ...i, qty } : i))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.spice.precio * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
