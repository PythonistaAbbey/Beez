"use client";

import { useState } from "react";

/** Single-series line with markers and hover/focus tooltip. */
export function LineChart({
  data, label, format = (n) => String(n), domain, height = 200, color = "#0f9592",
}: {
  data: { key: string; value: number }[];
  label: string;
  format?: (n: number) => string;
  domain: [number, number];
  height?: number;
  color?: string;
}) {
  const W = 480;
  const H = height;
  const pad = { l: 36, r: 16, t: 24, b: 24 };
  const [hover, setHover] = useState<number | null>(null);
  const x = (i: number) => pad.l + (i / Math.max(1, data.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + ((domain[1] - v) / (domain[1] - domain[0])) * (H - pad.t - pad.b);
  const ticks = [domain[0], (domain[0] + domain[1]) / 2, domain[1]];
  const active = hover ?? data.length - 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label={label} style={{ direction: "ltr" }} onPointerLeave={() => setHover(null)}>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#e9f0f7" />
          <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#6488ad">{format(v)}</text>
        </g>
      ))}
      <path d={data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`).join("")} fill="none" stroke={color} strokeWidth="2" />
      {data.map((d, i) => (
        <g key={d.key} tabIndex={0} role="img" aria-label={`${d.key}: ${format(d.value)}`} onPointerEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
          <rect x={x(i) - 16} y={pad.t} width="32" height={H - pad.t - pad.b} fill="transparent" />
          <circle cx={x(i)} cy={y(d.value)} r={active === i ? 5 : 4} fill={active === i ? color : "#fff"} stroke={color} strokeWidth="2" />
          <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="#6488ad">{d.key}</text>
          {active === i && <text x={x(i)} y={y(d.value) - 10} textAnchor="middle" fontSize="12" fontWeight="600" fill="#0a1b38">{format(d.value)}</text>}
        </g>
      ))}
    </svg>
  );
}
