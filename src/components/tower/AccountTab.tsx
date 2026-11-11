"use client";

import Link from "next/link";
import { Lock, UserCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Section";
import { useTower } from "./context";
import { Card, useFmt } from "./bits";

export function AccountTab() {
  const { td, data, locale, t } = useTower();
  const { time } = useFmt();
  const a = td.accountView;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title={a.title}>
        <dl className="space-y-3 text-sm">
          <div><dt className="text-xs text-steel-600">{a.company}</dt><dd className="font-semibold">{td.account}</dd></div>
          <div><dt className="text-xs text-steel-600">{a.plan}</dt><dd className="font-semibold">{a.planValue}</dd></div>
        </dl>
        <h4 className="mt-6 text-sm font-semibold">{a.users}</h4>
        <ul className="mt-2 divide-y divide-steel-100">
          {a.roles.map((r) => (
            <li key={r.name} className="flex items-center gap-3 py-2.5 text-sm">
              <UserCircle2 className="h-6 w-6 text-steel-400" aria-hidden="true" />
              <span className="flex-1">{r.name}</span>
              <Badge>{r.role}</Badge>
            </li>
          ))}
        </ul>
      </Card>
      <div className="space-y-6">
        <Card title={a.tickets} action={<Link href={`/${locale}/support`} className="text-sm font-semibold text-frost-600 hover:underline">{a.openSupport}</Link>}>
          <ul className="divide-y divide-steel-100">
            {data.tickets.map((tk) => (
              <li key={tk.id} className="flex flex-wrap items-center gap-2 py-2.5 text-sm">
                <span className="font-mono text-xs" dir="ltr">{tk.id}</span>
                <span className="flex-1">{locale === "ar" && tk.ar ? tk.ar.subject : tk.subject}</span>
                <Badge tone={tk.state === "resolved" ? "ok" : "frost"}>{t.support.states[tk.state]}</Badge>
                <span className="text-xs tabular text-steel-500">{time(tk.createdAt)}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title={a.quotes} action={<Link href={`/${locale}/quote`} className="text-sm font-semibold text-frost-600 hover:underline">{a.newQuote}</Link>}>
          <p className="text-sm text-steel-600">{t.quote.lead}</p>
        </Card>
        <Card title={a.privacy}>
          <ul className="space-y-2 text-sm">
            {a.privacyItems.map((p) => <li key={p} className="flex gap-2"><Lock className="mt-0.5 h-4 w-4 shrink-0 text-frost-600" aria-hidden="true" />{p}</li>)}
          </ul>
        </Card>
      </div>
    </div>
  );
}
