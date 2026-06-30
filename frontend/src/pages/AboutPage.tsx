import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <>
      <div className="page-hero about-hero">
        <h1>About This Project</h1>
        <p>A full-stack Nike-inspired e-commerce experience built for learning, portfolios, and interviews.</p>
      </div>

      <section className="section content-page">
        <h2>What is Nike Clone?</h2>
        <p>
          Nike Clone is a production-style demo storefront with a Django REST API backend and a
          React + TypeScript frontend. It mirrors the look and feel of nike.com while adding
          unique features like AI Shoe Finder, Smart Size Advisor, 360° product viewer, and
          membership tiers.
        </p>

        <h2>What makes it unique?</h2>
        <ul className="content-list">
          <li><strong>Shoe Finder</strong> — Quiz-based recommendation engine matching activity, surface, and budget.</li>
          <li><strong>Size Advisor</strong> — Cross-brand size translation with confidence scores.</li>
          <li><strong>Outfit Builder</strong> — Mix lifestyle, running, and Jordan picks into one look.</li>
          <li><strong>Trending Live</strong> — Simulated real-time viewer counts on hot products.</li>
          <li><strong>Sustainability scores</strong> — Eco ratings to guide conscious shopping.</li>
          <li><strong>Membership</strong> — Points, tiers, and perks tied to purchases.</li>
        </ul>

        <h2>Tech at a glance</h2>
        <p>
          Django 4.2 · DRF · PostgreSQL · React 18 · TypeScript · Vite 5 · Docker-ready deployment.
          See the full documentation for versions, setup, and API reference.
        </p>

        <div className="about-cta">
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
          <a
            href="https://github.com/prajwalm55/Nike-clone-"
            className="btn btn-outline"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </section>
    </>
  )
}
