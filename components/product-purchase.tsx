"use client";

import { useState } from "react";
import { formatPrice, type Product } from "@/lib/products";

export function ProductPurchase({ product }: { product: Product }) {
  const [rawQuantity, setRawQuantity] = useState("1");
  const quantity = product.type === "account" ? 1 : Number(rawQuantity);
  const valid = Number.isSafeInteger(quantity) && quantity >= 1 && quantity <= product.stock;
  const available = product.stock > 0;
  const total = valid ? formatPrice(product.price * quantity) : "—";

  return (
    <>
      <form id="product-purchase" action="/checkout" method="get" className="mt-6 space-y-5">
        <input type="hidden" name="product" value={product.id} />
        {product.type === "item" ? <div className="max-w-40"><label htmlFor="purchase-quantity" className="mb-2 block text-sm font-semibold">จำนวน</label><input id="purchase-quantity" name="quantity" type="number" min="1" max={product.stock} step="1" required disabled={!available} value={rawQuantity} onChange={(event) => setRawQuantity(event.target.value)} className="input min-h-12 w-full rounded-control border border-control-border bg-background px-3 text-foreground" /><p className="mt-1 text-xs text-muted">สูงสุด {product.stock} ชิ้น</p></div> : <input type="hidden" name="quantity" value="1" />}
        <div className="flex items-end justify-between gap-4"><span className="text-muted">{product.type === "item" ? "ยอดรวม" : "ราคา"}</span><strong aria-live="polite" className="font-display text-3xl text-accent">{total}</strong></div>
        <button type="submit" disabled={!available || !valid} className="btn btn-primary hidden min-h-12 w-full items-center justify-center rounded-control bg-primary font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:flex">{available ? "ซื้อเลย · โหมดสาธิต" : "สินค้าหมด"}</button>
      </form>
      <p className="mt-4 text-xs text-muted">ไม่มีการชำระเงินจริง ขั้นตอนต่อไปใช้ข้อมูลจำลองเท่านั้น</p>
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-border bg-surface px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-2xl sm:hidden"><strong className="font-display text-xl text-accent">{total}</strong><button type="submit" form="product-purchase" disabled={!available || !valid} className="btn btn-primary min-h-11 rounded-control bg-primary px-5 font-semibold text-white disabled:opacity-50">{available ? "ซื้อเลย" : "สินค้าหมด"}</button></div>
    </>
  );
}
