import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { QuoteWizard } from "@/components/demo/QuoteWizard";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDict(locale).quote.title } : {};
}

export default async function Page({ params }: P) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  return (
    <>
      <PageHero eyebrow={t.quote.eyebrow} title={t.quote.title} lead={t.quote.lead} />
      <div className="bg-mesh"><QuoteWizard t={t} locale={locale} /></div>
    </>
  );
}
