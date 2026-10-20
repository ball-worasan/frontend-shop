"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { Tabs } from "@/components/ui/tabs";
import { products } from "@/lib/products";

export default function DesignSystemPage() {
  const [open, setOpen] = useState(false);
  return (
    <main className="shop-container space-y-12 py-12">
      <header className="space-y-3">
        <Badge tone="accent">SHOP-002 · UI Preview</Badge>
        <h1 className="text-3xl font-bold sm:text-5xl">พื้นฐานหน้าร้านเกม</h1>
        <p className="max-w-2xl text-muted">ตัวอย่างส่วนประกอบและข้อมูลสมมติสำหรับพัฒนา ไม่ใช่หน้าร้านที่เปิดขาย</p>
      </header>
      <section aria-labelledby="buttons" className="space-y-4">
        <h2 id="buttons" className="text-2xl font-semibold">ปุ่มและสถานะ</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setOpen(true)}>เปิดตัวอย่าง Modal</Button>
          <Button variant="secondary" onClick={() => setOpen(true)}>ปุ่มรอง</Button>
          <Button variant="ghost" onClick={() => setOpen(true)}>ปุ่มข้อความ</Button>
          <Button loading>กำลังโหลด</Button>
          <Button disabled>สินค้าหมด</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge>ข้อมูลตัวอย่าง</Badge><Badge tone="success">พร้อมขาย</Badge>
          <Badge tone="warning">รอชำระ</Badge><Badge tone="danger">ไม่สำเร็จ</Badge>
        </div>
      </section>
      <section aria-labelledby="forms" className="space-y-4">
        <h2 id="forms" className="text-2xl font-semibold">ฟอร์ม</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Input label="ค้นหาสินค้า" placeholder="ชื่อสินค้า" hint="ใช้ข้อมูลสมมติในการทดลอง" />
          <Input label="อีเมล (ตัวอย่างข้อผิดพลาด)" type="email" defaultValue="demo" error="กรุณากรอกอีเมลให้ครบถ้วน" />
        </div>
      </section>
      <section aria-labelledby="catalog" className="space-y-4">
        <h2 id="catalog" className="text-2xl font-semibold">การ์ดสินค้าและแท็บ</h2>
        <Tabs label="ประเภทสินค้าตัวอย่าง" items={[
          { value: "all", label: "ทั้งหมด", content: <ProductGrid /> },
          { value: "account", label: "ไอดีเกม", content: <ProductGrid type="account" /> },
          { value: "item", label: "ไอเท็ม", content: <ProductGrid type="item" /> },
        ]} />
        <p id="product-preview-note" className="text-sm text-muted">การ์ดในหน้านี้เชื่อมมาข้อความนี้ หน้ารายละเอียดสินค้าจะพัฒนาใน SHOP-006</p>
      </section>
      <section aria-labelledby="states" className="space-y-4">
        <h2 id="states" className="text-2xl font-semibold">สถานะข้อมูล</h2>
        <LoadingState />
        <EmptyState title="ยังไม่มีสินค้า" description="ตัวอย่างกรณีไม่มีข้อมูลให้แสดง" />
        <ErrorState description="ตัวอย่างเมื่อโหลดข้อมูลไม่สำเร็จ" />
      </section>
      <Modal open={open} onClose={() => setOpen(false)} title="ตัวอย่างหน้าต่าง">
        <p className="mb-6 text-muted">ลองกด Tab เพื่อเลื่อนภายในหน้าต่าง หรือ Escape เพื่อปิดและคืน focus ไปยังปุ่มเดิม</p>
        <Input label="ชื่อแสดงตัวอย่าง" />
        <Button className="mt-6" onClick={() => setOpen(false)}>เสร็จสิ้น</Button>
      </Modal>
    </main>
  );
}

function ProductGrid({ type }: { type?: "account" | "item" }) {
  return <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
    {products.filter((product) => !type || product.type === type).map((product) =>
      <ProductCard key={product.id} product={product} href="#product-preview-note" />)}
  </div>;
}
