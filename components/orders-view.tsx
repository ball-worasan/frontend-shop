"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clearDemoOrders, paymentLabel, readDemoOrders, type DemoOrder, type PaymentStatus } from "@/lib/demo-orders";
import { formatPrice } from "@/lib/products";

type Filter = "all" | PaymentStatus;
const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "ทั้งหมด" }, { key: "pending", label: "รอชำระ" }, { key: "paid", label: "สำเร็จ" }, { key: "failed", label: "ไม่สำเร็จ" },
];

export function OrdersView() {
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { const timer = window.setTimeout(() => { const stored = readDemoOrders(); setOrders(stored.orders); setError(stored.error ?? ""); setLoaded(true); }, 0); return () => window.clearTimeout(timer); }, []);
  const visible = filter === "all" ? orders : orders.filter((order) => order.paymentStatus === filter);

  function clear() {
    if (clearDemoOrders()) { setOrders([]); setError(""); setFilter("all"); }
    else setError("ล้างข้อมูลสาธิตไม่ได้");
  }

  return <main className="shop-container flex-1 space-y-7 py-8 sm:py-12">
    <header><p className="text-sm font-semibold text-accent">DEMO ORDERS</p><h1 className="mt-2 text-3xl font-bold">คำสั่งซื้อของฉัน</h1><p className="mt-2 text-muted">รายการสาธิตเก็บในเบราว์เซอร์นี้เท่านั้น ไม่มีคำสั่งซื้อจริง</p></header>
    {error && <div role="alert" className="alert alert-error rounded-card border border-danger bg-surface p-4"><p>{error}</p><button type="button" onClick={clear} className="btn btn-outline min-h-11 rounded-control border border-control-border px-4">ล้างข้อมูลสาธิต</button></div>}
    {!loaded ? <p role="status">กำลังโหลดคำสั่งซื้อ...</p> : <>
      <nav aria-label="กรองสถานะคำสั่งซื้อ" className="tabs tabs-box flex flex-wrap gap-2 rounded-control border border-border bg-surface p-2">{filters.map((option) => <button key={option.key} type="button" onClick={() => setFilter(option.key)} aria-pressed={filter === option.key} className={`tab min-h-11 rounded-control px-4 text-sm font-semibold ${filter === option.key ? "bg-raised text-foreground" : "text-muted hover:bg-raised"}`}>{option.label}</button>)}</nav>
      {visible.length === 0 ? <div className="card card-border rounded-card border border-border bg-surface p-8"><h2 className="text-xl font-bold">{orders.length === 0 ? "ยังไม่มีคำสั่งซื้อ" : "ไม่มีรายการในสถานะนี้"}</h2><p className="mt-2 text-muted">{orders.length === 0 ? "เริ่มจากเลือกสินค้าตัวอย่างเพื่อทดลองขั้นตอนสั่งซื้อ" : "ลองเลือกสถานะอื่น"}</p><Link href="/products" className="btn btn-primary mt-5 inline-flex min-h-11 items-center rounded-control bg-primary px-5 text-white">เลือกซื้อสินค้า</Link></div> : <ul className="space-y-4">{visible.map((order) => <li key={order.id} className="card card-border flex flex-col gap-4 rounded-card border border-border bg-surface p-5 sm:flex-row sm:items-center"><div className="relative size-20 shrink-0 overflow-hidden rounded-control bg-raised"><Image src={order.image} alt="ภาพประกอบสินค้าตัวอย่าง" fill sizes="80px" className="object-cover" /></div><div className="min-w-0 flex-1"><p className="text-xs text-muted">{order.id} · {new Date(order.createdAt).toLocaleString("th-TH")}</p><h2 className="mt-1 font-semibold">{order.productName}</h2><p className="mt-1 text-sm text-muted">{order.quantity} ชิ้น · {paymentLabel(order.paymentStatus)}</p></div><div className="flex flex-wrap items-center gap-4 sm:flex-col sm:items-end"><strong className="font-display text-xl text-accent">{formatPrice(order.total)}</strong><Link href={`/orders/${order.id}`} className="font-semibold text-accent hover:underline">ดูรายละเอียด →</Link></div></li>)}</ul>}
      {orders.length > 0 && <button type="button" onClick={clear} className="btn btn-outline min-h-11 rounded-control border border-control-border px-4 text-sm">ล้างข้อมูลสาธิตในเบราว์เซอร์นี้</button>}
    </>}
  </main>;
}
