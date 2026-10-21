import { products, type Product } from "./products";

export type PaymentStatus = "pending" | "paid" | "failed";
export type DemoOrder = {
  id: string;
  productId: string;
  productName: string;
  gameSlug: string;
  image: string;
  unitPrice: number;
  quantity: number;
  total: number;
  playerName: string;
  createdAt: string;
  paymentStatus: PaymentStatus;
  deliveryStatus: "waiting" | "delivered";
};

const storageKey = "game-shop-demo-orders-v1";

export function validatePurchase(productId: string, rawQuantity: string) {
  const product = products.find((entry) => entry.id === productId);
  const quantity = Number(rawQuantity);
  if (!product || product.stock < 1) return null;
  if (!/^\d+$/.test(rawQuantity) || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > product.stock) return null;
  if (product.type === "account" && quantity !== 1) return null;
  return { product, quantity, total: product.price * quantity };
}

export function makeDemoOrder(product: Product, quantity: number, playerName: string): DemoOrder {
  return {
    id: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    productId: product.id,
    productName: product.name,
    gameSlug: product.gameSlug,
    image: product.image,
    unitPrice: product.price,
    quantity,
    total: product.price * quantity,
    playerName: playerName.trim().slice(0, 40),
    createdAt: new Date().toISOString(),
    paymentStatus: "pending",
    deliveryStatus: "waiting",
  };
}

function isOrder(value: unknown): value is DemoOrder {
  if (!value || typeof value !== "object") return false;
  const order = value as Partial<DemoOrder>;
  return typeof order.id === "string" && /^DEMO-[A-F0-9]{8}$/.test(order.id) && typeof order.productId === "string"
    && products.some((product) => product.id === order.productId)
    && typeof order.productName === "string" && order.productName.length <= 120
    && typeof order.gameSlug === "string" && typeof order.image === "string" && order.image.startsWith("/images/")
    && typeof order.unitPrice === "number" && Number.isSafeInteger(order.unitPrice) && order.unitPrice >= 0
    && typeof order.quantity === "number" && Number.isSafeInteger(order.quantity) && order.quantity > 0
    && typeof order.total === "number" && Number.isSafeInteger(order.total) && order.total === order.unitPrice * order.quantity
    && typeof order.playerName === "string" && order.playerName.length <= 40
    && typeof order.createdAt === "string" && Number.isFinite(Date.parse(order.createdAt))
    && ["pending", "paid", "failed"].includes(order.paymentStatus ?? "")
    && ["waiting", "delivered"].includes(order.deliveryStatus ?? "")
    && (order.paymentStatus === "paid") === (order.deliveryStatus === "delivered");
}

export function readDemoOrders(): { orders: DemoOrder[]; error?: string } {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { orders: [] };
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") throw new Error("invalid data");
    const envelope = data as { version?: unknown; orders?: unknown };
    if (envelope.version !== 1 || !Array.isArray(envelope.orders) || envelope.orders.length > 100 || !envelope.orders.every(isOrder)) throw new Error("invalid version or order");
    return { orders: envelope.orders };
  } catch {
    return { orders: [], error: "อ่านข้อมูลคำสั่งซื้อสาธิตไม่ได้ กรุณาล้างข้อมูลสาธิตแล้วลองใหม่" };
  }
}

export function writeDemoOrders(orders: DemoOrder[]) {
  try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, orders })); return true; }
  catch { return false; }
}

export function clearDemoOrders() {
  try { localStorage.removeItem(storageKey); return true; }
  catch { return false; }
}

export function paymentLabel(status: PaymentStatus) {
  return status === "pending" ? "รอชำระ (จำลอง)" : status === "paid" ? "สำเร็จ (จำลอง)" : "ไม่สำเร็จ (จำลอง)";
}
