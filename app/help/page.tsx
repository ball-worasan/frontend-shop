import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "ช่วยเหลือ" };

export default function HelpPage() {
  return (
    <main className="shop-container flex-1 space-y-8 py-12">
      <div>
        <p className="text-sm text-accent">ศูนย์ช่วยเหลือ</p>
        <h1 className="mt-2 text-3xl font-bold">ให้เราช่วยอะไรดี?</h1>
        <p className="mt-3 text-muted">คำตอบเบื้องต้นสำหรับร้านตัวอย่าง</p>
      </div>
      <section aria-labelledby="how-to-title" className="rounded-card border border-border bg-surface p-6">
        <h2 id="how-to-title" className="text-xl font-semibold">วิธีเลือกสินค้า</h2>
        <p className="mt-2 text-muted">เปิดหน้าสินค้า ใช้ช่องค้นหาหรือเลือกเกมจากเมนูเพื่อดูข้อมูลตัวอย่าง</p>
        <Link href="/products" className="mt-4 inline-block font-medium text-accent hover:underline">ดูสินค้าตัวอย่าง →</Link>
      </section>
      <section id="terms" aria-labelledby="terms-title" className="scroll-mt-28 rounded-card border border-border bg-surface p-6">
        <h2 id="terms-title" className="text-xl font-semibold">เงื่อนไขตัวอย่าง</h2>
        <p className="mt-2 text-muted">ยังไม่มีการซื้อ การชำระเงินจริง หรือการรับประกันสินค้า เงื่อนไขจริงจะประกาศก่อนเปิดให้บริการ</p>
      </section>
    </main>
  );
}
