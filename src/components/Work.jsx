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
    name: '[PROJECT NAME]',
    type: 'Concept — trades',
    note: 'Service pages and quote requests for a local contractor.',
    tags: ['Static', 'SEO', 'Quote form'],
  },
  {
    id: 3,
    name: '[PROJECT NAME]',
    type: 'Concept — clinic',
    note: 'Appointment enquiries and treatment info for a small practice.',
    tags: ['Accessible', 'Multi-page', 'Fast'],
  },
  {
    id: 4,
    name: '[PROJECT NAME]',
    type: 'Concept — app',
    note: 'A booking and loyalty app concept for repeat customers.',
    tags: ['React Native', 'Push alerts', 'Offline-ready'],
  },
]

export default function Work() {
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
              <div className="work-thumb">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={`${p.name} — ${p.type}`}
                    loading="lazy"
                  />
                ) : (
                  // TODO: replace with a real screenshot at
                  // /public/work/project-name.jpg
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
    </section>
  )
}
