import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TIER_COLORS = {
  member: '#737373',
  gold: '#c9a227',
  platinum: '#1a1a2e',
}

export default function AccountPage() {
  const { user, member, loading, logout } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  if (!user) {
    return (
      <div className="cart-empty">
        <h2>Your Account</h2>
        <p>Sign in to view your profile, orders, and membership benefits.</p>
        <Link to="/auth" className="btn btn-primary">Sign In / Join Us</Link>
      </div>
    )
  }

  const displayName = user.first_name
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`
    : user.username

  const handleSignOut = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="account-page">
      <div className="account-hero">
        <div className="account-avatar">
          {(user.first_name?.[0] || user.username[0]).toUpperCase()}
        </div>
        <div>
          <p className="account-greeting">Hi {user.first_name || user.username},</p>
          <h1 className="account-name">{displayName}</h1>
          <p className="account-email">{user.email}</p>
          {member && (
            <span
              className="account-tier-pill"
              style={{ background: TIER_COLORS[member.tier as keyof typeof TIER_COLORS] }}
            >
              {member.tier.toUpperCase()} · {member.points.toLocaleString()} pts
            </span>
          )}
        </div>
      </div>

      <div className="account-grid">
        <section className="account-section">
          <h2>Account</h2>
          <div className="account-details">
            <div className="account-detail-row">
              <span>Username</span>
              <strong>{user.username}</strong>
            </div>
            <div className="account-detail-row">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div className="account-detail-row">
              <span>Name</span>
              <strong>
                {user.first_name || user.last_name
                  ? `${user.first_name} ${user.last_name}`.trim()
                  : '—'}
              </strong>
            </div>
          </div>
        </section>

        <section className="account-section">
          <h2>Shopping</h2>
          <nav className="account-links">
            <Link to="/orders" className="account-link-card">
              <span className="account-link-icon">📦</span>
              <div>
                <h3>Orders</h3>
                <p>Track purchases and delivery status</p>
              </div>
            </Link>
            <Link to="/wishlist" className="account-link-card">
              <span className="account-link-icon">♥</span>
              <div>
                <h3>Favorites</h3>
                <p>Saved shoes and gear</p>
              </div>
            </Link>
            <Link to="/cart" className="account-link-card">
              <span className="account-link-icon">🛍️</span>
              <div>
                <h3>Bag</h3>
                <p>View items in your cart</p>
              </div>
            </Link>
          </nav>
        </section>

        <section className="account-section">
          <h2>Membership</h2>
          <nav className="account-links">
            <Link to="/member" className="account-link-card">
              <span className="account-link-icon">★</span>
              <div>
                <h3>Nike Membership</h3>
                <p>Points, tiers, and exclusive benefits</p>
              </div>
            </Link>
            <Link to="/shoe-finder" className="account-link-card">
              <span className="account-link-icon">🎯</span>
              <div>
                <h3>Shoe Finder</h3>
                <p>Get personalized recommendations</p>
              </div>
            </Link>
          </nav>
        </section>

        <section className="account-section account-signout-section">
          <button type="button" className="btn btn-outline btn-full" onClick={handleSignOut}>
            Sign Out
          </button>
        </section>
      </div>
    </div>
  )
}
