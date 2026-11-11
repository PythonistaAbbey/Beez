import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Info, Sparkles } from "lucide-react";
import { getDict, isLocale, LOCALES } from "@/lib/i18n";
import { SERVICES, SERVICE_SLUGS } from "@/content/services";
import type { ServiceSlug } from "@/content/en";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SourceLink } from "@/components/ui/SourceLink";
import { ServiceCompare } from "@/components/site/ServiceCompare";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => SERVICE_SLUGS.map((service) => ({ locale, service })));
}

type P = { params: Promise<{ locale: string; service: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, service } = await params;
  if (!isLocale(locale) || !SERVICE_SLUGS.includes(service as ServiceSlug)) return {};
  const c = SERVICES[locale][service as ServiceSlug];
  return { title: getDict(locale).serviceNames[service as ServiceSlug], description: c.lead };
}

const RELATED: Record<ServiceSlug, string> = {
  about: "/control-tower", logistics: "/tracking", "cold-chain": "/control-tower?tab=alerts", medical: "/control-tower?tab=continuity",
  warehousing: "/control-tower?tab=inventory", "fourth-party-logistics": "/control-tower?tab=suppliers", ecommerce: "/control-tower?tab=notifications",
  technology: "/control-tower", corporate: "/quote",
};

export default async function ServicePage({ params }: P) {
  const { locale, service } = await params;
  if (!isLocale(locale) || !SERVICE_SLUGS.includes(service as ServiceSlug)) notFound();
  const slug = service as ServiceSlug;
  const t = getDict(locale);
  const c = SERVICES[locale][slug];
  const href = (p: string) => `/${locale}${p}`;
  const arrow = <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />;

  return (
    <>
      <section className="relative overflow-hidden bg-aurora text-white">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <div className="absolute -top-32 end-0 h-96 w-96 rounded-full bg-frost-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-sm text-steel-400">
            <Link href={href("")} className="hover:text-white">{t.nav.home}</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page" className="text-steel-200">{t.serviceNames[slug]}</span>
          </nav>
          <p className="eyebrow mt-8 !text-frost-400">{c.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">{c.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-steel-300">{c.lead}</p>
          {c.proposedPage && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-frost-400/40 bg-frost-400/10 px-4 py-1.5 text-sm text-frost-200">
              <Info className="h-4 w-4" aria-hidden="true" /> {t.common.proposedPage}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <ul className={`grid gap-5 sm:grid-cols-2 ${c.pillars.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {c.pillars.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 0.05} className="h-full">
                <div className="h-full rounded-[var(--radius-card)] p-6 glass-card">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-frost-100 text-frost-600"><Icon name={p.icon} className="h-5 w-5" /></span>
                  <h2 className="mt-5 text-lg font-semibold">{p.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-steel-700">{p.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-mesh">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div className="rounded-3xl p-8 glass-card">
            <h2 className="text-xl font-semibold">{t.common.stated}</h2>
            <ul className="mt-6 space-y-5">
              {c.stated.map((x) => (
                <li key={x.text} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ok" aria-hidden="true" />
                  <div>
                    <p className="text-navy-800">{x.text}</p>
                    <div className="mt-1"><SourceLink src={x.src} label={t.common.source} /></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-navy-900 p-8 text-white">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold"><Sparkles className="h-5 w-5 text-frost-400" aria-hidden="true" /> {t.common.proposed}</h2>
            <p className="mt-2 text-sm text-steel-400">{c.digital.title}</p>
            <ul className="mt-6 space-y-4">
              {c.digital.items.map((x) => (
                <li key={x} className="flex gap-3 text-steel-200">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-frost-400" aria-hidden="true" /> {x}
                </li>
              ))}
            </ul>
            <Link href={href(RELATED[slug])} className="mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold btn-glacier">
              {t.common.tryDemo} {arrow}
            </Link>
          </div>
        </div>
      </section>

      {slug === "corporate" && <ServiceCompare t={t} />}

      <section className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-14 sm:flex-row sm:items-center sm:px-6">
        <p className="text-lg font-semibold">{t.home.ctaSecondary}</p>
        <Link href={href("/quote")} className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold btn-midnight">{t.nav.quote} {arrow}</Link>
      </section>
    </>
  );
}
