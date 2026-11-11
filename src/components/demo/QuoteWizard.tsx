"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, CheckCircle2, Loader2 } from "lucide-react";
import type { Dict } from "@/content/en";
import type { Locale } from "@/lib/data/types";
import { CITIES } from "@/lib/data/geo";
import { CITY_IDS, INDUSTRY_IDS, PROFILE_IDS, SERVICE_IDS, planningIndex, quoteSchemas, type QuoteData, type QuoteInput } from "@/lib/schemas";
import { fmtNumber } from "@/lib/i18n";
import { demoFetch } from "@/lib/demoFetch";

const STEP_FIELDS: (keyof QuoteInput)[][] = [
  ["company", "contactName", "email", "phone"],
  ["service", "industry", "origin", "destination", "profile", "palletsPerMonth", "startDate", "notes"],
  ["consent"],
];

export function QuoteWizard({ t, locale }: { t: Dict; locale: Locale }) {
  const q = t.quote;
  const schema = useMemo(() => quoteSchemas(q.errors).full, [q.errors]);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<{ reference: string } | null>(null);
  const [serverError, setServerError] = useState(false);
  const reduce = useReducedMotion();
  const { register, handleSubmit, trigger, control, reset, getValues, formState: { errors, isSubmitting } } = useForm<QuoteInput, unknown, QuoteData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { service: "cold_chain", industry: "medical", origin: "riyadh", destination: "jeddah", profile: "pharma", palletsPerMonth: 40, startDate: "", notes: "", phone: "", company: "", contactName: "", email: "" },
  });
  const watched = useWatch({ control });
  const idx = useMemo(() => {
    const p = Number(watched.palletsPerMonth);
    if (!p || p < 1) return null;
    return planningIndex({ palletsPerMonth: p, profile: watched.profile ?? "pharma", service: watched.service ?? "cold_chain", origin: watched.origin ?? "riyadh", destination: watched.destination ?? "jeddah" });
  }, [watched]);

  const next = async () => {
    const ok = await trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (ok) setStep((s) => Math.min(2, s + 1));
  };
  const onSubmit = handleSubmit(async (data) => {
    setServerError(false);
    const res = await demoFetch("/api/demo/quotes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) { setServerError(true); return; }
    const json = (await res.json()) as { data: { reference: string } };
    setDone({ reference: json.data.reference });
  });

  const field = "mt-1.5 block w-full rounded-xl border border-steel-300 bg-white px-3 py-2.5 text-base aria-[invalid=true]:border-alert";
  const Err = ({ name }: { name: keyof QuoteInput }) => {
    const e = errors[name];
    return e?.message ? <p id={`${name}-err`} className="mt-1 text-sm text-alert">{String(e.message)}</p> : null;
  };
  const aria = (name: keyof QuoteInput) => ({ "aria-invalid": !!errors[name], "aria-describedby": errors[name] ? `${name}-err` : undefined });

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6" role="status" data-testid="quote-success">
        <CheckCircle2 className="mx-auto h-14 w-14 text-ok" aria-hidden="true" />
        <h2 className="mt-4 text-3xl font-semibold">{q.successTitle}</h2>
        <p className="mt-3 text-steel-700">{q.successBody}</p>
        <p className="mt-6 inline-block rounded-xl bg-ice-50 px-4 py-2 text-sm">{q.reference}: <span className="font-mono font-bold" dir="ltr">{done.reference}</span></p>
        <div className="mt-8">
          <button type="button" className="rounded-full px-6 py-3 font-semibold btn-midnight" onClick={() => { reset(); setStep(0); setDone(null); }}>{q.another}</button>
        </div>
      </div>
    );
  }

  const v = getValues();
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px]">
      <form onSubmit={onSubmit} noValidate className="rounded-3xl p-6 sm:p-8 glass-card">
        <ol className="mb-8 flex items-center gap-2" aria-label={q.title}>
          {q.steps.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2" aria-current={i === step ? "step" : undefined}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${i < step ? "bg-ok text-white" : i === step ? "bg-navy-900 text-white" : "bg-steel-100 text-steel-600"}`}>
                {i < step ? <Check className="h-4 w-4" aria-hidden="true" /> : fmtNumber(locale, i + 1)}
              </span>
              <span className={`hidden text-sm sm:inline ${i === step ? "font-semibold" : "text-steel-600"}`}>{label}</span>
              {i < 2 && <span className="h-px flex-1 bg-steel-200" aria-hidden="true" />}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            {step === 0 && (
              <fieldset className="grid gap-5 sm:grid-cols-2">
                <legend className="sr-only">{q.steps[0]}</legend>
                <label className="text-sm font-medium sm:col-span-2">{q.company}<input {...register("company")} {...aria("company")} autoComplete="organization" className={field} /><Err name="company" /></label>
                <label className="text-sm font-medium">{q.contactName}<input {...register("contactName")} {...aria("contactName")} autoComplete="name" className={field} /><Err name="contactName" /></label>
                <label className="text-sm font-medium">{q.email}<input type="email" {...register("email")} {...aria("email")} autoComplete="email" dir="ltr" className={field} /><Err name="email" /></label>
                <label className="text-sm font-medium">{q.phone}<input type="tel" {...register("phone")} {...aria("phone")} autoComplete="tel" dir="ltr" placeholder="+9665XXXXXXXX" className={field} /><Err name="phone" /></label>
              </fieldset>
            )}
            {step === 1 && (
              <fieldset className="grid gap-5 sm:grid-cols-2">
                <legend className="sr-only">{q.steps[1]}</legend>
                <label className="text-sm font-medium">{q.service}<select {...register("service")} className={field}>{SERVICE_IDS.map((s) => <option key={s} value={s}>{q.serviceOptions[s]}</option>)}</select></label>
                <label className="text-sm font-medium">{q.industry}<select {...register("industry")} className={field}>{INDUSTRY_IDS.map((s) => <option key={s} value={s}>{t.industries[s]}</option>)}</select></label>
                <label className="text-sm font-medium">{q.origin}<select {...register("origin")} className={field}>{CITY_IDS.map((c) => <option key={c} value={c}>{CITIES[c].name[locale]}</option>)}</select></label>
                <label className="text-sm font-medium">{q.destination}<select {...register("destination")} className={field}>{CITY_IDS.map((c) => <option key={c} value={c}>{CITIES[c].name[locale]}</option>)}</select></label>
                <fieldset className="sm:col-span-2">
                  <legend className="text-sm font-medium">{q.profile}</legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {PROFILE_IDS.map((p) => (
                      <label key={p} className="flex cursor-pointer items-center gap-2 rounded-xl border border-steel-300 p-3 text-sm has-[:checked]:border-navy-700 has-[:checked]:bg-ice-50">
                        <input type="radio" value={p} {...register("profile")} className="accent-navy-800" /> {t.profiles[p]}
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-steel-500">{t.profileNote}</p>
                </fieldset>
                <label className="text-sm font-medium">{q.pallets}<input type="number" inputMode="numeric" min={1} max={5000} {...register("palletsPerMonth")} {...aria("palletsPerMonth")} className={field} /><Err name="palletsPerMonth" /></label>
                <label className="text-sm font-medium">{q.startDate}<input type="date" {...register("startDate")} {...aria("startDate")} className={field} /><Err name="startDate" /></label>
                <label className="text-sm font-medium sm:col-span-2">{q.notes}<textarea rows={3} maxLength={1000} {...register("notes")} className={field} /></label>
              </fieldset>
            )}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold">{q.reviewTitle}</h2>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  {[
                    [q.company, v.company], [q.contactName, v.contactName], [q.email, v.email], [q.phone, v.phone || "—"],
                    [q.service, q.serviceOptions[v.service]], [q.industry, t.industries[v.industry]],
                    [`${q.origin} → ${q.destination}`, `${CITIES[v.origin].name[locale]} → ${CITIES[v.destination].name[locale]}`],
                    [q.profile, t.profiles[v.profile]], [q.pallets, String(v.palletsPerMonth)], [q.startDate, v.startDate],
                  ].map(([k, val]) => (
                    <div key={k} className="rounded-xl bg-ice-50 p-3"><dt className="text-xs text-steel-600">{k}</dt><dd className="font-semibold break-words">{val}</dd></div>
                  ))}
                </dl>
                <label className="mt-6 flex items-start gap-3 text-sm">
                  <input type="checkbox" {...register("consent")} {...aria("consent")} className="mt-0.5 h-5 w-5 accent-navy-800" />
                  <span>{q.consent}</span>
                </label>
                <Err name="consent" />
                {serverError && <p role="alert" className="mt-3 text-sm text-alert">{locale === "ar" ? "رفضت واجهة العرض التجريبي البيانات. يرجى مراجعة إجاباتك." : "The demo API rejected the request. Please review your answers."}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-steel-200 pt-6">
          {step > 0 ? <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-full px-5 py-2.5 font-semibold text-steel-700 hover:bg-steel-100">{t.common.back}</button> : <span />}
          {step < 2 ? (
            <button type="button" onClick={next} className="rounded-full px-6 py-2.5 font-semibold btn-midnight">{t.common.next}</button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-semibold disabled:opacity-60 btn-glacier">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}{q.submit}
            </button>
          )}
        </div>
      </form>

      <aside className="h-fit rounded-3xl bg-navy-900 p-6 text-white lg:sticky lg:top-24">
        <h2 className="text-sm font-semibold text-frost-200">{q.estimateTitle}</h2>
        <p className="mt-4 text-4xl font-bold tabular" aria-live="polite">{idx ? `${fmtNumber(locale, idx.low)}–${fmtNumber(locale, idx.high)}` : "—"}</p>
        <p className="mt-1 text-xs text-steel-400">index · 100 = {locale === "ar" ? "ملف مرجعي" : "reference lane"}</p>
        <p className="mt-6 text-xs leading-relaxed text-steel-300">{q.estimateNote}</p>
      </aside>
    </div>
  );
}
