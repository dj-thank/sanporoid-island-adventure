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
    title: "Island Weekend｜大島 → 新島 旅行ボード",
    description: "Juneとりもの伊豆諸島旅行。採用済み予定、提案、費用、領収書を一つの正本で共有します。",
    metadataBase,
    openGraph: {
      title: "Island Weekend｜大島 → 新島",
      description: "俺たちの旅行SSOT。予定・提案・費用を一画面で共有。",
      type: "website",
      images: [{ url: "/og.png", width: 1728, height: 909, alt: "Island Weekend 大島から新島へ" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Island Weekend｜大島 → 新島",
      description: "俺たちの旅行SSOT。予定・提案・費用を一画面で共有。",
      images: ["/og.png"],
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
