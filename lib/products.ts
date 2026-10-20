export type Game = { slug: string; name: string };
type ProductBase = {
  id: string;
  gameSlug: string;
  name: string;
  /** Integer Thai baht for demo fixtures. */
  price: number;
  image: string;
  imageAlt: string;
  server: string;
};
export type Product =
  | (ProductBase & { type: "account"; stock: 0 | 1; rank: string })
  | (ProductBase & { type: "item"; stock: number; rank?: never });

export const games: readonly Game[] = [
  { slug: "astral-arena", name: "Astral Arena" },
  { slug: "rune-valley", name: "Rune Valley" },
];

/** Fictional games and products: no real accounts or credentials. */
export const products: readonly Product[] = [
  { id: "demo-001", gameSlug: "astral-arena", name: "ไอดีตัวอย่าง แรงก์ Diamond", type: "account", rank: "Diamond", stock: 1, price: 1290, server: "Asia", image: "/images/product-placeholder.svg", imageAlt: "ภาพประกอบสินค้าตัวอย่าง" },
  { id: "demo-002", gameSlug: "astral-arena", name: "ไอดีตัวอย่าง แรงก์ Platinum", type: "account", rank: "Platinum", stock: 0, price: 890, server: "Asia", image: "/images/product-placeholder.svg", imageAlt: "ภาพประกอบสินค้าตัวอย่าง" },
  { id: "demo-003", gameSlug: "rune-valley", name: "คริสตัลตัวอย่าง 100 ชิ้น", type: "item", stock: 20, price: 150, server: "SEA", image: "/images/product-placeholder.svg", imageAlt: "ภาพประกอบสินค้าตัวอย่าง" },
  { id: "demo-004", gameSlug: "rune-valley", name: "ดาบแสงตัวอย่าง", type: "item", stock: 5, price: 450, server: "SEA", image: "/images/product-placeholder.svg", imageAlt: "ภาพประกอบสินค้าตัวอย่าง" },
];

export function formatPrice(price: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency", currency: "THB", maximumFractionDigits: 0,
  }).format(price);
}
