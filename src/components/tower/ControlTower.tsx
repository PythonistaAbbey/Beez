"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  BarChart3, Bell, Boxes, Building2, FlaskConical, LayoutDashboard, LifeBuoy, Pause, Play, RotateCcw, Siren, Truck, Users,
} from "lucide-react";
import type { Dict } from "@/content/en";
import { TOWER } from "@/content/tower";
import type { Locale } from "@/lib/data/types";
import { getDataset, SIM_EPOCH } from "@/lib/data/dataset";
import { initialState, towerReducer } from "@/lib/tower/store";
import { Ctx, useTower as ctxOrThrow, type TabId, type TowerCtx } from "./context";
import { useFmt } from "./bits";
import { Overview } from "./Overview";
import { ShipmentsTab } from "./ShipmentsTab";
import { ShipmentDrawer } from "./ShipmentDrawer";
import { InventoryTab } from "./InventoryTab";
import { AlertsTab, EscalateDialog } from "./AlertsTab";
import { ContinuityTab } from "./ContinuityTab";
import { AnalyticsTab } from "./AnalyticsTab";
import { SuppliersTab } from "./SuppliersTab";
import { NotificationsTab } from "./NotificationsTab";
import { AccountTab } from "./AccountTab";

const TABS: { id: TabId; icon: typeof Truck }[] = [
  { id: "overview", icon: LayoutDashboard },
  { id: "shipments", icon: Truck },
  { id: "inventory", icon: Boxes },
  { id: "alerts", icon: Siren },
  { id: "continuity", icon: LifeBuoy },
  { id: "analytics", icon: BarChart3 },
  { id: "suppliers", icon: Users },
  { id: "notifications", icon: Bell },
  { id: "account", icon: Building2 },
];

export function ControlTower({ locale, t, initialTab }: { locale: Locale; t: Dict; initialTab: TabId }) {
  const data = useMemo(() => getDataset(), []);
  const [state, dispatch] = useReducer(towerReducer, data, initialState);
  const [tab, setTab] = useState<TabId>(initialTab);
  const [shipmentId, setShipmentId] = useState<string | null>(null);
  const [escalateId, setEscalateId] = useState<string | null>(null);
  const [live, setLive] = useState("");
  const td = TOWER[locale];
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Simulation clock: 1 real second = `speed` simulated minutes.
  useEffect(() => {
    if (!state.playing) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const id = window.setInterval(() => dispatch({ type: "tick", minutes: state.speed }), reduce ? 4000 : 1000);
    return () => window.clearInterval(id);
  }, [state.playing, state.speed]);

  const goTab = useCallback((id: TabId) => {
    setTab(id);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    window.history.replaceState(null, "", url);
  }, []);

  const ctx: TowerCtx = {
    state, dispatch, t, td, locale, data,
    openShipment: setShipmentId,
    openEscalate: setEscalateId,
    goTab,
    announce: setLive,
  };

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const rtl = locale === "ar";
    const keys: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 };
    let n: number | null = null;
    if (e.key in keys) n = (i + keys[e.key] + TABS.length) % TABS.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = TABS.length - 1;
    if (n !== null) {
      e.preventDefault();
      goTab(TABS[n].id);
      tabRefs.current[TABS[n].id]?.focus();
    }
  };

  return (
    <Ctx.Provider value={ctx}>
      <div className="min-h-[calc(100vh-7rem)] bg-mesh">
        <TopBar />
        <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr]">
          <div role="tablist" aria-label={td.title} aria-orientation="vertical" className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {TABS.map(({ id, icon: I }, i) => {
              const sel = tab === id;
              const badge = id === "alerts" ? state.alerts.filter((a) => a.state === "open").length : id === "continuity" && state.scenarios.length ? "!" : null;
              return (
                <button
                  key={id}
                  ref={(el) => { tabRefs.current[id] = el; }}
                  role="tab"
                  id={`tab-${id}`}
                  aria-selected={sel}
                  aria-controls={`panel-${id}`}
                  tabIndex={sel ? 0 : -1}
                  onClick={() => goTab(id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${sel ? "btn-midnight" : "text-steel-700 hover:bg-white/70"}`}
                >
                  <I className={`h-4 w-4 ${sel ? "text-frost-400" : ""}`} aria-hidden="true" />
                  <span className="whitespace-nowrap">{td.tabs[id]}</span>
                  {badge ? <span className={`ms-auto rounded-full px-1.5 text-xs tabular ${sel ? "bg-frost-400 text-navy-950" : "bg-alert-bg text-alert"}`}>{badge}</span> : null}
                </button>
              );
            })}
          </div>
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} tabIndex={0} className="min-w-0 outline-none">
            {tab === "overview" && <Overview />}
            {tab === "shipments" && <ShipmentsTab />}
            {tab === "inventory" && <InventoryTab />}
            {tab === "alerts" && <AlertsTab />}
            {tab === "continuity" && <ContinuityTab />}
            {tab === "analytics" && <AnalyticsTab />}
            {tab === "suppliers" && <SuppliersTab />}
            {tab === "notifications" && <NotificationsTab />}
            {tab === "account" && <AccountTab />}
          </div>
        </div>
      </div>
      <ShipmentDrawer id={shipmentId} onClose={() => setShipmentId(null)} />
      <EscalateDialog id={escalateId} onClose={() => setEscalateId(null)} />
      <div aria-live="polite" role="status" className="sr-only">{live}</div>
    </Ctx.Provider>
  );
}

function TopBar() {
  const { state, dispatch, td } = ctxOrThrow();
  const { time } = useFmt();
  const now = new Date(SIM_EPOCH + state.simMinutes * 60_000).toISOString();
  return (
    <div className="glass-header">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{td.title}</h1>
          <p className="text-sm text-steel-600">{td.account}</p>
        </div>
        <p className="inline-flex items-center gap-1.5 rounded-full bg-warn-bg px-3 py-1 text-xs font-semibold text-warn">
          <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" /> {td.demoBadge}
        </p>
        <div className="ms-auto flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-steel-200 bg-ice-50 px-3 py-1.5">
            <span className="text-xs text-steel-600">{td.clock}</span>
            <span className="font-mono text-sm font-semibold tabular" data-testid="sim-clock">{time(now)}</span>
          </div>
          <button type="button" onClick={() => dispatch({ type: "toggle" })} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-steel-300 hover:bg-ice-50" aria-label={state.playing ? td.pause : td.play}>
            {state.playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          </button>
          <label className="flex items-center gap-1.5 text-xs text-steel-600">
            {td.speed}
            <select
              value={state.speed}
              onChange={(e) => dispatch({ type: "speed", speed: Number(e.target.value) as 1 | 5 | 15 })}
              className="rounded-lg border border-steel-300 bg-white px-2 py-1.5 text-sm text-navy-900"
            >
              <option value={1}>×1</option>
              <option value={5}>×5</option>
              <option value={15}>×15</option>
            </select>
          </label>
          <button type="button" onClick={() => dispatch({ type: "reset" })} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-steel-700 hover:bg-steel-100">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> {td.reset}
          </button>
        </div>
      </div>
    </div>
  );
}
