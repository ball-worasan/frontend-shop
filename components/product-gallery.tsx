"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/products";

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const views = [
    { image: product.image, label: "ภาพประกอบสินค้า" },
    { image: "/images/product-gallery-arcane.svg", label: "ภาพประกอบโลกเกม" },
    { image: "/images/product-gallery-loot.svg", label: "ภาพประกอบไอเท็ม" },
  ];
  return <>
    <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-border bg-raised">
      <Image key={views[active].image} src={views[active].image} alt={`${views[active].label}ของ ${product.name} (ภาพสมมติ)`} fill priority sizes="(max-width: 1023px) 100vw, 55vw" className="object-cover" />
    </div>
    <div role="group" aria-label="เลือกภาพประกอบ" className="flex gap-3">
      {views.map((view, index) => <button key={view.image} type="button" aria-label={`ดู${view.label} ${index + 1}`} aria-pressed={active === index} onClick={() => setActive(index)} className={`relative size-20 overflow-hidden rounded-control border-2 bg-raised transition-colors ${active === index ? "border-accent" : "border-border hover:border-accent"}`}><Image src={view.image} alt="" fill sizes="80px" className="object-cover" /></button>)}
    </div>
    <p className="text-sm text-muted">ภาพทั้งหมดเป็นภาพประกอบสมมติ ไม่ใช่ภาพสินค้าจริง</p>
  </>;
}
