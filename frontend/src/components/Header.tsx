import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

function NikeLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-label="Nike">
      <path d="M24 7.8L6.442 15.276c-1.456.616-2.679 1.634-3.569 2.907L0 20.876V1.067c1.456.616 2.679 1.634 3.569 2.907L24 7.8z" />
    </svg>
  )
}

export default function Header() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const { items: wishlistItems } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setMobileOpen(false)
    }
  }

  const navLinks = [
    { to: '/shoe-finder', label: 'Shoe Finder' },
    { to: '/products?gender=men', label: 'Men' },
    { to: '/products?gender=women', label: 'Women' },
    { to: '/products?category=Jordan', label: 'Jordan' },
    { to: '/products?new=true', label: 'New' },
  ]

  const isActive = (path: string) => location.pathname + location.search === path

  return (
    <>
      <header className="header">
        <div className="header-top">
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link to="/" className="header-logo">
            <NikeLogo />
          </Link>

          <nav className="header-nav">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={isActive(link.to) ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <form className="search-bar" onSubmit={handleSearch}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            {user ? (
              <button onClick={() => logout()} title={`Signed in as ${user.username}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            ) : (
              <Link to="/auth" title="Sign in">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}

            <Link to="/member" title="Membership">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </Link>

            <Link to="/wishlist" className="cart-icon-wrap" title="Favorites">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="cart-badge">{wishlistItems.length}</span>
              )}
            </Link>

            <Link to="/cart" className="cart-icon-wrap" title="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cart && cart.total_items > 0 && (
                <span className="cart-badge">{cart.total_items}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <NikeLogo />
          <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="mobile-nav-links">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              type="button"
              className="mobile-nav-signout"
              onClick={() => {
                logout()
                setMobileOpen(false)
              }}
            >
              Sign Out
            </button>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </>
  )
}
