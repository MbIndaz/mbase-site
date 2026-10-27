import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/* Everything "alive" on the page lives here: the background, scroll
   reveals, 3D tilt, price count-up and the section rail.

   The page is fully readable without any of this. Reveal classes and
   data attributes are added from JS only, and every setup function
   returns a cleanup so React StrictMode's double-mount leaves the DOM
   exactly as it found it. */

const RAIL = [
  { id: 'top', label: 'Top' },
  { id: 'work', label: 'Work' },
  { id: 'process', label: 'Process' },
  { id: 'packages', label: 'Packages' },
  { id: 'care', label: 'Care' },
  { id: 'contact', label: 'Contact' },
]

// cyan, blue, violet, magenta — matches the tokens in holo.css
const PALETTE = [
  [94, 231, 255],
  [110, 162, 255],
  [167, 139, 250],
  [255, 122, 217],
]

const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
const hasFinePointer = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

// Shared cursor position (viewport px) read by the canvas loop
const pointer = { x: -9999, y: -9999 }

/* ─── Scroll pop-in ─────────────────────────────────────── */

function setupReveal() {
  if (prefersReduced() || !('IntersectionObserver' in window)) return

  const undo = []
  const watched = []
  const all = (sel) => [...document.querySelectorAll(sel)]

  const tag = (el, { dir = 'up', d = 0 } = {}) => {
    el.classList.add('fx-r')
    if (dir !== 'up') el.dataset.fx = dir
    el.style.setProperty('--d', `${Math.min(d, 0.7).toFixed(2)}s`)
    watched.push(el)
    undo.push(() => {
      el.classList.remove('fx-r', 'is-in')
      delete el.dataset.fx
      el.style.removeProperty('--d')
    })
  }

  const mark = (el, cls, d = 0) => {
    el.classList.add(cls)
    if (d) el.style.setProperty('--d', `${Math.min(d, 0.9).toFixed(2)}s`)
    watched.push(el)
    undo.push(() => {
      el.classList.remove(cls, 'is-in')
      el.style.removeProperty('--d')
    })
  }

  const stagger = (els, base = 0, step = 0.09, opts) =>
    els.forEach((el, i) => tag(el, { ...opts, d: base + i * step }))

  const splitTitle = (h) => {
    const text = h.textContent.trim()
    h.setAttribute('aria-label', text)
    h.classList.add('fx-title')
    h.textContent = ''
    text.split(/\s+/).forEach((word, i) => {
      if (i) h.appendChild(document.createTextNode(' '))
      const s = document.createElement('span')
      s.className = 'fx-w'
      s.setAttribute('aria-hidden', 'true')
      s.style.setProperty('--i', i)
      s.textContent = word
      h.appendChild(s)
    })
    watched.push(h)
    undo.push(() => {
      h.textContent = text
      h.removeAttribute('aria-label')
      h.classList.remove('fx-title', 'is-in')
    })
  }

  // Hero: staggered entrance on load
  const heroCopy = [
    ...all('.hero .eyebrow'),
    ...all('.hero-title'),
    ...all('.hero .lede'),
    ...all('.hero-actions'),
    ...all('.hero-facts li'),
  ]
  stagger(heroCopy, 0.05, 0.1)
  all('.hero-visual').forEach((el) => tag(el, { dir: 'right', d: 0.3 }))

  // Section furniture
  all('.section').forEach((sec) => mark(sec, 'fx-sec'))
  all('.section .eyebrow, .section .lede, .process-intro, .pkg-note, .care-note').forEach(
    (el) => tag(el)
  )
  all('.section-title').forEach(splitTitle)

  // Grids
  const works = all('.work-card')
  stagger(works, 0.05, 0.09)
  works.forEach((card, i) => {
    const thumb = card.querySelector('.work-thumb')
    if (thumb) mark(thumb, 'fx-scan', 0.3 + Math.min(i * 0.09, 0.7))
  })

  const steps = all('.steps')
  steps.forEach((el) => mark(el, 'fx-line'))
  stagger(all('.step'), 0.35, 0.17)

  stagger(all('.pkg'), 0.05, 0.1)
  stagger(all('.care-card'), 0.05, 0.1)

  // Contact: methods from the left, form from the right
  stagger(all('.contact-methods li'), 0.15, 0.12, { dir: 'left' })
  all('.contact-form').forEach((el) => tag(el, { dir: 'right', d: 0.1 }))

  // 3D tilt only where there is a real mouse
  if (hasFinePointer()) {
    all('.work-card, .pkg, .care-card').forEach((el) => {
      el.classList.add('fx-tilt')
      undo.push(() => {
        el.classList.remove('fx-tilt', 'is-tilting')
        el.style.removeProperty('--rx')
        el.style.removeProperty('--ry')
      })
    })
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        // Also reveal anything already scrolled past (reload mid-page, deep link)
        const passed = !e.isIntersecting && e.boundingClientRect.top < 0
        if (e.isIntersecting || passed) {
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0 }
  )
  watched.forEach((el) => io.observe(el))

  // Prices count up when they appear, then snap back to the exact original text
  const timers = new Set()
  const restore = []
  const countIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        countIO.unobserve(e.target)
        countUp(e.target)
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.5 }
  )

  function countUp(el) {
    const original = el.textContent
    const m = original.match(/^(\D*)([\d.,]+)(.*)$/)
    if (!m) return
    const [, pre, num, post] = m
    const target = parseFloat(num.replace(/,/g, ''))
    if (!Number.isFinite(target)) return
    const grouped = num.includes(',')

    el.style.minWidth = `${el.offsetWidth}px`
    const finish = () => {
      el.textContent = original
      el.style.minWidth = ''
    }
    restore.push(finish)

    const start = performance.now()
    const dur = 1300
    const step = (now) => {
      const t = Math.min((now - start) / dur, 1)
      const v = Math.round(target * (1 - Math.pow(1 - t, 3)))
      el.textContent = pre + (grouped ? v.toLocaleString('en-US') : v) + post
      if (t < 1) {
        const id = requestAnimationFrame(step)
        timers.add(id)
      } else {
        finish()
      }
    }
    const id = requestAnimationFrame(step)
    timers.add(id)
  }

  all('.pkg-amount:not(.pkg-amount-custom), .care-amount').forEach((el) =>
    countIO.observe(el)
  )

  return () => {
    io.disconnect()
    countIO.disconnect()
    timers.forEach(cancelAnimationFrame)
    restore.forEach((fn) => fn())
    undo.forEach((fn) => fn())
  }
}

/* ─── Canvas particle network ───────────────────────────── */

function setupCanvas(canvas) {
  const ctx = canvas && canvas.getContext('2d')
  if (!ctx) return

  const reduced = prefersReduced()
  const isMobile = () => window.innerWidth < 760

  let W = 0
  let H = 0
  let dpr = 1
  let pts = []
  let raf = 0
  let last = 0
  let resizeTimer = 0

  const makePoints = (n) =>
    Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 30, // px per second
      vy: (Math.random() - 0.5) * 30,
      z: 0.35 + Math.random() * 0.65, // depth: 1 is nearest
      c: (Math.random() * PALETTE.length) | 0,
      px: 0,
      py: 0,
    }))

  const fills = PALETTE.map(([r, g, b]) => `rgb(${r},${g},${b})`)
  const BUCKETS = 4
  const buckets = Array.from({ length: BUCKETS }, () => [])

  function draw(dt) {
    ctx.clearRect(0, 0, W, H)
    const sy = window.scrollY
    const linkDist = isMobile() ? 105 : 150
    const link2 = linkDist * linkDist

    for (const p of pts) {
      if (dt) {
        p.x += (p.vx * dt) / 1000
        p.y += (p.vy * dt) / 1000
        if (p.x < 0) p.x += W
        else if (p.x > W) p.x -= W
        if (p.y < 0) p.y += H
        else if (p.y > H) p.y -= H
      }
      // Scroll parallax: nearer points slide faster
      p.px = p.x
      p.py = (((p.y - sy * p.z * 0.18) % H) + H) % H
    }

    // Links between neighbours, batched by opacity so we stroke 4 paths, not hundreds
    buckets.forEach((b) => (b.length = 0))
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].px - pts[j].px
        const dy = pts[i].py - pts[j].py
        const d2 = dx * dx + dy * dy
        if (d2 < link2) {
          const k = Math.min(BUCKETS - 1, Math.floor((1 - d2 / link2) * BUCKETS))
          buckets[k].push(i, j)
        }
      }
    }
    ctx.lineWidth = 1
    buckets.forEach((b, k) => {
      if (!b.length) return
      ctx.strokeStyle = `rgba(110,162,255,${(((k + 1) / BUCKETS) * 0.2).toFixed(3)})`
      ctx.beginPath()
      for (let n = 0; n < b.length; n += 2) {
        ctx.moveTo(pts[b[n]].px, pts[b[n]].py)
        ctx.lineTo(pts[b[n + 1]].px, pts[b[n + 1]].py)
      }
      ctx.stroke()
    })

    // Lines to the cursor
    if (pointer.x > -999) {
      const reach = 175
      for (const p of pts) {
        const dx = p.px - pointer.x
        const dy = p.py - pointer.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < reach) {
          ctx.strokeStyle = `rgba(94,231,255,${((1 - d / reach) * 0.55).toFixed(3)})`
          ctx.beginPath()
          ctx.moveTo(p.px, p.py)
          ctx.lineTo(pointer.x, pointer.y)
          ctx.stroke()
        }
      }
    }

    for (const p of pts) {
      ctx.globalAlpha = 0.3 + 0.6 * p.z
      ctx.fillStyle = fills[p.c]
      ctx.beginPath()
      ctx.arc(p.px, p.py, 0.7 + p.z * 1.1, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  function resize() {
    const nw = window.innerWidth
    const nh = window.innerHeight
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(nw * dpr)
    canvas.height = Math.round(nh * dpr)
    // Rescale instead of regenerating, so phone address-bar resizes don't reshuffle
    if (W && H) {
      pts.forEach((p) => {
        p.x *= nw / W
        p.y *= nh / H
      })
    }
    W = nw
    H = nh
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const want = isMobile() ? 34 : 80
    if (pts.length !== want) pts = makePoints(want)
    if (reduced) draw(0)
  }

  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(resize, 150)
  }

  const loop = (t) => {
    raf = requestAnimationFrame(loop)
    const dt = Math.min(t - last, 50)
    last = t
    draw(dt)
  }
  const start = () => {
    if (raf || reduced) return
    last = performance.now()
    raf = requestAnimationFrame(loop)
  }
  const stop = () => {
    cancelAnimationFrame(raf)
    raf = 0
  }
  const onVisibility = () => (document.hidden ? stop() : start())

  resize()
  start()
  window.addEventListener('resize', onResize)
  document.addEventListener('visibilitychange', onVisibility)

  return () => {
    stop()
    clearTimeout(resizeTimer)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', onVisibility)
  }
}

/* ─── Cursor spotlight + card tilt (one rAF-throttled handler) ── */

const TILT_MAX = { 'work-card': 7, pkg: 9, 'care-card': 8 }

function setupPointer(spot) {
  if (!hasFinePointer() || prefersReduced()) return

  let raf = 0
  let ev = null
  let current = null

  const reset = (el) => {
    el.classList.remove('is-tilting')
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  const frame = () => {
    raf = 0
    if (!ev) return
    const { clientX: x, clientY: y, target } = ev

    if (spot) spot.style.transform = `translate3d(${x}px, ${y}px, 0)`

    const card = target instanceof Element ? target.closest('.fx-tilt') : null
    if (current && current !== card) reset(current)
    if (card) {
      const r = card.getBoundingClientRect()
      const px = (x - r.left) / r.width
      const py = (y - r.top) / r.height
      const cls = Object.keys(TILT_MAX).find((c) => card.classList.contains(c))
      const max = TILT_MAX[cls] || 8
      card.style.setProperty('--ry', `${((px - 0.5) * 2 * max).toFixed(2)}deg`)
      card.style.setProperty('--rx', `${(-(py - 0.5) * 2 * max).toFixed(2)}deg`)
      card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
      card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
      card.classList.add('is-tilting')
    }
    current = card
  }

  const onMove = (e) => {
    if (e.pointerType === 'touch') return
    pointer.x = e.clientX
    pointer.y = e.clientY
    ev = e
    if (spot) spot.classList.add('is-on')
    if (!raf) raf = requestAnimationFrame(frame)
  }

  const onLeave = () => {
    pointer.x = pointer.y = -9999
    ev = null
    if (current) reset(current)
    current = null
    if (spot) spot.classList.remove('is-on')
  }

  const root = document.documentElement
  window.addEventListener('pointermove', onMove, { passive: true })
  root.addEventListener('mouseleave', onLeave)

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('pointermove', onMove)
    root.removeEventListener('mouseleave', onLeave)
    onLeave()
  }
}

/* ─── Scroll progress ───────────────────────────────────── */

function setupProgress(bar) {
  if (!bar) return
  let raf = 0

  const update = () => {
    raf = 0
    const h = document.documentElement
    const max = h.scrollHeight - h.clientHeight
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
    bar.style.transform = `scaleX(${p.toFixed(4)})`
  }
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update)
  }

  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }
}

/* ─── Section rail ──────────────────────────────────────── */

function setupRail(setActive) {
  if (!('IntersectionObserver' in window)) return
  // A zero-height band across the middle of the screen
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
    },
    { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
  )
  RAIL.forEach((r) => {
    const el = document.getElementById(r.id)
    if (el) io.observe(el)
  })
  return () => io.disconnect()
}

/* ─── Component ─────────────────────────────────────────── */

export default function FX() {
  const canvasRef = useRef(null)
  const spotRef = useRef(null)
  const barRef = useRef(null)
  const [active, setActive] = useState('top')

  // Layout effect: tag + hide before first paint so nothing flashes
  useLayoutEffect(() => setupReveal(), [])
  useEffect(() => setupCanvas(canvasRef.current), [])
  useEffect(() => setupPointer(spotRef.current), [])
  useEffect(() => setupProgress(barRef.current), [])
  useEffect(() => setupRail(setActive), [])

  return (
    <>
      <div className="fx-layer" aria-hidden="true">
        <div className="fx-blob b1" />
        <div className="fx-blob b2" />
        <div className="fx-blob b3" />
        <canvas ref={canvasRef} className="fx-canvas" />
        <div ref={spotRef} className="fx-spot" />
      </div>

      <div className="fx-progress" aria-hidden="true">
        <i ref={barRef} />
      </div>

      <nav className="fx-rail" aria-label="Page sections">
        {RAIL.map((r) => (
          <a
            key={r.id}
            href={`#${r.id}`}
            className={active === r.id ? 'is-active' : undefined}
            aria-current={active === r.id ? 'true' : undefined}
          >
            <span className="fx-rail-label">{r.label}</span>
          </a>
        ))}
      </nav>
    </>
  )
}
