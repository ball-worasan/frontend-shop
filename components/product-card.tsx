import Image from "next/image";
import Link from "next/link";
import { formatPrice, games, type Product } from "@/lib/products";
import { Badge } from "./ui/badge";
export function ProductCard({ product, href = `/products/${product.id}` }: { product: Product; href?: string }) {
  const game = games.find((entry) => entry.slug === product.gameSlug);
  return (
    <Link href={href} className="group block min-w-0 overflow-hidden rounded-card border border-border bg-surface transition duration-150 hover:border-accent hover:shadow-[0_0_24px_rgba(124,58,237,.18)] motion-safe:hover:-translate-y-0.5 focus-visible:border-accent">
      <div className="relative aspect-[4/3] bg-raised">
        <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 280px" className="object-cover" />
      </div>
      <div className="space-y-3 p-3 sm:p-4">
        <Badge tone="accent">{product.type === "account" ? "ไอดีเกม" : "ไอเท็ม"}</Badge>
        <p className="text-sm text-muted">{game?.name ?? product.gameSlug}</p>
        <h3 className="line-clamp-2 min-h-13 break-words font-semibold">{product.name}</h3>
        <p className="text-sm text-muted">{product.server}{product.type === "account" ? ` · ${product.rank}` : ""}</p>
        <p className="font-display text-xl font-bold">{formatPrice(product.price)}</p>
        <p className={`text-sm ${product.stock > 0 ? "text-success" : "text-danger"}`}>{product.stock > 0 ? "พร้อมขาย · ตัวอย่าง" : "สินค้าหมด"}</p>
      </div>
    </Link>
  );
}
