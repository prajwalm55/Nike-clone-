import { useRef, useState } from 'react'

const FALLBACK =
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&w=800'

interface Props {
  images: string[]
  alt: string
}

export default function Product360Viewer({ images, alt }: Props) {
  const validImages = images.filter(Boolean)
  const [index, setIndex] = useState(0)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startIndex = useRef(0)

  if (validImages.length === 0) {
    return (
      <div className="viewer-360">
        <img src={FALLBACK} alt={alt} />
      </div>
    )
  }

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    startX.current = e.clientX
    startIndex.current = index
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || validImages.length < 2) return
    const delta = e.clientX - startX.current
    const steps = Math.round(delta / 40)
    const next = (startIndex.current - steps) % validImages.length
    setIndex(next < 0 ? validImages.length + next : next)
  }

  const onPointerUp = () => { dragging.current = false }

  return (
    <div className="viewer-360-wrap">
      <div
        className="viewer-360"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <img src={validImages[index]} alt={`${alt} view ${index + 1}`} draggable={false} />
        {validImages.length > 1 && (
          <span className="viewer-360-hint">Drag to rotate 360°</span>
        )}
      </div>
      {validImages.length > 1 && (
        <div className="viewer-360-dots">
          {validImages.map((_, i) => (
            <button
              key={i}
              className={i === index ? 'active' : ''}
              onClick={() => setIndex(i)}
              aria-label={`View angle ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
