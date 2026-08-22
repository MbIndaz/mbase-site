import { packages } from '../siteConfig'
import './Packages.css'

// Clicking a plan's CTA carries the choice over to the contact form
// without a page reload — Contact.jsx listens for this.
function selectPlan(id) {
  window.dispatchEvent(new CustomEvent('mbase-plan-select', { detail: id }))
}

export default function Packages() {
  return (
    <section className="section packages" id="packages">
      <div className="wrap">
        <span className="eyebrow">Packages</span>
        <h2 className="section-title">Pick a starting point.</h2>
        <p className="lede">
          Every package is quoted properly before anything begins. Timelines
          depend on scope and how quickly content and feedback come back — we
          agree them together, in writing.
        </p>

        <div className="pkg-grid">
          {packages.map((p) => (
            <article
              key={p.id}
              className={`pkg ${p.featured ? 'is-featured' : ''}`}
            >
              <span className="pkg-badge">{p.badge}</span>
              <h3 className="pkg-name">{p.name}</h3>
              <p className="pkg-subtitle">{p.subtitle}</p>

              <div className="pkg-price">
                {p.customQuote ? (
                  <span className="pkg-amount pkg-amount-custom">
                    {p.price}
                  </span>
                ) : (
                  <>
                    <span className="pkg-from">from</span>
                    <span className="pkg-amount">{p.price}</span>
                  </>
                )}
              </div>

              <ul className="pkg-features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <p className="pkg-bestfor">
                <span>Best for</span>
                {p.bestFor}
              </p>

              <a
                href="#contact"
                onClick={() => selectPlan(p.id)}
                className={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'} pkg-cta`}
              >
                Get a quote
              </a>
            </article>
          ))}
        </div>

        <p className="pkg-note">
          Hosting, domain, and ongoing maintenance are quoted separately —
          you own all of it. Site already live and just needs upkeep? See{' '}
          <a href="#care">care plans</a> below.
        </p>
      </div>
    </section>
  )
}
