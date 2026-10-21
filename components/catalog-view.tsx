import Link from "next/link";
import { catalogHref, getCatalogResults, type CatalogQuery } from "@/lib/catalog";
import { games, type Game } from "@/lib/products";
import { ProductCard } from "./product-card";
import { DesktopFilters, MobileFilters } from "./catalog-filters";

function HiddenFields({ query, omit = [] }: { query: CatalogQuery; omit?: string[] }) {
  const values = {
    q: query.q,
    game: query.game,
    type: query.type === "all" ? "" : query.type,
    min: query.min === undefined ? "" : String(query.min),
    max: query.max === undefined ? "" : String(query.max),
    sort: query.sort === "latest" ? "" : query.sort,
  };
  return Object.entries(values).filter(([key, value]) => value && !omit.includes(key)).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />);
}

function ActiveFilters({ basePath, query, fixedGame }: { basePath: string; query: CatalogQuery; fixedGame?: Game }) {
  const selectedGame = games.find((game) => game.slug === query.game);
  const chips = [
    query.q && { label: `ค้นหา: ${query.q}`, href: catalogHref(basePath, query, { q: "", page: 1 }) },
    !fixedGame && selectedGame && { label: selectedGame.name, href: catalogHref(basePath, query, { game: "", page: 1 }) },
    query.type !== "all" && { label: query.type === "account" ? "ไอดีเกม" : "ไอเท็ม", href: catalogHref(basePath, query, { type: "all", page: 1 }) },
    query.min !== undefined && { label: `เริ่ม ฿${query.min.toLocaleString("th-TH")}`, href: catalogHref(basePath, query, { min: undefined, page: 1 }) },
    query.max !== undefined && { label: `ไม่เกิน ฿${query.max.toLocaleString("th-TH")}`, href: catalogHref(basePath, query, { max: undefined, page: 1 }) },
  ].filter((chip): chip is { label: string; href: string } => Boolean(chip));

  if (chips.length === 0) return null;
  return (
    <div aria-label="ตัวกรองที่เลือก" className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => <Link key={chip.label} href={chip.href} className="badge badge-outline inline-flex min-h-9 items-center gap-2 rounded-full border border-control-border bg-raised px-3 text-sm text-foreground hover:border-accent">{chip.label}<span aria-hidden="true">×</span></Link>)}
      <Link href={basePath} className="text-sm font-medium text-accent hover:underline">ล้างทั้งหมด</Link>
    </div>
  );
}

export function CatalogView({ basePath, query, fixedGame }: { basePath: string; query: CatalogQuery; fixedGame?: Game }) {
  const { items, total, page, totalPages } = getCatalogResults(query);
  const activeCount = Number(Boolean(query.q)) + Number(Boolean(query.game && !fixedGame)) + Number(query.type !== "all") + Number(query.min !== undefined) + Number(query.max !== undefined);
  const selectedGame = games.find((game) => game.slug === query.game);
  const categories = [
    { value: "all", label: "ทั้งหมด" },
    { value: "account", label: "ไอดีเกม" },
    { value: "item", label: "ไอเท็ม" },
  ] as const;

  return (
    <main key={catalogHref(basePath, query)} className="shop-container flex-1 space-y-8 py-8 sm:py-12">
      {fixedGame ? (
        <header className="relative overflow-hidden rounded-card border border-border bg-surface px-6 py-10 sm:px-10 sm:py-12">
          <div aria-hidden="true" className="absolute -right-12 -top-20 size-64 rounded-full border-[32px] border-primary/20" />
          <div className="relative max-w-2xl space-y-3">
            <Link href="/products" className="text-sm font-medium text-accent hover:underline">สินค้าทั้งหมด <span aria-hidden="true">/</span></Link>
            <h1 className="text-3xl font-bold sm:text-4xl">{fixedGame.name}</h1>
            <p className="text-muted">เลือกดูไอดีและไอเท็มของ {fixedGame.name} จากข้อมูลสินค้าตัวอย่าง</p>
          </div>
        </header>
      ) : (
        <header className="space-y-2">
          <p className="text-sm font-semibold tracking-wide text-accent">GAME SHOP CATALOG</p>
          <h1 className="text-3xl font-bold sm:text-4xl">{selectedGame ? `สินค้า ${selectedGame.name}` : "สินค้าทั้งหมด"}</h1>
          <p className="text-muted">ค้นหาและกรองไอดีหรือไอเท็มเกมจากรายการตัวอย่าง</p>
        </header>
      )}

      <nav aria-label="ประเภทสินค้า" className="tabs tabs-box flex flex-wrap gap-1 rounded-control border border-border bg-surface p-1">
        {categories.map((category) => <Link key={category.value} href={catalogHref(basePath, query, { type: category.value, page: 1 })} aria-current={query.type === category.value ? "page" : undefined} className={`tab inline-flex min-h-11 items-center rounded-control px-4 text-sm font-semibold ${query.type === category.value ? "bg-raised text-foreground" : "text-muted hover:bg-raised hover:text-foreground"}`}>{category.label}</Link>)}
      </nav>

      <div className="grid gap-7 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside aria-label="ตัวกรองสินค้า" className="hidden self-start rounded-card border border-border bg-surface p-5 lg:block">
          <h2 className="mb-5 text-lg font-bold">ตัวกรอง</h2>
          <DesktopFilters basePath={basePath} query={query} fixedGame={Boolean(fixedGame)} />
        </aside>

        <div className="min-w-0 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <form action={basePath} method="get" role="search" className="flex min-w-0 flex-1 gap-2">
              <HiddenFields query={query} omit={["q", fixedGame ? "game" : ""]} />
              <label htmlFor="catalog-search" className="sr-only">ค้นหาสินค้า</label>
              <input id="catalog-search" name="q" type="search" defaultValue={query.q} placeholder="ค้นหาไอดีหรือไอเท็ม" className="input min-h-11 min-w-0 flex-1 rounded-control border border-control-border bg-surface px-3 text-base text-foreground placeholder:text-muted" />
              <button type="submit" className="btn btn-primary min-h-11 shrink-0 rounded-control bg-primary px-4 font-semibold text-white">ค้นหา</button>
            </form>
            <div className="flex flex-wrap gap-2">
              <MobileFilters basePath={basePath} query={query} fixedGame={Boolean(fixedGame)} activeCount={activeCount} />
              <form action={basePath} method="get" className="flex min-w-0 flex-1 gap-2 sm:flex-none">
                <HiddenFields query={query} omit={["sort", fixedGame ? "game" : ""]} />
                <label htmlFor="catalog-sort" className="sr-only">เรียงสินค้า</label>
                <select id="catalog-sort" name="sort" defaultValue={query.sort} className="select min-h-11 min-w-0 flex-1 rounded-control border border-control-border bg-surface px-3 text-sm text-foreground">
                  <option value="latest">ล่าสุด</option>
                  <option value="price-asc">ราคาต่ำไปสูง</option>
                  <option value="price-desc">ราคาสูงไปต่ำ</option>
                </select>
                <button type="submit" className="btn btn-outline min-h-11 rounded-control border border-control-border px-3 text-sm font-semibold text-foreground">เรียง</button>
              </form>
            </div>
          </div>

          <ActiveFilters basePath={basePath} query={query} fixedGame={fixedGame} />
          <p aria-live="polite" className="text-sm text-muted">พบสินค้า {total} รายการ{total > 0 && totalPages > 1 ? ` · หน้า ${page} จาก ${totalPages}` : ""}</p>

          {items.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {items.map((product) => <li key={product.id} className="min-w-0"><ProductCard product={product} href={`/products?q=${encodeURIComponent(product.name)}`} /></li>)}
            </ul>
          ) : (
            <div className="card card-border rounded-card border border-border bg-surface p-8">
              <h2 className="text-xl font-bold">ไม่พบสินค้าที่ตรงกัน</h2>
              <p className="mt-2 text-muted">ลองเปลี่ยนคำค้นหรือช่วงราคา แล้วค้นหาอีกครั้ง</p>
              <Link href={basePath} className="mt-5 inline-block font-semibold text-accent hover:underline">ล้างการค้นหาและตัวกรอง</Link>
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="หน้าสินค้า" className="join flex flex-wrap justify-center gap-2 pt-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <Link key={number} href={catalogHref(basePath, query, { page: number })} aria-current={number === page ? "page" : undefined} className={`join-item btn inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border px-3 font-semibold ${number === page ? "border-accent bg-raised text-foreground" : "border-border text-muted hover:border-accent"}`}>{number}</Link>)}
            </nav>
          )}
          <p className="text-sm text-muted">ข้อมูลสินค้าทั้งหมดเป็นตัวอย่าง หน้ารายละเอียดและการซื้อจะเปิดในงานถัดไป</p>
        </div>
      </div>
    </main>
  );
}
