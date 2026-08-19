import { useState, useEffect } from 'react'
import { site } from '../siteConfig'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#work', label: 'Work' },
    { href: '#process', label: 'Process' },
    { href: '#packages', label: 'Packages' },
    { href: '#care', label: 'Care plans' },
  ]

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        <a href="#top" className="logo" aria-label={site.name}>
          <span className="logo-mark">{site.shortName}</span>
          <span className="logo-text">{site.name}</span>
        </a>

        <nav className={`nav ${open ? 'is-open' : ''}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className="nav-cta" onClick={() => setOpen(false)}>
            Start a project
          </a>
        </nav>

        <button
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
