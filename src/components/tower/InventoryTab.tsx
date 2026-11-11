"use client";

import { useState } from "react";
import { AlertTriangle, HeartPulse, Thermometer } from "lucide-react";
import { daysOfCover } from "@/lib/tower/store";
import { CITIES } from "@/lib/data/geo";
import { useTower } from "./context";
import { Card, useFmt } from "./bits";

export function InventoryTab() {
  const { data, td, t, locale } = useTower();
  const { nf } = useFmt();
  const [medOnly, setMedOnly] = useState(false);
  const wh = Object.fromEntries(data.warehouses.map((w) => [w.id, w]));
  const items = data.inventory.filter((i) => !medOnly || i.medicalPriority);

  return (
    <div className="space-y-6">
      <Card title={td.inventory.warehouses}>
        <div className="grid gap-4 md:grid-cols-3">
          {data.warehouses.map((w) => (
            <article key={w.id} className="rounded-xl border border-steel-200 p-4">
              <h4 className="font-semibold">{w.name[locale]}</h4>
              <p className="text-xs text-steel-600">{CITIES[w.cityId].name[locale]}</p>
              <ul className="mt-4 space-y-3">
                {w.zones.map((z) => {
                  const pct = (z.usedPallets / z.capacityPallets) * 100;
                  return (
                    <li key={z.profile}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-navy-800">{t.profiles[z.profile]}</span>
                        <span className="inline-flex items-center gap-1 tabular text-steel-700"><Thermometer className="h-3 w-3" aria-hidden="true" />{td.inventory.current} {nf(z.currentC, 1)} °C</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-steel-100" role="meter" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={`${td.inventory.utilisation} ${t.profiles[z.profile]}`}>
                        <div className={`h-full rounded-full ${pct > 90 ? "bg-warn" : "bg-series-1"}`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className="mt-0.5 text-[11px] text-steel-600 tabular">{td.inventory.utilisation} {nf(pct)}% · {nf(z.usedPallets)}/{nf(z.capacityPallets)}</p>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </Card>

      <Card
        title={td.inventory.skus}
        action={
          <label className="inline-flex items-center gap-2 text-sm text-steel-700">
            <input type="checkbox" checked={medOnly} onChange={(e) => setMedOnly(e.target.checked)} className="h-4 w-4 accent-navy-800" />
            {td.inventory.medicalOnly}
          </label>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-steel-200 text-xs uppercase tracking-wide text-steel-600">
                {[td.inventory.sku, td.inventory.location, td.inventory.onHand, td.inventory.reserved, td.inventory.cover, td.inventory.backup, td.inventory.expiry].map((h) => <th key={h} scope="col" className="px-2 py-2 text-start font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {items.map((i) => {
                const cover = daysOfCover(i.onHand, i.reserved, i.dailyDemand);
                const low = cover < 3;
                return (
                  <tr key={i.skuId} className="border-b border-steel-100">
                    <th scope="row" className="px-2 py-2.5 text-start font-medium">
                      <span className="flex items-center gap-1.5">{i.medicalPriority && <HeartPulse className="h-4 w-4 text-frost-600" aria-label="medical priority" />}{i.name[locale]}</span>
                      <span className="block font-mono text-xs text-steel-500" dir="ltr">{i.skuId}</span>
                    </th>
                    <td className="px-2 py-2.5">{wh[i.warehouseId].name[locale]}</td>
                    <td className="px-2 py-2.5 tabular">{nf(i.onHand)}</td>
                    <td className="px-2 py-2.5 tabular">{nf(i.reserved)}</td>
                    <td className={`px-2 py-2.5 tabular font-semibold ${low ? "text-alert" : ""}`}>
                      {low && <AlertTriangle className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />}{nf(cover, 1)} {td.inventory.days}{low && <span className="ms-1 text-xs">({td.inventory.low})</span>}
                    </td>
                    <td className="px-2 py-2.5 tabular">{nf(i.backupOnHand)} · {wh[i.backupWarehouseId].name[locale]}</td>
                    <td className="px-2 py-2.5 tabular" dir="ltr">{i.lotExpiry}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
