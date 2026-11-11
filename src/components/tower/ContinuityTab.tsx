"use client";

import { useState } from "react";
import { BellRing, CheckCircle2, FlaskConical, HeartPulse, PlayCircle, Siren } from "lucide-react";
import { computeAlternatives } from "@/lib/data/dataset";
import { CITIES } from "@/lib/data/geo";
import { daysOfCover, riskScore, type ScenarioId } from "@/lib/tower/store";
import { Badge } from "@/components/ui/Section";
import { useTower } from "./context";
import { Btn, Card, StatusBadge, useFmt } from "./bits";

const SCENARIOS: ScenarioId[] = ["cooling", "corridor", "vehicle"];

export function ContinuityTab() {
  const { state, td, t, locale, dispatch, data, openShipment, goTab, announce } = useTower();
  const c = td.continuity;
  const { nf, dur } = useFmt();
  const delayed = state.shipments.filter((s) => s.status !== "delivered" && (s.delayMinutes >= 30 || state.flagged.includes(s.id)));
  const [selId, setSelId] = useState<string | null>(null);
  const sel = delayed.find((s) => s.id === selId) ?? delayed[0];
  const alts = sel ? computeAlternatives(sel) : [];
  const medical = state.shipments
    .filter((s) => s.industry === "medical" && s.status !== "delivered")
    .map((s) => ({ s, risk: riskScore(s) }))
    .sort((a, b) => b.risk - a.risk);
  const low = data.inventory.map((i) => ({ i, cover: daysOfCover(i.onHand, i.reserved, i.dailyDemand) })).filter((x) => x.cover < 5);
  const wh = Object.fromEntries(data.warehouses.map((w) => [w.id, w.name[locale]]));
  const signed = (n: number) => (n > 0 ? `+${dur(n)}` : n < 0 ? `−${dur(-n)}` : "0");

  return (
    <div className="space-y-6">
      <div role="note" className="flex items-start gap-3 rounded-2xl border-2 border-dashed border-warn/50 bg-warn-bg p-4 text-sm text-navy-900">
        <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 text-warn" aria-hidden="true" />
        <p><strong className="me-1">{c.simTag}.</strong>{c.banner}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">{c.title}</h2>
        <p className="mt-1 max-w-3xl text-sm text-steel-700">{c.lead}</p>
      </div>

      <Card title={c.scenarios}>
        <p className="-mt-2 mb-4 text-sm text-steel-700">{c.scenariosLead}</p>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <ul className="space-y-3">
            {SCENARIOS.map((id) => {
              const ran = state.scenarios.includes(id);
              return (
                <li key={id} className="flex items-start gap-3 rounded-xl border border-steel-200 p-4">
                  <div className="flex-1">
                    <p className="font-semibold">{c.scenarioList[id].title}</p>
                    <p className="text-sm text-steel-600">{c.scenarioList[id].body}</p>
                  </div>
                  <Btn
                    variant={ran ? "secondary" : "primary"}
                    disabled={ran}
                    onClick={() => { dispatch({ type: "scenario", id }); announce(`${c.simTag}: ${c.scenarioList[id].title}`); }}
                    data-testid={`run-${id}`}
                  >
                    {ran ? <><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {c.running}</> : <><PlayCircle className="h-4 w-4" aria-hidden="true" /> {c.run}</>}
                  </Btn>
                </li>
              );
            })}
          </ul>
          <div className="rounded-xl bg-navy-900 p-4 text-white">
            <h4 className="flex items-center gap-2 text-sm font-semibold"><BellRing className="h-4 w-4 text-frost-400" aria-hidden="true" /> {c.feed}</h4>
            {state.feed.length === 0 ? (
              <p className="mt-6 text-center text-sm text-steel-400">{c.feedEmpty}</p>
            ) : (
              <ul className="mt-3 space-y-2" aria-live="polite">
                {state.feed.map((f) => (
                  <li key={f.id} className="flex items-start gap-2 rounded-lg bg-white/5 p-2.5 text-sm">
                    <span className="mt-0.5 rounded bg-warn px-1.5 text-[10px] font-bold text-navy-950">{c.simTag}</span>
                    <span className="flex-1 text-steel-200">{c.notif[f.scenario][f.idx]}</span>
                  </li>
                ))}
              </ul>
            )}
            {state.flagged.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-sm">
                <span>{nf(state.flagged.length)} {c.affected}</span>
                <button type="button" onClick={() => goTab("alerts")} className="inline-flex items-center gap-1.5 rounded-lg bg-alert px-3 py-1.5 font-semibold text-white">
                  <Siren className="h-4 w-4" aria-hidden="true" /> {c.escalateAll}
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <Card title={c.delayed}>
          {delayed.length === 0 ? (
            <p className="text-sm text-steel-600">{c.noneDelayed}</p>
          ) : (
            <ul className="space-y-2" role="listbox" aria-label={c.delayed}>
              {delayed.map((s) => (
                <li key={s.id} role="option" aria-selected={sel?.id === s.id}>
                  <button type="button" onClick={() => setSelId(s.id)} className={`flex w-full flex-wrap items-center gap-2 rounded-xl border p-3 text-start text-sm ${sel?.id === s.id ? "border-navy-700 bg-ice-50" : "border-steel-200 hover:bg-ice-50"}`}>
                    <span className="font-mono font-semibold" dir="ltr">{s.id}</span>
                    {s.priority === "critical" && <Badge tone="navy">{t.priority.critical}</Badge>}
                    <StatusBadge s={s} />
                    <span className="ms-auto tabular text-warn">+{dur(s.delayMinutes)}</span>
                    <span className="w-full text-xs text-steel-600">{CITIES[s.origin].name[locale]} → {CITIES[s.destination].name[locale]} · {t.industries[s.industry]}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title={sel ? `${c.compareFor} ${sel.id}` : c.compare}>
          {sel ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-steel-200 text-xs uppercase tracking-wide text-steel-600">
                      {[c.cols.option, c.cols.eta, c.cols.cost, c.cols.risk, c.cols.co2, c.cols.choose].map((h, i) => <th key={i} scope="col" className="px-2 py-2 text-start font-semibold">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {alts.map((a) => {
                      const chosen = state.plans[sel.id] === a.id;
                      return (
                        <tr key={a.id} className={`border-b border-steel-100 ${chosen ? "bg-ok-bg" : ""}`}>
                          <th scope="row" className="px-2 py-2.5 text-start font-medium">{c.alt[a.id]}</th>
                          <td className={`px-2 py-2.5 tabular ${a.etaDeltaMin < 0 ? "text-ok" : "text-warn"}`}>{signed(a.etaDeltaMin)}</td>
                          <td className="px-2 py-2.5 tabular">{nf(a.costIndex)}</td>
                          <td className="px-2 py-2.5"><Badge tone={a.tempRisk === "low" ? "ok" : a.tempRisk === "medium" ? "warn" : "alert"}>{c.risk[a.tempRisk]}</Badge></td>
                          <td className="px-2 py-2.5 tabular">{nf(a.co2Index)}</td>
                          <td className="px-2 py-2.5 text-end">
                            {chosen ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-ok"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />{c.chosen}</span> : (
                              <Btn onClick={() => { dispatch({ type: "plan", shipmentId: sel.id, alt: a.id }); announce(`${sel.id}: ${c.alt[a.id]} — ${c.chosen}`); }}>{c.choose}</Btn>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-steel-600">{c.indexNote}</p>
            </>
          ) : <p className="text-sm text-steel-600">{c.noneDelayed}</p>}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title={c.medical}>
          <p className="-mt-2 mb-3 text-sm text-steel-600">{c.medicalLead}</p>
          <ul className="space-y-2">
            {medical.map(({ s, risk }) => (
              <li key={s.id} className="flex items-center gap-3 rounded-xl border border-steel-200 p-3 text-sm">
                <HeartPulse className="h-4 w-4 shrink-0 text-frost-600" aria-hidden="true" />
                <button type="button" onClick={() => openShipment(s.id)} className="font-mono font-semibold text-navy-700 hover:underline" dir="ltr">{s.id}</button>
                <Badge tone={s.priority === "critical" ? "navy" : "steel"}>{t.priority[s.priority]}</Badge>
                <div className="ms-auto flex w-32 items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-steel-100" role="meter" aria-valuenow={Math.round(risk)} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.risk_score} ${s.id}`}>
                    <div className={`h-full rounded-full ${risk >= 60 ? "bg-alert" : risk >= 35 ? "bg-warn" : "bg-ok"}`} style={{ width: `${risk}%` }} />
                  </div>
                  <span className="w-8 text-end text-xs tabular">{nf(risk)}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card title={c.backup}>
          <p className="-mt-2 mb-3 text-sm text-steel-600">{c.backupLead}</p>
          <ul className="space-y-2">
            {low.map(({ i, cover }) => {
              const requested = state.transfers.includes(i.skuId);
              const backupDays = i.backupOnHand / i.dailyDemand;
              return (
                <li key={i.skuId} className="flex flex-wrap items-center gap-3 rounded-xl border border-steel-200 p-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{i.name[locale]}</p>
                    <p className="text-xs text-steel-600 tabular">
                      <span className={cover < 3 ? "font-semibold text-alert" : ""}>{nf(cover, 1)} {td.inventory.days}</span> · {td.inventory.backup}: {nf(i.backupOnHand)} ({nf(backupDays, 1)} {td.inventory.days}) · {wh[i.backupWarehouseId]}
                    </p>
                  </div>
                  {requested ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-ok"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />{c.transferRequested}</span>
                  ) : (
                    <Btn onClick={() => { dispatch({ type: "transfer", skuId: i.skuId }); announce(c.transferRequested); }}>{c.transfer}</Btn>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
