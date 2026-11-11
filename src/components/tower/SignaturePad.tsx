"use client";

import { useRef, useState } from "react";

/** Minimal pointer-based signature pad (proof-of-delivery concept). Keyboard users can tick "sign" instead. */
export function SignaturePad({ label, clearLabel, onChange }: { label: string; clearLabel: string; onChange: (signed: boolean) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [has, setHas] = useState(false);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * e.currentTarget.width, ((e.clientY - r.top) / r.height) * e.currentTarget.height] as const;
  };
  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const [x, y] = pos(e);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0a1b38";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const [x, y] = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!has) { setHas(true); onChange(true); }
  };
  const clear = () => {
    const c = ref.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    setHas(false);
    onChange(false);
  };
  return (
    <div className="mt-3">
      <div className="relative rounded-xl border-2 border-dashed border-steel-300 bg-ice-50">
        <canvas
          ref={ref}
          width={560}
          height={160}
          className="block h-32 w-full touch-none"
          aria-label={label}
          role="img"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={() => (drawing.current = false)}
        />
        {!has && <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-steel-500">{label}</span>}
      </div>
      <div className="mt-2 flex items-center gap-3 text-sm">
        <button type="button" onClick={clear} className="text-steel-700 underline-offset-2 hover:underline">{clearLabel}</button>
        <label className="ms-auto inline-flex items-center gap-2 text-steel-700">
          <input type="checkbox" checked={has} onChange={(e) => { setHas(e.target.checked); onChange(e.target.checked); }} className="h-4 w-4 accent-navy-800" />
          {label} ✓
        </label>
      </div>
    </div>
  );
}
