import { findShipment } from "@/lib/data/dataset";
import { TRACKING_ID } from "@/lib/schemas";
import { demoJson } from "../../_shared";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const norm = decodeURIComponent(id).trim().toUpperCase();
  if (!TRACKING_ID.test(norm)) return demoJson({ error: "invalid_id" }, { status: 400 });
  const s = findShipment(norm);
  if (!s) return demoJson({ error: "not_found" }, { status: 404 });
  return demoJson(s);
}
