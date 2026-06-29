import {
  createContext, useCallback, useContext, useEffect, useState, type ReactNode,
} from 'react'
import { api } from '../api/client'
import { useAuth } from './AuthContext'
import type { WishlistItem } from '../types'

interface WishlistContextType {
  items: WishlistItem[]
  loading: boolean
  isWishlisted: (productId: number) => boolean
  toggle: (productId: number) => Promise<void>
  refresh: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([])
      return
    }
    setLoading(true)
    try {
      setItems(await api.getWishlist())
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { refresh() }, [refresh])

  const isWishlisted = (productId: number) =>
    items.some((i) => i.product.id === productId)

  const toggle = useCallback(async (productId: number) => {
    if (!user) throw new Error('Sign in to save favorites')
    const updated = isWishlisted(productId)
      ? await api.removeFromWishlist(productId)
      : await api.addToWishlist(productId)
    setItems(updated)
  }, [user, items])

  return (
    <WishlistContext.Provider value={{ items, loading, isWishlisted, toggle, refresh }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
