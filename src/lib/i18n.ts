import en, { type Dict } from "@/content/en";
import ar from "@/content/ar";
import type { Locale } from "@/lib/data/types";

export const LOCALES: Locale[] = ["en", "ar"];
const DICTS: Record<Locale, Dict> = { en, ar };

export function isLocale(v: string): v is Locale {
  return (LOCALES as string[]).includes(v);
}

export function getDict(locale: Locale): Dict {
  return DICTS[locale];
}

/** Swap the locale segment of a pathname. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const parts = pathname.split("/");
  if (parts[1] && isLocale(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join("/") || `/${to}`;
}

/** Locale-aware number formatting; Arabic uses Arabic-Indic digits. */
export function fmtNumber(locale: Locale, n: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", opts).format(n);
}

/** Clock time in Riyadh. Dates are deliberately not shown for simulated events. */
export function fmtTime(locale: Locale, isoString: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Riyadh",
  }).format(new Date(isoString));
}
