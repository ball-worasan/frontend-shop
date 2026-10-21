"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { formatPrice } from "@/lib/products";
import { makeDemoOrder, paymentLabel, readDemoOrders, validatePurchase, writeDemoOrders, type DemoOrder, type PaymentStatus } from "@/lib/demo-orders";

export function CheckoutFlow({ productId, quantityRaw, orderId }: { productId: string; quantityRaw: string; orderId: string }) {
  const purchase = validatePurchase(productId, quantityRaw);
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = readDemoOrders();
      if (stored.error) setError(stored.error);
      if (orderId) setOrder(stored.orders.find((entry) => entry.id === orderId) ?? null);
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [orderId]);

  function begin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!purchase || busy.current || order) return;
    const data = new FormData(event.currentTarget);
    const playerName = String(data.get("playerName") ?? "").trim();
    if (playerName.length < 2 || playerName.length > 40) { setError("กรอกชื่อในเกมสมมติ 2–40 ตัวอักษร"); return; }
    busy.current = true;
    setPending(true);
    setError("");
    window.setTimeout(() => {
      const stored = readDemoOrders();
      if (stored.error) setError(stored.error);
      else {
        const created = makeDemoOrder(purchase.product, purchase.quantity, playerName);
        if (writeDemoOrders([created, ...stored.orders].slice(0, 100))) {
          setOrder(created);
          window.history.replaceState(null, "", `/checkout?order=${encodeURIComponent(created.id)}`);
        } else setError("บันทึกคำสั่งซื้อสาธิตไม่ได้ โปรดตรวจพื้นที่เก็บข้อมูลของเบราว์เซอร์");
      }
      busy.current = false;
      setPending(false);
    }, 250);
  }

  function changeStatus(status: PaymentStatus) {
    if (!order || busy.current) return;
    busy.current = true;
    setPending(true);
    window.setTimeout(() => {
      const stored = readDemoOrders();
      if (stored.error) setError(stored.error);
      else {
        const updated = { ...order, paymentStatus: status, deliveryStatus: status === "paid" ? "delivered" as const : "waiting" as const };
        if (writeDemoOrders(stored.orders.map((entry) => entry.id === order.id ? updated : entry))) { setOrder(updated); setError(""); }
        else setError("บันทึกสถานะสาธิตไม่ได้");
      }
      busy.current = false;
      setPending(false);
    }, 250);
  }

  if (!loaded) return <main className="shop-container flex-1 py-12" role="status">กำลังโหลดข้อมูลสาธิต...</main>;
  if (!order && (!purchase || orderId)) return <main className="shop-container flex-1 py-12"><h1 className="text-3xl font-bold">ไม่พบคำสั่งซื้อที่เลือก</h1><p className="mt-3 text-muted">สินค้า จำนวน หรือเลขคำสั่งซื้อไม่ถูกต้อง{error ? ` · ${error}` : ""}</p><Link href="/products" className="mt-5 inline-block font-semibold text-accent hover:underline">กลับไปเลือกสินค้า →</Link></main>;

  const item = order ? { name: order.productName, image: order.image, quantity: order.quantity, total: order.total } : { name: purchase!.product.name, image: purchase!.product.image, quantity: purchase!.quantity, total: purchase!.total };

  return (
    <main className="shop-container flex-1 space-y-8 py-8 sm:py-12">
      <header><p className="text-sm font-semibold text-accent">DEMO CHECKOUT</p><h1 className="mt-2 text-3xl font-bold">{order ? "คำสั่งซื้อสาธิต" : "ตรวจสอบคำสั่งซื้อ"}</h1><p className="mt-2 text-muted">ไม่มีการเรียกเก็บเงินจริง กรุณาใช้ข้อมูลสมมติเท่านั้น</p></header>
      <ol className="steps flex flex-wrap gap-2 text-sm" aria-label="ขั้นตอนสั่งซื้อ"><li className="step step-primary rounded-full bg-raised px-4 py-2">1 ตรวจสอบ</li><li className={`step rounded-full px-4 py-2 ${order ? "step-primary bg-raised" : "bg-surface"}`}>2 จำลองชำระ</li><li className={`step rounded-full px-4 py-2 ${order?.paymentStatus === "paid" ? "step-primary bg-raised" : "bg-surface"}`}>3 รับข้อมูลตัวอย่าง</li></ol>
      <div className="alert alert-info rounded-card border border-accent/40 bg-raised p-4 text-sm">โหมดสาธิต · ไม่มี QR บัญชีรับเงิน หรือการส่งมอบสินค้าจริง</div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <section className="card card-border rounded-card border border-border bg-surface p-6">
          {order ? <div className="space-y-5"><h2 className="text-xl font-bold">{order.id}</h2><p className="text-muted">สถานะ: <strong className="text-foreground">{paymentLabel(order.paymentStatus)}</strong></p><p className="text-sm text-muted">ชื่อในเกมสมมติ: {order.playerName}</p>{order.paymentStatus === "pending" && <div className="flex flex-wrap gap-3"><button type="button" disabled={pending} onClick={() => changeStatus("paid")} className="btn btn-primary min-h-11 rounded-control bg-primary px-5 text-white">จำลองสำเร็จ</button><button type="button" disabled={pending} onClick={() => changeStatus("failed")} className="btn btn-outline min-h-11 rounded-control border border-control-border px-5">จำลองไม่สำเร็จ</button></div>}{order.paymentStatus === "failed" && <button type="button" disabled={pending} onClick={() => changeStatus("pending")} className="btn btn-primary min-h-11 rounded-control bg-primary px-5 text-white">ลองใหม่ด้วยรายการเดิม</button>}{order.paymentStatus === "paid" && <p className="text-success">จำลองการชำระสำเร็จแล้ว ข้อมูลส่งมอบตัวอย่างอยู่ในรายละเอียดคำสั่งซื้อ</p>}<Link href={`/orders/${order.id}`} className="inline-block font-semibold text-accent hover:underline">ดูรายละเอียดคำสั่งซื้อ →</Link></div> : <form onSubmit={begin} className="space-y-5"><h2 className="text-xl font-bold">ข้อมูลรับสินค้า</h2><div><label htmlFor="checkout-player" className="mb-2 block font-semibold">ชื่อในเกมสมมติ</label><input id="checkout-player" name="playerName" required minLength={2} maxLength={40} autoComplete="off" className="input min-h-12 w-full rounded-control border border-control-border bg-background px-3 text-foreground" /><p className="mt-1 text-xs text-muted">ใช้ชื่อสมมติเท่านั้น ไม่กรอกข้อมูลบัญชีหรือรหัสผ่านเกม</p></div><fieldset className="fieldset"><legend className="fieldset-legend mb-2 font-semibold">วิธีชำระ</legend><label className="flex items-center gap-3 rounded-control border border-border p-3"><input type="radio" name="method" value="demo" defaultChecked className="radio accent-primary" />จำลองสถานะการชำระเงิน</label></fieldset><button type="submit" disabled={pending} className="btn btn-primary min-h-12 w-full rounded-control bg-primary font-semibold text-white disabled:opacity-50">{pending ? "กำลังสร้างรายการ..." : "ยืนยันคำสั่งซื้อสาธิต"}</button></form>}
          {error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}
        </section>
        <aside aria-label="สรุปคำสั่งซื้อ" className="card card-border rounded-card border border-border bg-surface p-6"><h2 className="text-xl font-bold">สรุปสินค้า</h2><div className="mt-5 flex gap-4"><div className="relative size-20 shrink-0 overflow-hidden rounded-control bg-raised"><Image src={item.image} alt="ภาพประกอบสินค้าตัวอย่าง" fill sizes="80px" className="object-cover" /></div><div><p className="font-semibold">{item.name}</p><p className="text-sm text-muted">จำนวน {item.quantity}</p></div></div><div className="mt-6 flex justify-between border-t border-border pt-4"><span>ยอดรวม</span><strong className="font-display text-xl text-accent">{formatPrice(item.total)}</strong></div><p className="mt-3 text-xs text-muted">ยอดคำนวณจากข้อมูลสินค้าในร้าน ไม่มีค่าธรรมเนียมแฝง</p></aside>
      </div>
    </main>
  );
}
