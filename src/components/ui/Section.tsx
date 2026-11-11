export function SectionHeading({ eyebrow, title, lead, light = false, id }: { eyebrow?: string; title: string; lead?: string; light?: boolean; id?: string }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className={`mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl ${light ? "text-white" : "text-navy-900"}`}>{title}</h2>
      {lead && <p className={`mt-4 text-lg leading-relaxed ${light ? "text-steel-300" : "text-steel-700"}`}>{lead}</p>}
    </div>
  );
}

export function Badge({ children, tone = "steel" }: { children: React.ReactNode; tone?: "steel" | "ok" | "warn" | "alert" | "frost" | "navy" }) {
  const cls = {
    steel: "bg-steel-100 text-steel-700",
    ok: "bg-ok-bg text-ok",
    warn: "bg-warn-bg text-warn",
    alert: "bg-alert-bg text-alert",
    frost: "bg-frost-100 text-frost-600",
    navy: "bg-navy-900 text-white",
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{children}</span>;
}
