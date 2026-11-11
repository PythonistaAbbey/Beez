import { describe, expect, it } from "vitest";
import { buildShipments, computeAlternatives, findShipment, getDataset, DEMO_PREFIX } from "@/lib/data/dataset";
import { distanceKm, project } from "@/lib/data/geo";

describe("synthetic dataset", () => {
  it("is deterministic across builds", () => {
    expect(JSON.stringify(buildShipments())).toEqual(JSON.stringify(buildShipments()));
  });

  it("marks every shipment ID as demo data", () => {
    for (const s of buildShipments()) expect(s.id.startsWith(DEMO_PREFIX)).toBe(true);
  });

  it("has unique shipment IDs", () => {
    const ids = buildShipments().map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("scenario DEMO-RX-1042 contains a temperature excursion above its band", () => {
    const s = findShipment("demo-rx-1042")!;
    expect(s).toBeDefined();
    expect(s.readings.some((r) => r.celsius > s.profile.max)).toBe(true);
  });

  it("derives alerts for excursions, delays and low stock", () => {
    const { alerts } = getDataset();
    const kinds = new Set(alerts.map((a) => a.kind));
    expect(kinds).toContain("temp_excursion");
    expect(kinds).toContain("delay");
    expect(kinds).toContain("stock_low");
  });

  it("delivered shipments carry proof of delivery", () => {
    for (const s of buildShipments().filter((x) => x.status === "delivered")) expect(s.pod).toBeDefined();
  });

  it("alternatives are illustrative indices around a 100 baseline", () => {
    const s = findShipment("DEMO-RX-1057")!;
    const alts = computeAlternatives(s);
    expect(alts).toHaveLength(5);
    for (const a of alts) expect(a.costIndex).toBeGreaterThanOrEqual(90);
  });
});

describe("geo helpers", () => {
  it("computes a plausible Riyadh–Jeddah distance", () => {
    const d = distanceKm("riyadh", "jeddah");
    expect(d).toBeGreaterThan(800);
    expect(d).toBeLessThan(900);
  });
  it("projects inside the viewBox", () => {
    const [x, y] = project(46.7, 24.7);
    expect(x).toBeGreaterThan(0);
    expect(x).toBeLessThan(900);
    expect(y).toBeGreaterThan(0);
    expect(y).toBeLessThan(680);
  });
});
