// ─────────────────────────────────────────────────────────────
//  EDIT EVERYTHING HERE.
//  This is the only file you need to touch to change your
//  business details. Components read from this.
// ─────────────────────────────────────────────────────────────

export const site = {
  // --- Identity -------------------------------------------------
  // Working name — swap freely, this is the only place it lives.
  // Run the legal checks (see README) before treating it as final.
  name: 'MBuilt',
  shortName: 'MB',
  tagline: 'Websites and apps for Irish businesses, built in Portugal.',

  // --- Contact --------------------------------------------------
  // TODO: replace once you buy a domain (see notes)
  email: '[FOR INSERT]',            // e.g. hello@yourstudio.ie

  // TODO: decide on a number — see the phone advice before filling this in
  // Format for the WhatsApp link: country code + number, digits only.
  // Portugal example: '351912345678'
  whatsapp: '[FOR INSERT]',
  whatsappDisplay: '[FOR INSERT]',  // human-readable, e.g. '+351 912 345 678'

  // Set to false to hide the WhatsApp buttons entirely until you decide
  showWhatsapp: true,

  // --- Location -------------------------------------------------
  baseCity: 'Lisbon',
  baseCountry: 'Portugal',
  servingMarket: 'Ireland',
}

// --- Packages (mirrors your PDF) --------------------------------
export const packages = [
  {
    id: 'essential',
    badge: 'Starter',
    name: 'Essential',
    subtitle: 'A clean, professional online presence',
    price: '[FOR INSERT]',
    features: [
      'Up to 5 pages',
      'Mobile-responsive design',
      'Basic on-page SEO',
      'Contact form',
      '1 round of revisions',
    ],
    bestFor: 'Sole traders, tradespeople, small local businesses',
    featured: false,
  },
  {
    id: 'standard',
    badge: 'Most popular',
    name: 'Standard',
    subtitle: 'Semi-custom site built to grow with you',
    price: '[FOR INSERT]',
    features: [
      'Up to 10 pages',
      'Semi-custom design, branded to you',
      'Blog / news section',
      'SEO setup + Analytics',
      '2–3 rounds of revisions',
    ],
    bestFor: 'Growing SMEs, clinics, professional services, restaurants',
    featured: true,
  },
  {
    id: 'premium',
    badge: 'Custom build',
    name: 'Premium',
    subtitle: 'Fully custom platform, built to scale',
    price: '[FOR INSERT]',
    features: [
      'Custom page structure',
      'Fully custom design',
      'E-commerce or booking system',
      'Advanced SEO & performance',
      'Multilingual support',
    ],
    bestFor: 'Established businesses, e-commerce, franchises',
    featured: false,
  },
]

// --- Monthly care plans (bug fixes & upkeep) ---------------------
// Separate from the one-time website packages above — this is a
// recurring retainer for sites already live.
export const carePlans = [
  {
    id: 'basic-care',
    badge: 'Basic',
    name: 'Basic Care',
    subtitle: 'Keeps a live site safe and working',
    price: '[FOR INSERT]',
    cadence: '/month',
    features: [
      'Up to 2 hours of bug fixes',
      'Security & dependency updates',
      'Uptime monitoring',
      'Reply within 3 business days',
    ],
    bestFor: 'Sites that just need to keep running quietly',
    featured: false,
  },
  {
    id: 'standard-care',
    badge: 'Most popular',
    name: 'Standard Care',
    subtitle: 'For sites that change often',
    price: '[FOR INSERT]',
    cadence: '/month',
    features: [
      'Up to 5 hours of bug fixes',
      'Everything in Basic Care',
      'Monthly performance check',
      'Small content updates included',
      'Reply within 1–2 business days',
    ],
    bestFor: 'Active businesses updating content regularly',
    featured: true,
  },
  {
    id: 'priority-care',
    badge: 'Priority',
    name: 'Priority Care',
    subtitle: 'For sites where downtime costs money',
    price: '[FOR INSERT]',
    cadence: '/month',
    features: [
      'Up to 10 hours of bug fixes',
      'Everything in Standard Care',
      'Same-day reply on critical issues',
      'Direct WhatsApp line',
      'Monthly report',
    ],
    bestFor: 'Bookings, e-commerce, anything customer-facing',
    featured: false,
  },
]

// --- Process steps ----------------------------------------------
export const steps = [
  {
    n: '01',
    title: 'We talk',
    body: 'A short call or message. Tell us what the business does and what the site needs to achieve. No jargon, no pitch deck.',
  },
  {
    n: '02',
    title: 'You get a plan',
    body: 'A fixed scope and a fixed price in writing before anything starts. You know exactly what you are paying for.',
  },
  {
    n: '03',
    title: 'We build it',
    body: 'You see progress as it happens, not a surprise reveal at the end. Feedback rounds are built into the process.',
  },
  {
    n: '04',
    title: 'It goes live',
    body: 'Deployed, tested on real devices, and handed over with everything you need to run it. Support after launch if you want it.',
  },
]

// --- Terminal animation lines (the hero signature element) ------
export const deployLines = [
  { text: '$ npm run build', type: 'cmd' },
  { text: 'building for production...', type: 'dim' },
  { text: '✓ 42 modules transformed', type: 'ok' },
  { text: '✓ built in 1.24s', type: 'ok' },
  { text: '$ deploy --prod', type: 'cmd' },
  { text: 'uploading to edge network...', type: 'dim' },
  { text: '✓ live at yourbusiness.ie', type: 'success' },
]
