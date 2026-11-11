# Milestone 2 — Design system

Tokens live in `src/app/globals.css` (Tailwind 4 `@theme`). Components use the tokens only.

## Colour
| Role | Token | Hex | Use |
|---|---|---|---|
| Authority | `navy-900` / `navy-950` | #0a1b38 / #050f22 | Hero, footer, primary buttons, dark panels |
| Structure | `steel-100…700` | #e9f0f7 … #3b5878 | Borders, secondary text, table chrome |
| Clarity | `white`, `ice-50` | #ffffff / #f5f8fc | Page and card surfaces |
| Cold accent | `frost-400` / `frost-600` | #2ec4c0 / #0b7a77 | Live states, links, eyebrows. 400 only on navy, 600 on light |
| Status (reserved) | `ok`, `warn`, `alert` (+ `-bg`) | #17704a, #8f5a00, #c0392b | Always paired with an icon and a word, never colour alone |
| Chart series | `series-1…4` | #2f68b0, #0f9592, #c47a1a, #8a5cc2 | Validated for CVD separation and 3:1 contrast on white |

All text pairs were checked against WCAG AA (≥ 4.5:1); axe found no serious contrast issues after the final pass.

## Type
System UI stack for Latin; `Noto Kufi Arabic` → `Noto Sans Arabic` → `Geeza Pro` → `Segoe UI` → Tahoma for Arabic (`html[lang=ar]`). No web-font download, so first paint is fast. Headline style: uppercase, tight tracking, `text-balance` (Latin); Arabic drops tracking.

## Layout and motion
- 12-column content grid, `max-w-7xl`, 16 px mobile gutters; control tower uses a 220 px tab rail that becomes a horizontal scroller on mobile.
- Cards: 16 px radius, two-layer navy shadow. Large panels: 24 px radius.
- Motion (Motion for React): fade-and-rise on first view, wizard step transitions, deck transitions, vehicle movement on the map. All disabled under `prefers-reduced-motion`; the sim clock slows to one tick per 4 s.

## Components
`Reveal`, `SectionHeading`, `Badge`, `SourceLink`, `Dialog` (native `<dialog>` with focus trap), `Card`, `Btn`, `StatusBadge`, `SeverityBadge`, `TempPill`, `TempChart` (band + excursion label + keyboard crosshair + table view), `BarChart`, `LineChart`, `KsaMap` (schematic SVG map, keyboard-selectable vehicles), `SignaturePad` (with checkbox alternative).

## Imagery
Original line-drawn SVG artwork (refrigerated trailer, cold-chain pulse, schematic map). No Beez assets or third-party photos are bundled. Swap in licensed photography before a client presentation.

## Accessibility
Skip link, landmarks, one H1 per page, visible focus rings (3 px frost), `aria-current` in navigation, ARIA tabs with arrow/Home/End keys, live regions for workflow outcomes, form errors tied with `aria-describedby`, RTL mirroring with logical properties (`ms-`, `me-`, `start-`, `end-`), and data tables as an alternative to every chart.
