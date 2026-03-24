# SGF — Sistema de Gestão da Fazenda
## Landing Page PRD

**Last updated:** February 2026

---

## Original Problem Statement
Build Section 4 "Posicionamento Anti-Planilha" for the SGF landing page with an Apple chip comparison page visual reference: black background, large headline, two items side by side with gradient cards, specs listed below each, closing highlight block. Replace the existing `#antiplanilha` section.

---

## Architecture
- **Type:** Static HTML/CSS/JS landing page
- **Stack:** Vanilla HTML5, CSS3 (custom design tokens), JavaScript (vanilla)
- **Server:** Node.js static file server (`server.js`) on port 3000
- **No backend/database** — pure frontend marketing page

---

## User Personas
- Brazilian cattle ranchers (pecuaristas) looking for farm management tools
- Non-tech-savvy users who previously used spreadsheets (planilhas)
- Decision-makers for mid-to-large farms

---

## Core Requirements (Static)
1. Premium visual design — dark/light contrast sections
2. Mobile-first responsive layout
3. Scroll-triggered reveal animations
4. Clear CTA funnel (hero → problem → solution → offer)
5. Social proof (testimonials, stats)

---

## Sections Architecture
| # | ID | Description | Background |
|---|-----|-------------|------------|
| 1 | `#hero` | Headline + CTA + mockup image | Dark green (`--forest-950`) |
| 2 | `#problema` | Social proof + testimonials carousel | Cream (`--cream`) |
| 3 | `#agravamento` | Consequences + contrast cards | Cream-dark (`--cream-dark`) |
| **4** | **`#antiplanilha`** | **Apple-style comparison: Planilha vs Sistema** | **Pure black (#060606)** |
| 5 | `#ferramentas` | Tools grid (10 tools) | Cream |
| 6 | `#objecoes` | Objection handling cards | White |
| 7 | `#identificacao` | Identification grid + transition | Dark green |
| 8 | `#stack` | Value stack + bonus | Cream |
| 9 | `#oferta` | Pricing + steps | Dark green |
| 10 | `#garantia` | 7-day guarantee | Cream-dark |
| 11 | `#faq` | FAQ accordion | White |
| 12 | `#final-cta` | Final call-to-action | Dark green |

---

## What's Been Implemented

### Section 4 — Anti-Planilha Redesign (Feb 2026)
**Replaced** the existing `#antiplanilha` section with a full Apple-chip-comparison-style design:

**Visual Design:**
- Pure black background (`#060606`) — maximum contrast break in the page
- Large white headline: `clamp(44px, 6vw, 72px)` font-size with `font-weight: 800`
- Muted subheadline in `rgba(255,255,255,0.45)`
- Two gradient cards (square, `aspect-ratio: 1/1`, `max-width: 380px`, `border-radius: 24px`):
  - LEFT (Planilha): `radial-gradient(ellipse at 30% 70%, #8B2020 → #3D0808 → #0A0A0A)` with red border
  - RIGHT (Sistema): `radial-gradient(ellipse at 70% 30%, #1a6b4a → #0A3D2B → #050F09)` with green border + gold glow inset shadow
- Specs: 5 items each — red (`#e07070`) for Planilha, gold (`#f5c518`) for Sistema
- Closing block: muted uppercase label + large gold `clamp(28px, 4vw, 44px)` highlight

**Animations (IntersectionObserver):**
- Headline: `apFadeUp` with 300ms CSS delay
- Subheadline: `apFadeUp` with 450ms delay
- LEFT card: `apSlideLeft` (slides from -30px)
- RIGHT card: `apSlideRight` (slides from +30px)
- Specs: staggered fade-up, 60ms per item, starting at 500ms
- Closing: `apFadeUp` with 600ms JS delay

**Responsive:**
- Desktop: 2-column grid (`1fr 1fr`, `gap: 48px`)
- Mobile (<640px): single column, cards `max-width: 320px`

**Testing:** 100% pass rate (10/10 tests) — all visual, animation, responsive, and surrounding-section tests passed.

---

## Design Tokens Used
- `--font-display`: Bricolage Grotesque (headlines)
- `--amber-400` / `var(--color-primary)` = `#E8B931` (gold accent)
- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)`
- New section-specific prefix: `.ap-*` classes

---

## Prioritized Backlog

### P0 (Critical — must do)
- None outstanding

### P1 (High priority)
- Add smooth scroll behavior to navbar links (already exists via `scroll-behavior: smooth`)
- Performance audit: optimize images (hero mockup, background image)

### P2 (Nice to have)
- Add a "hover" micro-animation to the gradient cards (subtle scale or glow pulse on hover)
- A/B test the headline variants
- Add entrance animation to the divider between sections

---

## Next Tasks
- Review remaining sections for visual consistency with the new black section
- Potential: add a subtle background noise/grain texture to the black section for more depth
- Consider adding a thin animated divider line between the two cards
