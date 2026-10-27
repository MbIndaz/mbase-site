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
  {
    // A real, running project — not a concept. The screenshot is optional:
    // until /public/work/financas-app.jpg exists, the card shows the placeholder.
    id: 5,
    name: 'Finanças',
    type: 'Live app: personal finance',
    note: 'A personal finance app to track income, bills and savings goals, with a spendable balance, monthly history and category charts.',
    tags: ['React', 'Auth', 'Charts', 'Self-hosted'],
    image: '/work/financas-app.jpg',
    optionalImage: true,
    live: true,
  },
]

// For projects flagged optionalImage: probe the file first, so a missing
// screenshot never flashes a broken-image icon. Result per id: 'ok' | 'missing'
// (no entry yet = still checking).
function useOptionalImages(list) {
  const [probed, setProbed] = useState({})

  useEffect(() => {
    let cancelled = false
    list
      .filter((p) => p.optionalImage && p.image)
      .forEach((p) => {
        const probe = new Image()
        const settle = (result) => {
          if (!cancelled) setProbed((prev) => ({ ...prev, [p.id]: result }))
        }
        probe.onload = () => settle('ok')
        probe.onerror = () => settle('missing')
        probe.src = p.image
      })
    return () => {
      cancelled = true
    }
  }, [list])

  return probed
}

export default function Work() {
  const [lightbox, setLightbox] = useState(null)
  const probed = useOptionalImages(projects)
  // Ids whose thumbnail <img> has finished loading (or failed). The reveal
  // animation in holo.css waits for this, so it plays once, on a ready image.
  const [settled, setSettled] = useState(() => new Set())
  const settle = (id) =>
    setSettled((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))

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
          {projects.map((p) => {
            const hasImage =
              p.image && (!p.optionalImage || probed[p.id] === 'ok')
            // Ready = the image is loaded, or we're showing the placeholder
            // because the optional screenshot turned out to be missing.
            const ready = hasImage
              ? settled.has(p.id)
              : !(p.optionalImage && !probed[p.id])
            return (
            <article
              key={p.id}
              className={`work-card${p.live ? ' is-live is-wide' : ''}`}
            >
              {p.live && (
                <span className="work-live">
                  <i aria-hidden="true" />
                  Live · invite-only
                </span>
              )}
              <div
                className={`work-thumb ${hasImage ? 'is-zoomable' : ''}`}
                onClick={() => hasImage && setLightbox(p)}
                role={hasImage ? 'button' : undefined}
                tabIndex={hasImage ? 0 : undefined}
                onKeyDown={(e) => {
                  if (hasImage && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    setLightbox(p)
                  }
                }}
                aria-label={hasImage ? `View ${p.name} full size` : undefined}
                data-ready={ready ? '' : undefined}
              >
                {hasImage ? (
                  <>
                    {/* Same src as the real image, so no extra request —
                        blurred behind the frame to light up the card. */}
                    <img
                      className="thumb-glow"
                      src={p.image}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                    />
                    <div className="thumb-frame">
                      <img
                        className="thumb-img"
                        src={p.image}
                        alt={`${p.name} — ${p.type}`}
                        loading="lazy"
                        onLoad={() => settle(p.id)}
                        onError={() => settle(p.id)}
                      />
                    </div>
                    <span className="thumb-zoom-hint" aria-hidden="true">
                      View
                    </span>
                  </>
                ) : (
                  <div className="thumb-frame is-empty">
                    <div className="thumb-placeholder">
                      <span>Screenshot</span>
                    </div>
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
            )
          })}
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