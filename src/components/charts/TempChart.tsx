"use client";

import { useId, useMemo, useState } from "react";
import type { TemperatureReading } from "@/lib/data/types";

export interface TempChartLabels {
  title: string;
  band: string;
  excursion: string;
  elapsed: string;
  hint: string;
}

/**
 * Temperature line with the allowed band shaded. Out-of-band points are
 * marked and labelled (never colour alone). Pointer and arrow-key crosshair.
 */
export function TempChart({
  readings, min, max, labels, height = 220, digits = (n: number) => n.toFixed(1),
}: {
  readings: TemperatureReading[];
  min: number;
  max: number;
  labels: TempChartLabels;
  height?: number;
  digits?: (n: number) => string;
}) {
  const id = useId();
  const W = 640;
  const H = height;
  const pad = { l: 40, r: 16, t: 14, b: 28 };
  const [hover, setHover] = useState<number | null>(null);

  const geo = useMemo(() => {
    const vals = readings.map((r) => r.celsius);
    const lo = Math.floor(Math.min(min - 2, ...vals) );
    const hi = Math.ceil(Math.max(max + 2, ...vals));
    const tMax = Math.max(60, readings.at(-1)?.t ?? 60);
    const x = (t: number) => pad.l + (t / tMax) * (W - pad.l - pad.r);
    const y = (c: number) => pad.t + ((hi - c) / (hi - lo)) * (H - pad.t - pad.b);
    const path = readings.map((r, i) => `${i ? "L" : "M"}${x(r.t).toFixed(1)},${y(r.celsius).toFixed(1)}`).join("");
    const yTicks: number[] = [];
    const step = hi - lo > 12 ? 4 : 2;
    for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) yTicks.push(v);
    const xTicks: number[] = [];
    const hStep = tMax > 480 ? 120 : 60;
    for (let t = 0; t <= tMax; t += hStep) xTicks.push(t);
    return { lo, hi, tMax, x, y, path, yTicks, xTicks };
  }, [readings, min, max, H]);

  const out = readings.map((r, i) => ({ r, i })).filter(({ r }) => r.celsius > max || r.celsius < min);
  const h = hover !== null ? readings[hover] : null;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const t = ((px - pad.l) / (W - pad.l - pad.r)) * geo.tMax;
    let best = 0;
    readings.forEach((r, i) => { if (Math.abs(r.t - t) < Math.abs(readings[best].t - t)) best = i; });
    setHover(best);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (!readings.length) return;
    const dir = document.documentElement.dir === "rtl" ? -1 : 1;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const d = (e.key === "ArrowRight" ? 1 : -1) * dir;
      setHover((v) => Math.min(readings.length - 1, Math.max(0, (v ?? readings.length - 1) + d)));
    }
  };
  const fmtT = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

  return (
    <figure className="w-full" dir="ltr">
      <figcaption id={`${id}-cap`} className="sr-only">
        {labels.title}. {labels.band}: {min}–{max} °C. {out.length ? `${labels.excursion}: ${out.length}` : ""} {labels.hint}
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none select-none rounded-xl focus-visible:outline-3"
        role="img"
        tabIndex={0}
        aria-labelledby={`${id}-cap`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        onKeyDown={onKey}
        onBlur={() => setHover(null)}
      >
        <defs>
          <pattern id={`${id}-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#0f9592" strokeOpacity="0.18" strokeWidth="2" />
          </pattern>
        </defs>
        {/* allowed band */}
        <rect x={pad.l} width={W - pad.l - pad.r} y={geo.y(max)} height={geo.y(min) - geo.y(max)} fill="#dff7f6" />
        <rect x={pad.l} width={W - pad.l - pad.r} y={geo.y(max)} height={geo.y(min) - geo.y(max)} fill={`url(#${id}-hatch)`} />
        <line x1={pad.l} x2={W - pad.r} y1={geo.y(max)} y2={geo.y(max)} stroke="#0f9592" strokeDasharray="4 4" strokeWidth="1" />
        <line x1={pad.l} x2={W - pad.r} y1={geo.y(min)} y2={geo.y(min)} stroke="#0f9592" strokeDasharray="4 4" strokeWidth="1" />
        <text x={W - pad.r - 4} y={geo.y(max) - 4} textAnchor="end" fontSize="11" fill="#0f8f8c">{labels.band} {min}–{max} °C</text>
        {/* grid + axes */}
        {geo.yTicks.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={geo.y(v)} y2={geo.y(v)} stroke="#e9f0f7" />
            <text x={pad.l - 8} y={geo.y(v) + 4} textAnchor="end" fontSize="11" fill="#6488ad" className="tabular">{v}°</text>
          </g>
        ))}
        {geo.xTicks.map((t) => (
          <text key={t} x={geo.x(t)} y={H - 8} textAnchor="middle" fontSize="11" fill="#6488ad" className="tabular">{t / 60}h</text>
        ))}
        <path d={geo.path} fill="none" stroke="#1a3a6b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {out.map(({ r, i }) => (
          <circle key={i} cx={geo.x(r.t)} cy={geo.y(r.celsius)} r="4" fill="#c0392b" stroke="#fff" strokeWidth="2" />
        ))}
        {out.length > 0 && (() => {
          const peak = out.reduce((m, o) => (o.r.celsius > m.r.celsius ? o : m), out[0]);
          return (
            <g>
              <text x={geo.x(peak.r.t)} y={geo.y(peak.r.celsius) - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="#c0392b">
                ▲ {labels.excursion} {digits(peak.r.celsius)} °C
              </text>
            </g>
          );
        })()}
        {h && (
          <g pointerEvents="none">
            <line x1={geo.x(h.t)} x2={geo.x(h.t)} y1={pad.t} y2={H - pad.b} stroke="#8aa7c6" strokeWidth="1" />
            <circle cx={geo.x(h.t)} cy={geo.y(h.celsius)} r="5" fill="#1a3a6b" stroke="#fff" strokeWidth="2" />
            {(() => {
              const tx = Math.min(W - pad.r - 128, Math.max(pad.l, geo.x(h.t) + 10));
              const outBand = h.celsius > max || h.celsius < min;
              return (
                <g transform={`translate(${tx},${pad.t + 4})`}>
                  <rect width="124" height="50" rx="8" fill="#0a1b38" opacity="0.94" />
                  <text x="10" y="20" fontSize="13" fontWeight="700" fill="#fff" className="tabular">{digits(h.celsius)} °C {outBand ? "▲" : ""}</text>
                  <text x="10" y="38" fontSize="11" fill="#b3c7dc" className="tabular">{labels.elapsed} {fmtT(h.t)} · RH {h.humidity}%</text>
                </g>
              );
            })()}
          </g>
        )}
      </svg>
    </figure>
  );
}
