"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { CITIES } from "@/lib/data/geo";
import { Badge } from "@/components/ui/Section";
import { useTower } from "./context";
import { Btn, Card, useFmt } from "./bits";

export function SuppliersTab() {
  const { data, state, td, t, locale, dispatch, announce } = useTower();
  const { nf, time } = useFmt();
  const s = td.suppliers;
  const [openMsg, setOpenMsg] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  return (
    <Card title={s.title}>
      <p className="-mt-2 mb-4 text-sm text-steel-700">{s.lead}</p>
      <ul className="grid gap-4 md:grid-cols-2">
        {data.suppliers.map((sup) => {
          const asn = state.asn[sup.id];
          const msgs = state.supplierMsgs[sup.id] ?? [];
          return (
            <li key={sup.id} className="rounded-xl border border-steel-200 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{sup.name[locale]}</p>
                  <p className="text-xs text-steel-600">{t.industries[sup.category]} · {CITIES[sup.cityId].name[locale]}</p>
                </div>
                <Badge tone={asn === "confirmed" || asn === "received" ? "ok" : asn === "slot_requested" ? "frost" : "warn"}>{s.asn[asn]}</Badge>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-ice-50 p-2"><dt className="text-xs text-steel-600">{s.onTime}</dt><dd className="font-semibold tabular">{nf(sup.onTimeRate * 100)}%</dd></div>
                <div className="rounded-lg bg-ice-50 p-2"><dt className="text-xs text-steel-600">{s.nextInbound}</dt><dd className="font-semibold tabular">{time(sup.nextInbound)}</dd></div>
              </dl>
              <div className="mt-3 flex flex-wrap gap-2">
                {asn !== "confirmed" && asn !== "received" && <Btn onClick={() => { dispatch({ type: "asn", supplierId: sup.id, status: "confirmed" }); announce(s.asn.confirmed); }}>{s.confirm}</Btn>}
                {asn === "confirmed" && <Btn onClick={() => { dispatch({ type: "asn", supplierId: sup.id, status: "slot_requested" }); announce(s.asn.slot_requested); }}>{s.request}</Btn>}
                <Btn variant="ghost" aria-expanded={openMsg === sup.id} onClick={() => { setOpenMsg(openMsg === sup.id ? null : sup.id); setDraft(""); }}>
                  <MessageSquare className="h-4 w-4" aria-hidden="true" /> {s.message}{msgs.length ? ` (${nf(msgs.length)})` : ""}
                </Btn>
              </div>
              {openMsg === sup.id && (
                <div className="mt-3 rounded-lg border border-steel-200 p-3">
                  {msgs.length > 0 && <ul className="mb-2 space-y-1.5">{msgs.map((m, i) => <li key={i} className="ms-auto w-fit max-w-[85%] rounded-xl bg-navy-900 px-3 py-1.5 text-sm text-white">{m}</li>)}</ul>}
                  <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); dispatch({ type: "supplierMsg", supplierId: sup.id, text: draft }); if (draft.trim()) announce(s.sent); setDraft(""); }}>
                    <label className="sr-only" htmlFor={`msg-${sup.id}`}>{s.message}</label>
                    <input id={`msg-${sup.id}`} value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={500} placeholder={s.messagePlaceholder} className="flex-1 rounded-lg border border-steel-300 px-3 py-1.5 text-sm" />
                    <Btn type="submit" variant="primary">{s.send}</Btn>
                  </form>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
