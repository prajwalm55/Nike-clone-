import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'

export default function KidsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getProducts({ gender: 'kids' })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  return (
    <>
      <div className="page-hero kids-hero">
        <h1>Kids</h1>
        <p>Big energy, small sizes. Durable kicks built for play, school, and sport.</p>
        <Link to="/shoe-finder" className="btn btn-white">Find the Right Fit</Link>
      </div>
      <section className="section">
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  )
}
