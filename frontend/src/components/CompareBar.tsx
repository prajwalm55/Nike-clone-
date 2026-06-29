import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'

export default function CompareBar() {
  const { items, remove } = useCompare()

  if (items.length === 0) return null

  return (
    <div className="compare-bar">
      <span className="compare-bar-label">Compare ({items.length}/3)</span>
      <div className="compare-bar-items">
        {items.map((p) => (
          <div key={p.id} className="compare-bar-item">
            <img src={p.image_url} alt={p.name} />
            <button onClick={() => remove(p.id)} aria-label="Remove">×</button>
          </div>
        ))}
      </div>
      <Link to="/compare" className="btn btn-primary compare-bar-btn">
        Compare Now
      </Link>
    </div>
  )
}
