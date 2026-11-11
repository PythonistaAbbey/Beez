# Proposal: Beez Control Tower
### A premium digital experience for temperature-controlled logistics
**Prepared by:** Pristine Education · https://pristineeducation.net/
**Prepared for:** Beez Logistics (unsolicited proposal)
**Date:** November 2026 · **Status:** Draft for review

> This proposal and its prototype are independent concept work. They are not affiliated with or endorsed by Beez Logistics, and the prototype is not connected to any Beez system. All prices are indicative estimates.

---

## 1. Executive summary
Beez Logistics has built real operational depth since 2015: refrigerated transport across the Kingdom, refrigerated warehousing with 24/7 temperature control, 3PL/4PL services, and an in-house technology stack that includes a WMS, an order management system, GPS fleet management, a driver app, an order dashboard and an AI customer-service assistant. The public website and customer touchpoints present these strengths in separate places.

We propose a **customer experience layer** that brings them together: a premium bilingual website and a **Control Tower** where customers see shipments, temperature logs, stock, exceptions and suppliers in one place. It reads from Beez's existing systems through secure APIs; it does not replace them.

A working prototype is ready to view. It includes 15 bilingual pages, a nine-view control tower, a business-continuity simulator, quotation, tracking and support workflows, and an executive demo mode. It passes 35 unit tests, 51 end-to-end tests and an automated WCAG AA accessibility scan.

## 2. Our understanding of Beez's services
From Beez's public pages (sources in the prototype repository, `docs/01-research-and-sitemap.md`):
- **Logistics and transportation:** refrigerated shipping across Saudi Arabia, last-mile delivery with a dedicated fleet, B2B supply, dedicated vehicles with temperature monitoring, distribution centres.
- **Cold chain:** sensors that alert drivers when temperature leaves its range; typical ranges of 5 °C to 20 °C by product and client; temperature and humidity monitoring for medicine, food and cosmetics.
- **Warehousing:** refrigerated warehouses with monitoring systems and 24/7 temperature control; storage, assembly and packaging.
- **Fourth-party logistics:** transportation, warehousing, cross-docking, inventory, packaging, route planning, IT integration, compliance and safety.
- **Advanced IT:** in-house systems (Beez WMS, OMS, FMS with GPS, Driver App, Express Dashboard, Performance MS); AI integrated into most systems; Beez states it is ISO certified in IT and was first in the Middle East to integrate with Amazon.
- **Customer service:** people plus AI (Beez GPT), Sunday–Thursday 9:00–20:00.
- **Industries:** Medical, Supplements, Foods, Cosmetics, E-commerce, Beverage, Retail.

## 3. Respectful assessment of the public website
What works well: a clear cold-chain identity, bilingual content, a visible tracking entry point, a client login, and an honest FAQ about temperature ranges.

Where a refresh could add value:
1. **Capabilities are under-presented.** The in-house technology is a real differentiator, but it sits on one page and is not connected to customer outcomes.
2. **No dedicated pages for high-value audiences** such as medical and pharmaceutical customers or e-commerce merchants, although both are listed industries.
3. **Self-service is limited to tracking.** Quotations, issue reporting and notification preferences go through calls or email.
4. **Figures differ across sources** (for example warehouse counts on the site and in 2022 press coverage). A single, dated facts sheet would build trust.
5. **Small polish items:** a placeholder email link on the customer-service page, and phone hours that read "Call us anytime" next to published working hours.

## 4. Proposed improvements
- Premium bilingual site with a clear story: *Precision in every delivery.*
- Dedicated **Medical logistics** and **E-commerce fulfilment** pages, built only from verified information.
- A **source-backed facts sheet** maintained by Beez.
- **Self-service workflows:** corporate quotation wizard, delivery issue reporting with ticket tracking, notification preferences.
- A customer **Control Tower** in front of existing systems (section 5).
- Accessibility (WCAG 2.1 AA), Arabic-first RTL quality, and fast mobile performance as acceptance criteria.

## 5. Interactive prototype features
| Area | What the prototype demonstrates |
|---|---|
| Network view | Schematic Saudi map with simulated vehicles, KPIs, latest alerts |
| Shipments | Search and filters, shipment drawer with temperature graph (band, excursion label, table view, CSV export), delivery timeline, proof of delivery with signature capture |
| Inventory | Warehouse temperature zones and utilisation, SKU stock, reserved, days of cover, backup stock, lot expiry |
| Alerts & exceptions | Acknowledge, assign, three-level escalation with target response times, resolve, audit trail |
| Continuity | Hypothetical disruption scenarios, delayed shipments, illustrative alternatives, medical priority ranking, backup transfers, mock notifications |
| Analytics | On-time %, excursions, volumes, industry mix, with table views |
| Suppliers | Inbound notices, slot confirmation, supplier messaging |
| Notifications | Event × channel matrix, quiet hours, escalation contact |
| Account | Users and roles, tickets, quotes, privacy-by-design notes |
| Executive demo | 8-slide guided story with live links and speaker notes |

## 6. Business and customer benefits
- **Visibility:** customers answer "where is it and is it within temperature?" without calling.
- **Less service friction:** issues arrive structured and linked to the shipment, so agents (and Beez GPT) resolve them faster.
- **Sensitive medical deliveries:** a priority view, audit-ready temperature logs and clear escalation make Beez easier to choose for healthcare buyers.
- **Sales:** a complete corporate brief from the quote wizard shortens the sales cycle.
- **Brand:** a presentation that matches Beez's operational and technology investment.
We have not estimated percentage improvements; they should be measured in a pilot against Beez's own baselines.

## 7. Business continuity considerations
The prototype shows how a customer could rehearse disruption: identify delayed shipments, compare alternatives, protect medical priorities, draw on backup stock and escalate. In production this would need agreed playbooks, named contacts, SLA timers aligned to Beez's internal SLA, and integration with real ETA and inventory feeds. All scenarios in the prototype are hypothetical and labelled as simulations.

## 8. Technical architecture
- **Front end:** Next.js and TypeScript, Tailwind CSS, Motion, React Hook Form and Zod, bilingual routing with full RTL.
- **Back end for front end:** API gateway with OAuth2, role-based access and rate limiting; read-mostly adapters to WMS, OMS, FMS/driver app, sensor platform and Beez GPT.
- **Data:** PostgreSQL read models, a time-series store for temperature readings, append-only audit log.
- **Hosting:** KSA cloud region, CDN and WAF, infrastructure as code, CI with unit, end-to-end and accessibility tests.
- **Maps:** MapLibre GL with a KSA-hosted vector-tile source.

## 9. Cybersecurity and privacy design principles
- Privacy by design and data minimisation; no personal data in IDs or sensor streams.
- PDPL alignment: lawful basis, Arabic privacy notice, data-subject rights, breach response, in-Kingdom hosting by default.
- NCA Essential Cybersecurity Controls and, where cloud-hosted, Cloud Cybersecurity Controls.
- Least-privilege roles, SSO/MFA for corporate users, encrypted transport and storage, centralised logging.
- Secure SDLC: dependency scanning, code review, penetration testing by an authorised party before go-live.
- No testing of Beez systems was performed for this proposal; any future testing would need written authorisation.

## 10. Implementation milestones
| Phase | Duration | Outcome |
|---|---|---|
| 0. Discovery | 2 weeks | Workshops with operations, IT and customer service; verified facts sheet; API inventory; success metrics |
| 1. Website | 6–8 weeks | Bilingual public site, content migration, SEO, analytics, accessibility audit |
| 2. Control Tower pilot | 10–14 weeks | Integration with one system set, one pilot customer or lane, staging security review |
| 3. Scale | Ongoing | More customers, continuity playbooks, mobile app alignment, Beez GPT in-flow support |

## 11. Indicative pricing options (estimates only)
All figures are **indicative estimates in SAR, excluding VAT**, for planning. They are not an offer and will be refined after discovery.
| Option | Scope | Indicative range |
|---|---|---|
| A. Discovery sprint | Phase 0 | SAR 35,000 – 50,000 |
| B. Website | Phases 0 + 1 | SAR 150,000 – 230,000 |
| C. Website + Control Tower pilot | Phases 0 + 1 + 2 | SAR 420,000 – 650,000 |
| Support and evolution | Monthly retainer after launch | SAR 15,000 – 30,000 / month |
Excludes third-party licences, cloud hosting fees and penetration testing by an external party.

## 12. Suggested next steps
1. A 30-minute call to walk through the prototype (executive demo mode, about 7 minutes).
2. Beez shares which facts and figures it wants published and confirms certifications.
3. Agree on Option A to validate scope, data access and priorities.

*Contact: Pristine Education, https://pristineeducation.net/ — [sender name and contact details to be added by the sender].*
