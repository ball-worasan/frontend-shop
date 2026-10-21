import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog-view";
import { parseCatalogQuery, type RawCatalogParams } from "@/lib/catalog";
import { games, type Game } from "@/lib/products";

type GamePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawCatalogParams>;
};

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = games.find((entry) => entry.slug === slug);
  if (!game) notFound();
  return { title: `สินค้า ${game.name}` };
}

export default async function GamePage({ params, searchParams }: GamePageProps) {
  const { slug } = await params;
  const game = games.find((entry) => entry.slug === slug);
  if (!game) notFound();

  return (
    <Suspense fallback={<main className="shop-container flex-1 py-12" role="status">กำลังโหลดสินค้า...</main>}>
      <GameProducts game={game} searchParams={searchParams} />
    </Suspense>
  );
}

async function GameProducts({ game, searchParams }: { game: Game; searchParams: Promise<RawCatalogParams> }) {
  const query = parseCatalogQuery(await searchParams, game.slug);
  return <CatalogView basePath={`/games/${game.slug}`} query={query} fixedGame={game} />;
}
