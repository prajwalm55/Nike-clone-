import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'

export default function SalePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getProducts({ sale: 'true' })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  return (
    <>
      <div className="page-hero sale-hero">
        <h1>Sale</h1>
        <p>Limited-time deals on top Nike styles. Up to 30% off select pairs.</p>
      </div>
      {products.length === 0 ? (
        <p className="empty-state">No sale items right now. Check back soon.</p>
      ) : (
        <section className="section">
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
