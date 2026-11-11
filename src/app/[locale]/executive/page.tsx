import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import { SLIDES } from "@/content/executive";
import { ExecutiveDeck } from "@/components/demo/ExecutiveDeck";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDict(locale).nav.executive } : {};
}

export default async function Page({ params }: P) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ar = locale === "ar";
  const labels = ar
    ? { notes: "ملاحظات المتحدث", prev: "السابق", next: "التالي", full: "ملء الشاشة", of: "من", minutes: "دقائق", demo: "العرض الحي" }
    : { notes: "Speaker notes", prev: "Previous", next: "Next", full: "Full screen", of: "of", minutes: "minutes", demo: "Live demo" };
  return <ExecutiveDeck slides={SLIDES[locale]} locale={locale} labels={labels} />;
}
