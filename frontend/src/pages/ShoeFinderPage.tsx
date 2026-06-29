import { useState } from 'react'
import { api } from '../api/client'
import type { Product, ShoeFinderPrefs } from '../types'
import ProductCard from '../components/ProductCard'

const STEPS = [
  {
    key: 'activity',
    title: 'What will you use them for?',
    options: [
      { value: 'running', label: 'Running', icon: '🏃' },
      { value: 'training', label: 'Training', icon: '🏋️' },
      { value: 'lifestyle', label: 'Lifestyle', icon: '👟' },
      { value: 'racing', label: 'Racing', icon: '⚡' },
    ],
  },
  {
    key: 'surface',
    title: 'Where will you wear them?',
    options: [
      { value: 'road', label: 'Road / Street', icon: '🛣️' },
      { value: 'trail', label: 'Trail', icon: '🌲' },
      { value: 'gym', label: 'Gym', icon: '🏢' },
      { value: 'court', label: 'Court', icon: '🏀' },
    ],
  },
  {
    key: 'gender',
    title: 'Who are you shopping for?',
    options: [
      { value: 'men', label: 'Men', icon: '' },
      { value: 'women', label: 'Women', icon: '' },
      { value: 'unisex', label: 'Everyone', icon: '' },
    ],
  },
  {
    key: 'experience',
    title: 'Your experience level?',
    options: [
      { value: 'beginner', label: 'Just starting', icon: '🌱' },
      { value: 'intermediate', label: 'Regular', icon: '💪' },
      { value: 'advanced', label: 'Elite / Pro', icon: '🏆' },
    ],
  },
  {
    key: 'budget',
    title: 'Your budget?',
    options: [
      { value: 'under150', label: 'Under $150', icon: '' },
      { value: '150to200', label: '$150 – $200', icon: '' },
      { value: 'over200', label: '$200+', icon: '' },
    ],
  },
] as const

export default function ShoeFinderPage() {
  const [step, setStep] = useState(0)
  const [prefs, setPrefs] = useState<Partial<ShoeFinderPrefs>>({})
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<Product[]>([])
  const [reasons, setReasons] = useState<Record<number, string>>({})
  const [done, setDone] = useState(false)

  const current = STEPS[step]
  const progress = ((step + (done ? 1 : 0)) / STEPS.length) * 100

  const select = async (value: string) => {
    const key = current.key as keyof ShoeFinderPrefs
    const updated = { ...prefs, [key]: value }
    setPrefs(updated)

    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setLoading(true)
      try {
        const result = await api.shoeFinder(updated as ShoeFinderPrefs)
        setMatches(result.matches)
        setReasons(result.match_reasons)
        setDone(true)
      } finally {
        setLoading(false)
      }
    }
  }

  const reset = () => {
    setStep(0)
    setPrefs({})
    setMatches([])
    setReasons({})
    setDone(false)
  }

  return (
    <div className="shoe-finder-page">
      <div className="shoe-finder-hero">
        <span className="feature-badge">AI-Powered</span>
        <h1>Nike Shoe Finder</h1>
        <p>Answer 5 quick questions — we'll match you with your perfect pair.</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {!done ? (
        <div className="shoe-finder-step">
          <p className="step-count">Step {step + 1} of {STEPS.length}</p>
          <h2>{current.title}</h2>
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : (
            <div className="option-grid">
              {current.options.map((opt) => (
                <button
                  key={opt.value}
                  className="option-card"
                  onClick={() => select(opt.value)}
                >
                  {opt.icon && <span className="option-icon">{opt.icon}</span>}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          )}
          {step > 0 && (
            <button className="btn btn-outline" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
        </div>
      ) : (
        <div className="shoe-finder-results">
          <h2>Your Perfect Matches</h2>
          <p className="results-subtitle">Based on your activity, experience, and budget</p>
          <div className="product-grid">
            {matches.map((p) => (
              <div key={p.id} className="match-card-wrap">
                <ProductCard product={p} />
                {reasons[p.id] && <p className="match-reason">{reasons[p.id]}</p>}
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={reset}>Start Over</button>
        </div>
      )}
    </div>
  )
}
