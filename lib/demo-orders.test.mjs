import { beforeEach, describe, expect, test } from "bun:test";
import { clearDemoOrders, makeDemoOrder, readDemoOrders, validatePurchase, writeDemoOrders } from "./demo-orders.ts";

const values = new Map();
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key),
};

beforeEach(() => values.clear());

describe("demo checkout", () => {
  test("uses fixture price and limits item quantity", () => {
    expect(validatePurchase("demo-003", "3")?.total).toBe(450);
    expect(validatePurchase("demo-003", "21")).toBeNull();
    expect(validatePurchase("demo-003", "1.5")).toBeNull();
    expect(validatePurchase("demo-001", "2")).toBeNull();
    expect(validatePurchase("demo-002", "1")).toBeNull();
    expect(validatePurchase("unknown", "1")).toBeNull();
  });

  test("persists a versioned order and detects corrupt data", () => {
    const purchase = validatePurchase("demo-003", "2");
    const order = makeDemoOrder(purchase.product, purchase.quantity, "Player Demo");
    expect(order.total).toBe(300);
    expect(writeDemoOrders([order])).toBe(true);
    expect(readDemoOrders().orders[0]?.id).toBe(order.id);
    values.set("game-shop-demo-orders-v1", JSON.stringify({ version: 1, orders: [{ ...order, image: "https://example.com/unsafe.png" }] }));
    expect(readDemoOrders().error).toBeTruthy();
    values.set("game-shop-demo-orders-v1", '{"version":2,"orders":[]}');
    expect(readDemoOrders().error).toBeTruthy();
    expect(clearDemoOrders()).toBe(true);
    expect(readDemoOrders().orders).toEqual([]);
  });
});
