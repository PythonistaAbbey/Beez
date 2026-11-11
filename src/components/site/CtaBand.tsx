import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PREMIUM } from "@/content/premium";
import type { Locale } from "@/lib/data/types";

/** Closing call to action used at the foot of content pages. */
export function CtaBand({ locale }: { locale: Locale }) {
  const c = PREMIUM[locale].cta;
  const arrow = <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />;
  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-aurora p-10 text-white shadow-[var(--shadow-lift)] ring-1 ring-white/10 sm:p-14">
        <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="orb absolute -bottom-24 -end-16 h-72 w-72 rounded-full bg-glacier-400/25 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="rule-sand mb-6 w-24" aria-hidden="true" />
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{c.title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-steel-200">{c.lead}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href={`/${locale}/control-tower`} className="btn-glacier inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold">{c.primary} {arrow}</Link>
            <Link href={`/${locale}/quote`} className="glass-dark inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold">{c.secondary}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
