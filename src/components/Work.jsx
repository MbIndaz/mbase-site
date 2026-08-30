import { useState, useEffect } from 'react'
import './Work.css'

/* NOTE: These are placeholders for concept pieces you build yourself.
   Swap in real client work as you get it. Do not invent client names —
   an empty-but-honest portfolio beats a fake one, and Irish SMB owners
   talk to each other. */
const projects = [
  {
    id: 1,
    name: 'Nocturne',
    type: 'Concept — restaurant',
    note: 'Menu, bookings, and location for a neighbourhood restaurant.',
    tags: ['React', 'Booking form', 'Mobile-first'],
    image: '/work/nocturne-concept.jpg',
  },
  {
    id: 2,
    name: 'Trueline',
    type: 'Concept — trades',
    note: 'Service pages and quote requests for a local contractor.',
    tags: ['Static', 'SEO', 'Quote form'],
    image: '/work/trueline-concept.jpg',
  },
  {
    id: 3,
    name: 'Kinetic',
    type: 'Concept — clinic',
    note: 'Appointment enquiries and treatment info for a small practice.',
    tags: ['Accessible', 'Multi-page', 'Fast'],
    image: '/work/kinetic-concept.jpg',
  },
  {
    id: 4,
    name: 'Nocturne Club',
    type: 'Concept — app',
    note: 'A booking and loyalty app built as a companion to the Nocturne site.',
    tags: ['React Native', 'Push alerts', 'Offline-ready'],
    image: '/work/nocturne-club-app.jpg',
  },
]

export default function Work() {
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    if (!lightbox) return

    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox])

  return (
    <section className="section work" id="work">
      <div className="wrap">
        <span className="eyebrow">Selected work</span>
        <h2 className="section-title">
          Sites and apps built to be used, not admired.
        </h2>
        <p className="lede">
          Every project starts with what the business needs to happen — a
          booking, a call, an order — and works backwards from there.
        </p>

        <div className="work-grid">
          {projects.map((p) => (
            <article key={p.id} className="work-card">
              <div
                className={`work-thumb ${p.image ? 'is-zoomable' : ''}`}
                onClick={() => p.image && setLightbox(p)}
                role={p.image ? 'button' : undefined}
                tabIndex={p.image ? 0 : undefined}
                onKeyDown={(e) => {
                  if (p.image && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    setLightbox(p)
                  }
                }}
                aria-label={p.image ? `View ${p.name} full size` : undefined}
              >
                {p.image ? (
                  <>
                    <img
                      src={p.image}
                      alt={`${p.name} — ${p.type}`}
                      loading="lazy"
                    />
                    <span className="thumb-zoom-hint" aria-hidden="true">
                      View
                    </span>
                  </>
                ) : (
                  <div className="thumb-placeholder">
                    <span>Screenshot</span>
                  </div>
                )}
              </div>

              <div className="work-meta">
                <span className="work-type">{p.type}</span>
                <h3 className="work-name">{p.name}</h3>
                <p className="work-note">{p.note}</p>
                <ul className="work-tags">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="lightbox"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.name} — enlarged view`}
        >
          <button
            className="lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <figure
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={lightbox.image} alt={`${lightbox.name} — ${lightbox.type}`} />
            <figcaption>
              {lightbox.name} — {lightbox.type}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  )
}