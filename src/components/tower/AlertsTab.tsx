"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Section";
import type { Alert } from "@/lib/data/types";
import { useTower } from "./context";
import { Btn, Card, SeverityBadge, useFmt } from "./bits";

export function AlertsTab() {
  const { state, td, dispatch, openShipment, openEscalate, announce, data, locale } = useTower();
  const { nf, time, dur } = useFmt();
  const [filter, setFilter] = useState<"open" | "all">("open");
  const list = state.alerts
    .filter((a) => filter === "all" || a.state !== "resolved")
    .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "critical" ? -1 : b.severity === "critical" ? 1 : a.severity === "warning" ? -1 : 1));

  const detail = (a: Alert) => {
    if (a.kind === "temp_excursion" && a.value !== undefined) return `${td.alerts.peak} ${nf(a.value, 1)} °C`;
    if (a.kind === "delay" && a.value !== undefined) return `${td.alerts.delayBy} ${dur(a.value)}`;
    if (a.kind === "stock_low" && a.value !== undefined) return `${td.alerts.coverLeft}: ${nf(a.value, 1)}`;
    return "";
  };
  const act = (type: "ack" | "assign" | "resolve", a: Alert, msg: string) => { dispatch({ type, id: a.id }); announce(`${a.id}: ${msg}`); };

  return (
    <Card
      title={td.alerts.title}
      action={
        <div role="radiogroup" aria-label={td.alerts.title} className="inline-flex rounded-lg border border-steel-300 p-0.5 text-sm">
          {(["open", "all"] as const).map((f) => (
            <button key={f} type="button" role="radio" aria-checked={filter === f} onClick={() => setFilter(f)} className={`rounded-md px-3 py-1 ${filter === f ? "bg-navy-900 text-white" : "text-steel-700"}`}>
              {f === "open" ? td.alerts.filterOpen : td.alerts.filterAll}
            </button>
          ))}
        </div>
      }
    >
      {list.length === 0 && <p className="py-8 text-center text-sm text-steel-600">{td.alerts.none}</p>}
      <ul className="space-y-3">
        {list.map((a) => {
          const log = state.alertLog[a.id] ?? [];
          const sku = a.skuId ? data.inventory.find((i) => i.skuId === a.skuId) : undefined;
          return (
            <li key={a.id} className={`rounded-xl border p-4 ${a.severity === "critical" && a.state === "open" ? "border-alert/40 bg-alert-bg/30" : "border-steel-200"}`} data-testid={`alert-${a.id}`}>
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge sev={a.severity} />
                <span className="font-semibold">{td.alerts.kinds[a.kind]}</span>
                <span className="text-sm text-steel-600">{detail(a)}</span>
                <span className="ms-auto flex items-center gap-2">
                  <Badge tone={a.state === "resolved" ? "ok" : a.state === "escalated" ? "alert" : a.state === "acknowledged" ? "frost" : "steel"}>
                    {td.alerts.states[a.state]}{a.state === "escalated" ? ` · L${a.escalationLevel}` : ""}
                  </Badge>
                  <span className="text-xs tabular text-steel-500">{time(a.raisedAt)}</span>
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                {a.shipmentId && <button type="button" onClick={() => openShipment(a.shipmentId!)} className="font-mono text-navy-700 underline-offset-2 hover:underline" dir="ltr">{a.shipmentId}</button>}
                {sku && <span className="text-steel-700">{sku.name[locale]}</span>}
                {a.assignee && <span className="text-xs text-steel-600">· {td.alerts.assignedTo}: {td.alerts.me}</span>}
              </div>
              {a.state !== "resolved" && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {a.state === "open" && <Btn onClick={() => act("ack", a, td.alerts.log.ack)}>{td.alerts.acknowledge}</Btn>}
                  {!a.assignee && <Btn onClick={() => act("assign", a, td.alerts.log.assign)}>{td.alerts.assign}</Btn>}
                  {a.escalationLevel < 3 && <Btn variant="danger" onClick={() => openEscalate(a.id)}>{td.alerts.escalate}</Btn>}
                  <Btn variant="ghost" onClick={() => act("resolve", a, td.alerts.log.res)}>{td.alerts.resolve}</Btn>
                </div>
              )}
              {log.length > 0 && (
                <details className="mt-3 text-xs text-steel-700">
                  <summary className="cursor-pointer font-semibold">{td.alerts.audit} ({nf(log.length)})</summary>
                  <ol className="mt-2 space-y-1 border-s-2 border-steel-200 ps-3">
                    {log.map((l, i) => (
                      <li key={i}>{td.alerts.log[l.action]}{l.level ? ` ${l.level}` : ""}{l.note ? ` — “${l.note}”` : ""} · +{dur(l.simMinute)}</li>
                    ))}
                  </ol>
                </details>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export function EscalateDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { state, td, t, dispatch, announce } = useTower();
  const a = state.alerts.find((x) => x.id === id);
  const { register, handleSubmit, reset } = useForm<{ level: string; note: string }>();
  const submit = handleSubmit((v) => {
    if (!a) return;
    const level = Number(v.level || a.escalationLevel + 1) as 1 | 2 | 3;
    dispatch({ type: "escalate", id: a.id, level, note: v.note?.trim().slice(0, 300) || undefined });
    announce(`${a.id}: ${td.alerts.escalatedMsg} ${level}`);
    reset();
    onClose();
  });
  const next = a ? Math.min(3, a.escalationLevel + 1) : 1;
  return (
    <Dialog open={!!a} onClose={() => { reset(); onClose(); }} title={td.alerts.escalateTitle} closeLabel={t.common.close}>
      {a && (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-sm text-steel-700">{td.alerts.escalateLead}</p>
          <p className="text-sm"><SeverityBadge sev={a.severity} /> <span className="ms-2 font-semibold">{td.alerts.kinds[a.kind]}</span> <span className="font-mono text-xs" dir="ltr">{a.shipmentId ?? a.skuId}</span></p>
          <fieldset className="space-y-2">
            <legend className="sr-only">{td.alerts.escalateTitle}</legend>
            {td.alerts.levels.map((l, i) => {
              const lvl = i + 1;
              const disabled = lvl <= a.escalationLevel;
              return (
                <label key={l.title} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${disabled ? "opacity-50" : "hover:bg-ice-50"} border-steel-200 has-[:checked]:border-navy-700 has-[:checked]:bg-ice-50`}>
                  <input type="radio" value={lvl} defaultChecked={lvl === next} disabled={disabled} {...register("level")} className="mt-1 accent-navy-800" />
                  <span><span className="block font-semibold">{l.title}</span><span className="text-sm text-steel-600">{l.body}</span></span>
                </label>
              );
            })}
          </fieldset>
          <label className="block text-sm font-medium">
            {td.alerts.note}
            <textarea {...register("note")} rows={3} maxLength={300} className="mt-1 block w-full rounded-xl border border-steel-300 p-3 text-sm" />
          </label>
          <div className="flex justify-end gap-2">
            <Btn variant="ghost" onClick={() => { reset(); onClose(); }}>{t.common.cancel}</Btn>
            <Btn type="submit" variant="danger">{td.alerts.confirmEscalation}</Btn>
          </div>
        </form>
      )}
    </Dialog>
  );
}
