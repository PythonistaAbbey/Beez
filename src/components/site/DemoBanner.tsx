import Link from "next/link";
import { Info } from "lucide-react";
import type { Dict } from "@/content/en";
import type { Locale } from "@/lib/data/types";

export function DemoBanner({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <div role="note" aria-label={t.banner.short} className="bg-navy-950 text-steel-200">
      <div className="mx-auto flex max-w-7xl items-start gap-2 px-4 py-2 text-xs sm:items-center sm:px-6">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-frost-400 sm:mt-0" aria-hidden="true" />
        <p className="flex-1">
          <span className="hidden md:inline">{t.banner.text}</span>
          <span className="md:hidden">{t.banner.short}</span>{" "}
          <Link href={`/${locale}#disclaimer`} className="font-semibold text-frost-200 underline-offset-2 hover:underline">
            {t.banner.more}
          </Link>
        </p>
      </div>
    </div>
  );
}
