import { describe, expect, it } from "vitest";
import { daysOfCover, initialState, riskScore, selectKpis, towerReducer } from "@/lib/tower/store";

describe("control tower reducer", () => {
  it("advances in-transit shipments on tick and never moves delivered ones", () => {
    const s0 = initialState();
    const s1 = towerReducer(s0, { type: "tick", minutes: 30 });
    const moving = s0.shipments.find((s) => s.status === "in_transit")!;
    const delivered = s0.shipments.find((s) => s.status === "delivered")!;
    expect(s1.shipments.find((s) => s.id === moving.id)!.progress).toBeGreaterThan(moving.progress);
    expect(s1.shipments.find((s) => s.id === delivered.id)!.progress).toBe(delivered.progress);
    expect(s1.simMinutes).toBe(30);
  });

  it("appends simulated readings as time passes", () => {
    const s0 = initialState();
    const id = "DEMO-RX-1063";
    const before = s0.shipments.find((s) => s.id === id)!.readings.length;
    const s1 = towerReducer(s0, { type: "tick", minutes: 60 });
    expect(s1.shipments.find((s) => s.id === id)!.readings.length).toBeGreaterThan(before);
  });

  it("acknowledge → escalate → resolve with an audit trail", () => {
    let s = initialState();
    const a = s.alerts.find((x) => x.kind === "temp_excursion")!;
    s = towerReducer(s, { type: "ack", id: a.id });
    expect(s.alerts.find((x) => x.id === a.id)!.state).toBe("acknowledged");
    s = towerReducer(s, { type: "escalate", id: a.id, level: 2, note: "Check probe" });
    const esc = s.alerts.find((x) => x.id === a.id)!;
    expect(esc.state).toBe("escalated");
    expect(esc.escalationLevel).toBe(2);
    s = towerReducer(s, { type: "resolve", id: a.id });
    expect(s.alerts.find((x) => x.id === a.id)!.state).toBe("resolved");
    expect(s.alertLog[a.id].map((l) => l.action)).toEqual(["ack", "esc", "res"]);
    expect(s.alertLog[a.id][1].note).toBe("Check probe");
  });

  it("running a scenario flags shipments, adds alerts and mock notifications once", () => {
    let s = initialState();
    const alerts = s.alerts.length;
    s = towerReducer(s, { type: "scenario", id: "vehicle" });
    expect(s.flagged).toContain("DEMO-RX-1071");
    expect(s.shipments.find((x) => x.id === "DEMO-RX-1071")!.status).toBe("exception");
    expect(s.alerts.length).toBeGreaterThan(alerts);
    expect(s.feed).toHaveLength(3);
    const again = towerReducer(s, { type: "scenario", id: "vehicle" });
    expect(again).toBe(s);
  });

  it("capturing POD delivers the shipment", () => {
    const s = towerReducer(initialState(), { type: "pod", shipmentId: "DEMO-RX-1042" });
    const sh = s.shipments.find((x) => x.id === "DEMO-RX-1042")!;
    expect(sh.status).toBe("delivered");
    expect(sh.pod).toBeDefined();
  });

  it("ignores empty supplier messages and trims long ones", () => {
    let s = towerReducer(initialState(), { type: "supplierMsg", supplierId: "SUP-1", text: "   " });
    expect(s.supplierMsgs["SUP-1"]).toBeUndefined();
    s = towerReducer(s, { type: "supplierMsg", supplierId: "SUP-1", text: "x".repeat(900) });
    expect(s.supplierMsgs["SUP-1"][0]).toHaveLength(500);
  });

  it("KPIs are within sane bounds", () => {
    const k = selectKpis(initialState());
    expect(k.inBand).toBeGreaterThan(90);
    expect(k.inBand).toBeLessThanOrEqual(100);
    expect(k.openAlerts).toBeGreaterThan(0);
  });

  it("risk score is bounded and prioritises critical shipments", () => {
    const s = initialState();
    const crit = s.shipments.find((x) => x.id === "DEMO-RX-1042")!;
    const std = s.shipments.find((x) => x.id === "DEMO-CS-3108")!;
    expect(riskScore(crit)).toBeGreaterThan(riskScore(std));
    for (const x of s.shipments) expect(riskScore(x)).toBeLessThanOrEqual(100);
  });

  it("days of cover never goes negative", () => {
    expect(daysOfCover(10, 50, 5)).toBe(0);
    expect(daysOfCover(100, 0, 10)).toBe(10);
  });
});
