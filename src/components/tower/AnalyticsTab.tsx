"use client";

import { useState } from "react";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { useTower } from "./context";
import { Btn, Card, useFmt } from "./bits";

export function AnalyticsTab() {
  const { data, td, t } = useTower();
  const { nf } = useFmt();
  const [table, setTable] = useState(false);
  const a = td.analytics;
  const w = data.analytics.weeks;
  const key = (n: number) => `${a.week}${nf(n)}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{a.title}</h2>
          <p className="text-sm text-steel-700">{a.lead} <span className="font-semibold text-warn">{t.common.demoData}</span></p>
        </div>
        <Btn onClick={() => setTable((v) => !v)}>{table ? a.chartView : a.tableView}</Btn>
      </div>
      {table ? (
        <Card>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-steel-200 text-xs uppercase text-steel-600">{["#", a.onTime, a.excursions, a.volume].map((h) => <th key={h} scope="col" className="px-2 py-2 text-start">{h}</th>)}</tr></thead>
              <tbody>
                {w.map((r) => (
                  <tr key={r.week} className="border-b border-steel-100">
                    <th scope="row" className="px-2 py-2 text-start">{key(r.week)}</th>
                    <td className="px-2 py-2 tabular">{nf(r.onTime, 1)}%</td>
                    <td className="px-2 py-2 tabular">{nf(r.excursions)}</td>
                    <td className="px-2 py-2 tabular">{nf(r.shipments)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="mt-6 w-full text-sm">
              <caption className="mb-2 text-start font-semibold">{a.mix}</caption>
              <tbody>{data.analytics.byIndustry.map((r) => <tr key={r.industry} className="border-b border-steel-100"><th scope="row" className="px-2 py-2 text-start">{t.industries[r.industry]}</th><td className="px-2 py-2 tabular">{nf(r.share)}%</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title={a.onTime}><LineChart label={a.onTime} data={w.map((r) => ({ key: key(r.week), value: r.onTime }))} domain={[88, 100]} format={(n) => `${nf(n, 1)}%`} /></Card>
          <Card title={a.excursions}><BarChart label={a.excursions} data={w.map((r) => ({ key: key(r.week), value: r.excursions }))} format={(n) => nf(n)} color="#c47a1a" /></Card>
          <Card title={a.volume}><BarChart label={a.volume} data={w.map((r) => ({ key: key(r.week), value: r.shipments }))} format={(n) => nf(n)} /></Card>
          <Card title={a.mix}>
            <ul className="space-y-3">
              {data.analytics.byIndustry.map((r) => (
                <li key={r.industry} className="grid grid-cols-[110px_1fr_44px] items-center gap-3 text-sm">
                  <span className="text-steel-700">{t.industries[r.industry]}</span>
                  <span className="h-3 rounded-e-full bg-steel-100"><span className="block h-full rounded-e-full bg-series-2" style={{ width: `${(r.share / 35) * 100}%` }} /></span>
                  <span className="text-end font-semibold tabular">{nf(r.share)}%</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
