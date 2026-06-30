import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AccountMenu() {
  const { user, member, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) {
    return (
      <Link to="/auth" className="account-menu-trigger" title="Sign in">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </Link>
    )
  }

  const label = user.first_name || user.username

  const handleSignOut = async () => {
    setOpen(false)
    await logout()
    navigate('/')
  }

  return (
    <div className="account-menu" ref={menuRef}>
      <button
        type="button"
        className="account-menu-trigger signed-in"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        title={`Account — ${label}`}
      >
        <span className="account-menu-initial">
          {(user.first_name?.[0] || user.username[0]).toUpperCase()}
        </span>
      </button>

      {open && (
        <div className="account-menu-dropdown">
          <div className="account-menu-header">
            <strong>Hi, {label}</strong>
            <span>{user.email}</span>
            {member && (
              <span className="account-menu-tier">
                {member.tier.toUpperCase()} · {member.points} pts
              </span>
            )}
          </div>
          <Link to="/account" className="account-menu-item" onClick={() => setOpen(false)}>
            Account
          </Link>
          <Link to="/orders" className="account-menu-item" onClick={() => setOpen(false)}>
            Orders
          </Link>
          <Link to="/wishlist" className="account-menu-item" onClick={() => setOpen(false)}>
            Favorites
          </Link>
          <Link to="/member" className="account-menu-item" onClick={() => setOpen(false)}>
            Membership
          </Link>
          <button type="button" className="account-menu-item sign-out" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
