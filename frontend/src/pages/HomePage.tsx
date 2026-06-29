import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Product } from '../types'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [trending, setTrending] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { recent } = useRecentlyViewed()

  useEffect(() => {
    Promise.all([
      api.getProducts({ featured: 'true' }),
      api.getProducts({ new: 'true' }),
      api.getTrending(),
    ])
      .then(([feat, newest, trend]) => {
        setFeatured(feat)
        setNewArrivals(newest)
        setTrending(trend)
      })
      .catch(() => {
        setFeatured([])
        setNewArrivals([])
        setTrending([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  return (
    <>
      <Hero
        title="JUST DO IT"
        subtitle="New styles and classic icons. Find your next pair."
        ctaText="Shop Now"
        ctaLink="/products"
        bgImage="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80"
      />

      <section className="innovation-banner">
        <div className="innovation-card">
          <span className="feature-badge">AI-Powered</span>
          <h2>Not sure which shoe to pick?</h2>
          <p>Our Shoe Finder analyzes your activity, surface, experience, and budget to recommend your perfect Nike pair in 60 seconds.</p>
          <Link to="/shoe-finder" className="btn btn-white">Try Shoe Finder</Link>
        </div>
        <div className="innovation-card dark">
          <span className="feature-badge">Membership</span>
          <h2>Join Nike Membership</h2>
          <p>Earn points on every purchase, unlock Gold & Platinum tiers, and get exclusive benefits.</p>
          <Link to="/member" className="btn btn-white">View Benefits</Link>
        </div>
      </section>

      {trending.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">🔥 Trending Now</h2>
            <span className="section-link" style={{ cursor: 'default' }}>Live activity</span>
          </div>
          <div className="product-grid">
            {trending.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} showLive />
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="category-grid">
          <Link to="/products?gender=men" className="category-tile">
            <img src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&w=800" alt="Men" />
            <div className="category-tile-overlay"><h3>Men</h3></div>
          </Link>
          <Link to="/products?gender=women" className="category-tile">
            <img src="https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&w=800" alt="Women" />
            <div className="category-tile-overlay"><h3>Women</h3></div>
          </Link>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Recently Viewed</h2>
          </div>
          <div className="product-grid">
            {recent.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Featured</h2>
            <Link to="/products?featured=true" className="section-link">Shop All</Link>
          </div>
          <div className="product-grid">
            {featured.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/products?new=true" className="section-link">Shop All</Link>
          </div>
          <div className="product-grid">
            {newArrivals.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
