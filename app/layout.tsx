import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  return {
    title: "俺たちの島旅｜神津島から、新島へ",
    description: "8月29日から9月1日、神津島から新島へ。決まった予定、船と飛行機の比較、費用、未確認事項を一画面で共有します。",
    metadataBase,
    openGraph: {
      title: "俺たちの島旅｜神津島から、新島へ",
      description: "行き先は神津島→新島で決定。次は船と飛行機、宿を決める友達との旅行SSOT。",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "俺たちの島旅｜神津島から、新島へ",
      description: "行き先は神津島→新島で決定。次は船と飛行機、宿を決める友達との旅行SSOT。",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
