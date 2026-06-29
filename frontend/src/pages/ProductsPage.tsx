import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'

const GENDERS = [
  { value: '', label: 'All' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
]

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'Lifestyle', label: 'Lifestyle' },
  { value: 'Jordan', label: 'Jordan' },
  { value: 'Running', label: 'Running' },
  { value: 'Training', label: 'Training' },
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const gender = searchParams.get('gender') || ''
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const featured = searchParams.get('featured') || ''
  const isNew = searchParams.get('new') || ''

  useEffect(() => {
    setLoading(true)
    const params: Record<string, string> = {}
    if (gender) params.gender = gender
    if (category) params.category = category
    if (search) params.search = search
    if (featured) params.featured = featured
    if (isNew) params.new = isNew

    api
      .getProducts(params)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [gender, category, search, featured, isNew])

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    next.delete('featured')
    next.delete('new')
    next.delete('search')
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setSearchParams(next)
  }

  const title = search
    ? `Results for "${search}"`
    : featured
      ? 'Featured'
      : isNew
        ? 'New Arrivals'
        : gender
          ? `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Shoes`
          : category || 'All Products'

  return (
    <>
      <h1 className="page-title">{title}</h1>

      <div className="filters-bar">
        {GENDERS.map((g) => (
          <button
            key={g.value}
            className={`filter-btn ${gender === g.value ? 'active' : ''}`}
            onClick={() => setFilter('gender', g.value)}
          >
            {g.label}
          </button>
        ))}
        <span style={{ width: 1, height: 24, background: '#e5e5e5' }} />
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            className={`filter-btn ${category === c.value ? 'active' : ''}`}
            onClick={() => setFilter('category', c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <div className="cart-empty">
          <h2>No products found</h2>
          <p>Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <section className="section">
          <p style={{ marginBottom: 16, color: '#737373' }}>
            {products.length} {products.length === 1 ? 'Product' : 'Products'}
          </p>
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
