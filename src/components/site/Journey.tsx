import { PREMIUM } from "@/content/premium";
import type { Locale } from "@/lib/data/types";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { fmtNumber } from "@/lib/i18n";

/** Four-step journey of the proposed customer experience. */
export function Journey({ locale }: { locale: Locale }) {
  const j = PREMIUM[locale].journey;
  return (
    <section className="relative overflow-hidden" aria-labelledby="journey-title">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading id="journey-title" eyebrow={j.eyebrow} title={j.title} lead={j.lead} />
        <ol className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <span className="grad-line absolute inset-x-8 top-7 hidden h-px lg:block" aria-hidden="true" />
          {j.steps.map((s, i) => (
            <li key={s.title} className="relative">
              <Reveal delay={i * 0.08} className="h-full">
                <div className="lift glass-card h-full rounded-[var(--radius-card)] p-6">
                  <div className="flex items-center justify-between">
                    <span className="icon-tile flex h-14 w-14 items-center justify-center rounded-2xl"><Icon name={s.icon} className="h-6 w-6" /></span>
                    <span className="font-mono text-3xl font-bold text-steel-200 tabular" aria-hidden="true">{fmtNumber(locale, i + 1, { minimumIntegerDigits: 2 })}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-700">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
