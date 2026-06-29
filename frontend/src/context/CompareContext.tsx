import {
  createContext, useCallback, useContext, useState, type ReactNode,
} from 'react'
import type { Product } from '../types'

const MAX_COMPARE = 3

interface CompareContextType {
  items: Product[]
  add: (product: Product) => boolean
  remove: (productId: number) => void
  clear: () => void
  isComparing: (productId: number) => boolean
  isFull: boolean
}

const CompareContext = createContext<CompareContextType | null>(null)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  const add = useCallback((product: Product) => {
    if (items.find((p) => p.id === product.id)) return true
    if (items.length >= MAX_COMPARE) return false
    setItems((prev) => [...prev, product])
    return true
  }, [items])

  const remove = useCallback((productId: number) => {
    setItems((prev) => prev.filter((p) => p.id !== productId))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const isComparing = (productId: number) => items.some((p) => p.id === productId)

  return (
    <CompareContext.Provider
      value={{ items, add, remove, clear, isComparing, isFull: items.length >= MAX_COMPARE }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
