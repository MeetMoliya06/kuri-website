# kuri Website

Static marketing and support website for **kuri**, a restaurant ranking app focused on Surat. The site promotes the app, explains the scoring model, and hosts lightweight legal/support pages.

## Overview

kuri helps people build restaurant lists, rank venues across food, ambiance, and presentation, and discover what the Surat community is eating. This website is the public landing page for the app.

The site is built with plain HTML, CSS, and JavaScript. There is no framework build step in this repository.

## Project Structure

```text
.
|-- index.html              # Main landing page
|-- style.css               # Shared styles and responsive layout
|-- app.js                  # Animations, smooth scrolling, and interactions
|-- favicon.svg             # Browser favicon
|-- images/                 # Website imagery and app mockups
|-- privacy/index.html      # Privacy Policy page
|-- terms/index.html        # Terms of Service page
|-- help/index.html         # Help & Support page
|-- design.md               # Design reference notes
|-- AI_PROJECT_HANDOFF.md   # Related app handoff/context document
|-- package-lock.json       # Empty npm lockfile; no package.json is present
```

## Tech Notes

- Static HTML/CSS/JS
- Google Fonts loaded from CDN
- GSAP and ScrollTrigger loaded from CDN
- Lenis smooth scrolling loaded from CDN
- SplitType loaded from CDN
- Local assets are stored in `images/`

Because the animation libraries are loaded from external CDNs, an internet connection is required for the full animated experience.

## Running Locally

You can open `index.html` directly in a browser.

For a local server, use any static file server from the project root:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

The legal and support pages are available at:

```text
/privacy/
/terms/
/help/
```

## Deployment

This site can be deployed to any static hosting provider, including Netlify, Vercel, GitHub Pages, Cloudflare Pages, or a simple object storage bucket.

Recommended publish directory:

```text
.
```

No install or build command is required unless a future `package.json` is added.

## Content Updates

- Main landing page copy lives in `index.html`.
- Shared visual styles live in `style.css`.
- Scroll and animation behavior lives in `app.js`.
- Policy/support copy lives in the matching subfolder `index.html` files.
- App mockup images are referenced from `images/`.

When adding a new page, keep the same folder-based route pattern:

```text
new-page/index.html
```

This keeps URLs clean on static hosts.

## Important Maintenance Notes

- The current App Store and Google Play buttons use placeholder `#` links. Replace them with real store URLs before launch.
- Some pages contain inline styles for page-specific legal/support layouts.
- The site depends on CDN scripts; consider pinning or self-hosting assets if long-term availability is critical.
- `package-lock.json` exists, but there is currently no npm project configuration.
