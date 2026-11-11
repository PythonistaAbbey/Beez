import { ExternalLink } from "lucide-react";
import { SOURCES, shortUrl, type SourceKey } from "@/content/sources";

export function SourceLink({ src, label }: { src: SourceKey; label: string }) {
  return (
    <a
      href={SOURCES[src]}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-steel-600 underline-offset-2 hover:text-navy-800 hover:underline"
      dir="ltr"
    >
      <span className="sr-only">{label}: </span>
      {shortUrl(src)}
      <ExternalLink className="h-3 w-3" aria-hidden="true" />
    </a>
  );
}
