"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Accessible modal built on the native <dialog> element: focus is trapped,
 * Escape closes it, and focus returns to the opener.
 */
export function Dialog({
  open, onClose, title, closeLabel, children, size = "md", side = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
  size?: "md" | "lg";
  side?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  const pos = side
    ? "m-0 ms-auto h-dvh max-h-dvh w-full max-w-2xl rounded-none sm:rounded-s-3xl"
    : `m-auto w-[calc(100%-2rem)] ${size === "lg" ? "max-w-3xl" : "max-w-lg"} rounded-3xl`;
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      aria-labelledby="dlg-title"
      className={`${pos} bg-white p-0 text-navy-900 shadow-[var(--shadow-lift)] backdrop:bg-navy-950/60 backdrop:backdrop-blur-sm`}
    >
      {open && (
        <div className="flex h-full max-h-[inherit] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-steel-200 px-6 py-4">
            <h2 id="dlg-title" className="text-lg font-semibold">{title}</h2>
            <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-steel-100" aria-label={closeLabel}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        </div>
      )}
    </dialog>
  );
}
