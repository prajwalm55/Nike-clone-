import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../api/client'
import { useAuth } from './AuthContext'
import type { Cart } from '../types'

interface CartContextType {
  cart: Cart | null
  loading: boolean
  refreshCart: () => Promise<void>
  addToCart: (productId: number, size: string, quantity?: number) => Promise<void>
  updateItem: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshCart = useCallback(async () => {
    try {
      const data = await api.getCart()
      setCart(data)
    } catch {
      setCart({ id: 0, items: [], total_price: 0, total_items: 0, created_at: '', updated_at: '' })
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    refreshCart().finally(() => setLoading(false))
  }, [refreshCart, user])

  const addToCart = useCallback(
    async (productId: number, size: string, quantity = 1) => {
      const data = await api.addToCart(productId, size, quantity)
      setCart(data)
    },
    [],
  )

  const updateItem = useCallback(async (itemId: number, quantity: number) => {
    const data = await api.updateCartItem(itemId, { quantity })
    setCart(data)
  }, [])

  const removeItem = useCallback(async (itemId: number) => {
    const data = await api.removeCartItem(itemId)
    setCart(data)
  }, [])

  const clearCart = useCallback(async () => {
    const data = await api.clearCart()
    setCart(data)
  }, [])

  return (
    <CartContext.Provider
      value={{ cart, loading, refreshCart, addToCart, updateItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
