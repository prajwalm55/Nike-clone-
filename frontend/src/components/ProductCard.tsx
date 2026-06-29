import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { Product } from '../types'

const FALLBACK_IMG =
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&w=800'

interface Props {
  product: Product
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

export default function ProductCard({ product }: Props) {
  const price = Number(product.price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  })

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-image">
        {product.is_new && <span className="product-badge">Just In</span>}
        {product.image_url && (
          <>
            <ProductImage src={product.image_url} alt={product.name} className="img-main" />
            {product.image_url_2 && (
              <ProductImage src={product.image_url_2} alt={product.name} className="img-hover" />
            )}
          </>
        )}
      </div>
      <div className="product-card-info">
        <h3>{product.name}</h3>
        <p>{product.subtitle}</p>
        <span className="price">{price}</span>
      </div>
    </Link>
  )
}
