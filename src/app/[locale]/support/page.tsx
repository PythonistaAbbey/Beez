import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { SupportCenter } from "@/components/demo/SupportCenter";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDict(locale).support.title } : {};
}

export default async function Page({ params }: P) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  return (
    <>
      <PageHero eyebrow={t.support.eyebrow} title={t.support.title} lead={t.support.lead} />
      <div className="bg-mesh"><SupportCenter t={t} locale={locale} /></div>
    </>
  );
}
