import Link from "next/link";
import { games, products } from "@/lib/products";

export default function Home() {
  return (
    <main className="shop-container flex-1 py-14 sm:py-20">
      <section className="relative overflow-hidden rounded-card border border-border bg-surface px-6 py-14 sm:px-12 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/20 blur-3xl sm:size-96" />
        <div className="relative max-w-2xl space-y-6">
          <p className="text-sm font-semibold tracking-[0.2em] text-accent">GAME SHOP · DEMO STOREFRONT</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">ไอดีพร้อมเล่น<br /><span className="text-accent">ไอเท็มพร้อมลุย</span></h1>
          <p className="max-w-lg text-base text-muted sm:text-lg">เลือกดูไอดีและไอเท็มเกมในร้านตัวอย่าง สินค้าและขั้นตอนซื้อจริงกำลังพัฒนา</p>
          <Link href="/products" className="inline-flex min-h-12 items-center rounded-control bg-primary px-6 font-semibold text-white hover:bg-primary-hover">เลือกดูสินค้า <span aria-hidden="true" className="ml-2">→</span></Link>
        </div>
      </section>
      <section aria-labelledby="games-title" className="mt-14 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-sm text-accent">เลือกตามเกม</p><h2 id="games-title" className="text-2xl font-semibold">เกมที่มีสินค้าตัวอย่าง</h2></div>
          <Link href="/products" className="text-sm font-medium text-accent hover:underline">ดูสินค้าทั้งหมด →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {games.map((game) => <Link key={game.slug} href={`/products?game=${game.slug}`} className="group flex min-h-28 items-center justify-between rounded-card border border-border bg-surface p-6 hover:border-accent hover:bg-raised">
            <span className="text-xl font-semibold">{game.name}</span><span aria-hidden="true" className="text-2xl text-accent transition-transform group-hover:translate-x-1">→</span>
          </Link>)}
        </div>
      </section>
      <section aria-labelledby="preview-title" className="mt-14 rounded-card border border-border bg-surface p-6 sm:p-8">
        <h2 id="preview-title" className="text-xl font-semibold">กำลังเตรียมหน้าร้านเต็มรูปแบบ</h2>
        <p className="mt-2 text-muted">ขณะนี้มีสินค้าในชุดข้อมูลตัวอย่าง {products.length} รายการ คุณสามารถค้นหาและเลือกดูตามเกมได้จากเมนูด้านบน</p>
      </section>
    </main>
  );
}
