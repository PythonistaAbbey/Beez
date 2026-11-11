"use client";

import { useMemo } from "react";
import { Activity, BellRing, Timer } from "lucide-react";
import type { ServiceSlug } from "@/content/en";
import { PREMIUM } from "@/content/premium";
import type { Locale } from "@/lib/data/types";
import { buildShipments, INVENTORY } from "@/lib/data/dataset";
import { daysOfCover, initialState, selectKpis } from "@/lib/tower/store";
import { fmtNumber } from "@/lib/i18n";
import { KsaMap, type MapRoute } from "@/components/charts/KsaMap";
import { TempChart } from "@/components/charts/TempChart";

type Kind = "temp" | "map" | "stock" | "kpi";
const KIND: Record<ServiceSlug, Kind> = {
  about: "map", logistics: "map", "cold-chain": "temp", medical: "temp", warehousing: "stock",
  "fourth-party-logistics": "map", ecommerce: "stock", technology: "kpi", corporate: "map",
};

/** Hero visual for a service page. All values come from the seeded synthetic dataset. */
export function ServiceVisual({ slug, locale, labels }: { slug: ServiceSlug; locale: Locale; labels: { temperature: string; band: string } }) {
  const p = PREMIUM[locale].visual;
  const kind = KIND[slug];
  const shipments = useMemo(() => buildShipments(), []);
  const nf = (n: number, d = 0) => fmtNumber(locale, n, { maximumFractionDigits: d });

  let body: React.ReactNode = null;
  let title = "";
  if (kind === "temp") {
    const s = shipments.find((x) => x.industry === (slug === "medical" ? "medical" : "food")) ?? shipments[0];
    title = `${s.id} · ${p.inBand}`;
    body = (
      <div className="rounded-2xl bg-white p-2">
        <TempChart readings={s.readings} min={s.profile.min} max={s.profile.max} height={230}
          labels={{ title: labels.temperature, band: labels.band, excursion: locale === "ar" ? "تجاوز" : "Excursion", elapsed: locale === "ar" ? "منقضٍ" : "Elapsed", hint: "" }} />
      </div>
    );
  } else if (kind === "map") {
    const routes: MapRoute[] = shipments.slice(0, 12).map((x) => ({
      id: x.id, from: x.origin, to: x.destination, progress: x.progress,
      tone: x.status === "delivered" ? "done" : x.delayMinutes > 30 ? "warn" : "ok",
    }));
    body = <KsaMap routes={routes} locale={locale} caption={p.demo} showCities className="-mx-2" />;
  } else if (kind === "stock") {
    title = p.cover;
    const rows = INVENTORY.slice(0, 6).map((i) => ({ name: i.name[locale], cover: daysOfCover(i.onHand, i.reserved, i.dailyDemand) }));
    const max = Math.max(...rows.map((r) => r.cover));
    body = (
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.name} className="text-sm">
            <div className="flex justify-between gap-3 text-steel-200"><span className="truncate">{r.name}</span><span className="tabular font-semibold text-white">{nf(r.cover, 1)}</span></div>
            <div className="mt-1.5 h-2 rounded-full bg-white/10">
              <div className={`h-full rounded-full ${r.cover < 3 ? "bg-sand-400" : "bg-gradient-to-r from-frost-500 to-glacier-300"}`} style={{ width: `${(r.cover / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    );
  } else {
    const k = selectKpis(initialState());
    const tiles = [
      { I: Activity, v: `${nf(k.inBand, 1)}%`, l: p.inBand },
      { I: BellRing, v: nf(k.openAlerts), l: p.open },
      { I: Timer, v: `${nf(k.onTime)}%`, l: p.onTime },
    ];
    const routes: MapRoute[] = shipments.slice(0, 10).map((x) => ({ id: x.id, from: x.origin, to: x.destination, progress: x.progress, tone: x.delayMinutes > 30 ? "warn" : "ok" }));
    body = (
      <>
      <div className="grid grid-cols-3 gap-3">
        {tiles.map(({ I, v, l }) => (
          <div key={l} className="glass-dark rounded-2xl p-4">
            <I className="h-4 w-4 text-glacier-400" aria-hidden="true" />
            <p className="mt-3 text-2xl font-bold tabular">{v}</p>
            <p className="text-xs text-steel-300">{l}</p>
          </div>
        ))}
      </div>
      <KsaMap routes={routes} locale={locale} caption={p.demo} showCities={false} className="-mx-2 mt-2" />
      </>
    );
  }

  return (
    <figure className="glass-dark float-slow rounded-3xl p-5 shadow-[0_40px_80px_-40px_rgb(62_230_224/0.45)]">
      {title && <figcaption className="mb-3 flex items-center gap-2 text-xs font-semibold text-frost-200"><span className="h-2 w-2 rounded-full bg-glacier-400 shadow-[0_0_12px_#3ee6e0]" aria-hidden="true" /> <span dir="auto">{title}</span></figcaption>}
      {body}
      <p className="mt-3 text-[11px] text-steel-400">{p.demo}</p>
    </figure>
  );
}
