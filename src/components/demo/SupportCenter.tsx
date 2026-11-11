"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Clock, Loader2, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import type { Dict } from "@/content/en";
import type { Locale, SupportTicket } from "@/lib/data/types";
import { TICKETS } from "@/lib/data/dataset";
import { TRACKING_ID, ticketSchema, type TicketInput } from "@/lib/schemas";
import { demoFetch } from "@/lib/demoFetch";
import { fmtTime } from "@/lib/i18n";
import { SourceLink } from "@/components/ui/SourceLink";
import { Badge } from "@/components/ui/Section";

export function SupportCenter({ t, locale, prefillShipment }: { t: Dict; locale: Locale; prefillShipment?: string }) {
  const s = t.support;
  const [tickets, setTickets] = useState<SupportTicket[]>(TICKETS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TicketInput>({
    resolver: zodResolver(ticketSchema(s.errors)),
    defaultValues: { category: prefillShipment ? "delay" : "damage", shipmentId: prefillShipment ?? "", subject: "", description: "" },
  });

  // Deep link from tracking: /support?shipment=DEMO-… prefills a delay report.
  useEffect(() => {
    if (prefillShipment) return;
    const q = new URLSearchParams(window.location.search).get("shipment")?.toUpperCase();
    if (q && TRACKING_ID.test(q)) reset({ category: "delay", shipmentId: q, subject: "", description: "" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = handleSubmit(async (data) => {
    const res = await demoFetch("/api/demo/tickets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) return;
    const json = (await res.json()) as { data: { id: string } };
    const now = new Date().toISOString();
    const tk: SupportTicket = { id: json.data.id, subject: data.subject, category: data.category, shipmentId: data.shipmentId || undefined, createdAt: now, state: "open", messages: [{ from: "customer", body: data.description, at: now }] };
    setTickets((x) => [tk, ...x]);
    setCreated(tk.id);
    setOpenId(tk.id);
    reset({ category: "damage", shipmentId: "", subject: "", description: "" });
    window.setTimeout(() => {
      setTickets((x) => x.map((k) => (k.id === tk.id ? { ...k, state: "in_progress", messages: [...k.messages, { from: "agent", body: s.autoReply, at: new Date().toISOString() }] } : k)));
    }, 1500);
  });

  const sendReply = (id: string) => {
    const body = reply.trim().slice(0, 1000);
    if (!body) return;
    setTickets((x) => x.map((k) => (k.id === id ? { ...k, messages: [...k.messages, { from: "customer", body, at: new Date().toISOString() }] } : k)));
    setReply("");
  };

  const field = "mt-1.5 block w-full rounded-xl border border-steel-300 bg-white px-3 py-2.5 text-base aria-[invalid=true]:border-alert";
  const subj = (k: SupportTicket) => (locale === "ar" && k.ar ? k.ar.subject : k.subject);
  const body = (k: SupportTicket, i: number, m: SupportTicket["messages"][number]) => (locale === "ar" && k.ar?.bodies[i] ? k.ar.bodies[i] : m.body);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        <section className="rounded-3xl p-6 sm:p-8 glass-card" aria-labelledby="report-title">
          <h2 id="report-title" className="text-xl font-semibold">{s.reportTitle}</h2>
          {created && <p role="status" className="mt-3 flex items-center gap-2 rounded-xl bg-ok-bg p-3 text-sm text-ok"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />{s.created}: <span className="font-mono" dir="ltr">{created}</span></p>}
          <form onSubmit={onSubmit} noValidate className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium">{s.category}
              <select {...register("category")} className={field}>
                {(Object.keys(s.categories) as (keyof typeof s.categories)[]).map((c) => <option key={c} value={c}>{s.categories[c]}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium">{s.shipmentId}
              <input {...register("shipmentId")} aria-invalid={!!errors.shipmentId} aria-describedby={errors.shipmentId ? "sid-err" : undefined} placeholder="DEMO-RX-1042" dir="ltr" className={`${field} font-mono uppercase`} />
              {errors.shipmentId && <span id="sid-err" className="mt-1 block text-sm text-alert">{errors.shipmentId.message}</span>}
            </label>
            <label className="text-sm font-medium sm:col-span-2">{s.subject}
              <input {...register("subject")} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "subj-err" : undefined} maxLength={120} className={field} />
              {errors.subject && <span id="subj-err" className="mt-1 block text-sm text-alert">{errors.subject.message}</span>}
            </label>
            <label className="text-sm font-medium sm:col-span-2">{s.description}
              <textarea rows={4} {...register("description")} aria-invalid={!!errors.description} aria-describedby={errors.description ? "desc-err" : undefined} maxLength={2000} className={field} />
              {errors.description && <span id="desc-err" className="mt-1 block text-sm text-alert">{errors.description.message}</span>}
            </label>
            <label className="text-sm font-medium sm:col-span-2">{s.attach}
              <input type="file" accept="image/*" multiple className="mt-1.5 block w-full text-sm file:me-3 file:rounded-lg file:border-0 file:bg-steel-100 file:px-3 file:py-2 file:font-semibold" onChange={(e) => { e.currentTarget.value = ""; }} />
            </label>
            <div className="sm:col-span-2">
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold disabled:opacity-60 btn-midnight">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}{s.submit}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-3xl p-6 sm:p-8 glass-card" aria-labelledby="tickets-title">
          <h2 id="tickets-title" className="text-xl font-semibold">{s.ticketsTitle}</h2>
          {tickets.length === 0 && <p className="mt-3 text-sm text-steel-600">{s.noTickets}</p>}
          <ul className="mt-4 space-y-3" data-testid="ticket-list">
            {tickets.map((k) => (
              <li key={k.id} className="rounded-2xl border border-steel-200">
                <button type="button" aria-expanded={openId === k.id} onClick={() => setOpenId(openId === k.id ? null : k.id)} className="flex w-full flex-wrap items-center gap-2 p-4 text-start">
                  <MessageSquare className="h-4 w-4 text-steel-500" aria-hidden="true" />
                  <span className="font-mono text-xs" dir="ltr">{k.id}</span>
                  <span className="flex-1 font-medium">{subj(k)}</span>
                  <Badge tone={k.state === "resolved" ? "ok" : k.state === "in_progress" ? "frost" : "warn"}>{s.states[k.state]}</Badge>
                </button>
                {openId === k.id && (
                  <div className="border-t border-steel-200 p-4">
                    <ol className="space-y-2" aria-live="polite">
                      {k.messages.map((m, i) => (
                        <li key={i} className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.from === "customer" ? "ms-auto bg-navy-900 text-white" : "bg-ice-50"}`}>
                          {body(k, i, m)}
                          <span className={`mt-1 block text-[11px] ${m.from === "customer" ? "text-steel-300" : "text-steel-500"}`}>{fmtTime(locale, m.at)}</span>
                        </li>
                      ))}
                    </ol>
                    {k.state !== "resolved" && (
                      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); sendReply(k.id); }}>
                        <label htmlFor={`reply-${k.id}`} className="sr-only">{s.reply}</label>
                        <input id={`reply-${k.id}`} value={reply} onChange={(e) => setReply(e.target.value)} placeholder={s.reply} maxLength={1000} className="flex-1 rounded-xl border border-steel-300 px-3 py-2 text-sm" />
                        <button type="submit" className="rounded-xl bg-navy-900 px-4 py-2 text-sm font-semibold text-white">{s.send}</button>
                      </form>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="rounded-3xl bg-navy-900 p-6 text-white" aria-labelledby="contact-title">
          <h2 id="contact-title" className="font-semibold">{s.contactTitle}</h2>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-frost-400" aria-hidden="true" /><span><span className="block text-xs text-steel-400">{s.phone}</span><span dir="ltr">8001240172</span></span></li>
            <li className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-frost-400" aria-hidden="true" /><span><span className="block text-xs text-steel-400">{s.email}</span><span dir="ltr">info@beez.com.sa</span></span></li>
            <li className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-frost-400" aria-hidden="true" /><span><span className="block text-xs text-steel-400">{s.hours}</span>{s.hoursValue}</span></li>
            <li className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-frost-400" aria-hidden="true" /><span><span className="block text-xs text-steel-400">{s.address}</span>{s.addressValue}</span></li>
          </ul>
          <div className="mt-4 [&_a]:text-steel-300"><SourceLink src="service" label={t.common.source} /></div>
        </section>
        <section className="rounded-3xl p-6 glass-card" aria-labelledby="faq-title">
          <h2 id="faq-title" className="font-semibold">{s.faqTitle}</h2>
          <div className="mt-3 divide-y divide-steel-200">
            {s.faq.map((f) => (
              <details key={f.q} className="group py-3">
                <summary className="cursor-pointer list-none text-sm font-medium marker:hidden">
                  <span className="flex items-center justify-between gap-2">{f.q}<span className="text-steel-400 transition group-open:rotate-45" aria-hidden="true">+</span></span>
                </summary>
                <p className="mt-2 text-sm text-steel-700">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-2"><SourceLink src="home" label={t.common.source} /></div>
        </section>
      </aside>
    </div>
  );
}
