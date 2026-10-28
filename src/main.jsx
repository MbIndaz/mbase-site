import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { site } from './siteConfig'

// Self-hosted fonts — no Google Fonts request, so the site stays fast
// and avoids sending visitor IPs to a third party (matters for EU clients).
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'

import './styles/global.css'
// Dark theme + motion: re-skins everything above using the colour tokens.
import './styles/holo.css'
// Seasonal themes override those tokens; must come after holo.css.
import './styles/themes.css'

// Pick the theme before the first render so there is no flash of the default.
document.documentElement.dataset.theme = site.theme

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
