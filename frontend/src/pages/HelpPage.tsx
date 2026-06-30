import { Link } from 'react-router-dom'

const FAQ = [
  {
    q: 'How do I find my size?',
    a: 'Use the Size Guide page or the Smart Size Advisor on any product detail page. Enter your current brand and size for a recommendation.',
  },
  {
    q: 'Do you offer free shipping?',
    a: 'Yes — orders over $150 ship free. Standard shipping is $8 for smaller orders.',
  },
  {
    q: 'Can I shop without an account?',
    a: 'Yes. Guest carts work via a browser session. Sign in to sync your bag, wishlist, and order history.',
  },
  {
    q: 'How does Nike Membership work?',
    a: 'Earn points on purchases and reviews. Unlock Gold at 500 points and Platinum at 1500 points for exclusive perks.',
  },
  {
    q: 'What is the Shoe Finder?',
    a: 'A 60-second quiz that recommends the best Nike pair based on your activity, surface, experience, and budget.',
  },
  {
    q: 'How do returns work?',
    a: 'This is a demo app — checkout creates a simulated order. In production, you would integrate a returns portal.',
  },
]

export default function HelpPage() {
  return (
    <>
      <div className="page-hero">
        <h1>Help & FAQ</h1>
        <p>Quick answers to common questions. Need more? Browse our guides below.</p>
      </div>

      <section className="section content-page">
        <div className="help-links">
          <Link to="/size-guide" className="help-link-card">Size Guide</Link>
          <Link to="/orders" className="help-link-card">Order Status</Link>
          <Link to="/shoe-finder" className="help-link-card">Shoe Finder</Link>
          <Link to="/member" className="help-link-card">Membership</Link>
        </div>

        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {FAQ.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
