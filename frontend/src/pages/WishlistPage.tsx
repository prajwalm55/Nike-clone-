import { Link, useNavigate } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

export default function WishlistPage() {
  const { user } = useAuth()
  const { items, loading, toggle } = useWishlist()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="cart-empty">
        <h2>Your Favorites</h2>
        <p>Sign in to save products you love and access them anywhere.</p>
        <Link to="/auth" className="btn btn-primary">Sign In</Link>
      </div>
    )
  }

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Favorites</h2>
        <p>Tap the heart on any product to save it here.</p>
        <Link to="/products" className="btn btn-primary">Explore Products</Link>
      </div>
    )
  }

  const fmt = (p: string) =>
    Number(p).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })

  return (
    <div className="wishlist-page">
      <h1 className="page-title">Favorites ({items.length})</h1>
      <div className="wishlist-grid">
        {items.map((item) => (
          <div key={item.id} className="wishlist-card">
            <Link to={`/products/${item.product.id}`} className="wishlist-card-image">
              <img src={item.product.image_url} alt={item.product.name} />
            </Link>
            <div className="wishlist-card-info">
              <Link to={`/products/${item.product.id}`}>
                <h3>{item.product.name}</h3>
              </Link>
              <p>{item.product.subtitle}</p>
              <span className="price">{fmt(item.product.price)}</span>
              <div className="wishlist-card-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/products/${item.product.id}`)}
                >
                  View Product
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => toggle(item.product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
