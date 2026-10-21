import { describe, expect, test } from "bun:test";
import { catalogHref, getCatalogResults, parseCatalogQuery } from "./catalog.ts";

describe("catalog filtering", () => {
  test("combines game, type, price, and search filters", () => {
    const query = parseCatalogQuery({ game: "astral-arena", type: "account", min: "900", max: "1300", q: "Diamond" });
    const result = getCatalogResults(query);
    expect(result.total).toBe(1);
    expect(result.items[0]?.id).toBe("demo-001");
  });

  test("keeps a game page scoped to its route", () => {
    const query = parseCatalogQuery({ game: "astral-arena", type: "item" }, "rune-valley");
    const result = getCatalogResults(query);
    expect(result.total).toBe(2);
    expect(result.items.every((item) => item.gameSlug === "rune-valley")).toBe(true);
  });

  test("sorts prices and limits each page", () => {
    const first = getCatalogResults(parseCatalogQuery({ sort: "price-asc" }));
    const second = getCatalogResults(parseCatalogQuery({ sort: "price-asc", page: "2" }));
    expect(first.items.map((item) => item.price)).toEqual([150, 450, 890]);
    expect(second.items.map((item) => item.price)).toEqual([1290]);
    expect(second.totalPages).toBe(2);
  });

  test("ignores invalid values and omits removed filters from links", () => {
    const query = parseCatalogQuery({ game: "missing", min: "-10", type: "invalid", page: "0" });
    expect(query).toMatchObject({ game: "", min: undefined, type: "all", page: 1 });
    const selected = parseCatalogQuery({ q: "ดาบ", game: "rune-valley", type: "item", page: "2" });
    expect(catalogHref("/products", selected, { type: "all", page: 1 })).toBe("/products?q=%E0%B8%94%E0%B8%B2%E0%B8%9A&game=rune-valley");
  });
});
