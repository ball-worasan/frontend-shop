import { games, products, type Product } from "./products";

export type RawCatalogParams = Record<string, string | string[] | undefined>;
export type ProductType = "all" | "account" | "item";
export type SortOrder = "latest" | "price-asc" | "price-desc";

export type CatalogQuery = {
  q: string;
  game: string;
  type: ProductType;
  min?: number;
  max?: number;
  sort: SortOrder;
  page: number;
};

const pageSize = 3;

function scalar(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

function price(value: string) {
  if (!/^\d+$/.test(value)) return undefined;
  const number = Number(value);
  return Number.isSafeInteger(number) && number <= 1_000_000 ? number : undefined;
}

export function parseCatalogQuery(raw: RawCatalogParams, fixedGame?: string): CatalogQuery {
  const game = scalar(raw.game);
  const type = scalar(raw.type);
  const sort = scalar(raw.sort);
  const page = Number(scalar(raw.page));

  return {
    q: scalar(raw.q).trim().slice(0, 100),
    game: fixedGame ?? (games.some((entry) => entry.slug === game) ? game : ""),
    type: type === "account" || type === "item" ? type : "all",
    min: price(scalar(raw.min)),
    max: price(scalar(raw.max)),
    sort: sort === "price-asc" || sort === "price-desc" ? sort : "latest",
    page: Number.isSafeInteger(page) && page > 0 ? Math.min(page, 1000) : 1,
  };
}

export function getCatalogResults(query: CatalogQuery) {
  const term = query.q.toLocaleLowerCase("th");
  const matching = products.filter((product) => {
    const game = games.find((entry) => entry.slug === product.gameSlug);
    const searchable = `${product.name} ${game?.name ?? ""} ${product.server} ${product.type === "account" ? product.rank : ""}`.toLocaleLowerCase("th");
    return (!query.game || product.gameSlug === query.game)
      && (query.type === "all" || product.type === query.type)
      && (query.min === undefined || product.price >= query.min)
      && (query.max === undefined || product.price <= query.max)
      && (!term || searchable.includes(term));
  });

  const ordered = [...matching];
  if (query.sort === "price-asc") ordered.sort((a, b) => a.price - b.price);
  else if (query.sort === "price-desc") ordered.sort((a, b) => b.price - a.price);
  else ordered.reverse();

  const totalPages = Math.max(1, Math.ceil(ordered.length / pageSize));
  const page = Math.min(query.page, totalPages);
  const items: Product[] = ordered.slice((page - 1) * pageSize, page * pageSize);
  return { items, total: ordered.length, page, totalPages };
}

export function catalogHref(basePath: string, query: CatalogQuery, changes: Partial<CatalogQuery> = {}) {
  const next = { ...query, ...changes };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (basePath === "/products" && next.game) params.set("game", next.game);
  if (next.type !== "all") params.set("type", next.type);
  if (next.min !== undefined) params.set("min", String(next.min));
  if (next.max !== undefined) params.set("max", String(next.max));
  if (next.sort !== "latest") params.set("sort", next.sort);
  if (next.page > 1) params.set("page", String(next.page));
  const search = params.toString();
  return search ? `${basePath}?${search}` : basePath;
}
