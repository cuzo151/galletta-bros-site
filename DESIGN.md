# DESIGN — Galletta Bros Hauling

Visual system for the rugged-cinematic Galletta Bros marketing site. Authoritative reference for tokens, type, color, motion, and component conventions. Implementation lives in `style.css` and `script.js`.

## Aesthetic lane

Rugged workwear × short-form film. Reference physical objects: hand-painted signage on a dump truck, a Carhartt jacket label at dusk, sodium-vapor light on wet asphalt, a 1970s shop manual cover. The opposite of luxury polish or SaaS softness.

## Color

**Strategy:** Restrained + Committed hybrid. Asphalt black dominates 75–80% of surface. Steel and bone provide 15% of secondary surface. Safety yellow is the single accent, used sparingly (≤ 8%) on CTAs, eyebrow rules, accent labels, the final-CTA band. Brick is reserved for emphasis at < 2% (one or two moments only — e.g. a "live" indicator, a special label).

**Tokens (in `style.css :root`):**

| Token | Hex | OKLCH (intent) | Role |
|---|---|---|---|
| `--asphalt` | `#0e0e0e` | `oklch(0.16 0.005 60)` warm-tinted near-black | Primary background |
| `--steel` | `#1a1a1a` | `oklch(0.21 0.005 60)` | Secondary surface |
| `--steel-line` | `#2a2a2a` | `oklch(0.30 0.005 60)` | Borders, dividers |
| `--safety-yellow` | `#f5c518` | `oklch(0.83 0.16 95)` | Accent, primary CTA |
| `--safety-yellow-hot` | `#ffd633` | `oklch(0.88 0.16 95)` | Accent hover |
| `--bone` | `#f5f1e8` | `oklch(0.94 0.012 90)` warm off-white | Primary text on dark, light surfaces |
| `--brick` | `#a0392a` | `oklch(0.50 0.16 28)` | Rare emphasis |
| `--text-primary` | `#f5f1e8` | (= `--bone`) | Headlines on dark |
| `--text-body` | `#cfc8b8` | `oklch(0.81 0.012 90)` warm-tinted body | Body copy on dark |
| `--text-muted` | `#8a857a` | `oklch(0.59 0.012 90)` | Captions, timestamps |

**Rules:**
- Never `#000` or `#fff`. All neutrals tinted toward warm/yellow hue (chroma ~0.005–0.012).
- Bone replaces `#fff` everywhere headline text appears.
- Yellow is load-bearing: when it appears, it means *take action* or *this is the proof*. If yellow is decorative, remove it.
- Brick is reserved for one or two purposeful moments per page maximum.

## Typography

**Stacks:**

- `--font-display: 'Anton', Impact, 'Arial Narrow Bold', sans-serif` — heavy condensed display, all caps, used for headlines and section titles.
- `--font-body: 'Hanken Grotesk', -apple-system, BlinkMacSystemFont, sans-serif` — workhorse humanist grotesk, used for body copy and paragraphs. **Inter is rejected** as a reflex-default per Impeccable.
- `--font-mono: 'JetBrains Mono', 'Courier New', monospace` — used for eyebrow labels, numerals, mono numerics (phone numbers in fine print, "01 / 02 / 03" step counters, hours).

**Why Hanken Grotesk for body:** workhorse grotesk with five weights on Google Fonts. Reads as utilitarian without feeling default. Pairs cleanly with Anton's high contrast.

**Scale (modular, ratio ~1.33, fluid via `clamp()`):**

| Role | Size | Notes |
|---|---|---|
| Hero title | `clamp(3rem, 11vw, 8rem)` | Anton, 0.95 line-height |
| Section title | `clamp(2.5rem, 6vw, 5rem)` | Anton |
| Subhead / `.lead` | `1.125rem` | Hanken, 1.6 line-height, max 70ch |
| Body | `1rem` | Hanken |
| Eyebrow / labels | `0.75rem` | JetBrains Mono, 0.25em letter-spacing, uppercase |
| Caption | `0.85rem` | Mono or body, depending on context |

Light text on dark: line-height bumped +0.1, weight 400 default for body, 700 for emphasis.

**Banned:** Inter, Outfit, Plus Jakarta Sans, DM Sans, Geist, Space Grotesk, Playfair Display, Cormorant, IBM Plex anything, Instrument Sans/Serif. Anton + Hanken Grotesk + JetBrains Mono is the locked palette.

## Spatial system

4pt base unit. Common spacing values: `0.25rem` (4px), `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, `4rem`, `clamp(4rem, 9vw, 7rem)` (section vertical), `clamp(1.25rem, 3vw, 2rem)` (gutter).

**Vary spacing for rhythm.** Section vertical padding is fluid. Hero overrides to `padding: 0 0 clamp(3rem, 8vw, 6rem)` (no top padding because it's full-bleed). The Final-CTA band gets extra vertical breathing room.

**No nested cards.** No card inside a card. If something needs an inner panel, use a horizontal divider or a background-tint band, not a second card.

## Component conventions

### Cards (services grid)

Cards used only when truly the best affordance. The services grid is asymmetric (not 4 uniform cards). Pattern: 1 large feature card + 3 standard cards in a 2-row grid OR a zig-zag row of 4 with subtle size variance. **No side-stripe top/left/right borders on cards.** Use a full 1px border in `--steel-line`, plus a thin yellow underline ON the heading text (`text-decoration: underline; text-decoration-color: var(--safety-yellow); text-decoration-thickness: 3px; text-underline-offset: 6px`) as the accent affordance.

### Sections

`.section` class for opt-in vertical padding. Sections that go full-bleed (hero, marquee, final CTA band) do not get the class.

### Numbered steps (How It Works)

Lead with a huge mono numeral (`01 / 02 / 03`) in `--safety-yellow`. **No left border.** Use a background-tint panel (`background: var(--steel)` instead of `--asphalt`) to differentiate from surrounding sections, plus a horizontal yellow line connecting the three numbers (drawn via SVG or a single absolutely-positioned `::before`).

### Buttons

- `.btn--primary`: yellow background, asphalt text, square corners, weight 700. Hover lifts `translateY(-1px)` and shifts to `--safety-yellow-hot`.
- `.btn--ghost`: transparent, bone text, 2px bone border. Hover inverts (bone bg, asphalt text).
- All buttons use `font-mono` for label text — short labels in JetBrains Mono read as functional, not decorative.

### Eyebrow labels

Small mono uppercase text, `--safety-yellow` color, prefixed with a 2-character section number (`01 — `, `02 — `). The leading number is content, not a graphic; the `— ` separator is a regular hyphen-space-hyphen, **NOT** an em dash.

### Form inputs

Square corners. Steel background. Bone text. `--safety-yellow` `outline` on `:focus-visible` (2px, no offset). Visible `<label>` always above the input — never placeholder-only. Errors appear below the input in `--brick` color, prefixed with a small triangle, linked via `aria-describedby`.

## Motion

**Easing:**

- Default (most entrances): `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). Snappy, decisive.
- Subtle (small UI shifts): `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quart).
- **No bounce, no elastic.** No spring physics that overshoot.

**Durations:**

- 100–150ms — hover/focus feedback
- 200–300ms — state changes (carousel slide, thumb crossfade)
- 400–600ms — entrance reveals (fade-up on scroll)
- 800–1200ms — hero-load choreography only

**Patterns:**

- Page entrance: hero stagger reveals headline (line by line), CTA, sub-copy. 1200ms total.
- Scroll-triggered: each `[data-anim]` element fades + 32px y-shift on viewport entry. Stagger children 80ms.
- Before/after slider: clip-path-based reveal (no width/height animation). Drag handle: pointer-events, 0.15s pointer feedback.
- Marquee: linear infinite translate. Pauses on hover. Disabled at `prefers-reduced-motion`.
- Hero parallax: `yPercent 12%` over scroll, scrubbed.

**Reduced-motion:** All entrance animations collapse to instant. Marquee stops. Hover lifts removed. No skipped functional motion (chevron, focus rings).

## Imagery

Photography is non-negotiable. The plan loads:
- Hero MP4 (placeholder = existing OpenArt video; final from Griff)
- 4 service photos (placeholder = stock or existing mocks; final from Griff)
- ≥ 4 paired before/after sets (existing pairs + Griff additions)
- 1 photo of the brothers + truck

Stock placeholder strategy: use real Unsplash IDs for hauling-truck, pressure-washing, snowplow, moving-truck imagery while waiting on Griff's photos. URL shape: `https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w=1600&q=80`. Picked photos must read as Connecticut residential, not editorial-styled.

Alt text contributes to voice: "Pressure washing a stone driveway in Old Greenwich" beats "pressure washing".

## Layout philosophy

- **Asymmetric over centered-stack.** Hero is left-aligned with content at bottom. Services grid is asymmetric (1 large + 3 small). Final CTA splits 1fr 1fr (pitch + form).
- **Containers used sparingly.** Hero is full-bleed. Marquee is full-bleed. Final-CTA band is full-bleed yellow. Other sections use `.container` for max-width.
- **Mobile-first.** Default to 1-column. Add columns at ≥ 540px / 800px / 1024px. Sticky bottom call-bar appears at ≤ 700px.

## Responsive breakpoints

Token-less by intent (one or two unique breakpoints per component). Common values:

- 480px — phone-stack threshold for buttons / long copy
- 700px — sticky mobile call-bar threshold
- 800px — small-tablet / two-column collapse
- 900px — nav links collapse
- 1024px — desktop layout breakpoint
- 1280px — `--max-w` content cap

## File structure

```
galletta-bros-website/
├── PRODUCT.md             ← (this audience)
├── DESIGN.md              ← (this file)
├── index.html             ← single page
├── style.css              ← tokens + components + sections (no preprocessor)
├── script.js              ← vanilla JS (slider, carousels, hero detection, GSAP scroll anim)
├── assets/
│   ├── hero.mp4
│   ├── before-after/
│   │   ├── pairs.json
│   │   └── <slug>/before.jpg, after.jpg
│   └── services/
│       ├── hauling.jpg, pressure-washing.jpg, snow.jpg, moving.jpg
├── tests/slider.html      ← manual test harness
└── docs/superpowers/      ← spec + plan history
```

## What this design system explicitly rejects

- Pure `#000` / `#fff`
- Side-stripe borders (top/left/right colored stripes on cards)
- Gradient text, glassmorphism, neon glows
- Em dashes
- Inter, Outfit, Geist, Plus Jakarta, Playfair, IBM Plex
- Identical card grids
- Centered-stack hero (icon-title-subtitle-button)
- Generic SaaS gradients
- "Premium" / "elevate" / "seamless" / "next-gen" copy
- Mascots, uniforms, stock smiling-team photography
