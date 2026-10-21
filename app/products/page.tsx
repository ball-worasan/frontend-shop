import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { formatPrice, games, products } from "@/lib/products";

export const metadata: Metadata = { title: "สินค้าทั้งหมด" };

type ProductsPageProps = { searchParams: Promise<{ q?: string | string[]; game?: string | string[] }> };

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <Suspense fallback={<main className="shop-container flex-1 py-12" role="status">กำลังโหลดสินค้า...</main>}>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const game = typeof params.game === "string" ? params.game : "";
  const term = q.trim().toLocaleLowerCase();
  const selectedGame = games.find((entry) => entry.slug === game);
  const results = products.filter((product) =>
    (!game || product.gameSlug === game) &&
    (!term || `${product.name} ${games.find((entry) => entry.slug === product.gameSlug)?.name ?? ""}`.toLocaleLowerCase().includes(term))
  );

  return (
    <main className="shop-container flex-1 space-y-8 py-12">
      <div className="space-y-2"><p className="text-sm text-accent">สินค้าตัวอย่าง</p><h1 className="text-3xl font-bold">{selectedGame?.name ?? "สินค้าทั้งหมด"}</h1><p className="text-muted">ทดลองค้นหาและเลือกเกมได้ ขั้นตอนซื้อจะเพิ่มในงานถัดไป</p></div>
      <div className="flex flex-wrap gap-2">
        <Link href="/products" className={`rounded-full border px-4 py-2 text-sm ${!game ? "border-accent bg-raised" : "border-border hover:border-accent"}`}>ทุกเกม</Link>
        {games.map((entry) => <Link key={entry.slug} href={`/products?game=${entry.slug}`} className={`rounded-full border px-4 py-2 text-sm ${game === entry.slug ? "border-accent bg-raised" : "border-border hover:border-accent"}`}>{entry.name}</Link>)}
      </div>
      {term && <p className="text-sm text-muted">ผลการค้นหา “{q.trim()}” · {results.length} รายการ</p>}
      {results.length > 0 ? <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((product) => <li key={product.id} className="rounded-card border border-border bg-surface p-5">
          <p className="text-sm text-accent">{product.type === "account" ? "ไอดีเกม" : "ไอเท็ม"} · {games.find((entry) => entry.slug === product.gameSlug)?.name}</p>
          <h2 className="mt-2 font-semibold">{product.name}</h2>
          <p className="mt-2 text-sm text-muted">{product.server}{product.type === "account" ? ` · ${product.rank}` : ""}</p>
          <div className="mt-5 flex items-center justify-between gap-3"><span className="text-lg font-bold">{formatPrice(product.price)}</span><span className={`text-sm ${product.stock > 0 ? "text-success" : "text-danger"}`}>{product.stock > 0 ? "พร้อมขาย · ตัวอย่าง" : "สินค้าหมด"}</span></div>
        </li>)}
      </ul> : <div className="rounded-card border border-border bg-surface p-8"><h2 className="text-xl font-semibold">ไม่พบสินค้าที่ตรงกัน</h2><p className="mt-2 text-muted">ลองเปลี่ยนคำค้นหรือเลือกเกมอื่น</p><Link href="/products" className="mt-4 inline-block font-medium text-accent hover:underline">ล้างการค้นหาและตัวกรอง</Link></div>}
      <p className="text-sm text-muted">ข้อมูลทั้งหมดเป็นตัวอย่าง หน้ารายละเอียดและการซื้อจะเปิดในงานถัดไป</p>
    </main>
  );
}
