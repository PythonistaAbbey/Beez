/** Original concept mark (not the Beez logo). A hexagon cell with a cold-chain pulse line. */
export function Logo({ label, tag, light = false }: { label: string; tag: string; light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
        <path d="M20 2 36 11v18L20 38 4 29V11z" fill={light ? "#ffffff" : "#0a1b38"} />
        <path d="M9 21h6l3-6 4 11 3-5h6" fill="none" stroke="#2ec4c0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`text-lg font-bold tracking-tight ${light ? "text-white" : "text-navy-900"}`}>{label}</span>
        <span className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${light ? "text-frost-200" : "text-frost-600"}`}>{tag}</span>
      </span>
    </span>
  );
}
