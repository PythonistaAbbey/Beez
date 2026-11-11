import type { City, CityId } from "./types";

export const CITIES: Record<CityId, City> = {
  riyadh: { id: "riyadh", name: { en: "Riyadh", ar: "الرياض" }, lon: 46.72, lat: 24.71 },
  jeddah: { id: "jeddah", name: { en: "Jeddah", ar: "جدة" }, lon: 39.19, lat: 21.49 },
  dammam: { id: "dammam", name: { en: "Dammam", ar: "الدمام" }, lon: 50.1, lat: 26.43 },
  makkah: { id: "makkah", name: { en: "Makkah", ar: "مكة المكرمة" }, lon: 39.83, lat: 21.42 },
  madinah: { id: "madinah", name: { en: "Madinah", ar: "المدينة المنورة" }, lon: 39.61, lat: 24.52 },
  tabuk: { id: "tabuk", name: { en: "Tabuk", ar: "تبوك" }, lon: 36.57, lat: 28.38 },
  abha: { id: "abha", name: { en: "Abha", ar: "أبها" }, lon: 42.5, lat: 18.22 },
  buraidah: { id: "buraidah", name: { en: "Buraidah", ar: "بريدة" }, lon: 43.97, lat: 26.33 },
  hail: { id: "hail", name: { en: "Hail", ar: "حائل" }, lon: 41.69, lat: 27.52 },
  jazan: { id: "jazan", name: { en: "Jazan", ar: "جازان" }, lon: 42.55, lat: 16.89 },
  taif: { id: "taif", name: { en: "Taif", ar: "الطائف" }, lon: 40.42, lat: 21.27 },
  hofuf: { id: "hofuf", name: { en: "Al Hofuf", ar: "الهفوف" }, lon: 49.59, lat: 25.38 },
  najran: { id: "najran", name: { en: "Najran", ar: "نجران" }, lon: 44.13, lat: 17.49 },
  sakaka: { id: "sakaka", name: { en: "Sakaka", ar: "سكاكا" }, lon: 40.21, lat: 29.97 },
};

/** Simplified outline of Saudi Arabia (lon, lat). Schematic only, not survey-accurate. */
export const KSA_OUTLINE: [number, number][] = [
  [34.95, 29.36], [36.07, 29.19], [36.5, 29.5], [37.5, 30.0], [38.0, 30.5], [37.0, 31.5], [39.2, 32.15],
  [40.4, 31.9], [42.1, 31.1], [44.7, 29.2], [46.5, 29.1], [47.4, 29.0], [47.7, 28.5], [48.4, 28.5],
  [48.8, 27.6], [49.3, 27.1], [50.1, 26.6], [50.2, 25.7], [50.8, 24.75], [51.6, 24.25], [52.6, 22.9],
  [55.1, 22.6], [55.7, 22.0], [55.0, 20.0], [52.0, 19.0], [49.1, 18.6], [48.2, 18.2], [47.0, 16.9],
  [46.3, 17.2], [44.0, 17.4], [43.3, 17.5], [42.8, 16.4], [42.6, 16.8], [42.0, 17.8], [41.2, 19.1],
  [40.2, 20.3], [39.2, 21.5], [38.9, 22.4], [38.1, 24.0], [37.2, 25.3], [36.5, 26.0], [35.6, 27.4],
  [35.1, 28.1], [34.6, 28.1], [34.8, 28.9],
];

export const MAP_BOUNDS = { minLon: 34, maxLon: 56.5, minLat: 15.8, maxLat: 32.8 };

/** Equirectangular projection into an SVG viewBox of width × height. */
export function project(lon: number, lat: number, width = 900, height = 680): [number, number] {
  const { minLon, maxLon, minLat, maxLat } = MAP_BOUNDS;
  const x = ((lon - minLon) / (maxLon - minLon)) * width;
  const y = ((maxLat - lat) / (maxLat - minLat)) * height;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

/** Great-circle-ish distance in km (haversine). */
export function distanceKm(a: CityId, b: CityId): number {
  const A = CITIES[a];
  const B = CITIES[b];
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(B.lat - A.lat);
  const dLon = toRad(B.lon - A.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(A.lat)) * Math.cos(toRad(B.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

/** Linear interpolation of a position along a route, with a gentle arc so routes don't overlap. */
export function positionAlong(a: CityId, b: CityId, progress: number): { lon: number; lat: number } {
  const A = CITIES[a];
  const B = CITIES[b];
  const p = Math.min(1, Math.max(0, progress));
  const lon = A.lon + (B.lon - A.lon) * p;
  const lat = A.lat + (B.lat - A.lat) * p;
  const bulge = Math.sin(Math.PI * p) * 0.6;
  // perpendicular offset
  const dx = B.lon - A.lon;
  const dy = B.lat - A.lat;
  const len = Math.hypot(dx, dy) || 1;
  return { lon: lon + (-dy / len) * bulge, lat: lat + (dx / len) * bulge };
}
