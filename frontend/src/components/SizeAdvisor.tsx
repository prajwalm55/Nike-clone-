import { useState } from 'react'
import { api } from '../api/client'
import type { Product } from '../types'

interface Props {
  product: Product
  onSizeSelect: (size: string) => void
}

const BRANDS = [
  { value: 'nike', label: 'Nike' },
  { value: 'adidas', label: 'Adidas' },
  { value: 'new_balance', label: 'New Balance' },
  { value: 'puma', label: 'Puma' },
]

export default function SizeAdvisor({ product, onSizeSelect }: Props) {
  const [brand, setBrand] = useState('nike')
  const [currentSize, setCurrentSize] = useState('10')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    recommended_size: string
    confidence: number
    fit_note: string
  } | null>(null)

  const handleAdvise = async () => {
    setLoading(true)
    try {
      const advice = await api.sizeAdvisor({
        brand,
        current_size: currentSize,
        product_id: product.id,
      })
      setResult(advice)
      onSizeSelect(advice.recommended_size)
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="size-advisor">
      <h4>Smart Size Advisor</h4>
      <p className="size-advisor-desc">
        Tell us what you currently wear — we'll recommend your Nike size.
      </p>
      <div className="size-advisor-form">
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          {BRANDS.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Your size"
          value={currentSize}
          onChange={(e) => setCurrentSize(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleAdvise}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Find My Size'}
        </button>
      </div>
      {result && (
        <div className="size-advisor-result">
          <div className="size-advisor-rec">
            <span className="rec-size">{result.recommended_size}</span>
            <span className="rec-confidence">{result.confidence}% match</span>
          </div>
          <p>{result.fit_note}</p>
        </div>
      )}
    </div>
  )
}
