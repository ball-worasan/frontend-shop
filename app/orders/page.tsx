import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "คำสั่งซื้อ" };

export default function OrdersPage() {
  return (
    <main className="shop-container flex-1 py-12">
      <h1 className="text-3xl font-bold">คำสั่งซื้อของฉัน</h1>
      <div className="mt-8 rounded-card border border-border bg-surface p-8">
        <h2 className="text-xl font-semibold">ยังไม่มีคำสั่งซื้อ</h2>
        <p className="mt-2 text-muted">ระบบคำสั่งซื้อจำลองจะเพิ่มในงานถัดไป ขณะนี้ยังไม่มีการชำระเงินจริง</p>
        <Link href="/products" className="mt-5 inline-flex min-h-12 items-center rounded-control bg-primary px-5 font-semibold text-white hover:bg-primary-hover">เลือกดูสินค้า</Link>
      </div>
    </main>
  );
}
