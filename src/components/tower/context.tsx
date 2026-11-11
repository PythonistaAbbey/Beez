"use client";

import { createContext, useContext } from "react";
import type { Dict } from "@/content/en";
import type { TowerDict } from "@/content/tower";
import type { Locale } from "@/lib/data/types";
import type { Dataset } from "@/lib/data/dataset";
import type { TowerAction, TowerState } from "@/lib/tower/store";

export type TabId = "overview" | "shipments" | "inventory" | "alerts" | "continuity" | "analytics" | "suppliers" | "notifications" | "account";

export interface TowerCtx {
  state: TowerState;
  dispatch: React.Dispatch<TowerAction>;
  t: Dict;
  td: TowerDict;
  locale: Locale;
  data: Dataset;
  openShipment: (id: string) => void;
  openEscalate: (alertId: string) => void;
  goTab: (tab: TabId) => void;
  announce: (msg: string) => void;
}

export const Ctx = createContext<TowerCtx | null>(null);

export function useTower() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTower outside provider");
  return c;
}
