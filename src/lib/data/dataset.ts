import { createRng } from "./rng";
import { distanceKm } from "./geo";
import type {
  Alert, CityId, Industry, InventoryItem, Priority, Shipment, ShipmentStatus, Supplier,
  SupportTicket, TempProfile, TemperatureReading, TimelineEvent, TransportAlternative, Warehouse,
} from "./types";

/**
 * SYNTHETIC DATASET. Nothing here describes real Beez shipments, vehicles,
 * customers, sensors or stock. Times are anchored to a fixed simulation epoch
 * and shown only as clock times labelled "simulated", so no fictional event can
 * be read as a current real-world disruption.
 */
export const SIM_EPOCH = Date.UTC(2026, 0, 4, 3, 0, 0); // 06:00 Riyadh time on the simulation day
export const DEMO_PREFIX = "DEMO-";

export const PROFILES: Record<TempProfile["id"], TempProfile> = {
  pharma: { id: "pharma", min: 2, max: 8 },
  fresh: { id: "fresh", min: 5, max: 12 },
  controlled: { id: "controlled", min: 15, max: 20 },
};

const INDUSTRY_PROFILE: Record<Industry, TempProfile["id"]> = {
  medical: "pharma",
  supplements: "controlled",
  food: "fresh",
  beverage: "fresh",
  cosmetics: "controlled",
  ecommerce: "controlled",
  retail: "fresh",
};

const INDUSTRY_CODE: Record<Industry, string> = {
  medical: "RX", supplements: "SP", food: "FD", beverage: "BV", cosmetics: "CS", ecommerce: "EC", retail: "RT",
};

const AVG_SPEED_KMH = 72;
const READING_INTERVAL_MIN = 10;

export const iso = (minutesFromEpoch: number) => new Date(SIM_EPOCH + minutesFromEpoch * 60_000).toISOString();

export function transitMinutes(o: CityId, d: CityId) {
  return Math.round((distanceKm(o, d) * 1.25 * 60) / AVG_SPEED_KMH) + 45; // road factor + handling
}

interface Seed {
  n: number;
  industry: Industry;
  priority: Priority;
  origin: CityId;
  destination: CityId;
  progress: number;
  delay?: number;
  /** minutes into the trip where an excursion starts, and its peak overshoot (°C) */
  excursion?: { at: number; peak: number; duration: number };
  forceStatus?: ShipmentStatus;
}

// Hand-shaped scenarios first (these drive the guided demo), then generated volume.
const SCENARIOS: Seed[] = [
  { n: 1042, industry: "medical", priority: "critical", origin: "riyadh", destination: "jeddah", progress: 0.58, excursion: { at: 190, peak: 2.6, duration: 40 } },
  { n: 1057, industry: "medical", priority: "critical", origin: "dammam", destination: "riyadh", progress: 0.71, delay: 95 },
  { n: 1063, industry: "medical", priority: "high", origin: "jeddah", destination: "madinah", progress: 0.33 },
  { n: 2210, industry: "food", priority: "standard", origin: "riyadh", destination: "buraidah", progress: 1, forceStatus: "delivered" },
  { n: 2231, industry: "food", priority: "high", origin: "jeddah", destination: "abha", progress: 0.44, delay: 50 },
  { n: 3108, industry: "cosmetics", priority: "standard", origin: "riyadh", destination: "dammam", progress: 0.86 },
  { n: 4410, industry: "ecommerce", priority: "standard", origin: "riyadh", destination: "riyadh", progress: 0.9, forceStatus: "out_for_delivery" },
  { n: 5120, industry: "beverage", priority: "standard", origin: "dammam", destination: "hofuf", progress: 1, forceStatus: "delivered" },
  { n: 1071, industry: "medical", priority: "critical", origin: "riyadh", destination: "tabuk", progress: 0.22, excursion: { at: 60, peak: 1.4, duration: 20 } },
  { n: 6015, industry: "supplements", priority: "standard", origin: "jeddah", destination: "makkah", progress: 0.65 },
];

const ROUTES: [CityId, CityId][] = [
  ["riyadh", "hail"], ["riyadh", "najran"], ["jeddah", "taif"], ["jeddah", "jazan"], ["dammam", "hofuf"],
  ["riyadh", "sakaka"], ["madinah", "tabuk"], ["riyadh", "abha"], ["dammam", "buraidah"], ["jeddah", "riyadh"],
  ["riyadh", "makkah"], ["abha", "jazan"], ["hail", "sakaka"], ["dammam", "jeddah"],
];

const INDUSTRIES: Industry[] = ["medical", "food", "cosmetics", "ecommerce", "beverage", "retail", "supplements"];

function makeReadings(seed: Seed, elapsed: number, rng: ReturnType<typeof createRng>): TemperatureReading[] {
  const profile = PROFILES[INDUSTRY_PROFILE[seed.industry]];
  const mid = (profile.min + profile.max) / 2;
  const readings: TemperatureReading[] = [];
  let drift = 0;
  for (let t = 0; t <= elapsed; t += READING_INTERVAL_MIN) {
    drift = drift * 0.8 + rng.normal(0, 0.25);
    let c = mid + drift + Math.sin(t / 55) * 0.6;
    const ex = seed.excursion;
    if (ex && t >= ex.at && t <= ex.at + ex.duration) {
      const k = Math.sin(((t - ex.at) / ex.duration) * Math.PI);
      c = profile.max + ex.peak * k + 0.05;
    }
    c = Math.max(profile.min - 0.4, c);
    readings.push({ t, celsius: Math.round(c * 10) / 10, humidity: Math.round(55 + rng.normal(0, 3)) });
  }
  return readings;
}

function makeTimeline(s: Omit<Shipment, "timeline" | "readings">, total: number, hasExcursion: boolean, excursionAt?: number): TimelineEvent[] {
  const depart = 0;
  const elapsed = total * s.progress;
  const steps: { code: TimelineEvent["code"]; at: number; city: CityId }[] = [
    { code: "booked", at: depart - 240, city: s.origin },
    { code: "picked_up", at: depart, city: s.origin },
    { code: "in_transit", at: depart + 20, city: s.origin },
  ];
  if (hasExcursion && excursionAt !== undefined) steps.push({ code: "temp_alert", at: excursionAt, city: s.origin });
  if (s.delayMinutes > 0) steps.push({ code: "eta_updated", at: Math.max(30, elapsed - 40), city: s.origin });
  steps.push({ code: "at_hub", at: total * 0.75, city: s.destination });
  steps.push({ code: "out_for_delivery", at: total * 0.9, city: s.destination });
  steps.push({ code: "delivered", at: total + s.delayMinutes, city: s.destination });
  if (s.status === "delivered") steps.push({ code: "pod_captured", at: total + s.delayMinutes + 3, city: s.destination });
  return steps
    .sort((a, b) => a.at - b.at)
    .map((e) => ({
      code: e.code,
      at: iso(e.at),
      cityId: e.city,
      done: s.status === "delivered" ? true : e.at <= elapsed,
    }));
}

function statusFor(progress: number, forced?: ShipmentStatus): ShipmentStatus {
  if (forced) return forced;
  if (progress >= 1) return "delivered";
  if (progress >= 0.9) return "out_for_delivery";
  if (progress >= 0.75) return "at_hub";
  if (progress > 0) return "in_transit";
  return "booked";
}

function buildShipment(seed: Seed, rng: ReturnType<typeof createRng>): Shipment {
  const total = transitMinutes(seed.origin, seed.destination);
  const elapsed = Math.round(total * Math.min(seed.progress, 1));
  const profile = PROFILES[INDUSTRY_PROFILE[seed.industry]];
  const delay = seed.delay ?? 0;
  const status = statusFor(seed.progress, seed.forceStatus);
  const base: Omit<Shipment, "timeline" | "readings"> = {
    id: `${DEMO_PREFIX}${INDUSTRY_CODE[seed.industry]}-${seed.n}`,
    reference: `PO-${(seed.n * 37) % 90000 + 10000}`,
    industry: seed.industry,
    priority: seed.priority,
    profile,
    origin: seed.origin,
    destination: seed.destination,
    status,
    progress: seed.progress,
    vehicleId: `VH-${String(rng.int(100, 999))}`,
    pallets: rng.int(2, 18),
    departedAt: iso(-elapsed),
    plannedEtaAt: iso(total - elapsed),
    etaAt: iso(total - elapsed + delay),
    delayMinutes: delay,
    supplierId: `SUP-${(seed.n % 6) + 1}`,
  };
  // Re-anchor so "now" (minute 0 of the simulation) is the shipment's elapsed point
  const shifted = { ...base };
  const readings = makeReadings(seed, elapsed, rng);
  const timeline = makeTimeline(shifted, total, !!seed.excursion, seed.excursion?.at).map((e) => ({
    ...e,
    at: new Date(new Date(e.at).getTime() - elapsed * 60_000).toISOString(),
  }));
  const shipment: Shipment = { ...shifted, readings, timeline };
  if (status === "delivered") {
    shipment.pod = {
      receivedBy: rng.pick(["Receiving desk", "Pharmacy store", "Store manager", "Goods-in team"]),
      signedAt: iso(-rng.int(15, 140)),
      photoRef: "demo-pod-photo",
      geoStamp: { lat: 0, lon: 0 },
      tempAtHandover: readings.at(-1)?.celsius ?? profile.min + 1,
      sealIntact: true,
    };
  }
  return shipment;
}

export function buildShipments(): Shipment[] {
  const rng = createRng(20260104);
  const list = SCENARIOS.map((s) => buildShipment(s, rng));
  ROUTES.forEach(([o, d], i) => {
    const industry = INDUSTRIES[i % INDUSTRIES.length];
    const progress = Math.round(rng.next() * 100) / 100;
    list.push(
      buildShipment(
        {
          n: 7000 + i * 13,
          industry,
          priority: industry === "medical" ? "high" : "standard",
          origin: o,
          destination: d,
          progress,
          delay: rng.next() > 0.8 ? rng.int(20, 60) : 0,
        },
        rng,
      ),
    );
  });
  return list;
}

export function deriveAlerts(shipments: Shipment[], inventory: InventoryItem[]): Alert[] {
  const alerts: Alert[] = [];
  let k = 1;
  for (const s of shipments) {
    const over = s.readings.filter((r) => r.celsius > s.profile.max || r.celsius < s.profile.min);
    if (over.length) {
      const peak = over.reduce((m, r) => (r.celsius > m.celsius ? r : m), over[0]);
      alerts.push({
        id: `AL-${String(k++).padStart(3, "0")}`, shipmentId: s.id, kind: "temp_excursion",
        severity: s.industry === "medical" ? "critical" : "warning",
        raisedAt: new Date(new Date(s.departedAt).getTime() + peak.t * 60_000).toISOString(),
        value: peak.celsius, state: "open", escalationLevel: 0,
      });
    }
    if (s.delayMinutes >= 30 && s.status !== "delivered") {
      alerts.push({
        id: `AL-${String(k++).padStart(3, "0")}`, shipmentId: s.id, kind: "delay",
        severity: s.priority === "critical" ? "critical" : "warning",
        raisedAt: iso(-35), value: s.delayMinutes, state: "open", escalationLevel: 0,
      });
    }
  }
  for (const item of inventory) {
    const cover = (item.onHand - item.reserved) / item.dailyDemand;
    if (cover < 3) {
      alerts.push({
        id: `AL-${String(k++).padStart(3, "0")}`, skuId: item.skuId, kind: "stock_low",
        severity: item.medicalPriority ? "critical" : "warning", raisedAt: iso(-90),
        value: Math.round(cover * 10) / 10, state: "open", escalationLevel: 0,
      });
    }
  }
  alerts.push({ id: `AL-${String(k++).padStart(3, "0")}`, shipmentId: shipments[5].id, kind: "door_open", severity: "info", raisedAt: iso(-12), state: "open", escalationLevel: 0 });
  alerts.push({ id: `AL-${String(k++).padStart(3, "0")}`, shipmentId: shipments[12].id, kind: "sensor_offline", severity: "warning", raisedAt: iso(-8), state: "open", escalationLevel: 0 });
  return alerts;
}

export const WAREHOUSES: Warehouse[] = [
  { id: "WH-C", name: { en: "Central hub (demo)", ar: "المركز الرئيسي (تجريبي)" }, cityId: "riyadh", zones: [
    { profile: "pharma", capacityPallets: 400, usedPallets: 318, currentC: 4.6 },
    { profile: "fresh", capacityPallets: 900, usedPallets: 655, currentC: 7.9 },
    { profile: "controlled", capacityPallets: 1200, usedPallets: 744, currentC: 17.8 },
  ] },
  { id: "WH-W", name: { en: "Western hub (demo)", ar: "مركز الغربية (تجريبي)" }, cityId: "jeddah", zones: [
    { profile: "pharma", capacityPallets: 260, usedPallets: 241, currentC: 5.1 },
    { profile: "fresh", capacityPallets: 700, usedPallets: 402, currentC: 8.4 },
    { profile: "controlled", capacityPallets: 800, usedPallets: 590, currentC: 18.3 },
  ] },
  { id: "WH-E", name: { en: "Eastern hub (demo)", ar: "مركز الشرقية (تجريبي)" }, cityId: "dammam", zones: [
    { profile: "pharma", capacityPallets: 180, usedPallets: 96, currentC: 4.2 },
    { profile: "fresh", capacityPallets: 500, usedPallets: 377, currentC: 7.2 },
    { profile: "controlled", capacityPallets: 600, usedPallets: 288, currentC: 17.1 },
  ] },
];

export const INVENTORY: InventoryItem[] = [
  { skuId: "SKU-RX-01", name: { en: "Insulin cartridges (generic demo SKU)", ar: "خراطيش إنسولين (صنف تجريبي)" }, industry: "medical", profile: "pharma", warehouseId: "WH-W", onHand: 1840, reserved: 1210, dailyDemand: 260, backupWarehouseId: "WH-C", backupOnHand: 2400, lotExpiry: "2027-03", medicalPriority: true },
  { skuId: "SKU-RX-02", name: { en: "Vaccine vials (demo SKU)", ar: "قوارير لقاحات (صنف تجريبي)" }, industry: "medical", profile: "pharma", warehouseId: "WH-C", onHand: 5200, reserved: 1400, dailyDemand: 610, backupWarehouseId: "WH-E", backupOnHand: 1900, lotExpiry: "2026-12", medicalPriority: true },
  { skuId: "SKU-RX-03", name: { en: "Diagnostic reagent kits (demo)", ar: "مجموعات كواشف تشخيصية (تجريبي)" }, industry: "medical", profile: "pharma", warehouseId: "WH-E", onHand: 640, reserved: 120, dailyDemand: 75, backupWarehouseId: "WH-C", backupOnHand: 300, lotExpiry: "2027-06", medicalPriority: true },
  { skuId: "SKU-RX-04", name: { en: "Biologic infusion kits (demo)", ar: "مجموعات تسريب حيوية (تجريبي)" }, industry: "medical", profile: "pharma", warehouseId: "WH-C", onHand: 410, reserved: 260, dailyDemand: 58, backupWarehouseId: "WH-W", backupOnHand: 90, lotExpiry: "2026-11", medicalPriority: true },
  { skuId: "SKU-SP-01", name: { en: "Probiotic supplements (demo)", ar: "مكملات بروبيوتيك (تجريبي)" }, industry: "supplements", profile: "controlled", warehouseId: "WH-C", onHand: 3300, reserved: 500, dailyDemand: 220, backupWarehouseId: "WH-W", backupOnHand: 1200, lotExpiry: "2027-09", medicalPriority: false },
  { skuId: "SKU-FD-01", name: { en: "Fresh dairy assortment (demo)", ar: "تشكيلة ألبان طازجة (تجريبي)" }, industry: "food", profile: "fresh", warehouseId: "WH-C", onHand: 7600, reserved: 4100, dailyDemand: 2300, backupWarehouseId: "WH-E", backupOnHand: 3000, lotExpiry: "2026-01", medicalPriority: false },
  { skuId: "SKU-CS-01", name: { en: "Skincare serum (demo)", ar: "سيروم عناية بالبشرة (تجريبي)" }, industry: "cosmetics", profile: "controlled", warehouseId: "WH-W", onHand: 2100, reserved: 300, dailyDemand: 140, backupWarehouseId: "WH-C", backupOnHand: 800, lotExpiry: "2027-12", medicalPriority: false },
  { skuId: "SKU-BV-01", name: { en: "Chilled juice cases (demo)", ar: "عصائر مبردة (تجريبي)" }, industry: "beverage", profile: "fresh", warehouseId: "WH-E", onHand: 980, reserved: 640, dailyDemand: 190, backupWarehouseId: "WH-C", backupOnHand: 1500, lotExpiry: "2026-02", medicalPriority: false },
];

export const SUPPLIERS: Supplier[] = [
  { id: "SUP-1", name: { en: "Northwind Pharma (fictional)", ar: "نورثويند فارما (اسم وهمي)" }, category: "medical", cityId: "riyadh", onTimeRate: 0.96, nextInbound: iso(150), asnStatus: "confirmed" },
  { id: "SUP-2", name: { en: "Red Sea Fresh Foods (fictional)", ar: "أغذية البحر الأحمر (اسم وهمي)" }, category: "food", cityId: "jeddah", onTimeRate: 0.91, nextInbound: iso(240), asnStatus: "awaiting" },
  { id: "SUP-3", name: { en: "Oasis Cosmetics Co. (fictional)", ar: "شركة واحة لمستحضرات التجميل (اسم وهمي)" }, category: "cosmetics", cityId: "dammam", onTimeRate: 0.88, nextInbound: iso(420), asnStatus: "slot_requested" },
  { id: "SUP-4", name: { en: "Crescent Diagnostics (fictional)", ar: "الهلال للتشخيص (اسم وهمي)" }, category: "medical", cityId: "dammam", onTimeRate: 0.94, nextInbound: iso(90), asnStatus: "confirmed" },
  { id: "SUP-5", name: { en: "Palm Valley Beverages (fictional)", ar: "وادي النخيل للمشروبات (اسم وهمي)" }, category: "beverage", cityId: "hofuf", onTimeRate: 0.9, nextInbound: iso(600), asnStatus: "awaiting" },
  { id: "SUP-6", name: { en: "Dune Wellness Labs (fictional)", ar: "مختبرات الكثبان للعافية (اسم وهمي)" }, category: "supplements", cityId: "riyadh", onTimeRate: 0.97, nextInbound: iso(-30), asnStatus: "received" },
];

export const TICKETS: SupportTicket[] = [
  { id: "TCK-DEMO-301", subject: "Carton crushed on arrival", category: "damage", shipmentId: "DEMO-FD-2210", createdAt: iso(-300), state: "in_progress", messages: [
    { from: "customer", body: "Two cartons arrived with a crushed corner. Photos attached.", at: iso(-300) },
    { from: "agent", body: "Thank you. We have logged the damage against the proof of delivery and opened a claim review.", at: iso(-270) },
  ], ar: { subject: "كرتون متضرر عند الوصول", bodies: ["وصل كرتونان بزاوية متضررة. الصور مرفقة.", "شكرًا لك. سجلنا الضرر مقابل إثبات التسليم وفتحنا مراجعة للمطالبة."] } },
  { id: "TCK-DEMO-288", subject: "Requested temperature log", category: "temperature", shipmentId: "DEMO-BV-5120", createdAt: iso(-1500), state: "resolved", messages: [
    { from: "customer", body: "Please share the full temperature log for our audit.", at: iso(-1500) },
    { from: "agent", body: "The full log is now available as a CSV from the shipment page.", at: iso(-1460) },
  ], ar: { subject: "طلب سجل الحرارة", bodies: ["يرجى مشاركة سجل الحرارة الكامل لأغراض التدقيق.", "السجل الكامل متاح الآن بصيغة CSV من صفحة الشحنة."] } },
];

export function computeAlternatives(s: Shipment): TransportAlternative[] {
  const remaining = transitMinutes(s.origin, s.destination) * (1 - s.progress);
  const r = Math.max(30, Math.round(remaining));
  return [
    { id: "reroute_hub", etaDeltaMin: -Math.round(Math.min(s.delayMinutes, r * 0.25)), costIndex: 108, tempRisk: "low", co2Index: 104 },
    { id: "swap_vehicle", etaDeltaMin: -Math.round(s.delayMinutes * 0.6) + 25, costIndex: 115, tempRisk: "low", co2Index: 100 },
    { id: "split_load", etaDeltaMin: -Math.round(s.delayMinutes * 0.4), costIndex: 126, tempRisk: "medium", co2Index: 132 },
    { id: "express_courier", etaDeltaMin: -Math.round(s.delayMinutes * 0.85), costIndex: 182, tempRisk: "medium", co2Index: 160 },
    { id: "hold_backup", etaDeltaMin: -s.delayMinutes, costIndex: 112, tempRisk: "low", co2Index: 90 },
  ];
}

/** Eight synthetic weeks of KPIs for the analytics view. */
export function buildAnalytics() {
  const rng = createRng(77);
  const weeks = Array.from({ length: 8 }, (_, i) => ({
    week: i + 1,
    onTime: Math.round((93 + rng.normal(0, 1.4) + i * 0.35) * 10) / 10,
    excursions: Math.max(0, Math.round(6 - i * 0.45 + rng.normal(0, 1))),
    shipments: Math.round(1200 + i * 38 + rng.normal(0, 40)),
  }));
  const byIndustry: { industry: Industry; share: number }[] = [
    { industry: "medical", share: 31 },
    { industry: "food", share: 24 },
    { industry: "ecommerce", share: 17 },
    { industry: "cosmetics", share: 11 },
    { industry: "beverage", share: 9 },
    { industry: "supplements", share: 8 },
  ];
  return { weeks, byIndustry };
}

export function getDataset() {
  const shipments = buildShipments();
  return {
    shipments,
    alerts: deriveAlerts(shipments, INVENTORY),
    warehouses: WAREHOUSES,
    inventory: INVENTORY,
    suppliers: SUPPLIERS,
    tickets: TICKETS,
    analytics: buildAnalytics(),
  };
}

export type Dataset = ReturnType<typeof getDataset>;

export function findShipment(id: string): Shipment | undefined {
  const norm = id.trim().toUpperCase();
  return buildShipments().find((s) => s.id === norm);
}
