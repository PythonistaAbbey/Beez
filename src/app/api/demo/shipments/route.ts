import { buildShipments } from "@/lib/data/dataset";
import { demoJson } from "../_shared";

export function GET() {
  const list = buildShipments().map(({ readings, timeline, ...s }) => ({ ...s, lastReading: readings.at(-1) ?? null, events: timeline.length }));
  return demoJson(list);
}
