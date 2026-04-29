# Galletta Bros Hauling Website

Single-page marketing site for Galletta Bros Hauling, Old Greenwich, CT. Static HTML + CSS + vanilla JS, GSAP via CDN. No build step.

> Live phone: 203-252-0250 · Yelp: https://www.yelp.com/biz/galletta-bros-hauling-old-greenwich

## Run locally

Any static server works.

```bash
# pick one
python3 -m http.server 8000
npx serve .
```

Then open http://localhost:8000.

## Project structure

```
galletta-bros-website/
├── index.html                       single-page site
├── style.css                        all styles, design tokens at the top under :root
├── script.js                        vanilla JS (slider, carousels, hero detection, GSAP scroll inits)
├── PRODUCT.md                       brand brief: register, users, voice, anti-references
├── DESIGN.md                        visual system: tokens, type, motion, components
├── README.md                        this file
├── assets/
│   ├── hero.mp4                     hero background video (placeholder; final from Griff)
│   ├── before-after/
│   │   ├── pairs.json               registry of before/after image pairs
│   │   ├── garage/{before,after}.jpg
│   │   └── shed/{before,after}.png
│   └── services/
│       ├── hauling.jpg
│       ├── pressure-washing.jpg
│       ├── snow.jpg
│       └── moving.jpg
├── tests/
│   └── slider.html                  manual test harness for the before/after slider
├── .claude/
│   └── skills/impeccable/           Impeccable design skill (vendored, project-scoped)
└── docs/superpowers/
    ├── specs/2026-04-27-galletta-bros-redesign-design.md
    └── plans/2026-04-27-galletta-bros-redesign.md
```

## Design system

`PRODUCT.md` and `DESIGN.md` are the source of truth.

- Palette: asphalt black, steel, safety yellow accent, warm-tinted bone for text. No `#000`, no `#fff`.
- Type: Anton (display) · Hanken Grotesk (body) · JetBrains Mono (labels and numerals). All loaded from Google Fonts.
- Motion: GSAP entrance fade-up on `[data-anim]` elements; hero parallax; SVG pin drop on the service-area map. All easings are `expo.out`. Honors `prefers-reduced-motion`.
- No side-stripe borders, no gradient text, no glassmorphism, no em dashes (Impeccable absolute bans).

## Adding a before/after pair

1. Drop the matched photos into `assets/before-after/<slug>/before.jpg` and `assets/before-after/<slug>/after.jpg`.
2. Add an entry to `assets/before-after/pairs.json`:

```json
{ "slug": "kitchen", "label": "Kitchen cleanout", "before": "assets/before-after/kitchen/before.jpg", "after": "assets/before-after/kitchen/after.jpg" }
```

3. Reload. The new pair shows up in the slider thumbs and marquee automatically.

## Asset gaps (waiting on Griff)

- Final `hero.mp4` (currently the OpenArt placeholder).
- 4 to 6 clearly-paired before/after sets (currently only garage and shed).
- Real photo of the brothers + truck for the About section (currently uses a service photo as placeholder).
- Approval on the 3 Yelp quotes (`<section class="reviews">` in `index.html`) before launch.
- Confirmation that Moving is offered (or remove the fourth service card).
- Decision on the email destination for the Free Quote form (currently `mailto:info@gallettabros.com`).
- Final domain (currently `gallettabros.com` placeholder in the LocalBusiness JSON-LD and Open Graph tags).
- Open Graph share image (`logo.png` is the placeholder; a 1200×630 social card would be better).

## Slider test harness

`tests/slider.html` opens the BeforeAfterSlider component on its own with console assertions. Use it to verify drag, click, and keyboard (Arrow / Home / End) behavior in isolation.

## Hosting

Static. Drag the folder to Netlify, Vercel, Cloudflare Pages, S3, or any static host. No serverless required for v1 (form uses `mailto:`). To accept submissions server-side, swap the `<form action>` for a Formspree endpoint or a serverless function.

## Browser support

- Modern evergreen browsers (Chrome, Edge, Safari, Firefox).
- iOS Safari 15+ for `aspect-ratio`, `inset`, `clamp()`, OKLCH-equivalent palettes.
- Progressive enhancement: if GSAP fails to load, all `[data-anim]` content forces visible. If the hero video fails, a CSS-only fallback animation runs.

## Performance notes

- Hero video uses `preload="metadata"` to avoid eager full-fetch on mobile. Replace with a lower-bitrate file when shipping.
- Images use `loading="lazy"` below the fold.
- Fonts use `display=swap`.
- No bundler, no build step, no JS framework. Total payload is HTML + CSS + ~3 KB JS + GSAP CDN.

## Impeccable

The project includes the Impeccable design skill at `.claude/skills/impeccable/` for use with Claude Code. From this directory, you can invoke design audits with:

```
/impeccable audit
/impeccable critique [section]
/impeccable polish [section]
```

See `.claude/skills/impeccable/SKILL.md` for the full command list.
