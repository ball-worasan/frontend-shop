"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { paymentLabel, readDemoOrders, type DemoOrder } from "@/lib/demo-orders";
import { formatPrice } from "@/lib/products";

export function OrderDetails({ id }: { id: string }) {
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => { const stored = readDemoOrders(); setOrder(stored.orders.find((entry) => entry.id === id) ?? null); setError(stored.error ?? ""); setLoaded(true); }, 0); return () => window.clearTimeout(timer); }, [id]);

  async function copy() {
    try { await navigator.clipboard.writeText("DEMO-ACCOUNT"); setCopyMessage("คัดลอกข้อมูลตัวอย่างแล้ว"); }
    catch { setCopyMessage("คัดลอกไม่ได้ กรุณาตรวจสิทธิ์คลิปบอร์ด"); }
  }

  if (!loaded) return <main className="shop-container flex-1 py-12" role="status">กำลังโหลดคำสั่งซื้อ...</main>;
  if (!order) return <main className="shop-container flex-1 py-12"><h1 className="text-3xl font-bold">ไม่พบคำสั่งซื้อ</h1><p className="mt-3 text-muted">{error || "เลขคำสั่งซื้อนี้ไม่มีในเบราว์เซอร์นี้"}</p><Link href="/orders" className="mt-5 inline-block font-semibold text-accent hover:underline">กลับไปคำสั่งซื้อ →</Link></main>;

  return <main className="shop-container flex-1 space-y-7 py-8 sm:py-12"><nav aria-label="เส้นทางหน้า" className="text-sm text-muted"><Link href="/orders" className="hover:text-accent">คำสั่งซื้อ</Link> / {order.id}</nav><header><p className="text-sm font-semibold text-accent">DEMO ORDER</p><h1 className="mt-2 break-all text-3xl font-bold">{order.id}</h1><p className="mt-2 text-muted">{paymentLabel(order.paymentStatus)} · สร้างเมื่อ {new Date(order.createdAt).toLocaleString("th-TH")}</p></header><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="space-y-5"><section className="card card-border rounded-card border border-border bg-surface p-6"><h2 className="text-xl font-bold">สินค้า</h2><p className="mt-3 font-semibold">{order.productName}</p><p className="mt-1 text-muted">{formatPrice(order.unitPrice)} × {order.quantity}</p><p className="mt-3 text-sm text-muted">ชื่อในเกมสมมติ: {order.playerName}</p></section><section className="card card-border rounded-card border border-border bg-surface p-6"><h2 className="text-xl font-bold">ลำดับสถานะ</h2><ol className="mt-4 space-y-3 border-l border-border pl-5"><li>สร้างรายการ · {new Date(order.createdAt).toLocaleString("th-TH")}</li><li>รอชำระ (จำลอง)</li>{order.paymentStatus === "paid" && <><li>ชำระสำเร็จ (จำลอง)</li><li>ส่งมอบข้อมูลตัวอย่างแล้ว</li></>}{order.paymentStatus === "failed" && <li className="text-danger">จำลองชำระไม่สำเร็จ</li>}</ol></section>{order.deliveryStatus === "delivered" && <section className="card card-border rounded-card border border-border bg-surface p-6"><h2 className="text-xl font-bold">ข้อมูลส่งมอบตัวอย่าง</h2><p className="mt-2 text-sm text-muted">นี่ไม่ใช่รหัสผ่านหรือสินค้าเกมจริง</p><div className="mt-4 flex flex-wrap items-center gap-3"><code className="rounded-control bg-raised px-4 py-2">{revealed ? "DEMO-ACCOUNT" : "••••••••••••"}</code><button type="button" onClick={() => setRevealed(!revealed)} className="btn btn-outline min-h-11 rounded-control border border-control-border px-4">{revealed ? "ซ่อน" : "แสดง"}</button>{revealed && <button type="button" onClick={copy} className="btn btn-outline min-h-11 rounded-control border border-control-border px-4">คัดลอก</button>}</div><p role="status" className="mt-2 text-sm text-muted">{copyMessage}</p></section>}</div><aside className="card card-border h-fit rounded-card border border-border bg-surface p-6"><h2 className="text-xl font-bold">สรุปยอด</h2><p className="mt-5 flex justify-between"><span>ยอดรวม</span><strong className="font-display text-xl text-accent">{formatPrice(order.total)}</strong></p><div className="mt-6 flex flex-col gap-3">{order.paymentStatus !== "paid" && <Link href={`/checkout?order=${encodeURIComponent(order.id)}`} className="btn btn-primary inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-4 text-white">ดำเนินการต่อ</Link>}<Link href={`/help?order=${encodeURIComponent(order.id)}`} className="font-semibold text-accent hover:underline">ขอความช่วยเหลือ →</Link></div></aside></div></main>;
}
