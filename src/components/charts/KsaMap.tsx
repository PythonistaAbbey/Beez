"use client";

import { CITIES, KSA_OUTLINE, positionAlong, project } from "@/lib/data/geo";
import type { CityId, Locale } from "@/lib/data/types";

export interface MapRoute {
  id: string;
  from: CityId;
  to: CityId;
  progress: number;
  tone: "ok" | "warn" | "alert" | "done";
  label?: string;
}

const TONE = { ok: "#2ec4c0", warn: "#e2a400", alert: "#e5534b", done: "#8aa7c6" } as const;
const W = 900;
/** Label nudges where western cities sit close together. */
const LABEL_OFFSET: Partial<Record<CityId, [number, number]>> = { jeddah: [-8, -6], makkah: [8, 16], taif: [10, 4] };
const H = 680;

/**
 * Schematic map of Saudi Arabia. Routes are arcs; vehicles are dots positioned
 * by simulated progress. Not survey-accurate and not real vehicle positions.
 */
export function KsaMap({
  routes, locale, variant = "dark", selected, onSelect, showCities = true, caption, className = "",
}: {
  routes: MapRoute[];
  locale: Locale;
  variant?: "dark" | "light";
  selected?: string | null;
  onSelect?: (id: string) => void;
  showCities?: boolean;
  caption: string;
  className?: string;
}) {
  const outline = KSA_OUTLINE.map(([lon, lat]) => project(lon, lat, W, H).join(",")).join(" ");
  const dark = variant === "dark";
  const usedCities = new Set<CityId>(routes.flatMap((r) => [r.from, r.to]));
  ["riyadh", "jeddah", "dammam"].forEach((c) => usedCities.add(c as CityId));

  const arc = (r: MapRoute) => {
    const pts = Array.from({ length: 21 }, (_, i) => {
      const p = positionAlong(r.from, r.to, i / 20);
      return project(p.lon, p.lat, W, H);
    });
    return pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join("");
  };

  return (
    <figure className={className} dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label={caption}>
        <defs>
          <radialGradient id="ksa-glow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor={dark ? "#1a3a6b" : "#e9f0f7"} />
            <stop offset="100%" stopColor={dark ? "#0a1b38" : "#f5f8fc"} />
          </radialGradient>
        </defs>
        <polygon points={outline} fill="url(#ksa-glow)" stroke={dark ? "#3b5878" : "#b3c7dc"} strokeWidth="1.5" strokeLinejoin="round" />
        {routes.map((r) => {
          const isSel = selected === r.id;
          return (
            <path
              key={`p-${r.id}`}
              d={arc(r)}
              fill="none"
              stroke={TONE[r.tone]}
              strokeOpacity={selected && !isSel ? 0.18 : r.tone === "done" ? 0.4 : 0.7}
              strokeWidth={isSel ? 3 : 1.6}
              className={r.tone === "done" ? "" : "route-flow"}
            />
          );
        })}
        {showCities &&
          [...usedCities].map((c) => {
            const [x, y] = project(CITIES[c].lon, CITIES[c].lat, W, H);
            const off = LABEL_OFFSET[c] ?? [8, -6];
            return (
              <g key={c}>
                <circle cx={x} cy={y} r="4" fill={dark ? "#d5e1ee" : "#24508e"} />
                <text x={x + off[0]} y={y + off[1]} textAnchor={off[0] < 0 ? "end" : "start"} fontSize="15" fill={dark ? "#b3c7dc" : "#3b5878"} fontWeight="500">
                  {CITIES[c].name[locale]}
                </text>
              </g>
            );
          })}
        {routes.map((r) => {
          if (r.from === r.to) {
            const [x, y] = project(CITIES[r.from].lon + 0.35, CITIES[r.from].lat - 0.25, W, H);
            return <Vehicle key={`v-${r.id}`} r={r} x={x} y={y} selected={selected} onSelect={onSelect} />;
          }
          const p = positionAlong(r.from, r.to, r.progress);
          const [x, y] = project(p.lon, p.lat, W, H);
          return <Vehicle key={`v-${r.id}`} r={r} x={x} y={y} selected={selected} onSelect={onSelect} />;
        })}
      </svg>
    </figure>
  );
}

function Vehicle({ r, x, y, selected, onSelect }: { r: MapRoute; x: number; y: number; selected?: string | null; onSelect?: (id: string) => void }) {
  const isSel = selected === r.id;
  const interactive = !!onSelect;
  return (
    <g
      transform={`translate(${x},${y})`}
      style={{ transition: "transform 900ms linear", cursor: interactive ? "pointer" : undefined }}
      onClick={interactive ? () => onSelect(r.id) : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(r.id); } } : undefined}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      aria-label={r.label}
      aria-pressed={interactive ? isSel : undefined}
    >
      {r.tone !== "done" && <circle r="7" fill={TONE[r.tone]} className="pulse-ring" opacity="0.6" />}
      <circle r={isSel ? 9 : 6} fill={TONE[r.tone]} stroke="#0a1b38" strokeWidth="2" />
      {r.tone === "alert" && <text y="4" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0a1b38">!</text>}
      {interactive && <circle r="16" fill="transparent" />}
    </g>
  );
}
