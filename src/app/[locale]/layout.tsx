import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { getDict, isLocale, LOCALES } from "@/lib/i18n";
import { DemoBanner } from "@/components/site/DemoBanner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return {
    title: { default: t.meta.title, template: `%s · ${t.meta.title}` },
    description: t.meta.description,
    robots: { index: false, follow: false },
    alternates: { languages: { en: "/en", ar: "/ar" } },
  };
}

export const viewport: Viewport = { themeColor: "#0a1b38", width: "device-width", initialScale: 1 };

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  return (
    <html lang={locale} dir={t.dir}>
      <body className="min-h-screen">
        <a href="#main" className="skip-link">{t.skip}</a>
        <DemoBanner t={t} locale={locale} />
        <SiteHeader t={t} locale={locale} />
        <main id="main" tabIndex={-1} className="outline-none">{children}</main>
        <SiteFooter t={t} locale={locale} />
      </body>
    </html>
  );
}
