"use client";

import Link from "next/link";
import { useRef } from "react";
import { games } from "@/lib/products";
import type { CatalogQuery } from "@/lib/catalog";

type FilterProps = {
  basePath: string;
  query: CatalogQuery;
  fixedGame?: boolean;
};

function FilterForm({ basePath, query, fixedGame, mobile, formRef, onClear }: FilterProps & {
  mobile?: boolean;
  formRef?: React.RefObject<HTMLFormElement | null>;
  onClear?: () => void;
}) {
  const prefix = mobile ? "mobile" : "desktop";

  return (
    <form ref={formRef} action={basePath} method="get" className="space-y-6">
      <input type="hidden" name="q" defaultValue={query.q} />
      <input type="hidden" name="type" defaultValue={query.type === "all" ? "" : query.type} />
      <input type="hidden" name="sort" defaultValue={query.sort === "latest" ? "" : query.sort} />
      {!fixedGame && (
        <div className="fieldset space-y-2">
          <label htmlFor={`${prefix}-game`} className="fieldset-legend block text-sm font-semibold">เกม</label>
          <select id={`${prefix}-game`} name="game" defaultValue={query.game} className="select min-h-12 w-full rounded-control border border-control-border bg-background px-3 text-foreground">
            <option value="">ทุกเกม</option>
            {games.map((game) => <option key={game.slug} value={game.slug}>{game.name}</option>)}
          </select>
        </div>
      )}
      <fieldset className="fieldset space-y-3">
        <legend className="fieldset-legend text-sm font-semibold">ช่วงราคา (บาท)</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${prefix}-min`} className="mb-1 block text-sm text-muted">ต่ำสุด</label>
            <input id={`${prefix}-min`} name="min" type="number" min="0" max="1000000" step="1" inputMode="numeric" defaultValue={query.min ?? ""} placeholder="0" className="input min-h-12 w-full min-w-0 rounded-control border border-control-border bg-background px-3 text-foreground" />
          </div>
          <div>
            <label htmlFor={`${prefix}-max`} className="mb-1 block text-sm text-muted">สูงสุด</label>
            <input id={`${prefix}-max`} name="max" type="number" min="0" max="1000000" step="1" inputMode="numeric" defaultValue={query.max ?? ""} placeholder="ไม่จำกัด" className="input min-h-12 w-full min-w-0 rounded-control border border-control-border bg-background px-3 text-foreground" />
          </div>
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn btn-primary inline-flex min-h-11 flex-1 items-center justify-center rounded-control bg-primary px-4 font-semibold text-white hover:bg-primary-hover">แสดงสินค้า</button>
        {mobile ? (
          <button type="button" onClick={onClear} className="btn btn-outline min-h-11 rounded-control border border-control-border px-4 text-foreground">ล้างค่า</button>
        ) : (
          <Link href={basePath} className="btn btn-outline inline-flex min-h-11 items-center rounded-control border border-control-border px-4 text-foreground">ล้างตัวกรอง</Link>
        )}
      </div>
    </form>
  );
}

export function DesktopFilters(props: FilterProps) {
  return <FilterForm {...props} />;
}

export function MobileFilters(props: FilterProps & { activeCount: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function clearDraft() {
    const form = formRef.current;
    if (!form) return;
    for (const name of ["q", "type", "sort", "game", "min", "max"]) {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) field.value = "";
    }
  }

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => dialogRef.current?.showModal()} className="btn btn-outline inline-flex min-h-11 items-center rounded-control border border-control-border px-4 font-semibold text-foreground lg:hidden">
        ตัวกรอง{props.activeCount > 0 ? ` (${props.activeCount})` : ""}
      </button>
      <dialog ref={dialogRef} id="catalog-filter-dialog" aria-labelledby="catalog-filter-title" onClose={() => triggerRef.current?.focus()} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }} className="modal modal-end fixed inset-y-0 right-0 m-0 ml-auto h-dvh max-h-dvh w-[min(90vw,380px)] max-w-none border-l border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/70 lg:hidden">
        <div className="modal-box h-full max-h-none w-full max-w-none overflow-y-auto rounded-none bg-surface p-6">
          <div className="mb-7 flex items-center justify-between gap-3">
            <h2 id="catalog-filter-title" className="text-xl font-bold">ตัวกรองสินค้า</h2>
            <form method="dialog"><button type="submit" className="btn btn-ghost min-h-11 rounded-control px-3" aria-label="ปิดตัวกรอง">ปิด ×</button></form>
          </div>
          <p className="mb-6 text-sm text-muted">เลือกตัวกรองแล้วกด “แสดงสินค้า” เพื่อดูผลลัพธ์</p>
          <FilterForm {...props} mobile formRef={formRef} onClear={clearDraft} />
        </div>
      </dialog>
    </>
  );
}
