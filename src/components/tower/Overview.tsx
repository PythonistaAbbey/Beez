"use client";

import { useState } from "react";
import { ArrowRight, BellRing, HeartPulse, Thermometer, Timer, Truck } from "lucide-react";
import { KsaMap, type MapRoute } from "@/components/charts/KsaMap";
import { TempChart } from "@/components/charts/TempChart";
import { CITIES } from "@/lib/data/geo";
import { selectKpis } from "@/lib/tower/store";
import type { Shipment } from "@/lib/data/types";
import { useTower } from "./context";
import { Btn, Card, SeverityBadge, StatusBadge, TempPill, useFmt } from "./bits";

export function toneOf(s: Shipment, flagged: string[]): MapRoute["tone"] {
  if (s.status === "delivered") return "done";
  if (s.status === "exception" || s.readings.slice(-12).some((r) => r.celsius > s.profile.max || r.celsius < s.profile.min)) return "alert";
  if (s.delayMinutes >= 30 || flagged.includes(s.id)) return "warn";
  return "ok";
}

export function Overview() {
  const { state, td, t, locale, openShipment, goTab } = useTower();
  const { nf, time } = useFmt();
  const k = selectKpis(state);
  const [sel, setSel] = useState<string | null>("DEMO-RX-1042");
  const selected = state.shipments.find((s) => s.id === sel) ?? null;
  const routes: MapRoute[] = state.shipments.map((s) => ({
    id: s.id, from: s.origin, to: s.destination, progress: s.progress, tone: toneOf(s, state.flagged),
    label: `${s.id}, ${CITIES[s.origin].name[locale]} – ${CITIES[s.destination].name[locale]}, ${t.status[s.status]}`,
  }));
  const kpis = [
    { icon: Truck, label: td.kpi.active, value: nf(k.active) },
    { icon: Thermometer, label: td.kpi.inBand, value: `${nf(k.inBand, 1)}%` },
    { icon: BellRing, label: td.kpi.openAlerts, value: nf(k.openAlerts), tone: k.openAlerts ? "text-alert" : "" },
    { icon: HeartPulse, label: td.kpi.critical, value: nf(k.critical) },
    { icon: Timer, label: td.kpi.onTime, value: `${nf(k.onTime, 0)}%` },
  ];
  const latest = state.alerts.filter((a) => a.state !== "resolved").slice(0, 4);
  const labels = { title: td.detail.chart, band: t.tracking.band, excursion: locale === "ar" ? "تجاوز" : "Excursion", elapsed: td.detail.time, hint: "" };

  return (
    <div className="space-y-6">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {kpis.map(({ icon: I, label, value, tone }, i) => (
          <li key={label} className={`rounded-2xl p-4 glass-card ${i === kpis.length - 1 && kpis.length % 2 ? "col-span-2 md:col-span-1" : ""}`}>
            <I className="h-4 w-4 text-frost-600" aria-hidden="true" />
            <p className={`mt-2 text-2xl font-bold tabular ${tone ?? "text-navy-900"}`}>{value}</p>
            <p className="text-xs text-steel-600">{label}</p>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Card title={td.map.title}>
          <div className="rounded-xl bg-aurora p-2 ring-1 ring-white/10">
            <KsaMap routes={routes} locale={locale} selected={sel} onSelect={setSel} caption={td.map.caption} />
          </div>
          <ul className="mt-3 flex flex-wrap gap-4 text-xs text-steel-700">
            {[["#2ec4c0", td.map.legendOk], ["#e2a400", td.map.legendWarn], ["#e5534b", td.map.legendAlert], ["#8aa7c6", td.map.legendDone]].map(([c, l]) => (
              <li key={l} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} aria-hidden="true" />{l}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-steel-500">{td.map.caption}</p>
        </Card>

        <div className="space-y-6">
          <Card title={selected ? selected.id : td.selectHint} action={selected && <Btn onClick={() => openShipment(selected.id)}>{t.common.open} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /></Btn>}>
            {selected ? (
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <StatusBadge s={selected} />
                  <span className="text-steel-700">{CITIES[selected.origin].name[locale]} → {CITIES[selected.destination].name[locale]}</span>
                  <span className="ms-auto"><TempPill s={selected} /></span>
                </div>
                <div className="mt-3"><TempChart readings={selected.readings} min={selected.profile.min} max={selected.profile.max} labels={labels} height={180} /></div>
                <p className="mt-2 text-xs text-steel-600">{t.tracking.eta}: <span className="font-semibold tabular text-navy-900">{time(selected.etaAt)}</span> · {t.profiles[selected.profile.id]}</p>
              </div>
            ) : <p className="text-sm text-steel-600">{td.selectHint}</p>}
          </Card>

          <Card title={td.latestAlerts} action={<Btn variant="ghost" onClick={() => goTab("alerts")}>{td.viewAll}</Btn>}>
            <ul className="divide-y divide-steel-100">
              {latest.map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-2.5 text-sm">
                  <SeverityBadge sev={a.severity} />
                  <span className="min-w-0 flex-1 truncate">{td.alerts.kinds[a.kind]}</span>
                  {a.shipmentId && (
                    <button type="button" className="font-mono text-xs text-navy-700 underline-offset-2 hover:underline" onClick={() => openShipment(a.shipmentId!)}>{a.shipmentId}</button>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
