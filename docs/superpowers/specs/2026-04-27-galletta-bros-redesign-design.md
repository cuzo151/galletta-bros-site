# Galletta Bros Hauling — Website Redesign Spec

**Date:** 2026-04-27
**Project:** Replace the current "luxury / boutique hotel" design system with a rugged, cinematic single-page site that fits a family-run hauling crew in Old Greenwich, CT.
**Stack (unchanged):** Static HTML / CSS / vanilla JS, GSAP + ScrollTrigger for animation. No framework.

---

## 1. Direction

**Rugged Workwear, cinematic.** Carhartt × local contractor × short-form film. Honest, plain-spoken, photo-led. The opposite of the prior `Playfair Display + gold + glass cards` direction in the existing `DESIGN.md`, which is being replaced by this document.

The pitch in one line: *"Family-run Fairfield County crew, photo-proven before/afters across hauling, pressure washing, and snow — one call solves it."*

---

## 2. Visual System

### 2.1 Color tokens

| Token | Hex | Role |
|---|---|---|
| `--asphalt` | `#0e0e0e` | Primary background |
| `--steel` | `#1a1a1a` | Secondary surface (cards, sections) |
| `--steel-line` | `#2a2a2a` | Borders, dividers |
| `--safety-yellow` | `#f5c518` | Single accent — CTAs, highlights, accent bars |
| `--bone` | `#f5f1e8` | Off-white text, alternate light section bg |
| `--brick` | `#a0392a` | Sparing accent for emphasis (used <5% of surfaces) |
| `--text-primary` | `#ffffff` | Headlines on dark |
| `--text-body` | `#d4d4d4` | Body copy on dark |
| `--text-muted` | `#888888` | Captions, timestamps |

**Constraints:** One accent (yellow). No gold. No deep blue. No glass/blur effects. Brick used only for occasional emphasis.

### 2.2 Typography

- **Display / headlines:** `Anton` (preferred) or `Bebas Neue` (fallback) — heavy condensed sans, all caps, tight tracking, used for section titles and hero headline.
- **Body:** `Inter` (kept from current site) — 16px base, 1.6 line-height, max 65ch.
- **Numerals / labels:** `JetBrains Mono` — used for phone number, hours, "01 / 02 / 03" step counters, small uppercase eyebrow labels.

**Banned:** Playfair Display, Geist, generic serifs, anything decorative or "luxury."

### 2.3 Texture & component rules

- Subtle grain overlay (`background-image` SVG noise at ~3% opacity) on dark surfaces.
- Hard-edge yellow accent bars (3–4px) on the left of cards and section eyebrows.
- Border radius: max 4px. No pill shapes, no glass cards.
- Buttons: solid yellow on black text, square corners, 2px black border on hover, no shadow.
- Sticky mobile bottom-bar: full-width black with yellow phone CTA — visible on all sections except hero.

### 2.4 Motion principles

- GSAP + ScrollTrigger drives all scroll animations.
- Default entrance: `opacity 0 → 1`, `y: 32 → 0`, `x: 0` (or slight `-12 → 0` for left-anchored items), 800ms, `power2.out`.
- Staggered children at 80ms.
- Drag interactions for the before/after slider (pointer events, no library).
- Hardware-accelerated only (`transform`, `opacity`).
- Reduced-motion: `prefers-reduced-motion: reduce` collapses all animations to instant fades.

---

## 3. Page Structure (single long page, no separate service pages)

Anchor nav across the top: `Services · Before & After · How It Works · Areas · Reviews · About · Call`.

### 3.1 Hero

- Full-bleed video background, looping, muted, autoplay, `playsinline`. Source: `assets/hero.mp4` (currently the existing OpenArt video as placeholder; Griff to supply final).
- **Fallback animated hero** (no video required): CSS/Canvas-driven sequence — truck silhouette slides in left-to-right, logo stamps in center, yellow accent bar wipes across, settles to a static composition. Triggered when video fails to load OR `data-no-video` attribute is set on the hero. Built so the page is never empty.
- Black gradient overlay (top→bottom, `rgba(0,0,0,0.3) → rgba(0,0,0,0.7)`) keeps text legible.
- Content: small mono eyebrow ("Old Greenwich · Mon–Sun · 7am–6pm"), bold display headline ("GOT JUNK? / WE'LL HAUL IT."), one-line subhead, two CTAs: primary `CALL 203-252-0250`, secondary `Free Quote ↓` (anchor scroll to form).
- Logo top-left, small.
- Scroll-down chevron at bottom — animates up/down infinitely.

### 3.2 Services Strip

- Eyebrow: `01 — WHAT WE DO`. Title: `FOUR THINGS. DONE RIGHT.`
- 4 cards in a row (collapses to 2-up at 768px, stacked at 480px): **Junk Removal · Pressure Washing · Snow Removal · Moving**.
- Each card: yellow top accent bar, photo from project assets (`mock_service_*.png` placeholders, swap to real Griff photos later), service name in display font, 1-line description, "Learn more" link that scrolls to a deeper services detail block (or to anchor — kept simple for now: just a small description reveal on click).
- Stagger fade-up on scroll.

### 3.3 Before / After

- Eyebrow: `02 — THE WORK`. Title: `BEFORE. AFTER. PROOF.`
- **Interactive drag-to-reveal slider** as the centerpiece:
  - One large pair displayed at a time (16:9 aspect, max-width 1100px).
  - Vertical divider line (yellow, 2px) with circular drag handle at center.
  - User drags handle left/right; "after" image is clipped via CSS `clip-path` (or `inset()`) keyed to handle position.
  - Pointer events (no jQuery/library). Touch-supported.
  - Below the active pair: a row of thumbnail "next pair" chips — clicking swaps the active pair with a fade.
  - Auto-advances to next pair every 8s if user hasn't interacted (cancel on first interaction).
- Asset structure: `assets/before-after/{slug}/before.jpg` and `.../after.jpg` per pair, registered in a `pairs.json` array. Initial seeded with paired assets already in `assets/` (`garage_*`, `shed_*`, etc.). Griff sends additional clearly-paired sets to fill out.
- Marquee strip below: thin scrolling row of small extra before/after thumbnails (purely decorative, slow infinite scroll, paused on hover).

### 3.4 How It Works

- Eyebrow: `03 — HOW IT WORKS`. Title: `THREE STEPS. NO BS.`
- 3 numbered blocks (mono numerals: `01 / 02 / 03`): **Call or text → Free on-site quote → We haul it, often same day**.
- A horizontal yellow line draws across connecting the three numbers as the section enters viewport (GSAP).
- Single CTA below: `CALL 203-252-0250`.

### 3.5 Service Area

- Eyebrow: `04 — AREAS WE COVER`. Title: `FAIRFIELD COUNTY, COVERED.`
- Stylized SVG map of southern Fairfield County (hand-built simple SVG, not Google Maps embed) with 5 named pins: Old Greenwich, Greenwich, Riverside, Stamford, Darien.
- Pins drop in (y: -20 → 0, bounce ease) as section enters viewport, staggered.
- Town names listed alongside the map for SEO.

### 3.6 Real Reviews

- Eyebrow: `05 — REAL REVIEWS`. Title: `STRAIGHT FROM YELP.`
- Carousel of 3–5 hand-picked Yelp quotes, auto-advance every 6s with manual prev/next + swipe.
- Each: 5 yellow stars (animate fill on slide-in), quote, customer first name + last initial + neighborhood, date.
- Yelp logo + `Read all on Yelp →` link to https://www.yelp.com/biz/galletta-bros-hauling-old-greenwich.

### 3.7 Meet the Brothers

- Eyebrow: `06 — WHO WE ARE`. Title: `TWO BROTHERS. ONE TRUCK.`
- 2-column on desktop: left = photo of brothers by truck (Ken Burns slow zoom on scroll-in), right = 3–4 sentence family story in body type.
- Small inline detail: "Family-owned · Old Greenwich · Insured" on a single mono line.

### 3.8 Final CTA + Footer

- Big yellow band: `GOT SOMETHING TO HAUL?` headline + huge phone number + "Free Quote" form to the right.
- Form fields: Name, Phone, What you need hauled (textarea), optional photo upload. Submits to a `mailto:` href as v1 (no backend); upgrade path to Formspree / a serverless endpoint noted as v2.
- Footer: hours (Mon–Sun 7am–6pm), service area list, phone, Yelp link, copyright. All on dark.
- Sticky mobile call-bar appears here last.

---

## 4. File Structure

```
galletta-bros-website/
├── index.html            (rewritten)
├── style.css             (rewritten — new tokens, components, sections)
├── script.js             (rewritten — GSAP init, before/after slider, carousel, sticky bar)
├── DESIGN.md             (replaced by this spec; old file moved to docs/superpowers/specs/legacy/)
├── assets/
│   ├── hero.mp4          (placeholder = current openart video; final from Griff)
│   ├── logo.svg          (vectorize current logo.png if possible, fallback to png)
│   ├── before-after/
│   │   ├── pairs.json    (array of {slug,label,before,after})
│   │   ├── garage/{before,after}.jpg
│   │   └── ...
│   └── services/
│       ├── hauling.jpg
│       ├── pressure-washing.jpg
│       ├── snow.jpg
│       └── moving.jpg
└── docs/superpowers/specs/2026-04-27-galletta-bros-redesign-design.md
```

---

## 5. Open Items / Asset Gaps (for Griff)

1. **Final hero MP4** (truck pulling up, pressure washer arc, or logo reveal). Placeholder video used until received.
2. **Paired before/after photos** — current folders have ~18 before / ~4 after but they're not labeled as pairs. Need 4–6 clearly-matched sets.
3. **Photo of the brothers + truck** for the "About" section.
4. **Real numbers, if any, for "Meet the Brothers"** copy (years in business, towns covered, etc.) — otherwise we keep copy generic.
5. **Confirm Moving** is actually offered (Yelp implied it, folders don't confirm).
6. **Yelp review selections** — we'll pull 3–5 best from the public page; Griff to approve.
7. **Domain + hosting plan** (out of scope for this build, but flagged).

---

## 6. Out of Scope (v1)

- Backend form handling (v1 uses `mailto:`).
- Blog / SEO content beyond the single page.
- Separate service pages (single-page only — confirmed with user).
- E-commerce or scheduling integrations.
- Analytics beyond a basic Plausible/GA snippet (decide later).
- Stats / job-counter section (explicitly dropped by user).

---

## 7. Acceptance Criteria

- [ ] Lighthouse mobile Performance ≥ 85, Accessibility ≥ 95.
- [ ] Hero loads instantly with poster frame even when MP4 hasn't downloaded; never blank.
- [ ] Before/after drag slider works on touch + mouse + keyboard (left/right arrows nudge handle).
- [ ] All sections stack cleanly at 480px / 768px / 1024px / 1440px breakpoints.
- [ ] `prefers-reduced-motion: reduce` disables GSAP entrance and the marquee.
- [ ] Phone CTAs are real `tel:` links; sticky mobile bar visible after hero.
- [ ] No console errors. No layout shift on hero video swap.
