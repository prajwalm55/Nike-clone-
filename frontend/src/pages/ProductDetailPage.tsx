import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../context/CartContext'
import type { Product } from '../types'

const FALLBACK_IMG =
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&w=800'

function SafeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [url, setUrl] = useState(src || FALLBACK_IMG)
  return (
    <img
      src={url}
      alt={alt}
      className={className}
      onError={() => setUrl(FALLBACK_IMG)}
    />
  )
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api
      .getProduct(Number(id))
      .then((p) => {
        setProduct(p)
        if (p.sizes.length) setSelectedSize(p.sizes[0])
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!product || !selectedSize) return
    setAdding(true)
    setMessage('')
    try {
      await addToCart(product.id, selectedSize)
      setMessage('Added to bag')
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
        <div className="product-gallery-main">
          {images[activeImage] && (
            <SafeImage src={images[activeImage]} alt={product.name} />
          )}
        </div>
        {images.length > 1 && (
          <div className="product-gallery-thumbs">
            {images.map((img, i) => (
              <button
                key={i}
                className={activeImage === i ? 'active' : ''}
                onClick={() => setActiveImage(i)}
              >
                <SafeImage src={img} alt={`${product.name} view ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="product-info">
        {product.is_new && <span className="product-badge" style={{ position: 'static', display: 'inline-block', marginBottom: 12 }}>Just In</span>}
        <h1>{product.name}</h1>
        <p className="subtitle">{product.subtitle}</p>
        <p className="price">{price}</p>
        <p className="description">{product.description}</p>
        {product.color && (
          <p style={{ marginBottom: 24, color: '#737373' }}>
            <strong>Color:</strong> {product.color}
          </p>
        )}

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
    </div>
  )
}
