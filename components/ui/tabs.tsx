"use client";
import { useId, useRef, useState, type ReactNode } from "react";
export type Tab = { value: string; label: string; content: ReactNode };
/** Provide at least one item with a unique, stable value. */
export function Tabs({ label, items, defaultValue }: { label: string; items: readonly Tab[]; defaultValue?: string }) {
  const id = useId();
  const [selected, setSelected] = useState(defaultValue ?? items[0]?.value);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = items.some((item) => item.value === selected) ? selected : items[0]?.value;
  return (
    <div>
      <div role="tablist" aria-label={label} className="flex gap-2 overflow-x-auto p-1">
        {items.map((item, index) => (
          <button key={item.value} ref={(node) => { refs.current[index] = node; }} type="button"
            role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={active === item.value}
            tabIndex={active === item.value ? 0 : -1}
            onClick={() => setSelected(item.value)}
            onKeyDown={(event) => {
              let next: number;
              if (event.key === "ArrowRight") next = (index + 1) % items.length;
              else if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = items.length - 1;
              else return;
              event.preventDefault();
              setSelected(items[next].value);
              refs.current[next]?.focus();
            }}
            className={`min-h-12 shrink-0 rounded-control px-4 font-medium ${active === item.value ? "bg-primary text-white" : "bg-surface text-muted hover:bg-raised"}`}>
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div key={item.value} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`}
          hidden={active !== item.value} tabIndex={0} className="mt-6">{item.content}</div>
      ))}
    </div>
  );
}
