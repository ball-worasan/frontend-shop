import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderDetails } from "@/components/order-details";
export const metadata: Metadata = { title: "รายละเอียดคำสั่งซื้อ" };
export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<main className="shop-container flex-1 py-12" role="status">กำลังโหลดคำสั่งซื้อ...</main>}><OrderContent params={params} /></Suspense>;
}
async function OrderContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetails id={id} />;
}
