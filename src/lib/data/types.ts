/**
 * Database-ready data models for the control tower concept.
 *
 * Every record is synthetic. Field names map 1:1 to the suggested relational
 * schema in docs/03-architecture.md, so the mock API can later be swapped for an
 * adapter that reads from a client's real WMS / OMS / FMS through authorised APIs.
 */

export type Locale = "en" | "ar";

export type CityId =
  | "riyadh" | "jeddah" | "dammam" | "makkah" | "madinah" | "tabuk" | "abha"
  | "buraidah" | "hail" | "jazan" | "taif" | "hofuf" | "najran" | "sakaka";

export interface City {
  id: CityId;
  name: Record<Locale, string>;
  lon: number;
  lat: number;
}

export type Industry = "medical" | "food" | "cosmetics" | "ecommerce" | "beverage" | "retail" | "supplements";

/** Illustrative temperature profiles for the demo. Not a statement of Beez service ranges. */
export interface TempProfile {
  id: "pharma" | "fresh" | "controlled";
  min: number;
  max: number;
}

export type ShipmentStatus = "booked" | "picked_up" | "in_transit" | "at_hub" | "out_for_delivery" | "delivered" | "exception";

export type Priority = "critical" | "high" | "standard";

export interface TemperatureReading {
  /** minutes since departure */
  t: number;
  celsius: number;
  humidity: number;
}

export interface TimelineEvent {
  code: ShipmentStatus | "temp_alert" | "eta_updated" | "pod_captured";
  /** ISO timestamp (synthetic) */
  at: string;
  cityId: CityId;
  done: boolean;
}

export interface ProofOfDelivery {
  receivedBy: string;
  signedAt: string;
  photoRef: string;
  geoStamp: { lat: number; lon: number };
  tempAtHandover: number;
  sealIntact: boolean;
}

export interface Shipment {
  id: string; // always prefixed DEMO-
  reference: string; // customer PO (synthetic)
  industry: Industry;
  priority: Priority;
  profile: TempProfile;
  origin: CityId;
  destination: CityId;
  status: ShipmentStatus;
  /** 0..1 progress along the route at simulation time 0 */
  progress: number;
  vehicleId: string;
  pallets: number;
  departedAt: string;
  etaAt: string;
  plannedEtaAt: string;
  delayMinutes: number;
  readings: TemperatureReading[];
  timeline: TimelineEvent[];
  pod?: ProofOfDelivery;
  supplierId: string;
}

export type AlertSeverity = "critical" | "warning" | "info";
export type AlertKind = "temp_excursion" | "delay" | "door_open" | "sensor_offline" | "stock_low";

export interface Alert {
  id: string;
  shipmentId?: string;
  skuId?: string;
  kind: AlertKind;
  severity: AlertSeverity;
  raisedAt: string;
  value?: number;
  state: "open" | "acknowledged" | "escalated" | "resolved";
  escalationLevel: 0 | 1 | 2 | 3;
  assignee?: string;
}

export interface Warehouse {
  id: string;
  name: Record<Locale, string>;
  cityId: CityId;
  zones: { profile: TempProfile["id"]; capacityPallets: number; usedPallets: number; currentC: number }[];
}

export interface InventoryItem {
  skuId: string;
  name: Record<Locale, string>;
  industry: Industry;
  profile: TempProfile["id"];
  warehouseId: string;
  onHand: number;
  reserved: number;
  dailyDemand: number;
  backupWarehouseId: string;
  backupOnHand: number;
  lotExpiry: string;
  medicalPriority: boolean;
}

export interface Supplier {
  id: string;
  name: Record<Locale, string>;
  category: Industry;
  cityId: CityId;
  onTimeRate: number; // synthetic, 0..1
  nextInbound: string;
  asnStatus: "awaiting" | "confirmed" | "slot_requested" | "received";
}

export interface TransportAlternative {
  id: "reroute_hub" | "swap_vehicle" | "split_load" | "express_courier" | "hold_backup";
  etaDeltaMin: number;
  costIndex: number; // 100 = current plan
  tempRisk: "low" | "medium" | "high";
  co2Index: number; // 100 = current plan
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: "damage" | "delay" | "temperature" | "billing" | "other";
  shipmentId?: string;
  createdAt: string;
  state: "open" | "in_progress" | "resolved";
  messages: { from: "customer" | "agent"; body: string; at: string }[];
  /** Arabic copy for seeded demo tickets */
  ar?: { subject: string; bodies: string[] };
}

export interface QuoteRequest {
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  service: "cold_chain" | "warehousing" | "last_mile" | "b2b" | "fourth_party" | "ecommerce";
  industry: Industry;
  origin: CityId;
  destination: CityId;
  profile: TempProfile["id"];
  palletsPerMonth: number;
  startDate: string;
  notes?: string;
  consent: true;
}
