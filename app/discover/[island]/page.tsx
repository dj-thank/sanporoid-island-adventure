import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IslandFeature from "../IslandFeature";
import { islands, islandsBySlug, type Island } from "../island-data";

type Params = Promise<{ island: string }>;

export function generateStaticParams() {
  return islands.map((island) => ({ island: island.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { island: slug } = await params;
  const island = islandsBySlug[slug as Island["slug"]];
  if (!island) return {};
  const hasDossier = island.slug === "kozushima" || island.slug === "niijima";
  return {
    title: hasDossier ? `${island.name}大特集｜歴史・地質・文化から旅を読む` : `${island.name}完全ガイド｜${island.coverLine}`,
    description: hasDossier
      ? `${island.name}の成り立ち、歴史、大きさ、暮らし、文化、雑学を公的資料から読み解き、地図と旅程につないだ長編特集。`
      : `${island.shortIntro} 地図、回り方、食、宿、交通、公式予約先を一つにつないだ友達旅行のための特集。`,
  };
}

export default async function IslandPage({ params }: { params: Params }) {
  const { island: slug } = await params;
  const island = islandsBySlug[slug as Island["slug"]];
  if (!island) notFound();
  return <IslandFeature island={island} />;
}
