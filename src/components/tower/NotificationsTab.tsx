"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { notificationPrefsSchema, type NotificationPrefs, NOTIFY_EVENTS, NOTIFY_CHANNELS } from "@/lib/schemas";
import { useTower } from "./context";
import { Btn, Card } from "./bits";

export function NotificationsTab() {
  const { td, locale, announce } = useTower();
  const n = td.notifications;
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<NotificationPrefs>({
    resolver: zodResolver(notificationPrefsSchema),
    defaultValues: {
      matrix: {
        temp_excursion: ["email", "sms", "inapp"],
        delay: ["email", "inapp"],
        delivered: ["inapp"],
        exception: ["email", "sms", "whatsapp", "inapp"],
        stock_low: ["email"],
      },
      quietFrom: "22:00",
      quietTo: "06:00",
      contact: "",
      language: locale,
    },
  });
  const submit = handleSubmit(() => { setSaved(true); announce(n.saved); });

  return (
    <Card title={n.title}>
      <p className="-mt-2 mb-4 text-sm text-steel-700">{n.lead}</p>
      <form onSubmit={submit} onChange={() => setSaved(false)} noValidate className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-steel-200">
                <td />
                {NOTIFY_CHANNELS.map((c) => <th key={c} scope="col" className="px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-steel-600">{n.channels[c]}</th>)}
              </tr>
            </thead>
            <tbody>
              {NOTIFY_EVENTS.map((ev) => (
                <tr key={ev} className="border-b border-steel-100">
                  <th scope="row" className="px-2 py-3 text-start font-medium">{n.events[ev]}</th>
                  {NOTIFY_CHANNELS.map((c) => (
                    <td key={c} className="px-2 py-3 text-center">
                      <input type="checkbox" value={c} {...register(`matrix.${ev}`)} aria-label={`${n.events[ev]} – ${n.channels[c]}`} className="h-4 w-4 accent-navy-800" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <fieldset className="rounded-xl border border-steel-200 p-3">
            <legend className="px-1 text-sm font-medium">{n.quiet}</legend>
            <div className="flex gap-3">
              <label className="flex-1 text-xs text-steel-600">{n.from}<input type="time" {...register("quietFrom")} className="mt-1 block w-full rounded-lg border border-steel-300 px-2 py-1.5 text-sm text-navy-900" /></label>
              <label className="flex-1 text-xs text-steel-600">{n.to}<input type="time" {...register("quietTo")} className="mt-1 block w-full rounded-lg border border-steel-300 px-2 py-1.5 text-sm text-navy-900" /></label>
            </div>
          </fieldset>
          <label className="text-sm font-medium">
            {n.contact}
            <input type="email" {...register("contact")} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? "contact-err" : undefined} placeholder="quality@example.com" dir="ltr" className="mt-1 block w-full rounded-xl border border-steel-300 px-3 py-2 text-sm aria-[invalid=true]:border-alert" />
            {errors.contact && <span id="contact-err" className="mt-1 block text-xs text-alert">{n.emailError}</span>}
          </label>
          <label className="text-sm font-medium">
            {n.language}
            <select {...register("language")} className="mt-1 block w-full rounded-xl border border-steel-300 bg-white px-3 py-2 text-sm">
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </label>
        </div>
        <p className="flex items-center gap-2 text-sm text-steel-700"><ShieldAlert className="h-4 w-4 text-alert" aria-hidden="true" /> {n.critical}</p>
        <div className="flex items-center gap-3">
          <Btn type="submit" variant="primary" className="!px-4 !py-2">{n.save}</Btn>
          {saved && <span role="status" className="inline-flex items-center gap-1.5 text-sm font-medium text-ok"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {n.saved}</span>}
          {!saved && isDirty && <span className="text-xs text-steel-500">•</span>}
        </div>
      </form>
    </Card>
  );
}
