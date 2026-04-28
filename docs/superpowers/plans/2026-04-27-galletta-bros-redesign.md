# Galletta Bros Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current "luxury / boutique hotel" Galletta Bros site with a rugged, cinematic single-page site (asphalt black + safety yellow) that leans on real before/after photos and a video hero.

**Architecture:** Static site — single `index.html`, single `style.css`, single `script.js`. GSAP + ScrollTrigger via CDN drive scroll animation. The before/after slider, reviews carousel, and fallback hero animation are written from scratch in vanilla JS (no extra deps). Asset pairs for before/after live in `assets/before-after/pairs.json` and are loaded at runtime.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, clip-path), vanilla JS (ES2020), GSAP 3.12 + ScrollTrigger via CDN, Google Fonts (Anton, Inter, JetBrains Mono).

**Spec:** [`docs/superpowers/specs/2026-04-27-galletta-bros-redesign-design.md`](../specs/2026-04-27-galletta-bros-redesign-design.md)

**Testing approach (static site):** No JS test runner. Each task ends with **manual verification in a browser** — open `index.html`, check the listed behaviors at listed viewport widths, watch the console for errors. The before/after slider gets a tiny `tests/slider.html` harness with a couple of asserted behaviors. Frequent commits after each task.

---

## File Structure

```
galletta-bros-website/
├── index.html                                  (rewrite — full page shell + sections)
├── style.css                                   (rewrite — tokens, base, components, sections)
├── script.js                                   (rewrite — init, slider, carousels, sticky bar, fallback hero)
├── DESIGN.md                                   (delete; legacy archived under docs/)
├── tests/
│   └── slider.html                             (new — manual test harness for before/after slider)
├── assets/
│   ├── hero.mp4                                (rename of existing openart video; final from Griff)
│   ├── before-after/
│   │   ├── pairs.json                          (new — registry of paired photos)
│   │   ├── garage/before.jpg, after.jpg        (move from assets/garage_*)
│   │   ├── shed/before.png, after.png          (move from assets/shed_*)
│   │   └── ... (Griff to add more)
│   └── services/
│       ├── hauling.jpg                         (placeholder = current mock_service_truck.png)
│       ├── pressure-washing.jpg                (placeholder = current mock_service_wash.png)
│       ├── snow.jpg                            (placeholder = current mock_service_snow.png)
│       └── moving.jpg                          (placeholder = current mock_service_detail.png)
└── docs/
    └── superpowers/
        ├── specs/
        │   ├── 2026-04-27-galletta-bros-redesign-design.md
        │   └── legacy/
        │       └── DESIGN-luxury-2025.md       (the old DESIGN.md preserved here)
        └── plans/
            └── 2026-04-27-galletta-bros-redesign.md (this file)
```

---

## Task 1: Foundation — archive old design, set up tokens, reset, fonts

**Files:**
- Move: `DESIGN.md` → `docs/superpowers/specs/legacy/DESIGN-luxury-2025.md`
- Create: `style.css` (rewrite — replace existing entirely)
- Modify: `index.html` (clear out and replace `<head>`)

- [ ] **Step 1: Archive the old design system**

```bash
mkdir -p docs/superpowers/specs/legacy
git mv DESIGN.md docs/superpowers/specs/legacy/DESIGN-luxury-2025.md
```

- [ ] **Step 2: Replace `index.html` `<head>` with the new fonts + meta**

Replace the entire current `index.html` with this skeleton (more sections added in later tasks — for now only `<head>` and an empty `<body>` with the script tags):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Galletta Bros Hauling | Junk Removal, Pressure Washing & Snow — Old Greenwich, CT</title>
  <meta name="description" content="Family-run hauling crew serving Old Greenwich, Greenwich, Stamford, Riverside & Darien. Junk removal, pressure washing, snow removal, moving. Call 203-252-0250." />
  <meta name="theme-color" content="#0e0e0e" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="style.css" />

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
  <script src="script.js" defer></script>
</head>
<body>
  <!-- Sections inserted in later tasks -->
</body>
</html>
```

- [ ] **Step 3: Write the foundation `style.css` (tokens + reset + base)**

Replace `style.css` entirely with:

```css
/* ===== TOKENS ===== */
:root {
  --asphalt: #0e0e0e;
  --steel: #1a1a1a;
  --steel-line: #2a2a2a;
  --safety-yellow: #f5c518;
  --safety-yellow-hot: #ffd633;
  --bone: #f5f1e8;
  --brick: #a0392a;

  --text-primary: #ffffff;
  --text-body: #d4d4d4;
  --text-muted: #888888;

  --font-display: 'Anton', 'Bebas Neue', Impact, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  --max-w: 1280px;
  --gutter: clamp(1.25rem, 3vw, 2rem);
  --section-y: clamp(4rem, 9vw, 7rem);
}

/* ===== RESET ===== */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--asphalt);
  color: var(--text-body);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
img, video { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; border: 0; background: none; color: inherit; }

/* Subtle film grain overlay on dark sections */
body::before {
  content: "";
  position: fixed; inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>");
}

/* ===== TYPE ===== */
.display { font-family: var(--font-display); font-weight: 400; letter-spacing: 0.02em; text-transform: uppercase; line-height: 0.95; color: var(--text-primary); }
.eyebrow { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: var(--safety-yellow); display: inline-block; padding-left: 0.75rem; border-left: 3px solid var(--safety-yellow); }
.lead { font-size: 1.125rem; color: var(--text-body); max-width: 60ch; }

h1, h2, h3, h4 { margin: 0; }
p { margin: 0 0 1rem; }
p:last-child { margin-bottom: 0; }

/* ===== LAYOUT ===== */
.container { max-width: var(--max-w); margin: 0 auto; padding: 0 var(--gutter); }
section { padding: var(--section-y) 0; }
.section-head { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 3rem; }
.section-head h2 { font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 5rem); }

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.95rem 1.5rem;
  font-family: var(--font-mono); font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  font-size: 0.875rem;
  border: 2px solid transparent;
  transition: background 150ms ease, color 150ms ease, transform 150ms ease;
}
.btn--primary { background: var(--safety-yellow); color: var(--asphalt); }
.btn--primary:hover { background: var(--safety-yellow-hot); transform: translateY(-1px); }
.btn--ghost { background: transparent; color: var(--text-primary); border-color: var(--text-primary); }
.btn--ghost:hover { background: var(--text-primary); color: var(--asphalt); }
.btn--lg { padding: 1.15rem 2rem; font-size: 1rem; }

/* ===== UTILITY ===== */
.sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}
```

- [ ] **Step 4: Write a placeholder `script.js`**

Replace `script.js` with this (sections will register their own init blocks here in later tasks):

```js
// Galletta Bros — entrypoint
// Each section module registers via init functions called at the bottom.
const GB = {
  init() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
    // Section inits are appended here in later tasks.
  }
};

document.addEventListener('DOMContentLoaded', () => GB.init());
```

- [ ] **Step 5: Verify in browser**

Open `index.html` in a browser. Expected:
- Page loads with black background, no console errors.
- Network tab shows fonts loading from Google Fonts.
- No content yet (empty `<body>`) — that's expected.
- DevTools → Application → root computed styles show `--safety-yellow: #f5c518` etc.
- Run `gsap` in the console — should be defined.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Foundation: archive luxury design, set up rugged tokens, fonts, reset"
```

---

## Task 2: Page shell — anchor nav + sticky mobile call bar

**Files:**
- Modify: `index.html` (insert nav + sticky bar inside `<body>`)
- Modify: `style.css` (append nav + sticky bar styles)

- [ ] **Step 1: Add nav + sticky bar markup**

Insert this inside `<body>` (after the opening tag, before any sections):

```html
<a class="skip-link sr-only" href="#main">Skip to content</a>

<header class="nav" id="nav">
  <a href="#hero" class="nav__brand" aria-label="Galletta Bros home">
    <img src="logo.png" alt="" width="40" height="40" />
    <span class="display">Galletta Bros</span>
  </a>
  <nav class="nav__links" aria-label="Primary">
    <a href="#services">Services</a>
    <a href="#work">Before &amp; After</a>
    <a href="#how">How It Works</a>
    <a href="#areas">Areas</a>
    <a href="#reviews">Reviews</a>
    <a href="#about">About</a>
  </nav>
  <a href="tel:+12032520250" class="btn btn--primary nav__cta">Call 203-252-0250</a>
</header>

<main id="main">
  <!-- Sections inserted in later tasks -->
</main>

<a href="tel:+12032520250" class="call-bar" aria-label="Call Galletta Bros now">
  <span class="call-bar__label">Tap to Call</span>
  <span class="call-bar__num">203-252-0250</span>
</a>
```

- [ ] **Step 2: Append nav + call-bar styles to `style.css`**

```css
/* ===== NAV ===== */
.skip-link:focus { position: fixed; top: 8px; left: 8px; width:auto; height:auto; padding: 0.5rem 1rem; background: var(--safety-yellow); color: var(--asphalt); z-index: 10000; clip:auto; }

.nav {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0.875rem var(--gutter);
  background: rgba(14, 14, 14, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--steel-line);
}
.nav__brand { display: flex; align-items: center; gap: 0.6rem; color: var(--text-primary); }
.nav__brand img { width: 36px; height: 36px; object-fit: contain; }
.nav__brand span { font-size: 1.125rem; letter-spacing: 0.04em; }
.nav__links { display: flex; gap: 1.5rem; }
.nav__links a { font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-body); transition: color 150ms; }
.nav__links a:hover { color: var(--safety-yellow); }
.nav__cta { display: inline-flex; }

@media (max-width: 900px) {
  .nav__links { display: none; }
  .nav__cta { padding: 0.65rem 1rem; font-size: 0.75rem; }
}

/* ===== STICKY MOBILE CALL BAR ===== */
.call-bar {
  display: none;
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 99;
  padding: 0.85rem 1rem;
  background: var(--safety-yellow); color: var(--asphalt);
  align-items: center; justify-content: space-between;
  font-family: var(--font-mono); font-weight: 700; letter-spacing: 0.05em;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.4);
}
.call-bar__label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; }
.call-bar__num { font-size: 1.1rem; }
@media (max-width: 700px) {
  .call-bar { display: flex; }
  body { padding-bottom: 60px; }
}
```

- [ ] **Step 3: Verify in browser**

Open `index.html`. Expected:
- Top nav with logo + brand text on the left, links in the middle, yellow "Call" button right.
- Resize to ≤ 900px: links collapse, only brand + smaller call button remain.
- Resize to ≤ 700px: yellow sticky bar appears at the bottom of the viewport.
- Tab once: skip link appears top-left.
- No console errors.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "Add anchor nav and sticky mobile call bar"
```

---

## Task 3: Hero — video background + CSS fallback animation

**Files:**
- Modify: `index.html` (insert hero markup inside `<main>`)
- Modify: `style.css` (append hero styles + fallback keyframes)
- Modify: `script.js` (append video-load detection that sets `data-no-video` on failure)
- Rename: `assets/2025-10-27_openart-video_bf537937.mp4` → `assets/hero.mp4`

- [ ] **Step 1: Rename hero video for stable filename**

```bash
git mv "assets/2025-10-27_openart-video_bf537937.mp4" "assets/hero.mp4"
```

- [ ] **Step 2: Insert hero markup at the top of `<main>`**

```html
<section class="hero" id="hero">
  <div class="hero__media" aria-hidden="true">
    <video class="hero__video" autoplay loop muted playsinline preload="auto" poster="assets/services/hauling.jpg">
      <source src="assets/hero.mp4" type="video/mp4" />
    </video>
    <div class="hero__fallback" aria-hidden="true">
      <span class="hero__fallback-bar"></span>
      <span class="hero__fallback-truck"></span>
      <span class="hero__fallback-logo">GB</span>
    </div>
  </div>
  <div class="hero__overlay"></div>

  <div class="hero__content container">
    <span class="eyebrow">Old Greenwich · Mon–Sun · 7am–6pm</span>
    <h1 class="display hero__title">
      Got Junk?<br />
      We'll <span class="hero__title-accent">Haul It.</span>
    </h1>
    <p class="lead hero__sub">Family-run hauling crew covering Greenwich, Stamford, Riverside &amp; Darien. Junk removal, pressure washing, snow, moving. One call.</p>
    <div class="hero__ctas">
      <a class="btn btn--primary btn--lg" href="tel:+12032520250">Call 203-252-0250</a>
      <a class="btn btn--ghost btn--lg" href="#quote">Free Quote ↓</a>
    </div>
  </div>

  <a href="#services" class="hero__chevron" aria-label="Scroll to services">
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6" /></svg>
  </a>
</section>
```

- [ ] **Step 3: Append hero styles**

```css
/* ===== HERO ===== */
.hero { position: relative; min-height: 92vh; display: flex; align-items: flex-end; overflow: hidden; padding-bottom: clamp(3rem, 8vw, 6rem); }
.hero__media { position: absolute; inset: 0; }
.hero__video { width: 100%; height: 100%; object-fit: cover; }
.hero__overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, rgba(14,14,14,0.95) 100%); }
.hero__content { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 1.25rem; max-width: 920px; }
.hero__title { font-family: var(--font-display); font-size: clamp(3rem, 11vw, 8rem); color: var(--text-primary); }
.hero__title-accent { color: var(--safety-yellow); }
.hero__sub { color: var(--text-body); }
.hero__ctas { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; }
.hero__chevron { position: absolute; left: 50%; bottom: 1.25rem; transform: translateX(-50%); color: var(--text-body); z-index: 3; opacity: 0.7; animation: chev 2.4s ease-in-out infinite; }
@keyframes chev { 0%,100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, 8px); } }

/* Fallback animation runs only if data-no-video is set on .hero */
.hero__fallback { position: absolute; inset: 0; display: none; background: linear-gradient(135deg, var(--asphalt) 0%, var(--steel) 100%); }
.hero[data-no-video] .hero__video { display: none; }
.hero[data-no-video] .hero__fallback { display: block; }
.hero__fallback-bar { position: absolute; left: -100%; top: 0; bottom: 0; width: 18px; background: var(--safety-yellow); animation: hbar 2.6s cubic-bezier(0.7, 0, 0.3, 1) 0.2s forwards; }
.hero__fallback-truck { position: absolute; bottom: 18%; left: -40%; width: 320px; height: 110px;
  background: linear-gradient(180deg, #2a2a2a 60%, #1a1a1a 60%);
  clip-path: polygon(0 100%, 0 40%, 30% 40%, 35% 0, 70% 0, 75% 40%, 100% 40%, 100% 100%);
  animation: htruck 3.2s cubic-bezier(0.5, 0, 0.2, 1) 0.4s forwards;
}
.hero__fallback-logo { position: absolute; left: 50%; top: 45%; transform: translate(-50%, -50%) scale(0.6); opacity: 0; font-family: var(--font-display); font-size: clamp(5rem, 14vw, 12rem); color: var(--safety-yellow); letter-spacing: 0.06em; animation: hlogo 1.4s cubic-bezier(0.2, 0, 0.1, 1) 1.6s forwards; }
@keyframes hbar { to { left: 100%; } }
@keyframes htruck { 60% { left: 38%; } to { left: 32%; } }
@keyframes hlogo { to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }

@media (max-width: 700px) {
  .hero { min-height: 88vh; }
  .hero__ctas .btn { flex: 1 1 100%; justify-content: center; }
}
```

- [ ] **Step 4: Append video-load detection to `script.js`**

Add inside the `GB` object as a new method, and call it from `init()`:

```js
const GB = {
  init() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
    GB.detectHeroVideo();
  },

  detectHeroVideo() {
    const hero = document.querySelector('.hero');
    const video = hero && hero.querySelector('.hero__video');
    if (!hero || !video) return;
    const fail = () => hero.setAttribute('data-no-video', '');
    video.addEventListener('error', fail);
    // If no source loads within 2.5s, fall back so the page isn't blank.
    setTimeout(() => {
      if (video.readyState < 2) fail();
    }, 2500);
  }
};

document.addEventListener('DOMContentLoaded', () => GB.init());
```

- [ ] **Step 5: Verify in browser**

Open `index.html`. Expected:
- Hero takes most of viewport. Video plays muted, looped.
- "GOT JUNK? WE'LL HAUL IT." in heavy condensed type, "HAUL IT." in yellow.
- Two CTAs underneath: yellow "Call" button + ghost "Free Quote" button.
- Chevron bobs at bottom.
- Manually test fallback: in DevTools, edit the `<source>` to a broken path and reload — within ~2.5s the fallback should appear: yellow bar wipe → truck silhouette slides in → "GB" logo stamps in yellow.
- Restore the source.
- At 480px width: CTAs stack full-width.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Hero: video bg + CSS fallback truck/logo animation + JS detection"
```

---

## Task 4: Services strip — Hauling, Pressure Washing, Snow, Moving

**Files:**
- Modify: `index.html` (insert services section after hero)
- Modify: `style.css` (append services styles)
- Move: `assets/mock_service_truck.png` → `assets/services/hauling.jpg` (copy + rename)
- Move: `assets/mock_service_wash.png` → `assets/services/pressure-washing.jpg`
- Move: `assets/mock_service_snow.png` → `assets/services/snow.jpg`
- Move: `assets/mock_service_detail.png` → `assets/services/moving.jpg`

- [ ] **Step 1: Reorganize service images**

```bash
mkdir -p assets/services
cp assets/mock_service_truck.png assets/services/hauling.jpg
cp assets/mock_service_wash.png assets/services/pressure-washing.jpg
cp assets/mock_service_snow.png assets/services/snow.jpg
cp assets/mock_service_detail.png assets/services/moving.jpg
```

(Originals kept until Griff sends real photos; switch is just a copy for now.)

- [ ] **Step 2: Insert services markup after hero**

```html
<section class="services" id="services">
  <div class="container">
    <header class="section-head">
      <span class="eyebrow">01 — What We Do</span>
      <h2 class="display">Four Things. Done Right.</h2>
    </header>

    <div class="services__grid">
      <article class="service" data-anim>
        <div class="service__photo"><img src="assets/services/hauling.jpg" alt="Galletta Bros junk hauling truck" loading="lazy" /></div>
        <h3 class="service__name display">Junk Removal</h3>
        <p class="service__desc">Garages, basements, attics, estates. We take the heavy stuff so you don't have to.</p>
      </article>

      <article class="service" data-anim>
        <div class="service__photo"><img src="assets/services/pressure-washing.jpg" alt="Pressure washing in progress" loading="lazy" /></div>
        <h3 class="service__name display">Pressure Washing</h3>
        <p class="service__desc">Driveways, patios, siding, decks. High-pressure restorative cleaning.</p>
      </article>

      <article class="service" data-anim>
        <div class="service__photo"><img src="assets/services/snow.jpg" alt="Snow plow truck clearing driveway" loading="lazy" /></div>
        <h3 class="service__name display">Snow Removal</h3>
        <p class="service__desc">Plowing, shoveling, salting. We keep your driveway and walks clear all winter.</p>
      </article>

      <article class="service" data-anim>
        <div class="service__photo"><img src="assets/services/moving.jpg" alt="Galletta Bros moving service" loading="lazy" /></div>
        <h3 class="service__name display">Moving</h3>
        <p class="service__desc">Local moves, single items, full households. Careful crew, honest pricing.</p>
      </article>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Append services styles**

```css
/* ===== SERVICES ===== */
.services { background: var(--asphalt); }
.services__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.service {
  background: var(--steel);
  border-top: 3px solid var(--safety-yellow);
  border-left: 1px solid var(--steel-line);
  border-right: 1px solid var(--steel-line);
  border-bottom: 1px solid var(--steel-line);
  display: flex; flex-direction: column;
  transition: transform 200ms ease, border-color 200ms ease;
}
.service:hover { transform: translateY(-4px); border-top-color: var(--safety-yellow-hot); }
.service__photo { aspect-ratio: 4/3; overflow: hidden; }
.service__photo img { width: 100%; height: 100%; object-fit: cover; transition: transform 400ms ease; }
.service:hover .service__photo img { transform: scale(1.05); }
.service__name { font-size: 1.5rem; padding: 1rem 1.25rem 0.5rem; color: var(--text-primary); }
.service__desc { padding: 0 1.25rem 1.25rem; font-size: 0.95rem; color: var(--text-body); }

@media (max-width: 1024px) { .services__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 540px)  { .services__grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 4: Verify in browser**

Expected:
- Four cards in a row at desktop, dark steel background, yellow top accent bar.
- Hover any card: lifts 4px, image scales slightly.
- Resize to ≤ 1024px: 2x2 grid. ≤ 540px: stacked.
- All four images load (network 200s).
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Services: 4-card strip — Hauling, Pressure Washing, Snow, Moving"
```

---

## Task 5: Before/After drag slider component (single-pair behavior)

**Files:**
- Create: `tests/slider.html` (manual test harness)
- Modify: `script.js` (append `BeforeAfterSlider` class)
- Modify: `style.css` (append slider styles)

The slider is the most complex interactive piece. Build and verify it standalone in a test harness *before* wiring it into the homepage (next task).

- [ ] **Step 1: Append slider class to `script.js`**

Add to `script.js` (above `document.addEventListener`):

```js
class BeforeAfterSlider {
  constructor(root) {
    this.root = root;
    this.afterEl = root.querySelector('[data-after]');
    this.handleEl = root.querySelector('[data-handle]');
    this.value = 50; // 0..100, percentage from left where the divider sits
    this._onMove = this._onMove.bind(this);
    this._onUp = this._onUp.bind(this);
    this._bind();
    this._set(this.value);
  }

  _bind() {
    const start = (e) => {
      e.preventDefault();
      this.dragging = true;
      this.root.classList.add('is-dragging');
      window.addEventListener('pointermove', this._onMove);
      window.addEventListener('pointerup', this._onUp);
      this._onMove(e);
    };
    this.handleEl.addEventListener('pointerdown', start);
    this.root.addEventListener('pointerdown', start);
    // Keyboard
    this.root.tabIndex = 0;
    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { this._set(this.value - 5); e.preventDefault(); }
      if (e.key === 'ArrowRight') { this._set(this.value + 5); e.preventDefault(); }
    });
  }

  _onMove(e) {
    if (!this.dragging) return;
    const rect = this.root.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = (x / rect.width) * 100;
    this._set(pct);
  }

  _onUp() {
    this.dragging = false;
    this.root.classList.remove('is-dragging');
    window.removeEventListener('pointermove', this._onMove);
    window.removeEventListener('pointerup', this._onUp);
  }

  _set(pct) {
    pct = Math.max(0, Math.min(100, pct));
    this.value = pct;
    this.afterEl.style.clipPath = `inset(0 0 0 ${pct}%)`;
    this.handleEl.style.left = `${pct}%`;
    this.root.setAttribute('aria-valuenow', String(Math.round(pct)));
  }

  setImages({ before, after, label }) {
    this.root.querySelector('[data-before-img]').src = before;
    this.root.querySelector('[data-after-img]').src = after;
    if (label) this.root.setAttribute('aria-label', `${label} before and after`);
  }
}

window.BeforeAfterSlider = BeforeAfterSlider;
```

- [ ] **Step 2: Append slider styles**

```css
/* ===== BEFORE/AFTER SLIDER ===== */
.ba-slider {
  position: relative;
  aspect-ratio: 16/10;
  background: var(--steel);
  overflow: hidden;
  user-select: none;
  border: 1px solid var(--steel-line);
}
.ba-slider:focus-visible { outline: 2px solid var(--safety-yellow); outline-offset: 2px; }
.ba-slider img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ba-slider__after { clip-path: inset(0 0 0 50%); }
.ba-slider__handle {
  position: absolute; top: 0; bottom: 0; left: 50%; width: 2px;
  background: var(--safety-yellow);
  transform: translateX(-50%);
  cursor: ew-resize;
  z-index: 2;
}
.ba-slider__handle::after {
  content: ""; position: absolute; top: 50%; left: 50%; width: 44px; height: 44px;
  margin: -22px 0 0 -22px;
  background: var(--safety-yellow); color: var(--asphalt);
  border-radius: 50%;
  display: grid; place-items: center;
  box-shadow: 0 0 0 2px var(--asphalt), 0 4px 18px rgba(0,0,0,0.4);
}
.ba-slider__handle::before {
  content: "‹ ›"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  font-family: var(--font-mono); font-weight: 700; font-size: 0.85rem; color: var(--asphalt);
  z-index: 3; letter-spacing: 0.1em;
}
.ba-slider__label {
  position: absolute; bottom: 0.75rem; padding: 0.3rem 0.6rem;
  font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.18em;
  background: rgba(0,0,0,0.65); color: var(--safety-yellow);
}
.ba-slider__label--before { left: 0.75rem; }
.ba-slider__label--after  { right: 0.75rem; }
.ba-slider.is-dragging { cursor: ew-resize; }
```

- [ ] **Step 3: Create `tests/slider.html` manual harness**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Slider Test Harness</title>
  <link rel="stylesheet" href="../style.css" />
</head>
<body style="padding:2rem">
  <h1 class="display" style="color:#fff">Slider Test</h1>
  <p style="color:#ccc">Drag the handle. Click anywhere on the image. Tab to focus, then arrow keys.</p>
  <div class="ba-slider" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" style="max-width:900px">
    <img data-before-img src="../assets/garage_before.jpg" alt="" />
    <div class="ba-slider__after" data-after>
      <img data-after-img src="../assets/garage_after.jpg" alt="" />
    </div>
    <div class="ba-slider__handle" data-handle></div>
    <span class="ba-slider__label ba-slider__label--before">BEFORE</span>
    <span class="ba-slider__label ba-slider__label--after">AFTER</span>
  </div>

  <p style="color:#888;margin-top:1rem;font-family:'JetBrains Mono',monospace;font-size:0.85rem">
    Console assertions run on load. Open DevTools.
  </p>

  <script src="../script.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const root = document.querySelector('.ba-slider');
      const slider = new BeforeAfterSlider(root);

      // Assertions
      console.assert(root.getAttribute('aria-valuenow') === '50', 'Initial value should be 50');
      slider._set(0);
      console.assert(root.getAttribute('aria-valuenow') === '0', 'Min clamp should be 0');
      slider._set(150);
      console.assert(root.getAttribute('aria-valuenow') === '100', 'Max clamp should be 100');
      slider._set(50);
      console.log('%c✓ slider assertions passed', 'color:#f5c518');
    });
  </script>
</body>
</html>
```

- [ ] **Step 4: Verify the harness**

Open `tests/slider.html` in a browser. Expected:
- Console: `✓ slider assertions passed` in yellow.
- No console errors / failed assertions.
- Drag the handle: "after" image is revealed/hidden as you drag.
- Click anywhere on the slider: handle jumps there.
- Click image, tab away, tab back: focus ring around the slider.
- Arrow Left/Right: handle moves ~5% per keypress.
- Resize narrow: aspect ratio holds; touch drag works on a phone or DevTools touch emulation.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Before/after slider: drag/click/keyboard component + test harness"
```

---

## Task 6: Before/After section — multi-pair carousel + marquee

**Files:**
- Create: `assets/before-after/pairs.json`
- Move: `assets/garage_before.jpg` → `assets/before-after/garage/before.jpg`
- Move: `assets/garage_after.jpg` → `assets/before-after/garage/after.jpg`
- Move: `assets/shed_before.png` → `assets/before-after/shed/before.png`
- Move: `assets/shed_after.png` → `assets/before-after/shed/after.png`
- Modify: `index.html` (insert work section after services)
- Modify: `style.css` (append carousel + marquee styles)
- Modify: `script.js` (append `BeforeAfterCarousel` init that reads pairs.json)

- [ ] **Step 1: Reorganize before/after assets**

```bash
mkdir -p assets/before-after/garage assets/before-after/shed
git mv assets/garage_before.jpg assets/before-after/garage/before.jpg
git mv assets/garage_after.jpg  assets/before-after/garage/after.jpg
git mv assets/shed_before.png   assets/before-after/shed/before.png
git mv assets/shed_after.png    assets/before-after/shed/after.png
```

Update `tests/slider.html` to point at the new paths:

```html
<img data-before-img src="../assets/before-after/garage/before.jpg" alt="" />
...
<img data-after-img src="../assets/before-after/garage/after.jpg" alt="" />
```

- [ ] **Step 2: Create `assets/before-after/pairs.json`**

```json
[
  {
    "slug": "garage",
    "label": "Garage clearout",
    "before": "assets/before-after/garage/before.jpg",
    "after": "assets/before-after/garage/after.jpg"
  },
  {
    "slug": "shed",
    "label": "Shed removal",
    "before": "assets/before-after/shed/before.png",
    "after": "assets/before-after/shed/after.png"
  }
]
```

- [ ] **Step 3: Insert work section markup**

Add after the `</section>` of services:

```html
<section class="work" id="work">
  <div class="container">
    <header class="section-head">
      <span class="eyebrow">02 — The Work</span>
      <h2 class="display">Before. After. Proof.</h2>
    </header>

    <div class="ba-slider" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-label="Before and after">
      <img data-before-img src="" alt="Before" />
      <div class="ba-slider__after" data-after>
        <img data-after-img src="" alt="After" />
      </div>
      <div class="ba-slider__handle" data-handle></div>
      <span class="ba-slider__label ba-slider__label--before">BEFORE</span>
      <span class="ba-slider__label ba-slider__label--after">AFTER</span>
    </div>

    <ul class="work__thumbs" data-work-thumbs aria-label="Choose a transformation"></ul>
  </div>

  <div class="marquee" aria-hidden="true">
    <div class="marquee__track" data-marquee-track></div>
  </div>
</section>
```

- [ ] **Step 4: Append carousel + marquee styles**

```css
/* ===== WORK SECTION ===== */
.work .ba-slider { max-width: 1100px; margin: 0 auto; }
.work__thumbs {
  list-style: none; padding: 0; margin: 1.5rem auto 0; max-width: 1100px;
  display: flex; gap: 0.5rem; flex-wrap: wrap;
}
.work__thumb {
  flex: 0 0 auto;
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background: var(--steel); border: 1px solid var(--steel-line); color: var(--text-body);
  font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase;
  cursor: pointer; transition: all 150ms ease;
}
.work__thumb:hover { color: var(--safety-yellow); border-color: var(--safety-yellow); }
.work__thumb[aria-current="true"] { background: var(--safety-yellow); color: var(--asphalt); border-color: var(--safety-yellow); }
.work__thumb-dot { width: 8px; height: 8px; background: currentColor; border-radius: 0; }

/* ===== MARQUEE ===== */
.marquee { margin-top: 3rem; overflow: hidden; border-block: 1px solid var(--steel-line); padding-block: 1rem; background: var(--steel); }
.marquee__track { display: flex; gap: 1rem; animation: marq 60s linear infinite; will-change: transform; }
.marquee:hover .marquee__track { animation-play-state: paused; }
.marquee__pair { display: grid; grid-template-columns: 200px 200px; gap: 4px; flex: 0 0 auto; }
.marquee__pair img { width: 100%; height: 130px; object-fit: cover; }
@keyframes marq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .marquee__track { animation: none; } }
```

- [ ] **Step 5: Append `BeforeAfterCarousel` init to `script.js`**

```js
GB.initWork = async function () {
  const root = document.querySelector('.work');
  const sliderEl = root && root.querySelector('.ba-slider');
  const thumbsEl = root && root.querySelector('[data-work-thumbs]');
  const marqueeTrack = root && root.querySelector('[data-marquee-track]');
  if (!sliderEl || !thumbsEl) return;

  let pairs = [];
  try {
    const res = await fetch('assets/before-after/pairs.json', { cache: 'no-cache' });
    pairs = await res.json();
  } catch (e) {
    console.warn('[work] failed to load pairs.json', e);
    return;
  }
  if (!pairs.length) return;

  const slider = new BeforeAfterSlider(sliderEl);
  let activeIndex = 0;
  let autoTimer = null;
  let userInteracted = false;

  const setActive = (i, fromUser) => {
    activeIndex = (i + pairs.length) % pairs.length;
    const p = pairs[activeIndex];
    sliderEl.classList.add('is-swap');
    requestAnimationFrame(() => {
      slider.setImages(p);
      sliderEl.classList.remove('is-swap');
    });
    [...thumbsEl.children].forEach((el, idx) => {
      el.setAttribute('aria-current', String(idx === activeIndex));
    });
    if (fromUser) {
      userInteracted = true;
      clearInterval(autoTimer);
    }
  };

  // Build thumbs
  pairs.forEach((p, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'work__thumb';
    btn.type = 'button';
    btn.innerHTML = `<span class="work__thumb-dot"></span>${p.label}`;
    btn.addEventListener('click', () => setActive(i, true));
    li.appendChild(btn);
    thumbsEl.appendChild(li);
  });

  // Build marquee (each pair appears twice for seamless loop)
  if (marqueeTrack) {
    const html = pairs.concat(pairs).map(p => `
      <div class="marquee__pair">
        <img src="${p.before}" alt="" loading="lazy" />
        <img src="${p.after}" alt="" loading="lazy" />
      </div>
    `).join('');
    marqueeTrack.innerHTML = html;
  }

  // Pointer interaction on the slider counts as "user interacted"
  sliderEl.addEventListener('pointerdown', () => {
    userInteracted = true;
    clearInterval(autoTimer);
  });

  setActive(0, false);
  autoTimer = setInterval(() => {
    if (!userInteracted) setActive(activeIndex + 1, false);
  }, 8000);
};
```

Then call it from `init()`:

```js
GB.init = function () {
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  GB.detectHeroVideo();
  GB.initWork();
};
```

- [ ] **Step 6: Verify in browser**

Expected:
- Work section appears after services with eyebrow "02 — The Work".
- Slider shows the garage pair on first load. Drag works.
- Two thumb buttons below: "Garage clearout", "Shed removal" — first is highlighted yellow.
- Click "Shed removal": slider crossfades to shed pair, thumb highlight moves.
- Wait 8s without interacting: it auto-advances to the next pair.
- After interacting (drag or click), auto-advance stops.
- Marquee strip below: small before/after pairs scrolling slowly. Hover pauses.
- No console errors. Network shows `pairs.json` loaded.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Work: multi-pair before/after carousel + marquee strip"
```

---

## Task 7: How It Works — three steps

**Files:**
- Modify: `index.html` (insert section after work)
- Modify: `style.css` (append how-it-works styles)

- [ ] **Step 1: Insert section markup**

```html
<section class="how" id="how">
  <div class="container">
    <header class="section-head">
      <span class="eyebrow">03 — How It Works</span>
      <h2 class="display">Three Steps. No BS.</h2>
    </header>

    <ol class="how__steps">
      <li class="how__step" data-anim>
        <span class="how__num">01</span>
        <h3 class="how__title display">Call or Text</h3>
        <p>Tell us what's gotta go. Photos help. Most quotes take 2 minutes.</p>
      </li>
      <li class="how__step" data-anim>
        <span class="how__num">02</span>
        <h3 class="how__title display">Free On-Site Quote</h3>
        <p>We come look. Honest price, no mystery fees, no pressure.</p>
      </li>
      <li class="how__step" data-anim>
        <span class="how__num">03</span>
        <h3 class="how__title display">We Haul It</h3>
        <p>Same day if we can. Cleaner than we found it, every time.</p>
      </li>
    </ol>

    <div class="how__cta"><a class="btn btn--primary btn--lg" href="tel:+12032520250">Call 203-252-0250</a></div>
  </div>
</section>
```

- [ ] **Step 2: Append how styles**

```css
/* ===== HOW IT WORKS ===== */
.how { background: var(--steel); border-block: 1px solid var(--steel-line); }
.how__steps {
  list-style: none; padding: 0; margin: 0 0 3rem;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;
  position: relative;
}
.how__steps::before {
  content: ""; position: absolute; left: 5%; right: 5%; top: 36px; height: 2px;
  background: linear-gradient(90deg, var(--safety-yellow) 0%, var(--safety-yellow) 100%);
  opacity: 0.25;
  z-index: 0;
}
.how__step { position: relative; z-index: 1; padding: 1rem; background: var(--asphalt); border: 1px solid var(--steel-line); border-left: 3px solid var(--safety-yellow); }
.how__num { font-family: var(--font-mono); font-weight: 700; font-size: 2.25rem; color: var(--safety-yellow); display: block; line-height: 1; margin-bottom: 0.5rem; }
.how__title { font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.5rem; }
.how__cta { text-align: center; }

@media (max-width: 800px) {
  .how__steps { grid-template-columns: 1fr; }
  .how__steps::before { display: none; }
}
```

- [ ] **Step 3: Verify in browser**

Expected:
- Section on a slightly lighter steel background.
- 3 numbered cards in a row, yellow line behind connecting them.
- Each: yellow `01 / 02 / 03` mono numeral, condensed display title, body copy.
- Bottom: yellow "Call" button centered.
- ≤ 800px: cards stack, line hidden.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "How It Works: three-step section"
```

---

## Task 8: Service Area — stylized SVG map

**Files:**
- Modify: `index.html` (insert section after how)
- Modify: `style.css` (append areas styles)

- [ ] **Step 1: Insert areas markup**

The map is a hand-built simplified SVG of southern Fairfield County coastline with 5 named pins. Coordinates approximate west→east along the coast.

```html
<section class="areas" id="areas">
  <div class="container">
    <header class="section-head">
      <span class="eyebrow">04 — Areas We Cover</span>
      <h2 class="display">Fairfield County, Covered.</h2>
    </header>

    <div class="areas__grid">
      <svg class="areas__map" viewBox="0 0 800 320" role="img" aria-label="Map of southern Fairfield County coast">
        <!-- Land -->
        <path d="M 20,40 Q 200,20 360,60 T 700,80 L 780,140 L 780,200 Q 600,210 400,240 T 80,260 Z" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="1"/>
        <!-- Coastline accent -->
        <path d="M 20,40 Q 200,20 360,60 T 700,80 L 780,140" fill="none" stroke="#f5c518" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.5"/>

        <!-- Pins (cx aligned to towns west→east) -->
        <g class="areas__pin" transform="translate(140,150)">
          <circle r="9" fill="#f5c518" />
          <circle r="20" fill="none" stroke="#f5c518" stroke-width="1.5" opacity="0.5"/>
          <text y="-18" text-anchor="middle" fill="#fff" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">GREENWICH</text>
        </g>
        <g class="areas__pin" transform="translate(240,170)">
          <circle r="9" fill="#f5c518" />
          <circle r="20" fill="none" stroke="#f5c518" stroke-width="1.5" opacity="0.5"/>
          <text y="-18" text-anchor="middle" fill="#fff" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">RIVERSIDE</text>
        </g>
        <g class="areas__pin" transform="translate(310,160)">
          <circle r="11" fill="#f5c518" />
          <circle r="24" fill="none" stroke="#f5c518" stroke-width="2" />
          <text y="-22" text-anchor="middle" fill="#f5c518" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">OLD GREENWICH</text>
        </g>
        <g class="areas__pin" transform="translate(440,180)">
          <circle r="9" fill="#f5c518" />
          <circle r="20" fill="none" stroke="#f5c518" stroke-width="1.5" opacity="0.5"/>
          <text y="-18" text-anchor="middle" fill="#fff" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">STAMFORD</text>
        </g>
        <g class="areas__pin" transform="translate(580,170)">
          <circle r="9" fill="#f5c518" />
          <circle r="20" fill="none" stroke="#f5c518" stroke-width="1.5" opacity="0.5"/>
          <text y="-18" text-anchor="middle" fill="#fff" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">DARIEN</text>
        </g>
      </svg>

      <ul class="areas__list">
        <li><span class="areas__dot"></span>Old Greenwich <span class="areas__hq">HQ</span></li>
        <li><span class="areas__dot"></span>Greenwich</li>
        <li><span class="areas__dot"></span>Riverside</li>
        <li><span class="areas__dot"></span>Stamford</li>
        <li><span class="areas__dot"></span>Darien</li>
        <li class="areas__more">…and surrounding Fairfield County</li>
      </ul>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append areas styles**

```css
/* ===== AREAS ===== */
.areas { background: var(--asphalt); }
.areas__grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: center; }
.areas__map { width: 100%; height: auto; max-height: 380px; }
.areas__pin { transform-origin: center; }
.areas__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.9rem; letter-spacing: 0.05em; }
.areas__list li { display: flex; align-items: center; gap: 0.6rem; color: var(--text-body); }
.areas__dot { width: 8px; height: 8px; background: var(--safety-yellow); flex: 0 0 auto; }
.areas__hq { font-size: 0.65rem; padding: 0.1rem 0.4rem; background: var(--safety-yellow); color: var(--asphalt); margin-left: 0.5rem; letter-spacing: 0.15em; }
.areas__more { color: var(--text-muted); font-style: italic; }

@media (max-width: 800px) {
  .areas__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify in browser**

Expected:
- Section on asphalt bg. Left: dark stylized map with 5 yellow pins; "Old Greenwich" pin is larger/brighter (HQ). Right: vertical list of areas in mono type.
- ≤ 800px: list stacks under the map.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Areas: stylized SVG map of Fairfield County coast"
```

---

## Task 9: Reviews — Yelp pull carousel

**Files:**
- Modify: `index.html` (insert reviews section after areas)
- Modify: `style.css` (append reviews styles)
- Modify: `script.js` (append `initReviews` for auto-advance + manual nav)

Reviews are hard-coded HTML for v1 (Yelp doesn't offer a public review API for free). Griff will replace placeholders with the actual quotes he wants.

- [ ] **Step 1: Insert reviews markup**

```html
<section class="reviews" id="reviews">
  <div class="container">
    <header class="section-head">
      <span class="eyebrow">05 — Real Reviews</span>
      <h2 class="display">Straight from Yelp.</h2>
    </header>

    <div class="reviews__carousel" data-reviews>
      <button class="reviews__nav reviews__nav--prev" data-prev aria-label="Previous review">‹</button>

      <ul class="reviews__track" data-track>
        <li class="review" data-active>
          <div class="review__stars" aria-label="5 out of 5 stars">★★★★★</div>
          <blockquote>"Showed up exactly when they said. Cleared out my garage in two hours. Fair price. Hire these guys."</blockquote>
          <cite class="review__cite">— Margaret K. · Riverside · Mar 2026</cite>
        </li>
        <li class="review">
          <div class="review__stars" aria-label="5 out of 5 stars">★★★★★</div>
          <blockquote>"Pressure washed my driveway and patio. Looks brand new. Polite, on-time, and they cleaned up after themselves."</blockquote>
          <cite class="review__cite">— David R. · Greenwich · Feb 2026</cite>
        </li>
        <li class="review">
          <div class="review__stars" aria-label="5 out of 5 stars">★★★★★</div>
          <blockquote>"Plowed our long driveway every storm last winter. Reliable, never had to chase them down."</blockquote>
          <cite class="review__cite">— Sandra L. · Old Greenwich · Jan 2026</cite>
        </li>
      </ul>

      <button class="reviews__nav reviews__nav--next" data-next aria-label="Next review">›</button>
    </div>

    <p class="reviews__source">
      <a href="https://www.yelp.com/biz/galletta-bros-hauling-old-greenwich" target="_blank" rel="noopener">Read all reviews on Yelp →</a>
    </p>
  </div>
</section>
```

- [ ] **Step 2: Append reviews styles**

```css
/* ===== REVIEWS ===== */
.reviews { background: var(--steel); border-block: 1px solid var(--steel-line); }
.reviews__carousel { position: relative; max-width: 800px; margin: 0 auto; padding: 0 3rem; }
.reviews__track { list-style: none; padding: 0; margin: 0; position: relative; min-height: 220px; }
.review { position: absolute; inset: 0; opacity: 0; transition: opacity 400ms ease; pointer-events: none; padding: 1rem; text-align: center; }
.review[data-active] { opacity: 1; pointer-events: auto; position: relative; }
.review__stars { color: var(--safety-yellow); font-size: 1.5rem; letter-spacing: 0.2em; margin-bottom: 1rem; }
.review blockquote { font-size: 1.25rem; line-height: 1.5; color: var(--text-primary); font-style: italic; margin: 0 0 1rem; }
.review__cite { font-style: normal; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); letter-spacing: 0.08em; }
.reviews__nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 44px; height: 44px;
  background: var(--asphalt); color: var(--safety-yellow);
  border: 1px solid var(--steel-line);
  font-size: 1.5rem; line-height: 1;
}
.reviews__nav:hover { color: var(--asphalt); background: var(--safety-yellow); }
.reviews__nav--prev { left: 0; }
.reviews__nav--next { right: 0; }
.reviews__source { text-align: center; margin-top: 2rem; }
.reviews__source a { color: var(--safety-yellow); font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 0.12em; text-transform: uppercase; }
.reviews__source a:hover { text-decoration: underline; }
```

- [ ] **Step 3: Append `initReviews` to `script.js`**

```js
GB.initReviews = function () {
  const root = document.querySelector('[data-reviews]');
  if (!root) return;
  const items = [...root.querySelectorAll('.review')];
  const prevBtn = root.querySelector('[data-prev]');
  const nextBtn = root.querySelector('[data-next]');
  let i = 0;
  let timer = null;

  const show = (next) => {
    items[i].removeAttribute('data-active');
    i = (next + items.length) % items.length;
    items[i].setAttribute('data-active', '');
  };

  prevBtn.addEventListener('click', () => { show(i - 1); restart(); });
  nextBtn.addEventListener('click', () => { show(i + 1); restart(); });

  const restart = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 6000); };
  restart();
};
```

Wire into init:

```js
GB.init = function () {
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  GB.detectHeroVideo();
  GB.initWork();
  GB.initReviews();
};
```

- [ ] **Step 4: Verify in browser**

Expected:
- Reviews section, dark steel bg. Yellow stars, italic quote, mono citation.
- Auto-advances every 6s. Click prev/next: jumps to neighbor and resets the timer.
- Crossfade transition between reviews (~400ms).
- "Read all reviews on Yelp →" link works (opens Yelp in new tab).
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Reviews: Yelp-style carousel with auto-advance + manual nav"
```

---

## Task 10: Meet the Brothers

**Files:**
- Modify: `index.html` (insert section after reviews)
- Modify: `style.css` (append about styles)

- [ ] **Step 1: Insert about markup**

For the photo, use `assets/services/hauling.jpg` as a placeholder until Griff provides the real "brothers + truck" photo.

```html
<section class="about" id="about">
  <div class="container about__grid">
    <figure class="about__photo" data-anim>
      <img src="assets/services/hauling.jpg" alt="The Galletta brothers with their hauling truck" loading="lazy" />
    </figure>
    <div class="about__text">
      <span class="eyebrow">06 — Who We Are</span>
      <h2 class="display about__title">Two Brothers.<br />One Truck.</h2>
      <p>We started Galletta Bros to do honest work in the town we grew up in. We show up when we say we will, we work hard, and we leave it cleaner than we found it.</p>
      <p>If you're calling Galletta Bros, you're calling family — not a faceless company.</p>
      <p class="about__meta">Family-owned · Old Greenwich, CT · Insured</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append about styles**

```css
/* ===== ABOUT (BROTHERS) ===== */
.about { background: var(--asphalt); }
.about__grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 4rem); align-items: center; }
.about__photo { margin: 0; aspect-ratio: 4/5; overflow: hidden; border: 1px solid var(--steel-line); }
.about__photo img { width: 100%; height: 100%; object-fit: cover; transition: transform 8s ease; }
.about__photo:hover img { transform: scale(1.08); }
.about__text { display: flex; flex-direction: column; gap: 1rem; }
.about__title { font-size: clamp(2.25rem, 5vw, 4rem); }
.about__meta { font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 0.12em; color: var(--safety-yellow); margin-top: 0.5rem; }

@media (max-width: 800px) { .about__grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Verify in browser**

Expected:
- Two-column section: photo left (4:5), text right.
- Hover photo: slow Ken Burns zoom over 8s.
- Mono yellow line at bottom: "Family-owned · Old Greenwich, CT · Insured".
- ≤ 800px: stacks (photo on top).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "About: Meet the Brothers section with Ken Burns photo"
```

---

## Task 11: Final CTA + free quote form + footer

**Files:**
- Modify: `index.html` (insert quote section + footer at bottom of `<main>` and after `</main>`)
- Modify: `style.css` (append cta + footer styles)

- [ ] **Step 1: Insert quote section + footer markup**

```html
<section class="quote" id="quote">
  <div class="container quote__grid">
    <div class="quote__pitch">
      <span class="eyebrow eyebrow--dark">07 — Get a Free Quote</span>
      <h2 class="display quote__title">Got Something to Haul?</h2>
      <p>Call us — we usually pick up. Or fill this out and we'll get back to you, same day.</p>
      <a class="quote__phone" href="tel:+12032520250">203-252-0250</a>
      <p class="quote__hours">Mon–Sun · 7am–6pm</p>
    </div>

    <form class="quote__form" action="mailto:info@gallettabros.com" method="post" enctype="text/plain">
      <label class="quote__field">
        <span>Name</span>
        <input type="text" name="name" required />
      </label>
      <label class="quote__field">
        <span>Phone</span>
        <input type="tel" name="phone" required pattern="[0-9 \-\+\(\)]+" />
      </label>
      <label class="quote__field quote__field--full">
        <span>What needs to go?</span>
        <textarea name="details" rows="4" required></textarea>
      </label>
      <label class="quote__field quote__field--full">
        <span>Photo (optional)</span>
        <input type="file" name="photo" accept="image/*" />
      </label>
      <button type="submit" class="btn btn--primary btn--lg quote__submit">Send It</button>
    </form>
  </div>
</section>

</main>

<footer class="footer">
  <div class="container footer__grid">
    <div class="footer__brand">
      <h3 class="display">Galletta Bros</h3>
      <p>Family-run hauling, since the neighborhood needed us.</p>
    </div>
    <div class="footer__col">
      <h4>Services</h4>
      <ul>
        <li>Junk Removal</li>
        <li>Pressure Washing</li>
        <li>Snow Removal</li>
        <li>Moving</li>
      </ul>
    </div>
    <div class="footer__col">
      <h4>Areas</h4>
      <ul>
        <li>Old Greenwich</li>
        <li>Greenwich</li>
        <li>Riverside</li>
        <li>Stamford</li>
        <li>Darien</li>
      </ul>
    </div>
    <div class="footer__col">
      <h4>Contact</h4>
      <ul>
        <li><a href="tel:+12032520250">203-252-0250</a></li>
        <li>Mon–Sun · 7am–6pm</li>
        <li><a href="https://www.yelp.com/biz/galletta-bros-hauling-old-greenwich" target="_blank" rel="noopener">Yelp ↗</a></li>
      </ul>
    </div>
  </div>
  <div class="footer__legal container">
    <span>&copy; 2026 Galletta Bros Hauling · Old Greenwich, CT</span>
  </div>
</footer>
```

- [ ] **Step 2: Append cta + footer styles**

```css
/* ===== QUOTE / CTA ===== */
.quote { background: var(--safety-yellow); color: var(--asphalt); padding-block: clamp(4rem, 9vw, 7rem); }
.quote .eyebrow--dark { color: var(--asphalt); border-color: var(--asphalt); }
.quote__grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 4rem); align-items: center; }
.quote__title { font-size: clamp(2.5rem, 7vw, 5.5rem); color: var(--asphalt); margin: 0.5rem 0 1rem; }
.quote__phone { display: inline-block; font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4rem); color: var(--asphalt); border-bottom: 4px solid var(--asphalt); margin-top: 0.5rem; }
.quote__hours { font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 0.1em; margin-top: 0.5rem; }

.quote__form { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; padding: 1.5rem; background: var(--asphalt); color: var(--text-body); }
.quote__field { display: flex; flex-direction: column; gap: 0.35rem; font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); }
.quote__field--full { grid-column: 1 / -1; }
.quote__field input, .quote__field textarea {
  font-family: var(--font-body); font-size: 1rem; padding: 0.65rem 0.75rem;
  background: var(--steel); color: var(--text-primary);
  border: 1px solid var(--steel-line);
  border-radius: 0;
}
.quote__field input:focus, .quote__field textarea:focus { outline: 2px solid var(--safety-yellow); outline-offset: 0; }
.quote__submit { grid-column: 1 / -1; justify-content: center; }

@media (max-width: 800px) {
  .quote__grid { grid-template-columns: 1fr; }
  .quote__form { grid-template-columns: 1fr; }
}

/* ===== FOOTER ===== */
.footer { background: var(--asphalt); border-top: 1px solid var(--steel-line); padding: 3rem 0 1.5rem; }
.footer__grid { display: grid; grid-template-columns: 2fr repeat(3, 1fr); gap: 2rem; }
.footer__brand h3 { font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.5rem; }
.footer__brand p { color: var(--text-muted); }
.footer__col h4 { font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--safety-yellow); margin-bottom: 0.75rem; }
.footer__col ul { list-style: none; padding: 0; margin: 0; }
.footer__col li { font-size: 0.9rem; margin-bottom: 0.4rem; color: var(--text-body); }
.footer__col a:hover { color: var(--safety-yellow); }
.footer__legal { padding-top: 2rem; margin-top: 2rem; border-top: 1px solid var(--steel-line); font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); letter-spacing: 0.08em; }

@media (max-width: 800px) { .footer__grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 480px) { .footer__grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Verify in browser**

Expected:
- Big yellow CTA band: "Got Something to Haul?" + phone number underlined + form on the right.
- Form fields styled dark inside the yellow band. Submit button = primary yellow style on dark form.
- Footer below: 4 columns at desktop (brand wide, then 3 link cols), stacks on mobile.
- "Free Quote ↓" CTA in the hero scrolls down to this section.
- Submitting the form opens the user's mail client (mailto). That's expected for v1.
- ≤ 800px: form and pitch stack.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "CTA + free quote form + footer"
```

---

## Task 12: Scroll animations + reduced-motion + a11y polish

**Files:**
- Modify: `script.js` (append GSAP scroll-anim init)
- Modify: `style.css` (append minor a11y/anim helpers)

- [ ] **Step 1: Append `initAnimations` to `script.js`**

```js
GB.initAnimations = function () {
  if (!window.gsap) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Generic fade-up for any [data-anim] element
  gsap.utils.toArray('[data-anim]').forEach(el => {
    gsap.from(el, {
      y: 32,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // Hero parallax (subtle)
  gsap.to('.hero__media', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // Map pin drop
  gsap.from('.areas__pin', {
    y: -24, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.areas', start: 'top 70%', toggleActions: 'play none none none' }
  });

  // How-it-works line draw
  gsap.from('.how__steps::before', {
    scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: 'power2.out',
    scrollTrigger: { trigger: '.how', start: 'top 70%', toggleActions: 'play none none none' }
  });
};
```

Wire into init:

```js
GB.init = function () {
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  GB.detectHeroVideo();
  GB.initWork();
  GB.initReviews();
  GB.initAnimations();
};
```

- [ ] **Step 2: Append a11y CSS helpers**

```css
/* Default state for scroll-animated elements (so layout doesn't jump if JS doesn't load) */
@media (prefers-reduced-motion: no-preference) {
  [data-anim] { opacity: 1; }
}
:focus-visible { outline: 2px solid var(--safety-yellow); outline-offset: 2px; }
```

- [ ] **Step 3: Manual a11y + reduced-motion verification**

- [ ] Open the page. Tab through it from the top. Every interactive element should show the yellow focus ring.
- [ ] DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`. Reload. All animations should be effectively instant. Marquee should not scroll. Hero chevron should not bounce.
- [ ] Test screen-reader behavior of the slider with VoiceOver/NVDA: focusing the slider should announce "Before and after, slider, 50". Arrows should change the value announcement.
- [ ] Run Lighthouse mobile audit (DevTools → Lighthouse). Target: Perf ≥ 85, A11y ≥ 95.
- [ ] If a11y < 95, fix flagged issues (missing alt, contrast, label-for) inline.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Animations: GSAP scroll inits + reduced-motion + a11y polish"
```

---

## Task 13: Handoff README + final cleanup

**Files:**
- Create: `README.md`
- Delete: stale `assets/mock_*.png` and `assets/garage_*`/`shed_*` originals (now under `assets/before-after/`)

- [ ] **Step 1: Clean up stale asset files**

```bash
# Delete the old mock_* placeholders now copied into assets/services/
git rm assets/mock_service_truck.png assets/mock_service_wash.png assets/mock_service_snow.png assets/mock_service_detail.png assets/mock_hero.png 2>/dev/null || true
```

If the test harness references the old paths, leave originals in place (the moves earlier in Task 6 already handled the garage/shed pairs).

- [ ] **Step 2: Write `README.md`**

```markdown
# Galletta Bros Hauling — Website

Static single-page site. No build step. Open `index.html` in a browser or serve with any static server.

## Local dev

```bash
# any static server works
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

- `index.html` — full page
- `style.css` — all styles, design tokens at the top under `:root`
- `script.js` — vanilla JS (slider, carousels, hero detection, GSAP scroll inits)
- `assets/hero.mp4` — hero background video (replace with Griff's final video)
- `assets/before-after/pairs.json` — registry of before/after image pairs
- `assets/services/*.jpg` — service card images
- `tests/slider.html` — manual harness for the before/after slider
- `docs/superpowers/specs/2026-04-27-galletta-bros-redesign-design.md` — design spec
- `docs/superpowers/plans/2026-04-27-galletta-bros-redesign.md` — implementation plan

## Adding a before/after pair

1. Drop the two photos into `assets/before-after/<slug>/before.jpg` and `assets/before-after/<slug>/after.jpg`.
2. Add an entry to `assets/before-after/pairs.json`:
   ```json
   { "slug": "kitchen", "label": "Kitchen cleanout", "before": "assets/before-after/kitchen/before.jpg", "after": "assets/before-after/kitchen/after.jpg" }
   ```
3. Reload — the new pair shows up in the slider thumbs and marquee automatically.

## Asset gaps (waiting on Griff)

- Final hero MP4
- 4–6 clearly-paired before/after sets
- Photo of the Galletta brothers + truck
- Approval on the 3 placeholder Yelp quotes (currently in `index.html` `<section class="reviews">`)
- Confirm Moving service stays on the strip

## Hosting

- Deploy as static site to Netlify / Vercel / Cloudflare Pages — drag and drop the folder.
- Form currently uses `mailto:`. To accept submissions server-side, swap the `<form action>` to a Formspree endpoint or a serverless function.
```

- [ ] **Step 3: Final smoke test**

- [ ] Open `index.html` in a fresh browser tab. Scroll top to bottom — every section renders, no broken images, no console errors.
- [ ] Click each anchor in the top nav — page jumps smoothly to the right section.
- [ ] Resize from 1440 → 1024 → 768 → 480. No horizontal scroll. All sections legible.
- [ ] Click hero "Free Quote" — scrolls to the form.
- [ ] Drag the before/after slider through several pairs.
- [ ] Wait 8s on the slider — auto-advances. Click thumb — interaction stops auto.
- [ ] Wait 6s on reviews — advances. Click prev/next — manual works.
- [ ] DevTools → Network: page weighs < 5 MB, < 30 requests on first load.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Cleanup: remove stale mocks, add README handoff notes"
```

---

## Self-Review

**Spec coverage:**
- Direction (rugged + cinematic) → Tasks 1, 3, 12 ✓
- Visual system (colors, type, motion) → Task 1 ✓
- Hero (video + fallback) → Task 3 ✓
- Services strip → Task 4 ✓
- Before/After (drag slider, multi-pair, marquee) → Tasks 5, 6 ✓
- How It Works → Task 7 ✓
- Service Area (SVG map) → Task 8 ✓
- Reviews (Yelp carousel) → Task 9 ✓
- Meet the Brothers → Task 10 ✓
- Final CTA + form + footer → Task 11 ✓
- A11y + reduced motion + Lighthouse acceptance → Task 12 ✓
- File structure (incl. moving DESIGN.md to legacy) → Task 1 ✓
- Open items / asset gaps → README in Task 13 ✓

**Stats counter** is correctly absent (user dropped it in brainstorming).

**Type/method consistency check:**
- `BeforeAfterSlider` class defined in Task 5, used in Tasks 6 (multi-pair) and the test harness ✓
- `GB.detectHeroVideo`, `GB.initWork`, `GB.initReviews`, `GB.initAnimations` all defined and consistently called from `GB.init` ✓
- CSS tokens (`--safety-yellow`, `--asphalt`, `--steel`, etc.) defined in Task 1, used consistently in all later tasks ✓
- Asset paths consistent (`assets/before-after/<slug>/before.jpg` pattern matches both `pairs.json` and the file moves in Task 6) ✓
