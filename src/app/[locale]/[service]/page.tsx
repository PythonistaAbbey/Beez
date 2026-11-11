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
import { ServiceVisual } from "@/components/site/ServiceVisual";
import { Journey } from "@/components/site/Journey";
import { CtaBand } from "@/components/site/CtaBand";
import { PREMIUM } from "@/content/premium";

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
  const others = SERVICE_SLUGS.filter((x) => x !== slug && x !== "about");
  const related = [0, 1, 2].map((n) => others[(SERVICE_SLUGS.indexOf(slug) + n) % others.length]);
  const arrow = <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />;

  return (
    <>
      <section className="relative overflow-hidden bg-aurora text-white">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <div className="orb absolute -top-32 end-0 h-96 w-96 rounded-full bg-frost-500/20 blur-3xl" aria-hidden="true" />
        <div className="orb absolute -bottom-40 start-1/3 h-80 w-80 rounded-full bg-sand-400/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="text-sm text-steel-400">
              <Link href={href("")} className="hover:text-white">{t.nav.home}</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span aria-current="page" className="text-steel-200">{t.serviceNames[slug]}</span>
            </nav>
            <p className="eyebrow mt-8 !text-sand-300">{c.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"><span className="text-ice-shine">{c.title}</span></h1>
            <div className="rule-sand mt-6 w-32" aria-hidden="true" />
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel-300">{c.lead}</p>
            {c.proposedPage && (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-frost-400/40 bg-frost-400/10 px-4 py-1.5 text-sm text-frost-200">
                <Info className="h-4 w-4" aria-hidden="true" /> {t.common.proposedPage}
              </p>
            )}
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={href(RELATED[slug])} className="btn-glacier inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold">{t.common.tryDemo} {arrow}</Link>
              <Link href={href("/quote")} className="glass-dark inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold">{t.nav.quote}</Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <ServiceVisual slug={slug} locale={locale} labels={{ temperature: t.tracking.temperature, band: t.tracking.band }} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6">
        <ul className={`grid gap-5 sm:grid-cols-2 ${c.pillars.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {c.pillars.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 0.05} className="h-full">
                <div className="lift glass-solid h-full rounded-[var(--radius-card)] p-7 glass-card">
                  <span className="icon-tile flex h-12 w-12 items-center justify-center rounded-2xl"><Icon name={p.icon} className="h-5 w-5" /></span>
                  <h2 className="mt-5 text-lg font-semibold">{p.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-steel-700">{p.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-mesh mt-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2">
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
          <div className="relative overflow-hidden rounded-3xl bg-aurora p-8 text-white shadow-[var(--shadow-lift)] ring-1 ring-white/10">
            <div className="orb absolute -top-20 -end-20 h-60 w-60 rounded-full bg-glacier-400/20 blur-3xl" aria-hidden="true" />
            <div className="relative">
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
        </div>
      </section>

      {slug === "corporate" && <ServiceCompare t={t} />}

      <Journey locale={locale} />

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6" aria-labelledby="related-title">
        <h2 id="related-title" className="text-2xl font-semibold tracking-tight">{PREMIUM[locale].related}</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-3">
          {related.map((r) => (
            <li key={r}>
              <Link href={href(`/${r}`)} className="lift group glass-card flex h-full flex-col rounded-[var(--radius-card)] p-6">
                <span className="icon-tile flex h-11 w-11 items-center justify-center rounded-xl"><Icon name={SERVICES[locale][r].pillars[0].icon} className="h-5 w-5" /></span>
                <h3 className="mt-5 font-semibold">{t.serviceNames[r]}</h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-steel-700">{SERVICES[locale][r].title}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-frost-600 transition-all group-hover:gap-2.5">{t.common.learnMore} {arrow}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand locale={locale} />
    </>
  );
}
