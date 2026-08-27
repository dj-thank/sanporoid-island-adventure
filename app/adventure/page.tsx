import type { Metadata } from "next";
import AdventureApp from "./AdventureApp";

export const metadata: Metadata = {
  title: "島の異変図鑑｜神津島・新島・式根島を冒険",
  description: "さんぽろいどと一緒に、近くのチェックポイント、写真ミッション、島Q&Aを楽しむ3島アドベンチャー。",
};

export default function AdventurePage() {
  return <AdventureApp />;
}
