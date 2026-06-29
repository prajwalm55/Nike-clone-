import { Link } from 'react-router-dom'

interface Props {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  bgImage: string
}

export default function Hero({ title, subtitle, ctaText, ctaLink, bgImage }: Props) {
  return (
    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <Link to={ctaLink} className="btn btn-white">
          {ctaText}
        </Link>
      </div>
    </section>
  )
}
