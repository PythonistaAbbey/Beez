import type { Dict } from "@/content/en";

export function ServiceCompare({ t }: { t: Dict }) {
  const c = t.corporate;
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6" aria-labelledby="compare-title">
      <h2 id="compare-title" className="text-2xl font-semibold">{c.compareTitle}</h2>
      <p className="mt-2 max-w-3xl text-steel-700">{c.compareLead}</p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-steel-200">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-ice-50 text-start">
            <tr>
              {c.cols.map((h, i) => (
                <th key={h} scope="col" className={`px-4 py-3 text-start font-semibold ${i === c.cols.length - 1 ? "bg-frost-100 text-frost-600" : "text-navy-800"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r) => (
              <tr key={r[0]} className="border-t border-steel-200">
                {r.map((cell, i) => {
                  const isTick = cell === "✓";
                  const isDash = cell === "—";
                  const Tag = i === 0 ? "th" : "td";
                  return (
                    <Tag key={i} scope={i === 0 ? "row" : undefined} className={`px-4 py-3 text-start ${i === 0 ? "font-medium text-navy-900" : ""} ${i === r.length - 1 ? "bg-frost-100/50 text-navy-800" : ""}`}>
                      {isTick ? <span className="font-bold text-ok">✓ <span className="sr-only">yes</span></span> : isDash ? <span className="text-steel-600">— <span className="sr-only">not listed</span></span> : cell}
                    </Tag>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
