# Milestone 1 — Research, content inventory and sitemap

**Independent concept.** This prototype was prepared by Pristine Education as an unsolicited design concept. It is not affiliated with, endorsed by, or connected to Beez Logistics or any of its systems. Research date: 11 November 2026. Only publicly accessible pages were read; no login areas, APIs or client portals were accessed.

## 1. Source-backed content inventory

Every fact used in the prototype's public pages is listed here with its source. Anything not in this table is either clearly labelled as a proposal or uses synthetic demo data.

| # | Fact used in the prototype | Source |
|---|---|---|
| F1 | Beez Logistics was established in 2015 in Saudi Arabia | https://beez.com.sa/about.php , https://beez.com.sa/whyBeez.php |
| F2 | Describes itself as a Saudi company providing refrigerated shipping and storage solutions, specialising in cold-chain shipping across the Kingdom | https://beez.com.sa/ , https://beez.com.sa/about.php |
| F3 | Service lines: Logistics, Warehousing, Fourth Party Logistics, Advance IT Solution, Customer Service | https://beez.com.sa/services.php (site navigation) |
| F4 | Industries served: Medical, Supplements, Foods, Cosmetics, E-commerce, Beverage, Retail | https://beez.com.sa/ |
| F5 | Already advertises Real Time Tracking, Safe & Secure, Right Time Delivery, and a Track Shipment tool | https://beez.com.sa/ , https://beez.com.sa/about.php |
| F6 | FAQ: sensors monitor shipments and alert the driver when temperature leaves the allowed range; typical range 5 °C to 20 °C depending on product and client | https://beez.com.sa/ (FAQ) |
| F7 | Logistics page: refrigerated shipping across Saudi Arabia; temperature and humidity monitoring for medicine, food and cosmetics; last-mile delivery with a dedicated fleet; B2B supply; dedicated vehicles with temperature monitoring devices; distribution centres | https://beez.com.sa/logistics.php |
| F8 | Logistics page mentions nine warehouses in strategic locations | https://beez.com.sa/logistics.php |
| F9 | Warehousing: refrigerated warehouses with monitoring systems, temperature control 24/7, storage, assembly and packaging, dedicated fleet, continuous shipment updates | https://beez.com.sa/warehousing.php |
| F10 | 3PL and 4PL: transportation, warehousing, cross-docking, inventory, packaging, route planning, IT integration, compliance and safety | https://beez.com.sa/fourth-party-logistics.php |
| F11 | In-house systems: Beez WMS, Ordering Management System, Fleet Management System (GPS), Driver App, Express Dashboard System, Performance MS, C-to-C app; AI integrated into most systems | https://beez.com.sa/it-solution.php |
| F12 | Claims ISO certification in Information Technology (stated by Beez; certificate not independently verified) | https://beez.com.sa/it-solution.php |
| F13 | Claims to be the first company in the Middle East to integrate seamlessly with Amazon (company claim, not independently verified) | https://beez.com.sa/it-solution.php |
| F14 | Customer service combines people and AI; in-house "Beez GPT" aligned with internal SLA | https://beez.com.sa/customer-service.php |
| F15 | Customer care hours: Sunday to Thursday, 9:00 AM to 8:00 PM | https://beez.com.sa/customer-service.php |
| F16 | Contact: 8001240172, info@beez.com.sa, Abi Bakr Al Siddiq Branch Rd, Al Nafel Dist., Riyadh | https://beez.com.sa/contact.php (footer on all pages) |
| F17 | Existing client login at beezdash.com (not accessed) | https://beez.com.sa/ navigation |
| F18 | Mobile app published on the App Store | https://apps.apple.com/sa/app/beez-logistics/id6477186733 |
| F19 | Beez app on Salla e-commerce platform (install, connect store, rates by city) | https://help.salla.sa/en/article/beez-logistics-app/d3wo6hex2khyx36299202g15 |
| F20 | 2022 press release: partnership/investment with Naif Alrajhi Investment; at that time cited 11 new warehouses, 1,000+ refrigerated and dry vehicles, 100+ distribution points | https://www.zawya.com/en/press-release/naif-alrajhi-investment-acquires-shares-of-beez-logistics-p8uoy6xs |

### Handling of figures
- Fleet and warehouse counts differ between sources (nine warehouses on the current site; 11 new warehouses in a 2022 press release). **The prototype does not show any fleet, warehouse, volume or performance numbers on the public pages.** The proposal mentions them only with source and date.
- ISO and Amazon-integration claims are Beez's own statements. The prototype attributes them ("Beez states…") and does not invent other certifications (no GDP, HACCP, SFDA licence etc. are claimed).
- "Medical logistics", "E-commerce fulfilment" and "Corporate services" are not separate service pages on beez.com.sa. They are built from facts F4, F7, F9, F19 and clearly framed as proposed page structures.

## 2. What Beez already does (do not present as missing)
Real-time tracking, temperature monitoring with driver alerts, GPS fleet management, an order dashboard, WMS visibility, a client login, a mobile app, an AI customer-service assistant, and e-commerce integrations (Salla, Amazon).

**Our positioning:** the concept is a *customer-experience layer* on top of those capabilities: one premium public story, plus a unified control-tower interface that could sit in front of Beez's existing WMS/OMS/FMS through APIs. It complements, not replaces.

## 3. Sitemap (bilingual: /en and /ar, RTL for Arabic)

| Route | Page | Based on |
|---|---|---|
| `/` | Home: "Precision in every delivery" | F2–F7 |
| `/about` | About Beez | F1, F2, F16 |
| `/logistics` | Logistics and transportation | F7 |
| `/cold-chain` | Cold-chain solutions | F6, F7, F9 |
| `/medical` | Medical logistics (proposed page) | F4, F7, F9 |
| `/warehousing` | Warehousing | F9 |
| `/fourth-party-logistics` | 4PL | F10 |
| `/ecommerce` | E-commerce fulfilment (proposed page) | F4, F11, F19 |
| `/technology` | Technology solutions | F11–F13 |
| `/tracking` | Shipment tracking demonstration (synthetic) | F5 |
| `/corporate` | Corporate services and service comparison | F3, F10 |
| `/quote` | Request a quote (multi-step demo form) | — |
| `/support` | Customer support, issue reporting, mock tickets | F14–F16 |
| `/control-tower` | Demo control tower (synthetic data) | — |
| `/executive` | Executive demo mode (presentation) | — |

## 4. Imagery
Image hosts were not reachable from the build environment, so the prototype ships with original, code-drawn SVG illustrations (no third-party assets). Before any client presentation, swap in licensed logistics photography (e.g. Unsplash-licensed or Beez-supplied with written permission). No Beez logos or photos were copied.
