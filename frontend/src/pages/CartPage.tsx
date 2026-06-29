import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart()
  const [error, setError] = useState('')

  const handleUpdate = async (itemId: number, quantity: number) => {
    setError('')
    try {
      await updateItem(itemId, quantity)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item')
    }
  }

  const handleRemove = async (itemId: number) => {
    setError('')
    try {
      await removeItem(itemId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item')
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your bag is empty</h2>
        <p>Looks like you haven't added anything to your bag yet.</p>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  const subtotal = Number(cart.total_price)
  const shipping = subtotal >= 150 ? 0 : 8
  const total = subtotal + shipping

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })

  return (
    <div className="cart-page">
      <h1 className="page-title" style={{ padding: 0, marginBottom: 32 }}>
        Bag
      </h1>
      {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

      <div className="cart-layout">
        <div>
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <Link to={`/products/${item.product.id}`} className="cart-item-image">
                {item.product.image_url && (
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&w=800'
                    }}
                  />
                )}
              </Link>
              <div className="cart-item-details">
                <Link to={`/products/${item.product.id}`}>
                  <h3>{item.product.name}</h3>
                </Link>
                <p>{item.product.subtitle}</p>
                <p>Size: {item.size}</p>
                <p>{item.product.color}</p>
                <div className="cart-item-actions">
                  <div className="qty-control">
                    <button
                      onClick={() => handleUpdate(item.id, Math.max(1, item.quantity - 1))}
                      aria-label="Decrease quantity"
                    >
                      &minus;
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleUpdate(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
              <span className="cart-item-price">{fmt(Number(item.subtotal))}</span>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Estimated Shipping</span>
            <span>{shipping === 0 ? 'Free' : fmt(shipping)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{fmt(total)}</span>
          </div>
          <button className="btn btn-primary btn-full" style={{ marginTop: 24 }}>
            Checkout
          </button>
          <p style={{ marginTop: 12, fontSize: 12, color: '#737373', textAlign: 'center' }}>
            Free shipping on orders over $150
          </p>
        </div>
      </div>
    </div>
  )
}
