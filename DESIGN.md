# DESIGN — Galletta Bros Hauling

Visual system for the rugged-cinematic Galletta Bros marketing site. Authoritative reference for tokens, type, color, motion, and component conventions. Implementation lives in `style.css` and `script.js`.

## Aesthetic lane

Rugged workwear × short-form film. Reference physical objects: hand-painted signage on a dump truck, a Carhartt jacket label at dusk, sodium-vapor light on wet asphalt, a 1970s shop manual cover. The opposite of luxury polish or SaaS softness.

## Color (UPDATED 2026-04-29)

Per client direction, the palette pivoted from rugged-workwear-yellow to a classic American mover system: white + black + red, with navy and gray as supporting tones.

**Strategy:** Restrained light-default body with one red accent (less than or equal to 8% surface), navy as the dark contrast surface for hero / quote / footer, gray as the supporting neutral for borders and secondary text.

**Tokens:**

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#f9f7f3` | Primary page background, off-white warm-tinted |
| `--paper-card` | `#f1eee7` | Light card / section-stripe background |
| `--paper-line` | `#e0dcd2` | Borders, dividers on light surfaces |
| `--ink` | `#1a1814` | Primary text, headlines |
| `--ink-body` | `#5a564f` | Body copy gray |
| `--ink-muted` | `#8a857a` | Captions, eyebrow numerals |
| `--accent-red` | `#c93832` | Single accent, CTAs, highlights, headline accents, eyebrow rules |
| `--accent-red-hot` | `#e2453d` | Accent hover |
| `--ink-navy` | `#0f1830` | Dark surface for hero overlay, quote band |
| `--ink-deep` | `#0a0908` | Deep warm-black for footer |
| `--paper-on-dark` | `#f9f7f3` | Off-white text on dark surfaces |
| `--paper-on-dark-body` | `#c8c2b6` | Body text on dark surfaces |

The legacy token names (`--asphalt`, `--steel`, `--safety-yellow`, etc.) remain as aliases pointing at the new tokens for transitional compatibility.

**Rules:**
- Never `#000` or `#fff`. All neutrals tinted slightly warm.
- Red is load-bearing, appears only on actions, accents, and the accent word. Never decorative.
- Navy is for dark contrast surfaces only (hero, quote, footer). Not used as a body color.
- Hero is dark (navy overlay over video); the rest of the body is light.

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
