# Studio Site

Marketing site for a Portugal-based web studio selling into Ireland.
Built with React + Vite. Ships as static files — hosts free on Cloudflare
Pages, Vercel, or Netlify.

---

## Running it locally

You need Node.js 18+ installed. Check with `node --version`.

```bash
npm install     # once, after downloading
npm run dev     # starts dev server, usually http://localhost:5173
```

Changes save and reload instantly. `Ctrl+C` in the terminal stops it.

To produce the deployable files:

```bash
npm run build   # output lands in dist/
npm run preview # check the built version before deploying
```

---

## Opening in PyCharm

PyCharm Professional handles JS/React out of the box. On Community Edition
you have limited JS support — it will still work, but you get less
autocomplete. Either way:

1. `File → Open` → select the `studio-site` folder (the one with
   `package.json` in it, not a parent folder)
2. PyCharm detects the npm project automatically
3. Open the terminal tab at the bottom and run `npm install`, then `npm run dev`
4. Ctrl-click the localhost URL to open it

Mark `node_modules` as excluded if indexing feels slow:
right-click the folder → `Mark Directory as → Excluded`.

If JS support feels thin, WebStorm is the JetBrains IDE built for this and
uses the same keymap you already know. VS Code is the free alternative.

---

## What to edit

### `src/siteConfig.js` — start here

Everything you need to fill in lives in this one file, marked
`[FOR INSERT]` with `// TODO` comments:

- Studio name and logo initials
- Email address
- WhatsApp number (see note below)
- Package prices and feature lists
- Process step wording

Set `showWhatsapp: false` to hide the WhatsApp links until you're ready.

### `src/styles/global.css` — colours and fonts

The `:root` block at the top holds every colour and font as a variable.
Change a value there and it updates across the whole site.

| Variable | Current | Used for |
|---|---|---|
| `--ink` | `#10182b` | Dark sections, headings |
| `--paper` | `#f1f0eb` | Page background |
| `--azulejo` | `#1b4b8f` | Primary accent, links, buttons |
| `--signal` | `#00c878` | Terminal success, featured package |
| `--ink-soft` | `#5b6474` | Secondary text |

### `src/components/Work.jsx`

Three placeholder project cards. Replace with real work as you get it.
Do not invent client names — Irish SMB owners talk to each other, and an
honest "concept piece" label costs you nothing.

Add screenshots to `public/work/` and swap out the `.thumb-placeholder`
div for an `<img>`.

---

## Themes

All colours come from a handful of CSS custom properties defined in
`src/styles/holo.css` (`--accent-rgb`, `--accent`, `--accent-soft`, `--bg`,
`--surface`, `--border`, `--text`, `--text-soft`, `--success`). A theme only
overrides those tokens, so a seasonal look (Halloween, Christmas) is a small
block in `src/styles/themes.css`, not a redesign.

**Switch theme:** set `theme` in `src/siteConfig.js` (`'default'`, and later
`'halloween'` or `'christmas'`) and deploy. `main.jsx` writes it to
`<html data-theme="...">` before the first render. No seasonal theme is built
yet; `themes.css` has a commented-out example to copy from.

**Go back to the baseline:** the stable holographic-redesign release is tagged
`v1.0-holo`. To look at it: `git checkout v1.0-holo` (read-only, detached
HEAD; `git checkout main` returns you). To undo a bad deploy quickly, roll
back to the previous deployment in the Cloudflare dashboard.

---

## Making the contact form work

The form is built but not connected. It needs no backend — pick one:

- **Web3Forms** — https://web3forms.com (free tier, no account needed)
- **Formspree** — https://formspree.io (free tier)

Sign up, copy the endpoint URL, paste it into `FORM_ENDPOINT` near the top
of `src/components/Contact.jsx`. Submissions arrive in your email.

---

## Deploying (free)

**The repo is already initialized locally** with one commit. To push it to
GitHub:

1. On github.com, click **New repository**. Name it (e.g. `mbase-site`).
   Do **not** initialize with a README, .gitignore, or license — this
   project already has those, and it'll cause a conflict.
2. GitHub will show you a remote URL. Back in this project's terminal:

   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/mbase-site.git
   git branch -M main
   git push -u origin main
   ```

3. Go to Cloudflare Pages → Create project → connect the repo
4. Build command: `npm run build` — Output directory: `dist`
5. Deploy

Every push to `main` redeploys automatically. You get a free
`yourproject.pages.dev` URL immediately; point a custom domain at it once
you buy one.

Vercel and Netlify work identically if you prefer either.

---

## Notes

- Fonts are self-hosted via `@fontsource`, not loaded from Google. Faster,
  and it avoids sending visitor IPs to a third party — worth mentioning to
  EU clients who care about GDPR.
- Reduced-motion preferences are respected; the terminal animation skips
  to its end state for users who ask for less motion.
- Keyboard focus outlines are in place. Don't remove them.

## Still to do

- [ ] Fill in `siteConfig.js`
- [ ] Connect the contact form endpoint
- [ ] Replace placeholder project cards with real screenshots
- [ ] Buy a domain, set up email forwarding
- [ ] Add a favicon to `public/`
- [ ] Add company registration details to the footer once registered
