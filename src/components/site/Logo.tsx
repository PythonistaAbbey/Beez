/** Original concept mark (not the Beez logo). A hexagon cell with a cold-chain pulse line. */
export function Logo({ label, tag, light = false }: { label: string; tag: string; light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0 drop-shadow-[0_4px_10px_rgba(20,168,166,0.35)]" aria-hidden="true">
        <defs>
          <linearGradient id={light ? "lg-l" : "lg-d"} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={light ? "#24508e" : "#163463"} />
            <stop offset="1" stopColor={light ? "#0d2244" : "#040a18"} />
          </linearGradient>
          <linearGradient id="lg-pulse" x1="0" x2="1">
            <stop offset="0" stopColor="#7ff3ee" />
            <stop offset="1" stopColor="#e9c98a" />
          </linearGradient>
        </defs>
        <path d="M20 2 36 11v18L20 38 4 29V11z" fill={`url(#${light ? "lg-l" : "lg-d"})`} stroke="rgba(255,255,255,0.35)" strokeWidth="0.75" />
        <path d="M20 3.2 34.8 11.6" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
        <path d="M9 21h6l3-6 4 11 3-5h6" fill="none" stroke="url(#lg-pulse)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`text-lg font-bold tracking-tight ${light ? "text-white" : "text-navy-900"}`}>{label}</span>
        <span className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${light ? "text-frost-200" : "text-frost-600"}`}>{tag}</span>
      </span>
    </span>
  );
}
