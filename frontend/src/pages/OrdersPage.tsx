import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { Order } from '../types'

export default function OrdersPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    api
      .getOrders()
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load orders'))
      .finally(() => setLoading(false))
  }, [user, navigate])

  const fmt = (n: string | number) =>
    Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  return (
    <>
      <h1 className="page-title">Your Orders</h1>
      {error && <p className="form-error">{error}</p>}

      {orders.length === 0 ? (
        <div className="cart-empty">
          <h2>No orders yet</h2>
          <p>When you checkout, your orders will appear here with tracking info.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <strong>Order #{order.id}</strong>
                  <span className="order-date">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                <span className={`order-status status-${order.status}`}>{order.status}</span>
              </div>
              <p className="order-tracking">Tracking: {order.tracking_number}</p>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.product_name} · Size {item.size} · Qty {item.quantity} · {fmt(item.price)}
                  </li>
                ))}
              </ul>
              <div className="order-total">Total: {fmt(order.total)}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
