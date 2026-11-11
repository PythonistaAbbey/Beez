import { describe, expect, it } from "vitest";
import { planningIndex, quoteSchemas, ticketSchema, TRACKING_ID } from "@/lib/schemas";
import { readingsToCsv } from "@/lib/csv";
import { findShipment } from "@/lib/data/dataset";

const valid = {
  company: "Acme Pharma", contactName: "Sara", email: "sara@example.com", phone: "+966 55 123 4567",
  service: "cold_chain", industry: "medical", origin: "riyadh", destination: "jeddah", profile: "pharma",
  palletsPerMonth: "40", startDate: "2027-02-01", notes: "", consent: true,
};

describe("quote schema", () => {
  it("accepts a complete request and coerces pallets", () => {
    const r = quoteSchemas().full.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.palletsPerMonth).toBe(40);
      expect(r.data.phone).toBe("+966551234567");
    }
  });
  it.each([
    ["email", { email: "nope" }],
    ["phone", { phone: "12345" }],
    ["palletsPerMonth", { palletsPerMonth: "0" }],
    ["consent", { consent: false }],
    ["company", { company: " " }],
  ])("rejects invalid %s", (field, patch) => {
    const r = quoteSchemas().full.safeParse({ ...valid, ...patch });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path[0]).toBe(field);
  });
  it("planning index is cheaper for higher volume and same-city", () => {
    const base = { profile: "pharma", service: "cold_chain", origin: "riyadh", destination: "jeddah" } as const;
    expect(planningIndex({ ...base, palletsPerMonth: 600 }).low).toBeLessThan(planningIndex({ ...base, palletsPerMonth: 10 }).low);
    expect(planningIndex({ ...base, destination: "riyadh", palletsPerMonth: 10 }).low).toBeLessThan(planningIndex({ ...base, palletsPerMonth: 10 }).low);
  });
});

describe("ticket schema and tracking id", () => {
  it("normalises the shipment ID to upper case", () => {
    const r = ticketSchema().safeParse({ category: "damage", shipmentId: "demo-rx-1042", subject: "Box", description: "Box was crushed on arrival" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.shipmentId).toBe("DEMO-RX-1042");
  });
  it("rejects real-looking IDs", () => {
    expect(TRACKING_ID.test("BZ-123456")).toBe(false);
    expect(TRACKING_ID.test("DEMO-RX-1042")).toBe(true);
  });
});

describe("CSV export", () => {
  it("includes a header, every reading and a synthetic marker", () => {
    const s = findShipment("DEMO-RX-1042")!;
    const lines = readingsToCsv(s).trim().split("\n");
    expect(lines[0]).toContain("shipment_id");
    expect(lines).toHaveLength(s.readings.length + 1);
    expect(lines[1]).toContain("SYNTHETIC DEMO DATA");
  });
});
