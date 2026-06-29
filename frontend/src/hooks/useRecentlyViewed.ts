import { useCallback, useEffect, useState } from 'react'
import type { Product } from '../types'

const STORAGE_KEY = 'recently_viewed'
const MAX_ITEMS = 6

export function useRecentlyViewed() {
  const [recent, setRecent] = useState<Product[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setRecent(JSON.parse(stored))
    } catch { /* ignore */ }
  }, [])

  const addViewed = useCallback((product: Product) => {
    setRecent((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id)
      const next = [product, ...filtered].slice(0, MAX_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { recent, addViewed }
}
