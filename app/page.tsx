import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { formatPrice, games, products, type Product } from "@/lib/products";

const featuredGroups = [
  { label: "ทั้งหมด", products },
  { label: "ไอดีเกม", products: products.filter((product) => product.type === "account") },
  { label: "ไอเท็ม", products: products.filter((product) => product.type === "item") },
];

function ProductTile({ product }: { product: Product }) {
  const game = games.find((entry) => entry.slug === product.gameSlug);
  const href = `/products?q=${encodeURIComponent(product.name)}`;

  return (
    <Link href={href} className="card card-border group min-w-0 overflow-hidden rounded-card border border-border bg-surface transition-transform duration-200 hover:-translate-y-1 hover:border-accent focus-visible:border-accent">
      <figure className="relative aspect-[4/3] w-full bg-raised">
        <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw" className="object-cover" />
      </figure>
      <div className="card-body flex min-w-0 flex-col gap-2 p-3 sm:p-5">
        <span className="badge badge-outline badge-sm inline-flex self-start rounded-full border border-accent px-2 py-0.5 text-xs text-accent">{product.type === "account" ? "ไอดีเกม" : "ไอเท็ม"}</span>
        <p className="truncate text-xs text-muted sm:text-sm">{game?.name}</p>
        <h3 className="card-title line-clamp-2 min-h-12 break-words text-sm leading-6 sm:text-base">{product.name}</h3>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-2 gap-y-1 pt-2">
          <strong className="font-display text-lg text-foreground sm:text-xl">{formatPrice(product.price)}</strong>
          <span className={`text-xs sm:text-sm ${product.stock > 0 ? "text-success" : "text-danger"}`}>{product.stock > 0 ? "พร้อมขาย" : "สินค้าหมด"}</span>
        </div>
      </div>
    </Link>
  );
}

function SectionHeading({ id, eyebrow, title, href, linkLabel }: { id: string; eyebrow: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="mb-1 text-sm font-semibold tracking-wide text-accent">{eyebrow}</p>
        <h2 id={id} className="text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {href && linkLabel && <Link href={href} className="text-sm font-semibold text-accent hover:underline">{linkLabel} <span aria-hidden="true">↗</span></Link>}
    </div>
  );
}

export default function Home() {
  return (
    <main className="shop-container flex-1 pb-16 pt-8 sm:pb-24 sm:pt-10">
      <section aria-labelledby="home-title" className="hero relative isolate overflow-hidden rounded-card border border-border bg-surface">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(124,58,237,.2),transparent_50%)]" />
        <div className="hero-content relative grid min-w-0 w-full max-w-none grid-cols-1 gap-8 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:px-14 lg:py-20">
          <div className="z-10 flex min-w-0 flex-col items-start justify-center">
            <span className="badge badge-outline mb-6 inline-flex rounded-full border border-accent px-3 py-1 text-xs text-accent">GAME SHOP · DEMO STOREFRONT</span>
            <h1 id="home-title" className="max-w-xl text-4xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              ไอดีพร้อมเล่น<br /><span className="text-accent">ไอเท็มพร้อมลุย</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">เลือกดูไอดีและไอเท็มเกมในร้านตัวอย่าง ค้นหาของที่ใช่ แล้วเตรียมพร้อมสำหรับการผจญภัยครั้งต่อไป</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn btn-primary inline-flex min-h-12 items-center gap-2 rounded-control bg-primary px-6 font-semibold text-white hover:bg-primary-hover">เลือกซื้อสินค้า <span aria-hidden="true">→</span></Link>
              <Link href="/help" className="btn btn-outline inline-flex min-h-12 items-center rounded-control border border-control-border px-6 font-semibold text-foreground hover:bg-raised">ดูวิธีซื้อ</Link>
            </div>
            <p className="mt-6 text-xs text-muted">ข้อมูลสินค้าและขั้นตอนซื้อในขณะนี้เป็นตัวอย่าง</p>
          </div>
          <div className="relative mx-auto min-w-0 w-full max-w-xl">
            <Image src="/images/home-hero.svg" alt="ภาพประกอบเกมแนวแฟนตาซี โทนกรมท่าและแสงม่วง" width={680} height={560} priority className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section aria-labelledby="games-title" className="mt-12 space-y-6 sm:mt-16">
        <SectionHeading id="games-title" eyebrow="EXPLORE GAMES" title="เลือกเกมที่ชอบ" href="/products" linkLabel="ดูสินค้าทั้งหมด" />
        <div className="grid gap-4 sm:grid-cols-2">
          {games.map((game, index) => (
            <Link key={game.slug} href={`/games/${game.slug}`} className="card card-border group relative min-h-36 overflow-hidden rounded-card border border-border bg-surface transition-colors hover:border-accent hover:bg-raised sm:min-h-44">
              <span aria-hidden="true" className={`absolute -right-8 -top-12 size-48 rounded-full border-[24px] opacity-25 ${index === 0 ? "border-primary" : "border-accent"}`} />
              <span aria-hidden="true" className="absolute bottom-3 right-10 text-8xl font-black text-foreground/5">0{index + 1}</span>
              <span className="card-body relative flex flex-row items-end justify-between gap-4 p-6 sm:p-8">
                <span><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-accent">Game 0{index + 1}</span><span className="card-title text-xl sm:text-2xl">{game.name}</span></span>
                <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full border border-control-border text-xl text-accent transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="featured-title" className="mt-12 space-y-6 sm:mt-16">
        <SectionHeading id="featured-title" eyebrow="HANDPICKED FOR YOU" title="สินค้าแนะนำ" href="/products" linkLabel="ดูสินค้าทั้งหมด" />
        <div id="featured-tabs" role="tablist" aria-label="ประเภทสินค้าแนะนำ" className="tabs tabs-box rounded-control border border-border bg-surface p-1">
          {featuredGroups.map((group, index) => (
            <Fragment key={group.label}>
              <input type="radio" name="featured-products" className="tab featured-tab-input rounded-control text-sm" aria-label={group.label} defaultChecked={index === 0} />
              <div className="tab-content featured-tab-panel grid-cols-2 gap-3 pt-6 sm:gap-4 lg:grid-cols-4">
                {group.products.length > 0 ? group.products.map((product) => <ProductTile key={product.id} product={product} />) : <p className="col-span-full rounded-card border border-border bg-surface p-6 text-muted">กำลังเตรียมสินค้า</p>}
              </div>
            </Fragment>
          ))}
        </div>
      </section>

      <section aria-labelledby="latest-title" className="mt-12 space-y-6 sm:mt-16">
        <SectionHeading id="latest-title" eyebrow="JUST ADDED" title="สินค้าล่าสุด" href="/products" linkLabel="ดูทั้งหมด" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[...products].reverse().map((product) => <ProductTile key={product.id} product={product} />)}
        </div>
      </section>

      <section aria-labelledby="how-title" className="card card-border mt-12 rounded-card border border-border bg-surface sm:mt-16">
        <div className="card-body flex flex-col gap-6 p-6 sm:p-8 lg:p-10">
          <SectionHeading id="how-title" eyebrow="HOW IT WORKS" title="เลือกของง่าย ๆ ใน 3 ขั้นตอน" />
          <ol className="grid gap-4 md:grid-cols-3">
            {[
              { number: "01", title: "เลือกสินค้า", detail: "ค้นหาจากเกมหรือประเภทที่สนใจ" },
              { number: "02", title: "ตรวจรายละเอียด", detail: "ดูราคา เซิร์ฟเวอร์ และสถานะสินค้า" },
              { number: "03", title: "เตรียมสั่งซื้อ", detail: "ขั้นตอนชำระเงินจริงจะเปิดในงานถัดไป" },
            ].map((step) => (
              <li key={step.number} className="rounded-card border border-border bg-background p-5">
                <span className="font-display text-2xl font-bold text-accent">{step.number}</span>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
          <Link href="/help" className="self-start text-sm font-semibold text-accent hover:underline">อ่านวิธีซื้อและเงื่อนไข <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  );
}
