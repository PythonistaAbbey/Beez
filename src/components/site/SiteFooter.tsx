import Link from "next/link";
import type { Dict, ServiceSlug } from "@/content/en";
import type { Locale } from "@/lib/data/types";
import { SOURCES } from "@/content/sources";
import { Logo } from "./Logo";

const COLS: ServiceSlug[] = ["logistics", "cold-chain", "medical", "warehousing", "fourth-party-logistics", "ecommerce", "technology", "corporate"];

export function SiteFooter({ t, locale }: { t: Dict; locale: Locale }) {
  const href = (p: string) => `/${locale}${p}`;
  return (
    <footer className="bg-navy-950 text-steel-300">
      <div className="rule-sand" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-12 [&>*]:min-w-0">
        <div className="md:col-span-4">
          <Logo label="Beez" tag="Concept" light />
          <section id="disclaimer" aria-labelledby="disclaimer-title" className="mt-6 glass-dark rounded-2xl p-5">
            <h2 id="disclaimer-title" className="text-sm font-semibold text-white">{t.footer.disclaimerTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t.footer.disclaimer}</p>
          </section>
        </div>
        <nav aria-label={t.nav.services} className="md:col-span-3">
          <h2 className="text-sm font-semibold text-white">{t.nav.services}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {COLS.map((s) => (
              <li key={s}><Link className="hover:text-white" href={href(`/${s}`)}>{t.serviceNames[s]}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Demo" className="md:col-span-2">
          <h2 className="text-sm font-semibold text-white">{t.common.tryDemo}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-white" href={href("/control-tower")}>{t.nav.tower}</Link></li>
            <li><Link className="hover:text-white" href={href("/tracking")}>{t.nav.tracking}</Link></li>
            <li><Link className="hover:text-white" href={href("/quote")}>{t.nav.quote}</Link></li>
            <li><Link className="hover:text-white" href={href("/support")}>{t.nav.support}</Link></li>
            <li><Link className="hover:text-white" href={href("/executive")}>{t.nav.executive}</Link></li>
          </ul>
        </nav>
        <div className="md:col-span-3">
          <h2 className="text-sm font-semibold text-white">{t.footer.sources}</h2>
          <ul className="mt-4 space-y-1.5 text-xs" dir="ltr">
            {Object.values(SOURCES).map((u) => (
              <li key={u} className="truncate"><a className="hover:text-white" href={u} rel="noopener noreferrer" target="_blank">{u.replace(/^https?:\/\/(www\.)?/, "")}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            {t.footer.by}{" "}
            <a href="https://pristineeducation.net/" className="font-semibold text-white hover:underline" rel="noopener noreferrer" target="_blank">Pristine Education</a>
          </p>
          <p>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
