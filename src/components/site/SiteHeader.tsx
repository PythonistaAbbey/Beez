"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import type { Dict, ServiceSlug } from "@/content/en";
import type { Locale } from "@/lib/data/types";
import { switchLocalePath } from "@/lib/i18n";
import { Logo } from "./Logo";

const SERVICE_ORDER: ServiceSlug[] = [
  "logistics", "cold-chain", "medical", "warehousing", "fourth-party-logistics", "ecommerce", "technology", "corporate",
];

export function SiteHeader({ t, locale }: { t: Dict; locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const other: Locale = locale === "en" ? "ar" : "en";
  const href = (p: string) => `/${locale}${p}`;

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenu(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const isActive = (p: string) => pathname === href(p) || (p !== "" && pathname.startsWith(href(p)));
  const linkCls = (p: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-steel-100 ${isActive(p) ? "text-navy-900" : "text-steel-700"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-steel-200/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href={href("")} className="shrink-0" aria-label={`Beez — ${t.banner.short}`}>
          <Logo label="Beez" tag="Concept" />
        </Link>

        <nav aria-label="Primary" className="ms-6 hidden items-center gap-1 lg:flex">
          <Link href={href("/about")} className={linkCls("/about")} aria-current={isActive("/about") ? "page" : undefined}>
            {t.nav.about}
          </Link>
          <div ref={menuRef} className="relative">
            <button
              type="button"
              className={`${linkCls("/__none")} inline-flex items-center gap-1`}
              aria-expanded={open}
              aria-controls="services-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {t.nav.services}
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {open && (
              <div id="services-menu" className="absolute start-0 top-full mt-2 grid w-[520px] grid-cols-2 gap-1 rounded-2xl border border-steel-200 bg-white p-3 shadow-[var(--shadow-lift)]">
                {SERVICE_ORDER.map((s) => (
                  <Link key={s} href={href(`/${s}`)} className="rounded-xl px-3 py-2.5 text-sm text-navy-800 hover:bg-ice-50">
                    {t.serviceNames[s]}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href={href("/tracking")} className={linkCls("/tracking")} aria-current={isActive("/tracking") ? "page" : undefined}>{t.nav.tracking}</Link>
          <Link href={href("/control-tower")} className={linkCls("/control-tower")} aria-current={isActive("/control-tower") ? "page" : undefined}>{t.nav.tower}</Link>
          <Link href={href("/support")} className={linkCls("/support")} aria-current={isActive("/support") ? "page" : undefined}>{t.nav.support}</Link>
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <Link
            href={switchLocalePath(pathname, other)}
            hrefLang={other}
            lang={other}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-steel-700 hover:bg-steel-100"
            aria-label={t.nav.switchLang}
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            {t.otherLang}
          </Link>
          <Link href={href("/quote")} className="hidden rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 sm:inline-flex">
            {t.nav.quote}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy-900 hover:bg-steel-100 lg:hidden"
            aria-expanded={menu}
            aria-controls="mobile-nav"
            aria-label={menu ? t.nav.close : t.nav.menu}
            onClick={() => setMenu((v) => !v)}
          >
            {menu ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menu && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-steel-200 bg-white lg:hidden">
          <ul className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:grid-cols-2 sm:px-6">
            {[["", t.nav.home], ["/about", t.nav.about], ...SERVICE_ORDER.map((s) => [`/${s}`, t.serviceNames[s]]), ["/tracking", t.nav.tracking], ["/control-tower", t.nav.tower], ["/support", t.nav.support], ["/quote", t.nav.quote], ["/executive", t.nav.executive]].map(([p, label]) => (
              <li key={p}>
                <Link href={href(p)} className="block rounded-xl px-3 py-3 text-base text-navy-800 hover:bg-ice-50" aria-current={pathname === href(p) ? "page" : undefined}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
