import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../context/CartContext'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import type { Product } from '../types'
import Product360Viewer from '../components/Product360Viewer'
import SizeAdvisor from '../components/SizeAdvisor'
import ReviewsSection from '../components/ReviewsSection'
import StarRating from '../components/StarRating'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()
  const { addViewed } = useRecentlyViewed()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')
  const [viewers, setViewers] = useState(0)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api
      .getProduct(Number(id))
      .then((p) => {
        setProduct(p)
        if (p.sizes.length) setSelectedSize(p.sizes[0])
        addViewed(p)
        setViewers(Math.floor(Math.random() * 30) + 12)
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id, addViewed])

  const handleAddToCart = async () => {
    if (!product || !selectedSize) return
    setAdding(true)
    setMessage('')
    try {
      await addToCart(product.id, selectedSize)
      setMessage('Added to bag — +10 member points!')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to add')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  if (!product) {
    return (
      <div className="cart-empty">
        <h2>Product not found</h2>
      </div>
    )
  }

  const images = [product.image_url, product.image_url_2].filter(Boolean)
  const price = Number(product.price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  })

  return (
    <div className="product-detail">
      <div className="product-gallery">
        <Product360Viewer images={images} alt={product.name} />
        {viewers > 0 && (
          <p className="live-viewers">
            <span className="live-dot" /> {viewers} people are viewing this right now
          </p>
        )}
      </div>

      <div className="product-info">
        {product.is_new && (
          <span className="product-badge" style={{ position: 'static', display: 'inline-block', marginBottom: 12 }}>
            Just In
          </span>
        )}
        <h1>{product.name}</h1>
        <p className="subtitle">{product.subtitle}</p>
        {(product.average_rating ?? 0) > 0 && (
          <div className="product-rating-row">
            <StarRating rating={product.average_rating!} />
            <span>{product.average_rating} ({product.review_count} reviews)</span>
          </div>
        )}
        <p className="price">{price}</p>
        <p className="description">{product.description}</p>
        {product.color && (
          <p style={{ marginBottom: 24, color: '#737373' }}>
            <strong>Color:</strong> {product.color}
          </p>
        )}

        <SizeAdvisor product={product} onSizeSelect={setSelectedSize} />

        <div className="size-selector">
          <h4>Select Size</h4>
          <div className="size-grid">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={handleAddToCart}
          disabled={adding || !selectedSize}
        >
          {adding ? 'Adding...' : 'Add to Bag'}
        </button>
        {message && <p className="add-to-cart-msg">{message}</p>}
      </div>

      <div className="product-detail-reviews">
        <ReviewsSection productId={product.id} />
      </div>
    </div>
  )
}
