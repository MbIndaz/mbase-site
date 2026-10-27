import { useState, useEffect, useRef } from 'react'
import { deployLines } from '../siteConfig'
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

/* Gentle mouse parallax. Writes --nx / --ny (-1..1, smoothed) on the
   .hero element only; the CSS decides how far each layer moves. */
function useHeroParallax(ref) {
  useEffect(() => {
    const hero = ref.current
    if (!hero) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let raf = 0
    let visible = true

    const tick = () => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      hero.style.setProperty('--nx', cx.toFixed(3))
      hero.style.setProperty('--ny', cy.toFixed(3))
      const settled = Math.abs(tx - cx) < 0.002 && Math.abs(ty - cy) < 0.002
      raf = settled ? 0 : requestAnimationFrame(tick)
    }
    const onMove = (e) => {
      if (!visible) return
      tx = (e.clientX / window.innerWidth) * 2 - 1
      ty = (e.clientY / window.innerHeight) * 2 - 1
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(hero)
    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [ref])
}

export default function Hero() {
  const heroRef = useRef(null)
  useHeroParallax(heroRef)

  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="hero-floor" aria-hidden="true">
        <div className="floor-plane">
          <div className="floor-grid" />
        </div>
      </div>

      <div className="wrap hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">Web &amp; app studio</span>

          <h1 className="hero-title">
            Your business deserves a site that <em>actually</em> works.
          </h1>

          <p className="lede">
            We build fast, modern websites and apps for small businesses —
            fixed scope, fixed price, no hidden costs. One team, start to
            finish.
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
          <div className="orbits" aria-hidden="true">
            <div className="orbit o3"><div className="orbit-spin" /></div>
            <div className="orbit o1"><div className="orbit-spin" /></div>
            <div className="orbit o2"><div className="orbit-spin" /></div>
          </div>

          <DeployTerminal />

          <div className="hud-chip c1" aria-hidden="true"><span>SSL active</span></div>
          <div className="hud-chip c2" aria-hidden="true"><span>Mobile-ready</span></div>
          <div className="hud-chip c3" aria-hidden="true"><span>Deployed</span></div>
        </div>
      </div>
    </section>
  )
}
