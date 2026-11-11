"use client";

import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from "lucide-react";
import type { AlertSeverity, Shipment } from "@/lib/data/types";
import { Badge } from "@/components/ui/Section";
import { useTower } from "./context";

export function StatusBadge({ s }: { s: Shipment }) {
  const { t } = useTower();
  const tone = s.status === "delivered" ? "ok" : s.status === "exception" ? "alert" : s.delayMinutes >= 30 ? "warn" : "frost";
  return <Badge tone={tone}>{t.status[s.status]}</Badge>;
}

export function SeverityBadge({ sev }: { sev: AlertSeverity }) {
  const { td } = useTower();
  const I = sev === "critical" ? OctagonAlert : sev === "warning" ? AlertTriangle : Info;
  return (
    <Badge tone={sev === "critical" ? "alert" : sev === "warning" ? "warn" : "steel"}>
      <I className="h-3.5 w-3.5" aria-hidden="true" /> {td.alerts.severity[sev]}
    </Badge>
  );
}

export function TempPill({ s }: { s: Shipment }) {
  const last = s.readings.at(-1);
  const { locale } = useTower();
  if (!last) return <span>—</span>;
  const out = last.celsius > s.profile.max || last.celsius < s.profile.min;
  return (
    <span className={`inline-flex items-center gap-1 font-medium tabular ${out ? "text-alert" : "text-navy-800"}`}>
      {out ? <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> : <CheckCircle2 className="h-3.5 w-3.5 text-ok" aria-hidden="true" />}
      {new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(last.celsius)} °C
    </span>
  );
}

export function Card({ title, action, children, className = "" }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-steel-200 bg-white p-5 shadow-[var(--shadow-card)] ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h3 className="text-base font-semibold text-navy-900">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Btn({ children, variant = "secondary", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  const v = {
    primary: "bg-navy-900 text-white hover:bg-navy-700 disabled:bg-steel-300",
    secondary: "border border-steel-300 bg-white text-navy-800 hover:bg-ice-50 disabled:text-steel-400",
    ghost: "text-steel-700 hover:bg-steel-100",
    danger: "bg-alert text-white hover:brightness-110",
  }[variant];
  return (
    <button type="button" className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed ${v} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function useFmt() {
  const { locale } = useTower();
  const nf = (n: number, d = 0) => new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en", { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);
  const time = (iso: string) => new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Riyadh" }).format(new Date(iso));
  const dur = (min: number) => {
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return locale === "ar" ? `${h ? `${nf(h)} س ` : ""}${nf(m)} د` : `${h ? `${h}h ` : ""}${m}m`;
  };
  return { nf, time, dur };
}
