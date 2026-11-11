import { getDataset, iso, transitMinutes, type Dataset } from "@/lib/data/dataset";
import type { Alert, Shipment, Supplier, TransportAlternative } from "@/lib/data/types";

export type ScenarioId = "cooling" | "corridor" | "vehicle";
export type AlertAction = { action: "ack" | "assign" | "esc" | "res"; simMinute: number; level?: number; note?: string };

export interface TowerState {
  simMinutes: number;
  playing: boolean;
  speed: 1 | 5 | 15;
  shipments: Shipment[];
  alerts: Alert[];
  alertLog: Record<string, AlertAction[]>;
  flagged: string[];
  scenarios: ScenarioId[];
  feed: { id: string; scenario: ScenarioId; idx: number; simMinute: number }[];
  plans: Record<string, TransportAlternative["id"]>;
  transfers: string[];
  asn: Record<string, Supplier["asnStatus"]>;
  supplierMsgs: Record<string, string[]>;
}

export type TowerAction =
  | { type: "tick"; minutes: number }
  | { type: "toggle" }
  | { type: "speed"; speed: TowerState["speed"] }
  | { type: "reset" }
  | { type: "ack" | "assign" | "resolve"; id: string }
  | { type: "escalate"; id: string; level: 1 | 2 | 3; note?: string }
  | { type: "scenario"; id: ScenarioId }
  | { type: "plan"; shipmentId: string; alt: TransportAlternative["id"] }
  | { type: "transfer"; skuId: string }
  | { type: "asn"; supplierId: string; status: Supplier["asnStatus"] }
  | { type: "supplierMsg"; supplierId: string; text: string }
  | { type: "pod"; shipmentId: string };

export function initialState(data: Dataset = getDataset()): TowerState {
  return {
    simMinutes: 0,
    playing: true,
    speed: 5,
    shipments: data.shipments,
    alerts: data.alerts,
    alertLog: {},
    flagged: [],
    scenarios: [],
    feed: [],
    plans: {},
    transfers: [],
    asn: Object.fromEntries(data.suppliers.map((s) => [s.id, s.asnStatus])),
    supplierMsgs: {},
  };
}

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 997, 7);

/** Deterministic simulated reading so the reducer stays pure and testable. */
export function simulatedReading(s: Shipment, t: number) {
  const mid = (s.profile.min + s.profile.max) / 2;
  const c = mid + Math.sin(t / 37 + hash(s.id)) * 0.9 + Math.cos(t / 91) * 0.4;
  return { t, celsius: Math.round(c * 10) / 10, humidity: 55 + Math.round(Math.sin(t / 50) * 3) };
}

function advance(s: Shipment, minutes: number): Shipment {
  if (s.status === "delivered" || s.status === "exception") return s;
  const total = transitMinutes(s.origin, s.destination);
  const progress = Math.min(1, s.progress + minutes / total);
  const elapsed = Math.round(total * progress);
  const readings = [...s.readings];
  let last = readings.at(-1)?.t ?? 0;
  while (last + 10 <= elapsed) {
    last += 10;
    readings.push(simulatedReading(s, last));
  }
  let status: Shipment["status"] = progress >= 1 ? "delivered" : progress >= 0.9 ? "out_for_delivery" : progress >= 0.75 ? "at_hub" : "in_transit";
  if (s.status === "out_for_delivery" && progress < 1) status = "out_for_delivery";
  const now = new Date(s.departedAt).getTime() + elapsed * 60_000;
  const timeline = s.timeline.map((e) => (e.done || new Date(e.at).getTime() <= now ? { ...e, done: true } : e));
  const next: Shipment = { ...s, progress, status, readings, timeline };
  if (status === "delivered" && !s.pod) {
    next.timeline = next.timeline.map((e) => ({ ...e, done: true }));
  }
  return next;
}

function pushLog(state: TowerState, id: string, entry: Omit<AlertAction, "simMinute">) {
  return { ...state.alertLog, [id]: [...(state.alertLog[id] ?? []), { ...entry, simMinute: state.simMinutes }] };
}

const SCENARIO_TARGETS: Record<ScenarioId, (s: Shipment) => boolean> = {
  cooling: (s) => s.industry === "medical" && (s.origin === "jeddah" || s.destination === "jeddah") && s.status !== "delivered",
  corridor: (s) => ((s.origin === "riyadh" && s.destination === "jeddah") || (s.origin === "jeddah" && s.destination === "riyadh") || (s.origin === "riyadh" && s.destination === "makkah")) && s.status !== "delivered",
  vehicle: (s) => s.id === "DEMO-RX-1071",
};

export function towerReducer(state: TowerState, a: TowerAction): TowerState {
  switch (a.type) {
    case "tick":
      return { ...state, simMinutes: state.simMinutes + a.minutes, shipments: state.shipments.map((s) => advance(s, a.minutes)) };
    case "toggle":
      return { ...state, playing: !state.playing };
    case "speed":
      return { ...state, speed: a.speed };
    case "reset":
      return initialState();
    case "ack":
      return {
        ...state,
        alerts: state.alerts.map((x) => (x.id === a.id && x.state === "open" ? { ...x, state: "acknowledged" } : x)),
        alertLog: pushLog(state, a.id, { action: "ack" }),
      };
    case "assign":
      return { ...state, alerts: state.alerts.map((x) => (x.id === a.id ? { ...x, assignee: "me" } : x)), alertLog: pushLog(state, a.id, { action: "assign" }) };
    case "escalate":
      return {
        ...state,
        alerts: state.alerts.map((x) => (x.id === a.id ? { ...x, state: "escalated", escalationLevel: a.level } : x)),
        alertLog: pushLog(state, a.id, { action: "esc", level: a.level, note: a.note }),
      };
    case "resolve":
      return { ...state, alerts: state.alerts.map((x) => (x.id === a.id ? { ...x, state: "resolved" } : x)), alertLog: pushLog(state, a.id, { action: "res" }) };
    case "scenario": {
      if (state.scenarios.includes(a.id)) return state;
      const affected = state.shipments.filter(SCENARIO_TARGETS[a.id]);
      const extra = a.id === "corridor" ? 120 : a.id === "vehicle" ? 180 : 60;
      const shipments = state.shipments.map((s) =>
        affected.some((x) => x.id === s.id)
          ? {
              ...s,
              delayMinutes: s.delayMinutes + extra,
              etaAt: new Date(new Date(s.etaAt).getTime() + extra * 60_000).toISOString(),
              status: a.id === "vehicle" ? ("exception" as const) : s.status,
            }
          : s,
      );
      let n = state.alerts.length + 1;
      const newAlerts: Alert[] = affected.map((s) => ({
        id: `AL-S${String(n++).padStart(3, "0")}`,
        shipmentId: s.id,
        kind: "delay",
        severity: s.industry === "medical" ? "critical" : "warning",
        raisedAt: iso(state.simMinutes),
        value: s.delayMinutes + extra,
        state: "open",
        escalationLevel: 0,
      }));
      return {
        ...state,
        shipments,
        alerts: [...newAlerts, ...state.alerts],
        flagged: [...new Set([...state.flagged, ...affected.map((s) => s.id)])],
        scenarios: [...state.scenarios, a.id],
        feed: [...[0, 1, 2].map((idx) => ({ id: `${a.id}-${idx}`, scenario: a.id, idx, simMinute: state.simMinutes })), ...state.feed],
      };
    }
    case "plan":
      return { ...state, plans: { ...state.plans, [a.shipmentId]: a.alt } };
    case "transfer":
      return state.transfers.includes(a.skuId) ? state : { ...state, transfers: [...state.transfers, a.skuId] };
    case "asn":
      return { ...state, asn: { ...state.asn, [a.supplierId]: a.status } };
    case "supplierMsg":
      if (!a.text.trim()) return state;
      return { ...state, supplierMsgs: { ...state.supplierMsgs, [a.supplierId]: [...(state.supplierMsgs[a.supplierId] ?? []), a.text.trim().slice(0, 500)] } };
    case "pod":
      return {
        ...state,
        shipments: state.shipments.map((s) =>
          s.id === a.shipmentId
            ? {
                ...s,
                status: "delivered",
                progress: 1,
                timeline: s.timeline.map((e) => ({ ...e, done: true })),
                pod: { receivedBy: "Demo receiver", signedAt: iso(state.simMinutes), photoRef: "demo", geoStamp: { lat: 0, lon: 0 }, tempAtHandover: s.readings.at(-1)?.celsius ?? s.profile.min, sealIntact: true },
              }
            : s,
        ),
      };
  }
}

/** KPI selectors (pure). */
export function selectKpis(state: TowerState) {
  const active = state.shipments.filter((s) => s.status !== "delivered");
  const readings = state.shipments.flatMap((s) => s.readings.map((r) => r.celsius >= s.profile.min && r.celsius <= s.profile.max));
  const inBand = readings.length ? (readings.filter(Boolean).length / readings.length) * 100 : 100;
  const openAlerts = state.alerts.filter((a) => a.state === "open" || a.state === "acknowledged" || a.state === "escalated").length;
  const critical = active.filter((s) => s.industry === "medical" && s.priority === "critical").length;
  const onTime = state.shipments.length ? (state.shipments.filter((s) => s.delayMinutes < 30).length / state.shipments.length) * 100 : 100;
  return { active: active.length, inBand, openAlerts, critical, onTime };
}

export function riskScore(s: Shipment): number {
  const excursions = s.readings.filter((r) => r.celsius > s.profile.max || r.celsius < s.profile.min).length;
  const prio = s.priority === "critical" ? 40 : s.priority === "high" ? 20 : 0;
  return Math.min(100, prio + Math.min(30, s.delayMinutes / 4) + excursions * 6 + (s.status === "exception" ? 25 : 0));
}

export function daysOfCover(onHand: number, reserved: number, dailyDemand: number) {
  return Math.max(0, (onHand - reserved) / dailyDemand);
}
