# DESIGN.md — GemOne Visual Redesign Spec
*Reference: Dovetail (dovetailapp.com) marketing site — design language to be copied 1:1. Only copy/content changes; layout, color, type, and component patterns stay identical.*

---

## 1. Design Philosophy

Dovetail reads as **warm, human, editorial SaaS** — the opposite of GemOne's current sterile slate/blue enterprise-dashboard look. Key traits to replicate:

- Oversized, confident typography carrying most of the visual weight (not icons/cards)
- Warm cream background instead of cool white/slate
- One deep ink-indigo used everywhere for both headlines *and* primary actions (no separate "blue for links, black for text")
- Full-bleed color-block sections with **curved** (not straight) transitions
- Flat, hand-drawn line illustrations as decoration, never as functional UI icons
- Generous whitespace; content maxes out around 600–700px per column even on wide screens

---

## 2. Color System

### Marketing / light surfaces
| Token | Approx. Hex | Use |
|---|---|---|
| `cream` | `#FDF3E4` | Default page background |
| `ink` | `#2A1B54` | Headlines, nav text, primary buttons, body copy |
| `inkMuted` | `#4C3B7C` | Secondary/subhead paragraph text |
| `inkDark` | `#1F1440` | Button hover state |

### Dark contrast sections
| Token | Approx. Hex | Use |
|---|---|---|
| `indigoDark` | `#241454` | Full-bleed dark section backgrounds |
| `white` | `#FFFFFF` | All text/links on dark sections |

### Illustration & tag accents (decorative only — never for body text)
| Token | Approx. Hex |
|---|---|
| `tealAccent` | `#14B8A6` |
| `coralAccent` | `#F2994A` |
| `pinkAccent` | `#E6396B` |
| `skyAccent` | `#3B5BFF` |

> These are eyeballed from the screenshots — pull exact values with a color picker on the source images before locking the palette.

### Keep unchanged (functional, not part of this reskin)
- Compliance verdict colors: compliant green / needs-review amber / non-compliant red
- Any color used inside data tables, form validation, or status badges in the authenticated app

---

## 3. Typography

- **Family:** bold, slightly rounded geometric sans (Dovetail uses a custom font; closest easy substitutes are **Poppins** or **Inter**, weight 700–900 for headings)
- **Body:** same family, weight 400–500, line-height ~1.6
- **Scale**

| Element | Size | Weight | Color |
|---|---|---|---|
| Hero H1 | 56–64px | 800–900 | `ink` (or white on dark section) |
| Section H2 | 36–40px | 800 | `ink` / white |
| Card/feature H3 | 20–24px | 700 | `ink` / white |
| Body | 16–18px | 400–500 | `inkMuted` / white-80% |

Headlines are always 2 short lines max, center- or left-aligned depending on section — never gray text for headings, always full `ink` or full white.

---

## 4. Buttons & Links

- **Primary CTA:** full pill shape (`border-radius: 999px`), solid `ink` fill, white text, `px-6 py-3`, bold weight, no shadow, darkens to `inkDark` on hover. Used for every "Try free" / main CTA, on both light and dark sections (invert to white-fill/ink-text on dark backgrounds if needed for contrast).
- **Secondary "Log in" style:** plain text, `ink` color, no border, sits next to the primary pill in nav.
- **Inline links** ("Learn more about analysis →"): `ink` color, underlined, arrow suffix, no button chrome.

---

## 5. Page Structure (landing/marketing page rhythm)

This is the exact section order to replicate for GemOne's home page:

1. **Sticky nav** (cream bg): logo + wordmark left, nav links with dropdown chevrons center, "Log in" text + primary pill CTA right.
2. **Hero** (cream): centered oversized H1 (2 lines) → centered subhead paragraph (max-width ~600px) → CTA pill(s) → large full-width flat illustration banner beneath.
3. **Logo/trust bar** (cream): 4-per-row grid of partner/customer logos, thin horizontal rule above and below.
4. **Anchor-tab row** (cream): horizontal list of section jump-links (e.g. Analysis / Repository / People / Enterprise / Security / Community) + a repeated primary pill CTA on the far right.
5. **Feature block, light** (cream): big H2 + short paragraph + "Learn more →" link on one side; a **product screenshot inside a white rounded-2xl card with soft shadow** on the other. Repeats 2–3 times for sub-features, alternating text-left/screenshot-right and text-right/screenshot-left.
6. **Curved divider → Dark section** (`indigoDark`, white text): bold H2 + paragraph + underlined white link, a floating accent squiggle/shape, and another screenshot-in-white-card mockup. Often stacks 2 sub-value-props side by side under the same dark block.
7. **Curved divider → Light section**: a functional/data-heavy feature (e.g. a table/list mockup) with a 2×2 grid of short bold micro-headline + one-line description pairs underneath (no icons needed).
8. **Curved divider → Dark "scale/enterprise" section**: bold H2, then a 2×2 grid of short benefit bullets (bold micro-title + one-line description), same layout as step 7 but inverted colors.
9. **Curved divider → Light "trust/security" section**: heading + paragraph + a small certification badge (e.g. "SOC 2 Type II") paired with a simple line-illustration icon (shield, lock, etc.).
10. **Footer.**

**Section transitions** always use a single smooth SVG arc/wave (a `<path>` with one bezier curve, full section width, ~60–100px tall) — never a hard straight edge between cream and indigo blocks.

---

## 6. Cards & Screenshot Framing

- Rounded-2xl (16–20px) white containers, soft/low-opacity shadow — **not** the current hard `border-slate-200` boxes.
- Screenshots are stylized mockups of the *actual product UI* (simplified fake nav bar, colorful highlighted text, small round avatar) rather than literal browser screenshots — recreate GemOne's own UI at small scale inside these cards.

---

## 7. Illustration Style

- Thin outline (1.5–2px), flat solid color fills, no gradients/drop-shadows, slightly quirky/hand-drawn character proportions.
- Reserve illustration budget for: the hero banner, and 2–3 decorative accents per page (a leaf/blob, a squiggle line, a starburst, a half-moon arc) placed asymmetrically at section edges — never centered on top of text.
- Keep `lucide-react` icons for the **functional dashboard app** (tables, nav, buttons inside `/officer` and `/bidder` routes) — illustration is for marketing pages only.

---

## 8. Where This Applies in GemOne

| Current page | Treatment |
|---|---|
| `/` (`HowItWorksPage.tsx`) | Full redesign to the 10-step structure above: hero, trust/status bar, alternating feature sections replacing the Officer/Bidder step-cards, dark CTA block for the roadmap, light trust section near the footer. |
| `/sih-compliance` | Light reskin only (cream bg, `ink` headings, pill buttons) — it is a functional checklist, not a marketing page, so keep its current card-grid layout. |
| `/login` | Cream background, rounded white card, pill submit button, `ink` accents/focus rings. |
| Authenticated app | **Not** part of this reskin — keep the current functional slate UI (tables, forms, badges) as-is. Only update the primary button color/shape (pill, `ink`) and card corner-radius so it feels related to the new marketing pages. |

---

## 9. Tailwind Token Additions

```js
// tailwind.config.js — extend, don't replace the existing brand/status tokens
colors: {
  cream: '#FDF3E4',
  ink: '#2A1B54',
  inkMuted: '#4C3B7C',
  inkDark: '#1F1440',
  indigoDark: '#241454',
  tealAccent: '#14B8A6',
  coralAccent: '#F2994A',
  pinkAccent: '#E6396B',
  skyAccent: '#3B5BFF',
},
borderRadius: {
  pill: '999px',
},
```

---

## 10. What NOT to Change

- Compliance status colors (green/amber/red) and any functional data-viz color coding
- Data tables, forms, and rule-config UI inside the authenticated dashboard
- `lucide-react` icon set for functional app screens
