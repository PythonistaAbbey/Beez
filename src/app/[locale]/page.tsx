import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BellRing, CheckCircle2, HeartPulse, LifeBuoy, PlayCircle, Thermometer } from "lucide-react";
import { getDict, isLocale } from "@/lib/i18n";
import { SERVICES } from "@/content/services";
import type { ServiceSlug } from "@/content/en";
import { buildShipments } from "@/lib/data/dataset";
import { initialState, selectKpis } from "@/lib/tower/store";
import { fmtNumber } from "@/lib/i18n";
import { KsaMap, type MapRoute } from "@/components/charts/KsaMap";
import { TempChart } from "@/components/charts/TempChart";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { SourceLink } from "@/components/ui/SourceLink";
import { Icon } from "@/components/Icon";
import { HeroArt } from "@/components/site/HeroArt";

const HOME_SERVICES: ServiceSlug[] = ["logistics", "cold-chain", "medical", "warehousing", "fourth-party-logistics", "ecommerce", "technology", "corporate"];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  const s = SERVICES[locale];
  const shipments = buildShipments();
  const hero = shipments.find((x) => x.id === "DEMO-RX-1042")!;
  const routes: MapRoute[] = shipments.slice(0, 18).map((x) => ({
    id: x.id, from: x.origin, to: x.destination, progress: x.progress,
    tone: x.status === "delivered" ? "done" : x.readings.some((r) => r.celsius > x.profile.max) ? "alert" : x.delayMinutes > 30 ? "warn" : "ok",
  }));
  const k = selectKpis(initialState());
  const href = (p: string) => `/${locale}${p}`;
  const arrow = <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />;
  const chartLabels = { title: t.tracking.temperature, band: t.tracking.band, excursion: locale === "ar" ? "تجاوز" : "Excursion", elapsed: locale === "ar" ? "منقضٍ" : "Elapsed", hint: "" };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-900 text-white" aria-labelledby="hero-title">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <HeroArt />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-12 lg:pb-28 lg:pt-24">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow !text-frost-400">{t.home.eyebrow}</p>
              <h1 id="hero-title" className="mt-5 text-5xl font-bold uppercase leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
                {t.home.title}
              </h1>
              <p className="mt-6 max-w-xl text-xl leading-relaxed text-steel-300">{t.home.lead}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href={href("/control-tower")} className="inline-flex items-center gap-2 rounded-full bg-frost-400 px-6 py-3.5 text-base font-semibold text-navy-950 hover:bg-frost-200">
                  {t.home.ctaPrimary} {arrow}
                </Link>
                <Link href={href("/quote")} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-base font-semibold text-white hover:bg-white/10">
                  {t.home.ctaSecondary}
                </Link>
              </div>
            </Reveal>
          </div>
          <div className="relative lg:col-span-6">
            <Reveal delay={0.15}>
              <KsaMap routes={routes} locale={locale} caption={`${t.common.demoData}: ${t.home.towerTitle}`} className="opacity-95" />
              <div className="absolute bottom-0 end-0 w-[min(92%,360px)] rounded-2xl border border-white/10 bg-navy-950/85 p-4 shadow-[var(--shadow-lift)] backdrop-blur">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-frost-200">
                    <span className="h-2 w-2 rounded-full bg-frost-400" aria-hidden="true" /> {t.home.heroCard.label}
                  </span>
                  <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-steel-200" dir="ltr">{hero.id}</span>
                </div>
                <p className="mt-2 text-sm font-semibold">{t.home.heroCard.route}</p>
                <div className="mt-2 rounded-lg bg-white p-1">
                  <TempChart readings={hero.readings} min={hero.profile.min} max={hero.profile.max} labels={chartLabels} height={150} />
                </div>
                <p className="mt-2 text-[11px] text-steel-400">{t.common.demoData}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROOF: what Beez already publishes */}
      <section className="border-b border-steel-200 bg-ice-50" aria-labelledby="proof-title">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 id="proof-title" className="text-2xl font-semibold tracking-tight">{t.home.proofTitle}</h2>
              <p className="mt-3 text-steel-700">{t.home.proofLead}</p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
              {t.home.proof.map((p) => (
                <li key={p.v} className="rounded-2xl border border-steel-200 bg-white p-5 shadow-[var(--shadow-card)]">
                  <p className="text-2xl font-bold text-navy-800">{p.k}</p>
                  <p className="mt-1 text-sm text-steel-700">{p.v}</p>
                  <div className="mt-3"><SourceLink src={p.src} label={t.common.source} /></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-labelledby="solutions-title">
        <SectionHeading id="solutions-title" eyebrow={t.nav.services} title={t.home.solutionsTitle} lead={t.home.solutionsLead} />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_SERVICES.map((slug, i) => (
            <li key={slug}>
              <Reveal delay={i * 0.04} className="h-full">
                <Link href={href(`/${slug}`)} className="group flex h-full flex-col rounded-[var(--radius-card)] border border-steel-200 bg-white p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-steel-300 hover:shadow-[var(--shadow-lift)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-frost-400">
                    <Icon name={s[slug].pillars[0].icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{t.serviceNames[slug]}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-steel-700">{s[slug].title}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-frost-600 group-hover:gap-2.5">{t.common.learnMore} {arrow}</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <h3 className="text-sm font-semibold text-steel-600">{t.home.industriesTitle} <span className="ms-2"><SourceLink src="home" label={t.common.source} /></span></h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {t.home.industries.map((x) => (
              <li key={x} className="rounded-full border border-steel-200 bg-ice-50 px-4 py-1.5 text-sm text-navy-800">{x}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* CONTROL TOWER PREVIEW */}
      <section className="bg-navy-950 text-white" aria-labelledby="tower-title">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <SectionHeading id="tower-title" eyebrow={t.nav.tower} title={t.home.towerTitle} lead={t.home.towerLead} light />
            <ul className="mt-8 space-y-3">
              {t.home.towerPoints.map((p) => (
                <li key={p} className="flex items-start gap-3 text-steel-200">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-frost-400" aria-hidden="true" /> {p}
                </li>
              ))}
            </ul>
            <Link href={href("/control-tower")} className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-navy-900 hover:bg-frost-100">
              {t.common.viewTower} {arrow}
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Thermometer className="h-4 w-4" aria-hidden="true" />, k: `${fmtNumber(locale, k.inBand, { maximumFractionDigits: 1 })}%`, v: locale === "ar" ? "قراءات ضمن النطاق" : "Readings in band" },
                  { icon: <BellRing className="h-4 w-4" aria-hidden="true" />, k: fmtNumber(locale, k.openAlerts), v: locale === "ar" ? "تنبيهات مفتوحة" : "Open alerts" },
                  { icon: <HeartPulse className="h-4 w-4" aria-hidden="true" />, k: fmtNumber(locale, k.critical), v: locale === "ar" ? "شحنات طبية حرجة" : "Critical medical" },
                ].map((kp) => (
                  <div key={kp.v} className="rounded-2xl bg-navy-900 p-4">
                    <span className="text-frost-400">{kp.icon}</span>
                    <p className="mt-2 text-2xl font-bold tabular">{kp.k}</p>
                    <p className="text-xs text-steel-400">{kp.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-2xl bg-white p-3">
                <TempChart readings={hero.readings} min={hero.profile.min} max={hero.profile.max} labels={chartLabels} height={200} />
              </div>
              <p className="mt-3 text-xs text-steel-400">{t.common.demoData} · {t.banner.short}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MEDICAL + CONTINUITY */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <Reveal className="h-full">
          <article className="flex h-full flex-col rounded-3xl border border-steel-200 bg-gradient-to-br from-white to-frost-100 p-8">
            <HeartPulse className="h-8 w-8 text-frost-600" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold">{t.home.medicalTitle}</h2>
            <p className="mt-3 flex-1 leading-relaxed text-steel-700">{t.home.medicalLead}</p>
            <div className="mt-4"><SourceLink src="logistics" label={t.common.source} /></div>
            <Link href={href("/medical")} className="mt-6 inline-flex items-center gap-2 font-semibold text-navy-800">{t.serviceNames.medical} {arrow}</Link>
          </article>
        </Reveal>
        <Reveal delay={0.08} className="h-full">
          <article className="flex h-full flex-col rounded-3xl border border-steel-200 bg-gradient-to-br from-white to-steel-100 p-8">
            <LifeBuoy className="h-8 w-8 text-steel-600" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold">{t.home.continuityTitle}</h2>
            <p className="mt-3 flex-1 leading-relaxed text-steel-700">{t.home.continuityLead}</p>
            <Link href={href("/control-tower?tab=continuity")} className="mt-6 inline-flex items-center gap-2 font-semibold text-navy-800">{t.common.tryDemo} {arrow}</Link>
          </article>
        </Reveal>
      </section>

      {/* CTA band */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 rounded-3xl bg-gradient-to-r from-navy-800 to-navy-600 p-10 text-white md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold">{t.home.ctaBandTitle}</h2>
            <p className="mt-2 text-steel-200">{t.home.ctaBandLead}</p>
          </div>
          <Link href={href("/executive")} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-navy-900 hover:bg-frost-100">
            <PlayCircle className="h-5 w-5" aria-hidden="true" /> {t.home.ctaBandButton}
          </Link>
        </div>
      </section>
    </>
  );
}
