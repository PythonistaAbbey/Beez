import { findShipment } from "@/lib/data/dataset";
import { planningIndex, quoteSchemas, ticketSchema, TRACKING_ID } from "@/lib/schemas";

/**
 * Calls the mock API. In the static preview build (NEXT_PUBLIC_STATIC_DEMO=1)
 * there is no server, so the same validation and synthetic responses are
 * produced in the browser instead. Nothing is sent anywhere in either mode.
 */
export async function demoFetch(url: string, init?: RequestInit): Promise<Response> {
  if (process.env.NEXT_PUBLIC_STATIC_DEMO !== "1") return fetch(url, init);
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify({ demo: true, notice: "Synthetic data from an independent concept prototype.", data }), {
      status, headers: { "Content-Type": "application/json", "X-Demo-Data": "synthetic" },
    });
  const body = () => { try { return JSON.parse(String(init?.body ?? "{}")); } catch { return null; } };

  const ship = url.match(/^\/api\/demo\/shipments\/([^/?]+)$/);
  if (ship) {
    const id = decodeURIComponent(ship[1]).trim().toUpperCase();
    if (!TRACKING_ID.test(id)) return json({ error: "invalid_id" }, 400);
    const s = findShipment(id);
    return s ? json(s) : json({ error: "not_found" }, 404);
  }
  if (url === "/api/demo/quotes") {
    const p = quoteSchemas().full.safeParse(body());
    if (!p.success) return json({ error: "validation" }, 422);
    return json({ reference: `QT-DEMO-${Math.random().toString(36).slice(2, 7).toUpperCase()}`, planningIndex: planningIndex(p.data), stored: false }, 201);
  }
  if (url === "/api/demo/tickets") {
    const p = ticketSchema().safeParse(body());
    if (!p.success) return json({ error: "validation" }, 422);
    return json({ id: `TCK-DEMO-${Math.floor(400 + Math.random() * 500)}`, state: "open", stored: false }, 201);
  }
  return json({ error: "not_found" }, 404);
}
