import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { TrackingDemo } from "@/components/demo/TrackingDemo";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDict(locale).tracking.title } : {};
}

export default async function Page({ params }: P) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  return (
    <>
      <PageHero eyebrow={t.tracking.eyebrow} title={t.tracking.title} lead={t.tracking.lead} />
      <div className="bg-mesh"><TrackingDemo t={t} locale={locale} /></div>
    </>
  );
}
