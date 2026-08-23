import { useState, useEffect } from 'react'
import { site } from '../siteConfig'
import './Contact.css'

// Plan ids that Packages.jsx / Care.jsx are allowed to preselect.
// Keep this in sync with the option values in the <select> below.
const VALID_PLANS = [
  'essential',
  'standard',
  'premium',
  'app',
  'basic-care',
  'standard-care',
  'priority-care',
]

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [plan, setPlan] = useState('not-sure')

  // Picks up a plan chosen elsewhere on the page (Packages/Care CTAs),
  // and also honours a ?plan=xxx link for direct/shareable URLs.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('plan')
    if (fromUrl && VALID_PLANS.includes(fromUrl)) setPlan(fromUrl)

    const onSelect = (e) => {
      if (VALID_PLANS.includes(e.detail)) setPlan(e.detail)
    }
    window.addEventListener('mbase-plan-select', onSelect)
    return () => window.removeEventListener('mbase-plan-select', onSelect)
  }, [])

  /* ───────────────────────────────────────────────────────
     FORM WIRING — Web3Forms.

     The URL below is fixed and the same for everyone — what makes
     submissions land in YOUR inbox is the access_key hidden field
     rendered in the form further down, pulled from siteConfig.js.
     Get your key at https://web3forms.com (sign up, verify the
     email they send you, copy the key into site.web3formsAccessKey).
     ─────────────────────────────────────────────────────── */
  const FORM_ENDPOINT = 'https://api.web3forms.com/submit'
  const formReady =
    site.web3formsAccessKey && site.web3formsAccessKey !== '[FOR INSERT]'

  async function handleSubmit(e) {
    e.preventDefault()

    if (!formReady) {
      console.warn('No Web3Forms access key set yet — see siteConfig.js')
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
          </ul>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Web3Forms required/optional hidden fields — not shown to
              the visitor, just carried along with the submission. */}
          <input
            type="hidden"
            name="access_key"
            value={site.web3formsAccessKey}
          />
          <input
            type="hidden"
            name="subject"
            value="New enquiry from the MBase site"
          />
          {/* Honeypot: real visitors never see or fill this in (it's
              visually hidden via CSS), so if it arrives filled in,
              Web3Forms silently drops the submission as spam. */}
          <input
            type="checkbox"
            name="botcheck"
            className="hp-field"
            tabIndex="-1"
            autoComplete="off"
          />
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
            <select
              id="package"
              name="package"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              <option value="essential">Essential</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="app">App</option>
              <option value="basic-care">Basic Care</option>
              <option value="standard-care">Standard Care</option>
              <option value="priority-care">Priority Care</option>
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
              {formReady
                ? 'Something went wrong sending that. Please email ' +
                  site.email +
                  ' directly.'
                : `The form isn't connected yet. Email ${site.email} in the meantime.`}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
