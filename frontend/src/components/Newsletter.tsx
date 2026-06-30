import { useState } from 'react'
import { api } from '../api/client'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await api.subscribeNewsletter(email.trim())
      setStatus('success')
      setMessage(res.detail)
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Subscription failed')
    }
  }

  return (
    <section className="newsletter-section">
      <div className="newsletter-inner">
        <h2>Stay in the loop</h2>
        <p>Get early access to drops, member-only sales, and training tips.</p>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
          />
          <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing up…' : 'Sign Up'}
          </button>
        </form>
        {status === 'success' && <p className="newsletter-msg success">{message}</p>}
        {status === 'error' && <p className="newsletter-msg error">{message}</p>}
      </div>
    </section>
  )
}
