import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import { TRACKING_ID } from "@/lib/schemas";
import { PageHero } from "@/components/site/PageHero";
import { SupportCenter } from "@/components/demo/SupportCenter";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ shipment?: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDict(locale).support.title } : {};
}

export default async function Page({ params, searchParams }: P) {
  const { locale } = await params;
  const { shipment } = await searchParams;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  const prefill = shipment && TRACKING_ID.test(shipment) ? shipment : undefined;
  return (
    <>
      <PageHero eyebrow={t.support.eyebrow} title={t.support.title} lead={t.support.lead} />
      <div className="bg-ice-50"><SupportCenter t={t} locale={locale} prefillShipment={prefill} /></div>
    </>
  );
}
