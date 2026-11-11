import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import { TOWER } from "@/content/tower";
import { ControlTower } from "@/components/tower/ControlTower";
import type { TabId } from "@/components/tower/context";

const TABS: TabId[] = ["overview", "shipments", "inventory", "alerts", "continuity", "analytics", "suppliers", "notifications", "account"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: TOWER[locale].title } : {};
}

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { locale } = await params;
  const { tab } = await searchParams;
  if (!isLocale(locale)) notFound();
  const initialTab = TABS.includes(tab as TabId) ? (tab as TabId) : "overview";
  return <ControlTower locale={locale} t={getDict(locale)} initialTab={initialTab} />;
}
