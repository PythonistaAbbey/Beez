"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ExternalLink, Maximize2, NotebookPen } from "lucide-react";
import type { Locale } from "@/lib/data/types";
import type { Slide } from "@/content/executive";
import { fmtNumber } from "@/lib/i18n";

export function ExecutiveDeck({ slides, locale, labels }: { slides: Slide[]; locale: Locale; labels: { notes: string; prev: string; next: string; full: string; of: string; minutes: string; demo: string } }) {
  const [i, setI] = useState(0);
  const [notes, setNotes] = useState(false);
  const reduce = useReducedMotion();
  const rtl = locale === "ar";
  const go = useCallback((d: number) => setI((v) => Math.min(slides.length - 1, Math.max(0, v + d))), [slides.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (tag === "BUTTON" && e.key === " ") return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(rtl ? -1 : 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(rtl ? 1 : -1); }
      if (e.key === "PageDown" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "PageUp") { e.preventDefault(); go(-1); }
      if (e.key.toLowerCase() === "n") setNotes((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, rtl]);

  const s = slides[i];
  const total = slides.reduce((a, x) => a + x.minutes, 0);
  return (
    <div className="bg-aurora text-white" id="deck">
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-6xl flex-col px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between gap-4 text-xs text-steel-400">
          <span className="tabular" aria-live="polite">{fmtNumber(locale, i + 1)} {labels.of} {fmtNumber(locale, slides.length)} · ≈{fmtNumber(locale, Math.round(total))} {labels.minutes}</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => setNotes((v) => !v)} aria-pressed={notes} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/10"><NotebookPen className="h-4 w-4" aria-hidden="true" />{labels.notes}</button>
            <button type="button" onClick={() => document.getElementById("deck")?.requestFullscreen?.()} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/10"><Maximize2 className="h-4 w-4" aria-hidden="true" />{labels.full}</button>
          </div>
        </div>
        <div className="mt-3 h-1 rounded-full bg-white/10"><div className="h-full rounded-full bg-frost-400 transition-all" style={{ width: `${((i + 1) / slides.length) * 100}%` }} /></div>

        <section className="relative flex flex-1 items-center py-10" aria-roledescription="slide" aria-label={`${i + 1} / ${slides.length}`}>
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="w-full">
              <p className="eyebrow !text-sand-300">{s.kicker}</p>
              <h1 className={`mt-4 max-w-4xl font-bold tracking-tight text-balance ${i === 0 ? "text-5xl uppercase sm:text-7xl" : "text-4xl sm:text-5xl"}`}>{s.title}</h1>
              <ul className="mt-10 grid gap-4 md:grid-cols-3">
                {s.points.map((p, k) => (
                  <li key={p} className="glass-dark rounded-2xl p-5 text-lg leading-snug text-steel-200">
                    <span className="mb-3 block text-sm font-bold text-frost-400 tabular">{fmtNumber(locale, k + 1, { minimumIntegerDigits: 2 })}</span>{p}
                  </li>
                ))}
              </ul>
              {s.link && (
                <Link href={`/${locale}${s.link.href}`} target="_blank" className="mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold btn-glacier">
                  {labels.demo}: {s.link.label} <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {notes && <aside className="mb-6 rounded-2xl border border-warn/40 bg-warn/10 p-4 text-sm text-steel-200"><strong className="text-white">{labels.notes}:</strong> {s.note}</aside>}

        <div className="flex items-center justify-between">
          <button type="button" onClick={() => go(-1)} disabled={i === 0} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 font-semibold disabled:opacity-30">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />{labels.prev}
          </button>
          <div className="hidden gap-1.5 sm:flex">
            {slides.map((_, k) => (
              <button key={k} type="button" onClick={() => setI(k)} aria-label={`${k + 1}`} aria-current={k === i ? "step" : undefined} className={`h-2.5 rounded-full transition-all ${k === i ? "w-8 bg-frost-400" : "w-2.5 bg-white/25 hover:bg-white/50"}`} />
            ))}
          </div>
          <button type="button" onClick={() => go(1)} disabled={i === slides.length - 1} className="btn-glacier inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold disabled:opacity-30">
            {labels.next}<ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
