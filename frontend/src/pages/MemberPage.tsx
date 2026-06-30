import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import type { MemberProfile } from '../types'

const TIER_BENEFITS = {
  member: ['Free shipping on orders $150+', 'Early access to sales', 'Birthday reward'],
  gold: ['All Member benefits', 'Exclusive colorways', 'Priority customer support', '2x points on purchases'],
  platinum: ['All Gold benefits', 'VIP event invites', 'Free returns', '3x points on purchases', 'Personal style advisor'],
}

const TIER_COLORS = {
  member: '#737373',
  gold: '#c9a227',
  platinum: '#1a1a2e',
}

export default function MemberPage() {
  const { user, member: authMember, loading: authLoading } = useAuth()
  const [member, setMember] = useState<MemberProfile | null>(authMember)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMember(authMember)
  }, [authMember])

  useEffect(() => {
    if (!user || authMember) return
    setLoading(true)
    api
      .getMember()
      .then(setMember)
      .catch(() => setMember(null))
      .finally(() => setLoading(false))
  }, [user, authMember])

  if (authLoading || loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  if (!user) {
    return (
      <div className="cart-empty">
        <h2>Nike Membership</h2>
        <p>Join Nike Membership to earn points, unlock tiers, and get exclusive benefits.</p>
        <Link to="/auth" className="btn btn-primary">Join Us — It's Free</Link>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="cart-empty">
        <h2>Nike Membership</h2>
        <p>We couldn't load your membership profile. Try again from your account.</p>
        <Link to="/account" className="btn btn-primary">Go to Account</Link>
      </div>
    )
  }

  const tier = member.tier as keyof typeof TIER_BENEFITS
  const progress = member.tier === 'platinum'
    ? 100
    : member.tier === 'gold'
      ? ((member.points - 2000) / 3000) * 100
      : (member.points / 2000) * 100

  return (
    <div className="member-page">
      <div className="member-hero" style={{ borderColor: TIER_COLORS[tier] }}>
        <span className="member-tier-badge" style={{ background: TIER_COLORS[tier] }}>
          {tier.toUpperCase()}
        </span>
        <h1>Hey, {user.first_name || user.username}</h1>
        <p className="member-points">{member.points.toLocaleString()} Nike Points</p>
        {member.next_tier_points > 0 && (
          <p className="member-next-tier">
            {member.next_tier_points} points to next tier
          </p>
        )}
        <div className="tier-progress">
          <div className="tier-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      </div>

      <div className="member-stats">
        <div className="member-stat">
          <span className="stat-value">{member.shoes_owned}</span>
          <span className="stat-label">Shoes Owned</span>
        </div>
        <div className="member-stat">
          <span className="stat-value">+10</span>
          <span className="stat-label">Pts per Add to Bag</span>
        </div>
        <div className="member-stat">
          <span className="stat-value">+25</span>
          <span className="stat-label">Pts per Review</span>
        </div>
        <div className="member-stat">
          <span className="stat-value">+50</span>
          <span className="stat-label">Pts per Checkout Item</span>
        </div>
      </div>

      <section className="member-benefits">
        <h2>Your Benefits</h2>
        <ul>
          {TIER_BENEFITS[tier].map((b) => (
            <li key={b}>✓ {b}</li>
          ))}
        </ul>
      </section>

      <section className="member-cta">
        <h2>Earn More Points</h2>
        <div className="member-cta-grid">
          <Link to="/shoe-finder" className="cta-card">
            <span>🎯</span>
            <h3>Shoe Finder</h3>
            <p>Find your perfect match</p>
          </Link>
          <Link to="/products" className="cta-card">
            <span>🛍️</span>
            <h3>Shop Now</h3>
            <p>Earn points on every purchase</p>
          </Link>
          <Link to="/products?new=true" className="cta-card">
            <span>⭐</span>
            <h3>Leave Reviews</h3>
            <p>+25 points per review</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
