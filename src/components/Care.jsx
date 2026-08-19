import { carePlans } from '../siteConfig'
import './Care.css'

export default function Care() {
  return (
    <section className="section care" id="care">
      <div className="wrap">
        <span className="eyebrow">Ongoing support</span>
        <h2 className="section-title">Already live? Keep it that way.</h2>
        <p className="lede">
          A monthly plan for sites that are already built — ours or
          someone else's — covering bug fixes, security updates, and
          keeping things running.
        </p>

        <div className="care-grid">
          {carePlans.map((c) => (
            <article
              key={c.id}
              className={`care-card ${c.featured ? 'is-featured' : ''}`}
            >
              <span className="care-badge">{c.badge}</span>
              <h3 className="care-name">{c.name}</h3>
              <p className="care-subtitle">{c.subtitle}</p>

              <div className="care-price">
                <span className="care-from">from</span>
                <span className="care-amount">{c.price}</span>
                <span className="care-cadence">{c.cadence}</span>
              </div>

              <ul className="care-features">
                {c.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <p className="care-bestfor">
                <span>Best for</span>
                {c.bestFor}
              </p>

              <a
                href="#contact"
                className={`btn ${c.featured ? 'btn-primary' : 'btn-ghost'} care-cta`}
              >
                Start a plan
              </a>
            </article>
          ))}
        </div>

        <p className="care-note">
          A bug fix is something that used to work and stopped. New
          features, redesigns, and content overhauls are scoped and quoted
          separately — a care plan keeps a site healthy, it does not
          replace a project.
        </p>
      </div>
    </section>
  )
}
