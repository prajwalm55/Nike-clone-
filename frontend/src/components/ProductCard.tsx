import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import type { Product } from '../types'
import { useWishlist } from '../context/WishlistContext'
import { useCompare } from '../context/CompareContext'
import { useAuth } from '../context/AuthContext'
import StarRating from './StarRating'

const FALLBACK_IMG =
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&w=800'

interface Props {
  product: Product
  showLive?: boolean
}

function ProductImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [url, setUrl] = useState(src || FALLBACK_IMG)
  return (
    <img
      src={url}
      alt={alt}
      className={className}
      onError={() => setUrl(FALLBACK_IMG)}
      loading="lazy"
    />
  )
}

export default function ProductCard({ product, showLive }: Props) {
  const { user } = useAuth()
  const { isWishlisted, toggle } = useWishlist()
  const { add, isComparing, isFull } = useCompare()
  const navigate = useNavigate()
  const [msg, setMsg] = useState('')

  const price = Number(product.effective_price || product.price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  })
  const originalPrice = product.is_on_sale
    ? Number(product.price).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
    : null

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate('/auth')
      return
    }
    try {
      await toggle(product.id)
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Error')
      setTimeout(() => setMsg(''), 2000)
    }
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isComparing(product.id)) {
      navigate('/compare')
      return
    }
    if (!add(product)) {
      setMsg('Compare list full (max 3)')
      setTimeout(() => setMsg(''), 2000)
    }
  }

  return (
    <div className="product-card-wrap">
      <Link to={`/products/${product.id}`} className="product-card">
        <div className="product-card-image">
          {product.is_new && <span className="product-badge">Just In</span>}
          {product.is_on_sale && product.discount_percent ? (
            <span className="product-badge sale-badge">-{product.discount_percent}%</span>
          ) : null}
          {showLive && product.live_viewers && (
            <span className="live-badge">{product.live_viewers} viewing</span>
          )}
          {product.image_url && (
            <>
              <ProductImage src={product.image_url} alt={product.name} className="img-main" />
              {product.image_url_2 && (
                <ProductImage src={product.image_url_2} alt={product.name} className="img-hover" />
              )}
            </>
          )}
          <div className="product-card-actions">
            <button
              className={`action-btn ${isWishlisted(product.id) ? 'active' : ''}`}
              onClick={handleWishlist}
              title="Add to favorites"
            >
              ♥
            </button>
            <button
              className={`action-btn ${isComparing(product.id) ? 'active' : ''}`}
              onClick={handleCompare}
              title={isFull && !isComparing(product.id) ? 'Compare full' : 'Compare'}
              disabled={isFull && !isComparing(product.id)}
            >
              ⇄
            </button>
          </div>
        </div>
        <div className="product-card-info">
          <h3>{product.name}</h3>
          <p>{product.subtitle}</p>
          {(product.average_rating ?? 0) > 0 && (
            <div className="product-card-rating">
              <StarRating rating={product.average_rating!} size={12} />
              <span>({product.review_count})</span>
            </div>
          )}
          <span className="price">
            {price}
            {originalPrice && <s className="original-price">{originalPrice}</s>}
          </span>
        </div>
      </Link>
      {msg && <p className="card-toast">{msg}</p>}
    </div>
  )
}
