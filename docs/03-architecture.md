# Milestone 3 — Technical architecture

## Prototype (this repository)
```
Next.js 16 App Router (TypeScript, React 19)
├─ src/app/[locale]/…            15 bilingual routes (/en, /ar), SSG for content pages
├─ src/app/api/demo/*            Mock REST API (shipments, inventory, alerts, quotes, tickets)
├─ src/content/*                 en/ar dictionaries, service copy, tower copy, slides, sources
├─ src/lib/data/*                Typed models, seeded PRNG, synthetic dataset, geo helpers
├─ src/lib/tower/store.ts        Pure reducer for the control tower (unit-tested)
├─ src/lib/schemas.ts            Zod schemas shared by forms (React Hook Form) and API routes
└─ src/components/*              Site chrome, charts, tower tabs, demo workflows
```
- **Data**: deterministic synthetic data (seed `20260104`), every ID prefixed `DEMO-`, every API response carries `"demo": true` and `X-Demo-Data: synthetic`.
- **Simulation**: a client-side clock advances vehicles and appends readings. Scenarios are labelled hypothetical and use clock times only, never calendar dates.
- **Forms**: one Zod schema per form, used for client validation and re-validated on the server route. Nothing is persisted, logged or forwarded.
- **Maps**: a schematic SVG map is used instead of MapLibre tiles because no tile server was reachable from the build environment and a demo should not depend on a third-party tile quota. For production, MapLibre GL with a Saudi-hosted vector-tile source is the recommended swap; `KsaMap` keeps the same props.
- **Security headers**: `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, `X-Robots-Tag: noindex` so the concept is never indexed as an official Beez site.

## Suggested production architecture (requires Beez authorisation)
```
Customer browser / mobile ──► CDN + WAF (KSA region) ──► Next.js (SSR/ISR)
                                                         │
                                         BFF / API gateway (OAuth2, mTLS, rate limits)
                                ┌────────────┬───────────┼─────────────┬──────────────┐
                           Beez WMS     Beez OMS    Beez FMS/Driver   Sensor/IoT     Beez GPT
                         (inventory)   (orders)    (GPS, POD)       (temp, RH)     (support)
                                └────────────┴─── event bus (alerts, ETA changes) ─┘
                                                         │
                               Read models (PostgreSQL + time-series store), audit log
```
- Read-mostly adapters; the control tower never writes to operational systems except through explicit, permissioned actions (e.g. raise ticket, request transfer).
- Suggested relational schema follows `src/lib/data/types.ts`: `shipments`, `shipment_events`, `temperature_readings` (time-series, partitioned by day), `alerts`, `alert_actions` (append-only audit), `warehouses`, `zones`, `inventory_items`, `suppliers`, `asn`, `tickets`, `ticket_messages`, `quote_requests`, `notification_prefs`, `users`, `roles`.

## Saudi data protection and cybersecurity considerations (for a later production phase)
These need confirmation by Beez's legal and security teams; listed here as a checklist, not legal advice.
- **Personal Data Protection Law (PDPL)** and its Implementing Regulations (SDAIA): lawful basis and purpose limitation for receiver names, phone numbers, signatures and photos in POD; privacy notice in Arabic; data-subject rights; breach notification; records of processing.
- **Data transfer outside the Kingdom** (PDPL transfer regulations): host personal data and logs in a KSA region by default.
- **NCA Essential Cybersecurity Controls (ECC)** and, if cloud-hosted, **Cloud Cybersecurity Controls (CCC)**: identity and access management, logging and monitoring, vulnerability management, third-party risk.
- **CST cloud computing regulatory framework** for choice of cloud provider and data classification.
- **SFDA** good storage and distribution practice expectations for medical products: relevant to how temperature records are retained and presented to medical customers. The concept does not claim Beez holds any SFDA licence.
- Privacy by design in the prototype: no real personal data, role-based views, minimal fields in forms, CSV export marked synthetic and escaped against formula injection, no third-party trackers, no cookies.

## Not done (needs client authorisation)
No contact with beezdash.com or any Beez API; no security testing of any Beez system; no real-time feeds; no deployment under a Beez domain.
