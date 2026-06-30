import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'

export default function SustainabilityPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getProducts()
      .then((all) =>
        setProducts(
          all
            .filter((p) => (p.sustainability_score ?? 0) >= 60)
            .sort((a, b) => (b.sustainability_score ?? 0) - (a.sustainability_score ?? 0)),
        ),
      )
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  return (
    <>
      <div className="page-hero sustainability-hero">
        <h1>Move to Zero</h1>
        <p>
          Shop styles with higher sustainability scores — recycled materials, lower carbon
          footprint, and responsible manufacturing.
        </p>
      </div>

      <section className="section info-cards">
        <div className="info-card">
          <h3>Recycled Content</h3>
          <p>Many pairs use at least 20% recycled materials by weight in the upper.</p>
        </div>
        <div className="info-card">
          <h3>Carbon Aware</h3>
          <p>We highlight products with lower estimated carbon impact per pair.</p>
        </div>
        <div className="info-card">
          <h3>Score Guide</h3>
          <p>80+ Excellent · 60–79 Good · Below 60 Standard</p>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Planet-Friendly Picks</h2>
          <Link to="/outfit-builder" className="section-link">Build a sustainable outfit</Link>
        </div>
        <div className="product-grid">
          {products.map((p) => (
            <div key={p.id} className="sustainability-wrap">
              {(p.sustainability_score ?? 0) > 0 && (
                <span className="eco-score">Eco {p.sustainability_score}</span>
              )}
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
