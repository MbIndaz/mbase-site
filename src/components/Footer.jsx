import { site } from '../siteConfig'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer on-dark">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <span className="logo-mark">{site.shortName}</span>
          <div>
            <p className="footer-name">{site.name}</p>
            <p className="footer-tag">{site.tagline}</p>
          </div>
        </div>

        <nav className="footer-nav">
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#packages">Packages</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>

      <div className="wrap footer-base">
        <p>
          © {year} {site.name}
        </p>
        {/* TODO: add company registration / VAT number once registered */}
        <p className="footer-legal">[COMPANY DETAILS FOR INSERT]</p>
      </div>
    </footer>
  )
}
