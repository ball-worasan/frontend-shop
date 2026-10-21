import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "บัญชีผู้ใช้" };

export default function LoginPage() {
  return (
    <main className="shop-container flex flex-1 items-center justify-center py-12">
      <div className="w-full max-w-lg rounded-card border border-border bg-surface p-8">
        <p className="text-sm text-accent">บัญชีผู้ใช้</p>
        <h1 className="mt-2 text-3xl font-bold">เข้าสู่ระบบ</h1>
        <p className="mt-4 text-muted">ระบบบัญชีตัวอย่างยังไม่เปิดใช้งาน ฟอร์มเข้าสู่ระบบและสมัครสมาชิกจะเพิ่มในงานถัดไป</p>
        <Link href="/products" className="mt-6 inline-flex min-h-12 items-center rounded-control bg-primary px-5 font-semibold text-white hover:bg-primary-hover">เลือกดูสินค้า</Link>
      </div>
    </main>
  );
}
