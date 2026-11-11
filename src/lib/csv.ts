import type { Shipment } from "@/lib/data/types";

/** CSV export of a shipment's (synthetic) temperature log. Values are escaped defensively. */
export function readingsToCsv(s: Shipment): string {
  const esc = (v: string | number) => {
    const str = String(v);
    // neutralise spreadsheet formula injection and quote special characters
    const safe = /^[=+\-@]/.test(str) && Number.isNaN(Number(str)) ? `'${str}` : str;
    return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  const header = ["shipment_id", "minutes_since_departure", "celsius", "humidity_pct", "in_band", "band_min", "band_max", "note"];
  const rows = s.readings.map((r) => [
    s.id, r.t, r.celsius.toFixed(1), r.humidity,
    r.celsius >= s.profile.min && r.celsius <= s.profile.max ? "yes" : "no",
    s.profile.min, s.profile.max, "SYNTHETIC DEMO DATA",
  ]);
  return [header, ...rows].map((row) => row.map(esc).join(",")).join("\n") + "\n";
}
