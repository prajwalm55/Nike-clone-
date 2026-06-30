import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Product } from '../types'

const SLOTS = [
  { key: 'lifestyle', label: 'Everyday', filter: (p: Product) => p.category === 'Lifestyle' },
  { key: 'performance', label: 'Performance', filter: (p: Product) => p.category === 'Running' || p.category === 'Training' },
  { key: 'statement', label: 'Statement', filter: (p: Product) => p.category === 'Jordan' },
] as const

export default function OutfitBuilderPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<Record<string, Product | null>>({
    lifestyle: null,
    performance: null,
    statement: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const pick = (slot: string, product: Product) => {
    setSelected((prev) => ({ ...prev, [slot]: product }))
  }

  const clear = (slot: string) => {
    setSelected((prev) => ({ ...prev, [slot]: null }))
  }

  const outfit = Object.values(selected).filter(Boolean) as Product[]
  const total = outfit.reduce(
    (sum, p) => sum + Number(p.effective_price || p.price),
    0,
  )
  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  return (
    <>
      <div className="page-hero outfit-hero">
        <h1>Outfit Builder</h1>
        <p>Mix one everyday pair, one performance shoe, and one statement Jordan — your complete rotation.</p>
      </div>

      <section className="section outfit-builder">
        <div className="outfit-preview">
          <h2>Your Outfit</h2>
          {outfit.length === 0 ? (
            <p className="outfit-empty">Pick a shoe from each category to build your look.</p>
          ) : (
            <div className="outfit-preview-grid">
              {outfit.map((p) => (
                <Link key={p.id} to={`/products/${p.id}`} className="outfit-preview-item">
                  <img src={p.image_url} alt={p.name} />
                  <span>{p.name}</span>
                </Link>
              ))}
            </div>
          )}
          {outfit.length > 0 && (
            <p className="outfit-total">Outfit total: <strong>{fmt(total)}</strong></p>
          )}
        </div>

        {SLOTS.map((slot) => {
          const options = products.filter(slot.filter).slice(0, 6)
          return (
            <div key={slot.key} className="outfit-slot">
              <div className="outfit-slot-header">
                <h3>{slot.label}</h3>
                {selected[slot.key] && (
                  <button type="button" onClick={() => clear(slot.key)}>Clear</button>
                )}
              </div>
              <div className="outfit-options">
                {options.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`outfit-option ${selected[slot.key]?.id === p.id ? 'active' : ''}`}
                    onClick={() => pick(slot.key, p)}
                  >
                    <img src={p.image_url} alt={p.name} />
                    <span>{p.name}</span>
                    <span className="outfit-price">{fmt(Number(p.effective_price || p.price))}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </>
  )
}
