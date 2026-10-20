"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./button";
export function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [open]);
  return (
    <dialog ref={ref} aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-32px)] max-w-lg overflow-y-auto rounded-card border border-border bg-surface p-6 text-foreground shadow-2xl backdrop:bg-black/70">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 id={titleId} className="text-2xl font-semibold">{title}</h2>
        <Button variant="ghost" onClick={onClose} aria-label="ปิดหน้าต่าง">ปิด</Button>
      </div>
      {children}
    </dialog>
  );
}
