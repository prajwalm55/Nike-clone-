import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import StarRating from '../components/StarRating'

export default function ComparePage() {
  const { items, remove, clear } = useCompare()

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Compare Products</h2>
        <p>Add up to 3 shoes from any product page to compare side by side.</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    )
  }

  const fmt = (p: string) =>
    Number(p).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })

  const rows = [
    { label: 'Price', render: (p: typeof items[0]) => fmt(p.price) },
    { label: 'Category', render: (p: typeof items[0]) => p.category },
    { label: 'Gender', render: (p: typeof items[0]) => p.gender },
    { label: 'Color', render: (p: typeof items[0]) => p.color || '—' },
    { label: 'Rating', render: (p: typeof items[0]) => (
      <StarRating rating={p.average_rating || 0} size={14} />
    )},
    { label: 'Sizes', render: (p: typeof items[0]) => p.sizes.join(', ') },
    { label: 'New', render: (p: typeof items[0]) => p.is_new ? 'Yes' : 'No' },
    { label: 'Featured', render: (p: typeof items[0]) => p.is_featured ? 'Yes' : 'No' },
  ]

  return (
    <div className="compare-page">
      <div className="compare-header">
        <h1>Compare Products</h1>
        <button className="btn btn-outline" onClick={clear}>Clear All</button>
      </div>

      <div className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th />
              {items.map((p) => (
                <th key={p.id}>
                  <button className="compare-remove" onClick={() => remove(p.id)}>×</button>
                  <Link to={`/products/${p.id}`}>
                    <img src={p.image_url} alt={p.name} />
                    <span>{p.name}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="compare-label">{row.label}</td>
                {items.map((p) => (
                  <td key={p.id}>{row.render(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
