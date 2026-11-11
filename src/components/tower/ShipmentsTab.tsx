"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CITIES } from "@/lib/data/geo";
import type { Industry, ShipmentStatus } from "@/lib/data/types";
import { Badge } from "@/components/ui/Section";
import { useTower } from "./context";
import { Card, StatusBadge, TempPill, useFmt } from "./bits";

const STATUSES: ShipmentStatus[] = ["in_transit", "at_hub", "out_for_delivery", "delivered", "exception"];
const INDUSTRIES: Industry[] = ["medical", "food", "cosmetics", "ecommerce", "beverage", "retail", "supplements"];

export function ShipmentsTab() {
  const { state, td, t, locale, openShipment } = useTower();
  const { time, nf } = useFmt();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | ShipmentStatus>("");
  const [industry, setIndustry] = useState<"" | Industry>("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return state.shipments
      .filter((s) => !status || s.status === status)
      .filter((s) => !industry || s.industry === industry)
      .filter((s) =>
        !needle ||
        s.id.toLowerCase().includes(needle) ||
        s.reference.toLowerCase().includes(needle) ||
        CITIES[s.origin].name[locale].toLowerCase().includes(needle) ||
        CITIES[s.destination].name[locale].toLowerCase().includes(needle),
      )
      .sort((a, b) => (a.priority === b.priority ? 0 : a.priority === "critical" ? -1 : b.priority === "critical" ? 1 : 0));
  }, [state.shipments, q, status, industry, locale]);

  return (
    <Card title={td.tabs.shipments}>
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <label className="relative flex-1">
          <span className="sr-only">{t.common.search}</span>
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" aria-hidden="true" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={td.table.searchPlaceholder} className="w-full rounded-xl border border-steel-300 bg-white py-2.5 pe-3 ps-9 text-sm" />
        </label>
        <label className="text-xs text-steel-600">
          {td.table.filterStatus}
          <select value={status} onChange={(e) => setStatus(e.target.value as ShipmentStatus | "")} className="mt-1 block w-full rounded-xl border border-steel-300 bg-white px-3 py-2.5 text-sm text-navy-900 md:w-44">
            <option value="">{t.common.all}</option>
            {STATUSES.map((s) => <option key={s} value={s}>{t.status[s]}</option>)}
          </select>
        </label>
        <label className="text-xs text-steel-600">
          {td.table.filterIndustry}
          <select value={industry} onChange={(e) => setIndustry(e.target.value as Industry | "")} className="mt-1 block w-full rounded-xl border border-steel-300 bg-white px-3 py-2.5 text-sm text-navy-900 md:w-44">
            <option value="">{t.common.all}</option>
            {INDUSTRIES.map((s) => <option key={s} value={s}>{t.industries[s]}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-3 text-xs text-steel-600" aria-live="polite">{nf(rows.length)} {td.table.results}</p>
      <div className="relative mt-3 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-steel-200 text-start text-xs uppercase tracking-wide text-steel-600">
              {[td.table.id, td.table.route, td.table.industry, td.table.priority, td.table.status, td.table.eta, td.table.temp].map((h) => (
                <th key={h} scope="col" className="px-2 py-2 text-start font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className={`border-b border-steel-100 hover:bg-ice-50 ${state.flagged.includes(s.id) ? "bg-warn-bg/40" : ""}`}>
                <th scope="row" className="px-2 py-2.5 text-start">
                  <button type="button" onClick={() => openShipment(s.id)} className="font-mono text-sm font-semibold text-navy-700 underline-offset-2 hover:underline" dir="ltr">{s.id}</button>
                </th>
                <td className="px-2 py-2.5">{CITIES[s.origin].name[locale]} → {CITIES[s.destination].name[locale]}</td>
                <td className="px-2 py-2.5">{t.industries[s.industry]}</td>
                <td className="px-2 py-2.5"><Badge tone={s.priority === "critical" ? "navy" : s.priority === "high" ? "steel" : "steel"}>{t.priority[s.priority]}</Badge></td>
                <td className="px-2 py-2.5"><StatusBadge s={s} /></td>
                <td className="px-2 py-2.5 tabular">{time(s.etaAt)}{s.delayMinutes >= 30 && <span className="ms-1 text-xs text-warn">+{nf(s.delayMinutes)}′</span>}</td>
                <td className="px-2 py-2.5"><TempPill s={s} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="py-8 text-center text-sm text-steel-600">{td.table.none}</p>}
      </div>
    </Card>
  );
}
