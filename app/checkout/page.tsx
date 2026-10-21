import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutFlow } from "@/components/checkout-flow";
export const metadata: Metadata = { title: "ตรวจสอบคำสั่งซื้อ" };

export default function CheckoutPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <Suspense fallback={<main className="shop-container flex-1 py-12" role="status">กำลังโหลดคำสั่งซื้อ...</main>}><CheckoutContent searchParams={searchParams} /></Suspense>;
}

async function CheckoutContent({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const scalar = (key: string) => typeof query[key] === "string" ? query[key] as string : "";
  const productId = scalar("product");
  const quantityRaw = scalar("quantity");
  const orderId = scalar("order");
  return <CheckoutFlow key={`${productId}:${quantityRaw}:${orderId}`} productId={productId} quantityRaw={quantityRaw} orderId={orderId} />;
}
