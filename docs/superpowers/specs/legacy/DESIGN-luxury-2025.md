# Design System: Galletta Bros – Premium Services

## 1. Visual Theme & Atmosphere
A **cinematic, gallery‑airy** interface that feels like a high‑end showcase studio. The mood is **restrained yet luxurious**, with a dark, deep‑blue backdrop that lets gold accents pop. Variance is **asymmetric** – the hero is left‑aligned with bold typography, while the services grid uses a staggered, glass‑card layout. Motion is **fluid spring‑physics** driven micro‑interactions (GSAP fade‑up on scroll, subtle hover lifts).

## 2. Color Palette & Roles
- **Midnight Canvas** `#0a0e12` – Primary background, deep dark base.
- **Abyssal Gradient** `#001f3f` → `#0a0e12` – Hero overlay gradient for depth.
- **Gold Accent** `#ffd700` – Primary call‑to‑action, highlights, interactive states.
- **Luminous Text** `#eaeaea` – Main body copy, high contrast on dark.
- **Soft Secondary** `#cfd8dc` – Sub‑text, descriptions, muted details.
- **Glass Tint** `rgba(255,255,255,0.05)` – Card background subtle glass effect.
- **Border Whisper** `rgba(226,232,240,0.5)` – Light borders for cards and dividers.

**Constraints**: Only one accent color (gold). No neon or purple tones. No pure black (`#000000`).

## 3. Typography Rules
- **Display / Headline**: `Playfair Display` – high‑contrast serif, track‑tight, weight‑driven hierarchy. Used for the company name and section titles.
- **Body**: `Geist` (or `Outfit` as alternative) – modern sans‑serif, clean, 1rem base, 65ch max line‑length, relaxed leading.
- **Mono**: `Geist Mono` – for code snippets, timestamps, high‑density numeric data.
- **Banned Fonts**: `Inter` (currently used) is **NOT** permitted for premium contexts; replace with `Geist`/`Outfit`.
- **Serif Ban**: Generic serifs (`Times New Roman`, `Georgia`) are prohibited unless a distinctive modern serif like `Fraunces` is required for editorial sections.

## 4. Component Stylings
- **CTA Button**: Gold background, dark text, rounded 8px, scale‑up hover (`transform: scale(1.05)`), subtle background shift to `#ffea00`.
- **Cards (Glass)**: `border-radius: 2.5rem`, whisper shadow, semi‑transparent white tint, elevation only when hierarchy demands. On high‑density screens, replace with thin top borders.
- **Hero Overlay**: Centered logo, headline, tagline, and CTA. Uses `data‑anim="fade-up"` for scroll‑triggered entrance.
- **Video Hero**: Full‑screen looping MP4, muted, plays inline. No autoplay controls visible.
- **Loaders**: Skeletal shimmer placeholders matching layout dimensions, no circular spinners.
- **Inputs**: Label above, accent focus ring, error text below, no floating labels.

## 5. Layout Principles
- **Grid‑First Architecture**: CSS Grid for the services section, asymmetric two‑column zig‑zag on larger screens.
- **Responsive Collapse**: Below 768 px, all multi‑column layouts collapse to a single column.
- **Max‑Width Containment**: Content constrained to `max-width: 1400px` and centered.
- **Spacing**: Vertical gaps via `clamp(3rem, 8vw, 6rem)`; internal padding generous.
- **No Overlap**: Every element occupies its own spatial zone; absolute positioning avoided.
- **Hero Positioning**: Left‑aligned hero (as variance > 4) – no centered hero.

## 6. Motion & Interaction
- **GSAP Core + ScrollTrigger**: All elements with `data‑anim="fade-up"` animate from `opacity:0, y:30` over 1 s with `power2.out` easing.
- **Spring Physics Default**: `stiffness: 100, damping: 20` for tactile feedback on buttons and cards.
- **Perpetual Micro‑Interactions**: Hover lift on cards, pulse on CTA, subtle shimmer on loaders.
- **Hardware‑Accelerated**: Animations limited to `transform` and `opacity`.

## 7. Anti‑Patterns (Banned)
- No emojis.
- No `Inter` font (replace with `Geist`/`Outfit`).
- No pure black (`#000000`).
- No neon/outer‑glow shadows.
- No oversaturated accent colors.
- No generic placeholder text (e.g., "Scroll to explore").
- No centered hero sections for this high‑variance project.
- No three‑column equal card grids.
- No AI‑cliché copy ("Elevate", "Seamless", "Next‑Gen").
- No custom mouse cursors.
- No overlapping elements.
- No generic names ("John Doe", "Acme").

## 8. Best Practices
- **Be Descriptive**: "Midnight Canvas (#0a0e12) – deep dark background".
- **Be Functional**: Explain each token’s purpose (e.g., gold accent for primary actions).
- **Be Consistent**: Use the same terminology across the document.
- **Be Precise**: Include exact hex codes, rem values, and pixel dimensions.
- **Be Opinionated**: Enforce a premium aesthetic, not a neutral template.

## 9. Tips for Success
1. Start with the atmosphere – capture the cinematic, gallery‑air vibe before detailing tokens.
2. Identify recurring patterns (spacing, shadow depth) and codify them.
3. Name colors by function, not just appearance.
4. Encode bans explicitly – they are as critical as the rules.
5. Validate the DESIGN.md by feeding it back into Stitch to generate a screen and ensure the output matches the premium vision.

## 10. Common Pitfalls to Avoid
- Using technical class names (`rounded-xl`) instead of descriptive language.
- Omitting hex codes or using only color names.
- Forgetting functional roles for each token.
- Being vague in atmosphere descriptions.
- Ignoring the anti‑pattern list – these create the premium feel.
