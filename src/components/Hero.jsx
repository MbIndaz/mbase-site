import { useState, useEffect } from 'react'
import { site, deployLines } from '../siteConfig'
import './Hero.css'

/* The terminal is the signature element: it shows what the studio
   actually does (ships sites) instead of describing it. */
function DeployTerminal() {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setVisible(deployLines.length)
      return
    }

    let i = 0
    const tick = () => {
      i += 1
      setVisible(i)
      if (i < deployLines.length) {
        // Slower pause before the final "live" line lands
        const delay = i === deployLines.length - 1 ? 700 : 420
        timer = setTimeout(tick, delay)
      }
    }
    let timer = setTimeout(tick, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="terminal" aria-hidden="true">
      <div className="terminal-bar">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="terminal-title">deploy — bash</span>
      </div>
      <div className="terminal-body">
        {deployLines.slice(0, visible).map((line, i) => (
          <div key={i} className={`t-line t-${line.type}`}>
            {line.text}
          </div>
        ))}
        {visible < deployLines.length && <span className="cursor" />}
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">
            {site.baseCity}, {site.baseCountry} → {site.servingMarket}
          </span>

          <h1 className="hero-title">
            Your business deserves a site that <em>actually</em> works.
          </h1>

          <p className="lede">
            We build fast, modern websites and apps for small businesses in{' '}
            {site.servingMarket} — fixed scope, fixed price, no hidden
            costs. One team, start to finish.
          </p>

          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">
              Start a project
            </a>
            <a href="#packages" className="btn btn-ghost">
              See packages
            </a>
          </div>

          <ul className="hero-facts">
            <li>
              <strong>Fixed pricing</strong>
              <span>Quoted before we start</span>
            </li>
            <li>
              <strong>Built to load fast</strong>
              <span>Performance is not an add-on</span>
            </li>
            <li>
              <strong>You own everything</strong>
              <span>Code, domain, hosting</span>
            </li>
          </ul>
        </div>

        <div className="hero-visual">
          <DeployTerminal />
        </div>
      </div>
    </section>
  )
}
