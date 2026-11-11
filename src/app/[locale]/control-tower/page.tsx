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

// The ?tab= query is read on the client so the page can be prerendered (and exported as static files).
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ControlTower locale={locale} t={getDict(locale)} initialTab="overview" tabs={TABS} />;
}
