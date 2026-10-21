import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase } from "@/components/product-purchase";
import { games, products } from "@/lib/products";

type ProductPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((entry) => entry.id === id);
  return { title: product?.name ?? "ไม่พบสินค้า" };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((entry) => entry.id === id);
  if (!product) notFound();
  const game = games.find((entry) => entry.slug === product.gameSlug);

  return (
    <main className="shop-container flex-1 space-y-8 pb-28 pt-6 sm:pb-16 sm:pt-10">
      <nav aria-label="เส้นทางหน้า" className="flex flex-wrap gap-2 text-sm text-muted">
        <Link href="/products" className="hover:text-accent">สินค้า</Link><span>/</span>
        <Link href={`/games/${product.gameSlug}`} className="hover:text-accent">{game?.name}</Link><span>/</span>
        <span aria-current="page" className="text-foreground">{product.name}</span>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,.9fr)] lg:items-start">
        <section aria-label="ภาพสินค้า" className="space-y-3">
          <ProductGallery product={product} />
        </section>
        <section aria-labelledby="product-title" className="card card-border rounded-card border border-border bg-surface p-6 sm:p-8">
          <p className="text-sm font-semibold text-accent">{game?.name} · {product.type === "account" ? "ไอดีเกม" : "ไอเท็ม"}</p>
          <h1 id="product-title" className="mt-3 text-3xl font-bold leading-tight">{product.name}</h1>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-5 text-sm">
            <div><dt className="text-muted">เซิร์ฟเวอร์</dt><dd className="mt-1 font-semibold">{product.server}</dd></div>
            {product.type === "account" && <div><dt className="text-muted">แรงก์</dt><dd className="mt-1 font-semibold">{product.rank}</dd></div>}
            <div><dt className="text-muted">สถานะ</dt><dd className={`mt-1 font-semibold ${product.stock > 0 ? "text-success" : "text-danger"}`}>{product.stock > 0 ? `พร้อมขาย${product.type === "item" ? ` ${product.stock} ชิ้น` : ""}` : "สินค้าหมด"}</dd></div>
          </dl>
          <ProductPurchase product={product} />
        </section>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="card card-border rounded-card border border-border bg-surface p-6"><h2 className="text-xl font-bold">รายละเอียดสินค้า</h2><p className="mt-3 text-muted">{product.type === "account" ? `ไอดีเกมตัวอย่าง แรงก์ ${product.rank} เซิร์ฟเวอร์ ${product.server}` : `ไอเท็มเกมตัวอย่าง เซิร์ฟเวอร์ ${product.server}`} ข้อมูลนี้ใช้สาธิตขั้นตอนเลือกซื้อเท่านั้น</p></section>
        <section className="card card-border rounded-card border border-border bg-surface p-6"><h2 className="text-xl font-bold">วิธีรับสินค้าและเงื่อนไข</h2><p className="mt-3 text-muted">เมื่อจำลองการชำระสำเร็จ ระบบจะแสดงข้อมูลส่งมอบสมมติในหน้าคำสั่งซื้อ ไม่มีการส่งมอบไอดีหรือไอเท็มจริง</p><Link href="/help#terms" className="mt-4 inline-block font-semibold text-accent hover:underline">อ่านเงื่อนไขตัวอย่าง →</Link></section>
      </div>
    </main>
  );
}
