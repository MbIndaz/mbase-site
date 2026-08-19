import { useState } from 'react'
import { site } from '../siteConfig'
import './Contact.css'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  /* ───────────────────────────────────────────────────────
     FORM WIRING — currently inactive on purpose.

     When you're ready, sign up for a free form service and
     paste the endpoint below. No backend or server needed.
       • Web3Forms:  https://web3forms.com
       • Formspree:  https://formspree.io
     ─────────────────────────────────────────────────────── */
  const FORM_ENDPOINT = '' // TODO: paste endpoint here

  async function handleSubmit(e) {
    e.preventDefault()

    if (!FORM_ENDPOINT) {
      console.warn('No form endpoint set yet — see Contact.jsx')
      setStatus('error')
      return
    }

    setStatus('sending')
    const data = new FormData(e.target)

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('sent')
      e.target.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section contact" id="contact">
      <div className="wrap contact-inner">
        <div className="contact-copy">
          <span className="eyebrow">Start a project</span>
          <h2 className="section-title">
            Tell us what the business needs.
          </h2>
          <p className="lede">
            Describe the business and what you want the site to do. You will
            get a straight answer on scope, price, and timing — usually within
            one working day.
          </p>

          <ul className="contact-methods">
            <li>
              <span className="cm-label">Email</span>
              <a href={`mailto:${site.email}`} className="cm-value">
                {site.email}
              </a>
            </li>

            {site.showWhatsapp && (
              <li>
                <span className="cm-label">WhatsApp</span>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  className="cm-value"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {site.whatsappDisplay}
                </a>
              </li>
            )}

            <li>
              <span className="cm-label">Based in</span>
              <span className="cm-value">
                {site.baseCity}, {site.baseCountry}
              </span>
            </li>
          </ul>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Your name</label>
            <input id="name" name="name" type="text" required />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>

          <div className="field">
            <label htmlFor="business">Business name</label>
            <input id="business" name="business" type="text" />
          </div>

          <div className="field">
            <label htmlFor="package">What are you after?</label>
            <select id="package" name="package" defaultValue="not-sure">
              <option value="essential">Essential — simple site</option>
              <option value="standard">Standard — semi-custom</option>
              <option value="premium">Premium — custom build</option>
              <option value="app">An app, not a website</option>
              <option value="care">A care plan for an existing site</option>
              <option value="not-sure">Not sure yet</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="message">What does the site need to do?</label>
            <textarea id="message" name="message" rows="4" required />
          </div>

          <button
            type="submit"
            className="btn btn-primary form-submit"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending…' : 'Send enquiry'}
          </button>

          {status === 'sent' && (
            <p className="form-msg form-ok">
              Sent. You will hear back within one working day.
            </p>
          )}
          {status === 'error' && (
            <p className="form-msg form-err">
              The form is not connected yet. Email {site.email} in the
              meantime.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
