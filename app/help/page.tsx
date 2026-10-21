import type { Metadata } from "next";
import { Suspense } from "react";
import { HelpCenter } from "@/components/help-center";

export const metadata: Metadata = { title: "ช่วยเหลือ" };

export default function HelpPage({ searchParams }: { searchParams: Promise<{ order?: string | string[] }> }) {
  return <Suspense fallback={<main className="shop-container flex-1 py-12" role="status">กำลังโหลดคำถาม...</main>}><HelpContent searchParams={searchParams} /></Suspense>;
}

async function HelpContent({ searchParams }: { searchParams: Promise<{ order?: string | string[] }> }) {
  const params = await searchParams;
  const order = typeof params.order === "string" ? params.order : "";
  return <HelpCenter key={order} initialOrder={order} />;
}
