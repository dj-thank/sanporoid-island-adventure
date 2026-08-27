import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "さんぽろいど 島の異変図鑑",
    short_name: "島さんぽ",
    description: "神津島、新島、式根島をチェックポイントと写真ミッションで冒険する旅アプリ。",
    start_url: "/adventure",
    display: "standalone",
    background_color: "#f8f4f0",
    theme_color: "#0c6573",
    lang: "ja",
    orientation: "portrait",
    icons: [
      {
        src: "/sanporoid/avatar_treasure_01.webp",
        sizes: "any",
        type: "image/webp",
        purpose: "any",
      },
    ],
  };
}
