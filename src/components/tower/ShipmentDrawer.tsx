"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, CheckCircle2, Circle, Download, MapPinCheck, Siren } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { TempChart } from "@/components/charts/TempChart";
import { CITIES } from "@/lib/data/geo";
import { readingsToCsv } from "@/lib/csv";
import { useTower } from "./context";
import { Btn, StatusBadge, TempPill, useFmt } from "./bits";
import { SignaturePad } from "./SignaturePad";

export function ShipmentDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { state, td, t, locale, dispatch, openEscalate, announce } = useTower();
  const { nf, time, dur } = useFmt();
  const [asTable, setAsTable] = useState(false);
  const [signed, setSigned] = useState(false);
  const s = state.shipments.find((x) => x.id === id);
  const alert = s && state.alerts.find((a) => a.shipmentId === s.id && a.state !== "resolved");
  const labels = { title: td.detail.chart, band: t.tracking.band, excursion: locale === "ar" ? "تجاوز" : "Excursion", elapsed: td.detail.time, hint: locale === "ar" ? "استخدم الأسهم للتنقل بين القراءات." : "Use arrow keys to move between readings." };

  const download = () => {
    if (!s) return;
    const blob = new Blob([readingsToCsv(s)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${s.id}-temperature-log-DEMO.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={!!s} onClose={() => { setSigned(false); onClose(); }} title={s ? s.id : ""} closeLabel={td.detail.close} side>
      {s && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge s={s} />
            <span className="text-sm text-steel-700">{CITIES[s.origin].name[locale]} → {CITIES[s.destination].name[locale]}</span>
            <span className="ms-auto text-xs font-semibold text-warn">{t.common.demoData}</span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-steel-600"><span>{td.detail.progress}</span><span className="tabular">{nf(Math.round(s.progress * 100))}%</span></div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-steel-100" role="progressbar" aria-valuenow={Math.round(s.progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={td.detail.progress}>
              <div className="h-full rounded-full bg-frost-500 transition-all duration-700" style={{ width: `${s.progress * 100}%` }} />
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            {[
              [t.tracking.eta, time(s.etaAt)],
              [t.tracking.plannedEta, time(s.plannedEtaAt)],
              [td.detail.delay, s.delayMinutes ? dur(s.delayMinutes) : td.detail.onPlan],
              [td.detail.vehicle, s.vehicleId],
              [td.detail.pallets, nf(s.pallets)],
              [td.detail.reference, s.reference],
              [td.detail.profile, t.profiles[s.profile.id]],
              [t.tracking.temperature, <TempPill key="tp" s={s} />],
              [td.table.priority, t.priority[s.priority]],
            ].map(([k, v]) => (
              <div key={String(k)} className="rounded-xl bg-ice-50 p-3">
                <dt className="text-xs text-steel-600">{k}</dt>
                <dd className="mt-0.5 font-semibold tabular">{v}</dd>
              </div>
            ))}
          </dl>

          <section>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">{td.detail.chart}</h3>
              <div className="flex gap-2">
                <Btn variant="ghost" onClick={() => setAsTable((v) => !v)}>{asTable ? td.detail.chartView : td.detail.tableView}</Btn>
                <Btn onClick={download}><Download className="h-4 w-4" aria-hidden="true" /> {t.common.exportCsv}</Btn>
              </div>
            </div>
            <div className="mt-3">
              {asTable ? (
                <div className="max-h-64 overflow-y-auto rounded-xl border border-steel-200">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-ice-50"><tr>{[td.detail.time, td.detail.reading, td.detail.humidity].map((h) => <th key={h} scope="col" className="px-3 py-2 text-start">{h}</th>)}</tr></thead>
                    <tbody>
                      {s.readings.map((r) => {
                        const out = r.celsius > s.profile.max || r.celsius < s.profile.min;
                        return (
                          <tr key={r.t} className={`border-t border-steel-100 ${out ? "bg-alert-bg font-semibold text-alert" : ""}`}>
                            <td className="px-3 py-1.5 tabular">{dur(r.t)}</td>
                            <td className="px-3 py-1.5 tabular">{nf(r.celsius, 1)}{out ? " ▲" : ""}</td>
                            <td className="px-3 py-1.5 tabular">{nf(r.humidity)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <TempChart readings={s.readings} min={s.profile.min} max={s.profile.max} labels={labels} digits={(n) => nf(n, 1)} />
              )}
            </div>
            <p className="mt-2 text-xs text-steel-500">{t.profileNote}</p>
          </section>

          <section>
            <h3 className="font-semibold">{td.detail.timeline}</h3>
            <ol className="mt-3 space-y-0">
              {s.timeline.map((e, i) => (
                <li key={`${e.code}-${i}`} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < s.timeline.length - 1 && <span className={`absolute start-[9px] top-5 h-full w-0.5 ${e.done ? "bg-frost-400" : "bg-steel-200"}`} aria-hidden="true" />}
                  {e.done ? <CheckCircle2 className={`relative h-5 w-5 shrink-0 ${e.code === "temp_alert" ? "text-alert" : "text-frost-600"}`} aria-hidden="true" /> : <Circle className="relative h-5 w-5 shrink-0 text-steel-300" aria-hidden="true" />}
                  <div className="flex flex-1 flex-wrap justify-between gap-2 text-sm">
                    <span className={e.done ? "font-medium" : "text-steel-500"}>{t.status[e.code]} · {CITIES[e.cityId].name[locale]}</span>
                    <span className="tabular text-steel-600">{time(e.at)}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-steel-200 p-4">
            <h3 className="font-semibold">{s.pod ? td.detail.pod : td.detail.podPending}</h3>
            {s.pod ? (
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div><dt className="text-xs text-steel-600">{td.detail.receivedBy}</dt><dd className="font-semibold">{s.pod.receivedBy}</dd></div>
                <div><dt className="text-xs text-steel-600">{td.detail.signedAt}</dt><dd className="font-semibold tabular">{time(s.pod.signedAt)}</dd></div>
                <div><dt className="text-xs text-steel-600">{td.detail.tempAtHandover}</dt><dd className="font-semibold tabular">{nf(s.pod.tempAtHandover, 1)} °C</dd></div>
                <div><dt className="text-xs text-steel-600">{td.detail.seal}</dt><dd className="font-semibold">{s.pod.sealIntact ? t.common.yes : t.common.no}</dd></div>
                <div className="sm:col-span-2 flex items-center gap-3 rounded-xl bg-ice-50 p-3">
                  <span className="flex h-14 w-20 items-center justify-center rounded-lg bg-steel-200 text-steel-600"><Camera className="h-5 w-5" aria-hidden="true" /><span className="sr-only">{td.detail.photoPlaceholder}</span></span>
                  <span className="flex items-center gap-1.5 text-xs text-ok"><MapPinCheck className="h-4 w-4" aria-hidden="true" />{td.detail.geo}</span>
                </div>
              </dl>
            ) : (
              <div className="mt-2">
                <p className="text-sm text-steel-700">{td.detail.podPendingBody}</p>
                <SignaturePad label={td.detail.signHere} clearLabel={td.detail.clear} onChange={setSigned} />
                <Btn variant="primary" className="mt-3" disabled={!signed} onClick={() => { dispatch({ type: "pod", shipmentId: s.id }); announce(td.detail.podCaptured); }}>
                  {td.detail.confirmPod}
                </Btn>
              </div>
            )}
          </section>

          <div className="flex flex-wrap gap-2 border-t border-steel-200 pt-4">
            <Link href={`/${locale}/support?shipment=${s.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-steel-300 px-3 py-1.5 text-sm font-semibold hover:bg-ice-50">{td.detail.reportIssue}</Link>
            {alert && (
              <Btn variant="danger" onClick={() => openEscalate(alert.id)}><Siren className="h-4 w-4" aria-hidden="true" /> {td.detail.escalate}</Btn>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
