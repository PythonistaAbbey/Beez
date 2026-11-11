# Testing report

Run on 11 November 2026 against a production build (`next build && next start`), headless Chromium.

## Summary
| Suite | Tool | Result |
|---|---|---|
| Type check | `tsc --noEmit` | Pass, 0 errors |
| Unit tests | Vitest + Testing Library (jsdom) | **35 / 35 pass** (5 files) |
| End-to-end | Playwright, desktop Chrome + Pixel 7 | **51 / 51 pass**, 1 skipped (mobile-menu test is mobile-only) |
| Accessibility | axe-core (WCAG 2 A/AA) on 9 pages × 2 viewports | **0 serious or critical violations** |
| Layout | Horizontal-overflow check on 5 pages × 2 viewports, EN and AR | Pass |
| Production build | `next build` | Pass, 37 routes (30 static, dynamic tower/tracking/support/API) |

## What the tests cover
**Unit (`tests/unit`)**
- Synthetic dataset is deterministic, every ID is `DEMO-` prefixed and unique, delivered shipments carry POD, the guided excursion scenario exists.
- Control tower reducer: tick advances only active shipments and appends readings; acknowledge → escalate → resolve with an audit trail including the note; scenarios flag shipments, add alerts and three mock notifications exactly once; POD capture; supplier message trimming; KPI and risk-score bounds.
- Zod schemas: quote happy path, Saudi phone normalisation, five rejection cases; ticket ID normalisation; tracking ID rejects real-looking formats; planning index behaves monotonically.
- Bilingual content: English and Arabic dictionaries, service copy and tower copy have **identical key sets**; Arabic strings are Arabic; no unverified certification claims appear (GDP, HACCP, SFDA).
- `TempChart` labels excursions in text (not colour only) and is keyboard explorable.

**End-to-end (`tests/e2e`)**
- All 15 routes return 200 in both languages with `dir` set correctly and the disclaimer present.
- Language switch keeps the current page; root redirects to `/en`; mobile menu navigation.
- Workflows: tracking (valid, invalid ID), three-step quote with validation and demo submission, issue report with validation and simulated agent reply, shipment drawer table view and POD capture, alert acknowledge + level-2 escalation with note in the activity log, continuity scenario + alternative selection + backup transfer, keyboard-operable tabs with a running clock, notification preferences validation and save, Arabic RTL tower, executive deck keyboard navigation and speaker notes.
- Mock API returns `demo: true` and `X-Demo-Data: synthetic`, rejects malformed IDs (400) and invalid quotes (422).

## Defects found and fixed during testing
1. Colour contrast: turquoise links/eyebrows, steel-500 captions and status text were below 4.5:1. Tokens darkened (`frost-600` #0b7a77, `steel-500` #55789c, `ok` #17704a, `warn` #8f5a00).
2. Nested interactive controls in the delayed-shipments list (`role=option` around a button). Replaced with toggle buttons using `aria-pressed`.
3. Mobile horizontal overflow from grid items with wide tables (footer source list, continuity tables). Fixed with `min-w-0` on grid children.
4. Unit test isolation: Testing Library cleanup was not registered; added to setup.

## Performance (local, uncached, not a field measurement)
| Page | Load event | LCP | JS (uncompressed) |
|---|---|---|---|
| /en | 199 ms | 280 ms | 777 KB |
| /en/control-tower | 170 ms | 156 ms | 890 KB |
| /ar/quote | 186 ms | 164 ms | 777 KB |
No web fonts and no raster images are downloaded. JS weight is mostly React, Next.js runtime and Motion; code-splitting the tower tabs is a sensible next optimisation.

## Not tested / known limits
- Lighthouse and real-device testing (Safari iOS, low-end Android) were not run in this environment.
- Screen-reader walkthroughs (VoiceOver, NVDA, TalkBack) not performed; axe is not a substitute.
- Arabic copy was written for this concept and should be reviewed by a native Saudi business editor before a client presentation.
- No deployment URL yet; the repo runs locally with `npm run build && npm start`.

## How to run
```bash
npm install
npm run lint          # type check
npm test              # unit tests
npm run build
npx playwright install chromium   # or set PW_CHROMIUM_PATH to an existing Chromium
npm run test:e2e
```
