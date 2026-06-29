import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { Review } from '../types'
import StarRating from './StarRating'

interface Props {
  productId: number
}

export default function ReviewsSection({ productId }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState<Review[]>([])
  const [avg, setAvg] = useState(0)
  const [count, setCount] = useState(0)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getReviews(productId)
      .then((data) => {
        setReviews(data.reviews)
        setAvg(data.average_rating)
        setCount(data.review_count)
      })
      .finally(() => setLoading(false))
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      navigate('/auth')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const review = await api.addReview(productId, rating, comment)
      setReviews((prev) => [review, ...prev])
      setCount((c) => c + 1)
      setAvg((prev) => Math.round(((prev * (count) + rating) / (count + 1)) * 10) / 10)
      setComment('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <h3>Reviews ({count})</h3>
        {count > 0 && (
          <div className="reviews-summary">
            <StarRating rating={avg} size={20} />
            <span>{avg} / 5</span>
          </div>
        )}
      </div>

      <form className="review-form" onSubmit={handleSubmit}>
        <p className="review-form-label">Rate this product</p>
        <div className="review-stars-input">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              className={s <= rating ? 'active' : ''}
              onClick={() => setRating(s)}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          placeholder={user ? 'Share your experience...' : 'Sign in to leave a review'}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required={!!user}
          disabled={!user}
          rows={3}
        />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-outline" disabled={submitting || !user}>
          {submitting ? 'Submitting...' : 'Submit Review (+25 pts)'}
        </button>
      </form>

      <div className="reviews-list">
        {reviews.map((r) => (
          <div key={r.id} className="review-card">
            <div className="review-card-header">
              <strong>{r.username}</strong>
              <StarRating rating={r.rating} size={14} />
            </div>
            <p>{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
