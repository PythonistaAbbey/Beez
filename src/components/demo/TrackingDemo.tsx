"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Circle, Loader2, Search } from "lucide-react";
import type { Dict } from "@/content/en";
import type { Locale, Shipment } from "@/lib/data/types";
import { CITIES } from "@/lib/data/geo";
import { TRACKING_ID } from "@/lib/schemas";
import { fmtNumber, fmtTime } from "@/lib/i18n";
import { TempChart } from "@/components/charts/TempChart";
import { Badge } from "@/components/ui/Section";
import { Icon } from "@/components/Icon";
import { PREMIUM } from "@/content/premium";

const SAMPLES = ["DEMO-RX-1042", "DEMO-RX-1057", "DEMO-FD-2210", "DEMO-EC-4410"];

export function TrackingDemo({ t, locale, initialId }: { t: Dict; locale: Locale; initialId?: string }) {
  const [id, setId] = useState(initialId ?? "");
  const [state, setState] = useState<"idle" | "loading" | "invalid" | "notfound" | "ok">("idle");
  const [s, setS] = useState<Shipment | null>(null);

  const track = async (raw: string) => {
    const v = raw.trim().toUpperCase();
    setId(v);
    if (!TRACKING_ID.test(v)) { setState("invalid"); setS(null); return; }
    setState("loading");
    try {
      const res = await fetch(`/api/demo/shipments/${encodeURIComponent(v)}`);
      if (!res.ok) { setState("notfound"); setS(null); return; }
      const json = (await res.json()) as { data: Shipment };
      setS(json.data);
      setState("ok");
      const url = new URL(window.location.href);
      url.searchParams.set("id", v);
      window.history.replaceState(null, "", url);
    } catch {
      setState("notfound");
    }
  };

  useEffect(() => { if (initialId) void track(initialId); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const last = s?.readings.at(-1);
  const out = s && last ? last.celsius > s.profile.max || last.celsius < s.profile.min : false;
  const excursions = s ? s.readings.filter((r) => r.celsius > s.profile.max || r.celsius < s.profile.min).length : 0;
  const errId = "track-err";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <form onSubmit={(e) => { e.preventDefault(); void track(id); }} className="rounded-3xl p-6 glass-card" noValidate>
        <label htmlFor="track-id" className="text-sm font-semibold">{t.tracking.label}</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-steel-500" aria-hidden="true" />
            <input
              id="track-id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder={t.tracking.placeholder}
              autoComplete="off"
              spellCheck={false}
              dir="ltr"
              aria-invalid={state === "invalid" || state === "notfound"}
              aria-describedby={state === "invalid" || state === "notfound" ? errId : undefined}
              className="w-full rounded-xl border border-steel-300 py-3 pe-3 ps-10 font-mono text-base uppercase placeholder:normal-case placeholder:font-sans placeholder:text-steel-500 aria-[invalid=true]:border-alert"
            />
          </div>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold btn-midnight">
            {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} {t.tracking.button}
          </button>
        </div>
        {(state === "invalid" || state === "notfound") && (
          <p id={errId} role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-alert"><AlertTriangle className="h-4 w-4" aria-hidden="true" />{state === "invalid" ? t.tracking.invalid : t.tracking.notFound}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-steel-600">{t.tracking.tryThese}</span>
          {SAMPLES.map((x) => (
            <button key={x} type="button" onClick={() => void track(x)} className="rounded-full border border-steel-300 bg-white/70 px-3 py-1 font-mono text-xs transition hover:border-frost-500 hover:bg-frost-100" dir="ltr">{x}</button>
          ))}
        </div>
      </form>

      {state !== "ok" && (
        <ul className="mt-8 grid gap-5 sm:grid-cols-3">
          {PREMIUM[locale].trackingHints.map((h) => (
            <li key={h.title} className="lift glass-card rounded-[var(--radius-card)] p-6">
              <span className="icon-tile flex h-11 w-11 items-center justify-center rounded-xl"><Icon name={h.icon} className="h-5 w-5" /></span>
              <h2 className="mt-4 font-semibold">{h.title}</h2>
              <p className="mt-1.5 text-sm text-steel-700">{h.body}</p>
            </li>
          ))}
        </ul>
      )}

      <div aria-live="polite">
        {state === "ok" && s && (
          <article className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]" data-testid="tracking-result">
            <div className="space-y-6">
              <div className="rounded-3xl p-6 glass-card">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-mono text-xl font-bold" dir="ltr">{s.id}</h2>
                  <Badge tone={s.status === "delivered" ? "ok" : s.delayMinutes >= 30 ? "warn" : "frost"}>{t.status[s.status]}</Badge>
                  <span className="ms-auto text-xs font-semibold text-warn">{t.common.demoData}</span>
                </div>
                <p className="mt-2 text-lg">{CITIES[s.origin].name[locale]} → {CITIES[s.destination].name[locale]}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-steel-100" role="progressbar" aria-valuenow={Math.round(s.progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={t.tracking.status}>
                  <div className="h-full rounded-full bg-frost-500" style={{ width: `${s.progress * 100}%` }} />
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div><dt className="text-xs text-steel-600">{t.tracking.eta}</dt><dd className="text-lg font-semibold tabular">{fmtTime(locale, s.etaAt)}</dd></div>
                  <div><dt className="text-xs text-steel-600">{t.tracking.plannedEta}</dt><dd className="text-lg font-semibold tabular">{fmtTime(locale, s.plannedEtaAt)}</dd></div>
                  <div><dt className="text-xs text-steel-600">{t.tracking.temperature}</dt><dd className={`flex items-center gap-1 text-lg font-semibold tabular ${out ? "text-alert" : ""}`}>{out ? <AlertTriangle className="h-4 w-4" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4 text-ok" aria-hidden="true" />}{last ? fmtNumber(locale, last.celsius, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "—"} °C</dd></div>
                  <div><dt className="text-xs text-steel-600">{t.tracking.band}</dt><dd className="text-lg font-semibold">{t.profiles[s.profile.id]}</dd></div>
                </dl>
              </div>
              <div className="rounded-3xl p-6 glass-card">
                <h3 className="font-semibold">{t.tracking.temperature}</h3>
                {excursions > 0 && <p className="mt-1 text-sm text-alert">▲ {fmtNumber(locale, excursions)} × {locale === "ar" ? "قراءة خارج النطاق، تم تنبيه السائق والعميل (محاكاة)" : "readings outside the band; driver and customer alerted (simulated)"}</p>}
                <div className="mt-3">
                  <TempChart readings={s.readings} min={s.profile.min} max={s.profile.max} labels={{ title: t.tracking.temperature, band: t.tracking.band, excursion: locale === "ar" ? "تجاوز" : "Excursion", elapsed: locale === "ar" ? "منقضٍ" : "Elapsed", hint: "" }} />
                </div>
                <p className="mt-2 text-xs text-steel-500">{t.profileNote}</p>
              </div>
            </div>
            <aside className="space-y-6">
              <div className="rounded-3xl p-6 glass-card">
                <h3 className="font-semibold">{t.tracking.timeline}</h3>
                <ol className="mt-4">
                  {s.timeline.map((e, i) => (
                    <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
                      {i < s.timeline.length - 1 && <span className={`absolute start-[9px] top-5 h-full w-0.5 ${e.done ? "bg-frost-400" : "bg-steel-200"}`} aria-hidden="true" />}
                      {e.done ? <CheckCircle2 className={`relative h-5 w-5 shrink-0 ${e.code === "temp_alert" ? "text-alert" : "text-frost-600"}`} aria-hidden="true" /> : <Circle className="relative h-5 w-5 shrink-0 text-steel-300" aria-hidden="true" />}
                      <div className="text-sm">
                        <p className={e.done ? "font-medium" : "text-steel-500"}>{t.status[e.code]}</p>
                        <p className="text-xs text-steel-600 tabular">{CITIES[e.cityId].name[locale]} · {fmtTime(locale, e.at)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              {s.pod && (
                <div className="rounded-3xl border border-ok/30 bg-ok-bg p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-ok"><CheckCircle2 className="h-5 w-5" aria-hidden="true" />{t.tracking.pod}</h3>
                  <p className="mt-2 text-sm">{s.pod.receivedBy} · {fmtTime(locale, s.pod.signedAt)}</p>
                  <p className="text-sm tabular">{fmtNumber(locale, s.pod.tempAtHandover, { minimumFractionDigits: 1 })} °C</p>
                </div>
              )}
              <Link href={`/${locale}/support?shipment=${s.id}`} className="flex items-center justify-center rounded-xl border border-steel-300 bg-white px-4 py-3 font-semibold hover:bg-ice-50">{t.tracking.reportIssue}</Link>
              <Link href={`/${locale}/control-tower?tab=shipments`} className="flex items-center justify-center rounded-xl px-4 py-3 font-semibold btn-midnight">{t.common.viewTower}</Link>
            </aside>
          </article>
        )}
      </div>
    </div>
  );
}
