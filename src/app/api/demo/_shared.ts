import { NextResponse } from "next/server";

/** Every mock API response carries an explicit demo marker and is never cached as real data. */
export function demoJson(body: unknown, init?: ResponseInit) {
  return NextResponse.json(
    { demo: true, notice: "Synthetic data from an independent concept prototype. Not connected to Beez Logistics systems.", data: body },
    { ...init, headers: { "Cache-Control": "no-store", "X-Demo-Data": "synthetic", ...(init?.headers ?? {}) } },
  );
}

/** Reject oversized bodies before parsing (defence in depth for the mock endpoints). */
export async function readJson(req: Request, maxBytes = 16_000): Promise<unknown> {
  const text = await req.text();
  if (text.length > maxBytes) throw new Error("payload_too_large");
  return JSON.parse(text);
}
