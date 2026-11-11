# Beez Control Tower — independent concept prototype

> **Disclaimer.** An unsolicited design concept prepared by **Pristine Education** (https://pristineeducation.net/). It is not affiliated with, endorsed by, or connected to Beez Logistics or any of its systems. Company facts are summarised from public sources (see `docs/01-research-and-sitemap.md`). Every shipment, vehicle, sensor reading, stock level, supplier and ticket is synthetic.

A premium, bilingual (English / Arabic, RTL) website and customer-facing control tower for temperature-controlled logistics. Headline: **Precision in every delivery.**

## What's inside
- **Public site (15 routes × 2 languages):** Home, About, Logistics & transportation, Cold-chain, Medical logistics, Warehousing, 4PL, E-commerce fulfilment, Technology, Shipment tracking demo, Corporate services (with service comparison), Request a quote, Customer support, Control Tower, Executive demo.
- **Control tower:** live schematic map, KPIs, shipment table and drawer (temperature graph with excursion labels, table view, CSV export, delivery timeline, proof-of-delivery with signature pad), warehouse zones and inventory with days of cover, alerts with acknowledge / assign / escalate (3 levels) / resolve and audit trail, analytics, supplier coordination, notification preferences, customer account.
- **Business continuity module:** hypothetical disruption scenarios (clearly labelled simulations), delayed shipments, illustrative alternatives (ETA, cost index, temperature risk, CO₂ index), medical priority ranking, backup inventory transfer requests, mock notification feed, escalation.
- **Customer workflows:** quote wizard (React Hook Form + Zod), tracking, delivery issue reporting with mock tickets and replies.
- **Executive demo mode:** 8-slide, ~7-minute guided presentation with speaker notes and live demo links (`/en/executive`, `/ar/executive`).

## Stack
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion for React · React Hook Form + Zod · lucide icons · Vitest + Testing Library · Playwright + axe-core. Synthetic data via a seeded PRNG; mock REST API under `/api/demo/*`.

## Run
```bash
npm install
npm run dev            # http://localhost:3000/en
npm test               # unit tests
npm run build && npm run test:e2e
```

## Docs
1. `docs/01-research-and-sitemap.md` — source-backed content inventory and sitemap
2. `docs/02-design-system.md`
3. `docs/03-architecture.md` — including Saudi PDPL / NCA considerations
4. `docs/04-testing-report.md`
5. `docs/05-proposal.md`, `docs/06-outreach-emails.md`, `docs/07-presentation-script.md` — drafts only; **no email has been sent**
