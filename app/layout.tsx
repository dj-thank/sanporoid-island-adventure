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
    title: "俺たちの島旅｜神津島から、大島か新島へ",
    description: "8月29日から9月1日。神津島を共通に、大島と新島の2案を比べる旅行ボード。予定、費用、未確認事項を一画面で共有します。",
    metadataBase,
    openGraph: {
      title: "俺たちの島旅｜神津島から、大島か新島へ",
      description: "神津島は共通。第二の島を大島か新島から選ぶ、友達との旅行SSOT。",
      type: "website",
      images: [{ url: "/og.png", width: 1728, height: 909, alt: "Island Weekend 神津島から、大島か新島へ" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "俺たちの島旅｜神津島から、大島か新島へ",
      description: "神津島は共通。第二の島を大島か新島から選ぶ、友達との旅行SSOT。",
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
