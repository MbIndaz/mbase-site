import { steps } from '../siteConfig'
import './Process.css'

export default function Process() {
  return (
    <section className="section process on-dark" id="process">
      <div className="wrap">
        <div className="process-head">
          <div>
            <span className="eyebrow">How it works</span>
            <h2 className="section-title">
              Four steps. No surprises in the invoice.
            </h2>
          </div>
          <p className="process-intro">
            You are dealing with the people building your site, not an
            account manager passing messages along.
          </p>
        </div>

        <ol className="steps">
          {steps.map((s) => (
            <li key={s.n} className="step">
              <span className="step-n">{s.n}</span>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-body">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
