import { Link } from 'react-router-dom'

const LOOKS = [
  {
    title: 'Street Runner',
    desc: 'Air Max 90 + neutral layers for city miles',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&w=1200',
    tags: ['Lifestyle', 'Running'],
    link: '/products?category=Running',
  },
  {
    title: 'Court Classic',
    desc: 'Jordan 1 Low with bold color blocking',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&w=1200',
    tags: ['Jordan', 'Lifestyle'],
    link: '/products?category=Jordan',
  },
  {
    title: 'Gym Ready',
    desc: 'Metcon trainers built for HIIT and lifts',
    image: 'https://images.pexels.com/photos/19090/pexels-photo-19090.jpeg?auto=compress&w=1200',
    tags: ['Training'],
    link: '/products?category=Training',
  },
  {
    title: 'Weekend Chill',
    desc: 'Cozy Dunk Low vibes for off-duty days',
    image: 'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&w=1200',
    tags: ['Lifestyle'],
    link: '/products?category=Lifestyle',
  },
  {
    title: 'Trail Explorer',
    desc: 'Pegasus Trail for muddy weekend adventures',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
    tags: ['Running', 'Trail'],
    link: '/products?category=Running',
  },
  {
    title: 'Kids Play Day',
    desc: 'Durable kids styles for recess and beyond',
    image: 'https://images.pexels.com/photos/46149/pexels-photo-46149.jpeg?auto=compress&w=1200',
    tags: ['Kids'],
    link: '/kids',
  },
]

export default function LookbookPage() {
  return (
    <>
      <div className="page-hero lookbook-hero">
        <h1>Lookbook</h1>
        <p>Curated outfit inspiration. Shop the vibe, not just the shoe.</p>
      </div>
      <section className="section lookbook-grid">
        {LOOKS.map((look) => (
          <Link key={look.title} to={look.link} className="lookbook-card">
            <img src={look.image} alt={look.title} loading="lazy" />
            <div className="lookbook-card-body">
              <h3>{look.title}</h3>
              <p>{look.desc}</p>
              <div className="lookbook-tags">
                {look.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </>
  )
}
