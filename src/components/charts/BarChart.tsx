"use client";

import { useState } from "react";

/** Single-series vertical bars with per-bar hover/focus tooltips and selective direct labels. */
export function BarChart({
  data, label, format = (n) => String(n), color = "#2f68b0", height = 200, highlightLast = true,
}: {
  data: { key: string; value: number }[];
  label: string;
  format?: (n: number) => string;
  color?: string;
  height?: number;
  highlightLast?: boolean;
}) {
  const W = 480;
  const H = height;
  const pad = { l: 8, r: 8, t: 22, b: 24 };
  const max = Math.max(1, ...data.map((d) => d.value));
  const bw = (W - pad.l - pad.r) / data.length;
  const [hover, setHover] = useState<number | null>(null);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label={label} style={{ direction: "ltr" }}>
      <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="#d5e1ee" />
      {data.map((d, i) => {
        const h = ((H - pad.t - pad.b) * d.value) / max;
        const x = pad.l + i * bw + 4;
        const w = bw - 8;
        const y = H - pad.b - h;
        const show = hover === i || (highlightLast && hover === null && i === data.length - 1);
        return (
          <g key={d.key} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0} role="img" aria-label={`${d.key}: ${format(d.value)}`}>
            <rect x={pad.l + i * bw} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
            <path d={`M${x},${H - pad.b} V${y + 4} q0,-4 4,-4 h${w - 8} q4,0 4,4 V${H - pad.b} Z`} fill={color} opacity={hover === null || hover === i ? 1 : 0.45} />
            <text x={x + w / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="#6488ad">{d.key}</text>
            {show && <text x={x + w / 2} y={y - 6} textAnchor="middle" fontSize="12" fontWeight="600" fill="#0a1b38" className="tabular">{format(d.value)}</text>}
          </g>
        );
      })}
    </svg>
  );
}
