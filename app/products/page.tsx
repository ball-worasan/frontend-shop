import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog-view";
import { parseCatalogQuery, type RawCatalogParams } from "@/lib/catalog";

export const metadata: Metadata = { title: "สินค้าทั้งหมด" };

export default function ProductsPage({ searchParams }: { searchParams: Promise<RawCatalogParams> }) {
  return (
    <Suspense fallback={<main className="shop-container flex-1 py-12" role="status">กำลังโหลดสินค้า...</main>}>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductsContent({ searchParams }: { searchParams: Promise<RawCatalogParams> }) {
  const query = parseCatalogQuery(await searchParams);
  return <CatalogView basePath="/products" query={query} />;
}
